let pdfJsPromise: Promise<any> | null = null;
let resumePdfPromise: Promise<any> | null = null;

// Keep the two resume pages warm while the resume modal is open. The cache is
// deliberately cleared when the modal closes so memory is not retained after
// the user is done viewing the resume.
const resumePageCache = new Map<number, HTMLCanvasElement>();
const resumePagePromiseCache = new Map<number, Promise<HTMLCanvasElement>>();

const PDFJS_MODULE = '/pdfjs/pdf.mjs';
const RESUME_RENDER_SCALE = 2.2;

export async function loadPdfJs(): Promise<any> {
  if (!pdfJsPromise) {
    pdfJsPromise = import(/* @vite-ignore */ PDFJS_MODULE).then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.mjs';
      return pdfjs;
    });
  }
  return pdfJsPromise;
}

export function loadResumePdf(): Promise<any> {
  if (!resumePdfPromise) {
    resumePdfPromise = loadPdfJs().then((pdfjs) => pdfjs.getDocument("/Arshil's resume.pdf").promise);
  }
  return resumePdfPromise;
}

async function renderResumePage(pageNumber: number): Promise<HTMLCanvasElement> {
  const cached = resumePageCache.get(pageNumber);
  if (cached) return cached;

  const existing = resumePagePromiseCache.get(pageNumber);
  if (existing) return existing;

  const promise = loadResumePdf().then(async (pdf) => {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: RESUME_RENDER_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas context unavailable');

    await page.render({ canvasContext: ctx, viewport }).promise;
    resumePageCache.set(pageNumber, canvas);
    return canvas;
  });

  resumePagePromiseCache.set(pageNumber, promise);

  try {
    return await promise;
  } finally {
    resumePagePromiseCache.delete(pageNumber);
  }
}

/**
 * Warm both A4 resume pages as soon as the viewer opens. This means the
 * initial page and the back page are downloaded, parsed and rasterized before
 * the user flips between them.
 */
export async function preloadResumePages(): Promise<void> {
  await Promise.all([renderResumePage(1), renderResumePage(2)]);
}

export function getCachedResumePage(pageNumber: number): HTMLCanvasElement | null {
  return resumePageCache.get(pageNumber) ?? null;
}

/** Release the rendered page bitmaps when the resume popup is closed. */
export function clearResumePageCache(): void {
  resumePageCache.clear();
  resumePagePromiseCache.clear();
}
