let pdfJsPromise: Promise<any> | null = null;
let resumePdfPromise: Promise<any> | null = null;

/**
 * PDF.js is loaded only when the resume viewer is opened.
 * The build step copies PDF.js into /public/pdfjs so the viewer has no
 * third-party network dependency at runtime.
 */
const PDFJS_MODULE = '/pdfjs/pdf.mjs';

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
    resumePdfPromise = loadPdfJs().then((pdfjs) =>
      pdfjs.getDocument('/resume.pdf').promise,
    );
  }
  return resumePdfPromise;
}
