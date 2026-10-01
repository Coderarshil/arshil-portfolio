import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Box,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { clearResumePageCache, getCachedResumePage, loadResumePdf, preloadResumePages } from '../lib/pdfjs';
import FlipCard from './FlipCard';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

type ResumeMode = 'pdf' | '3d';
type FlightState = 'ready' | 'folded' | 'unfolded';

const PAGE_COUNT = 2;

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<ResumeMode>('pdf');
  const [frameReady, setFrameReady] = useState(false);
  const [flightState, setFlightState] = useState<FlightState>('ready');
  const flightFrameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!open) {
      setPage(0);
      setZoom(1);
      setMode('pdf');
      setFrameReady(false);
      setFlightState('ready');
      clearResumePageCache();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Start loading and rendering both PDF pages immediately. We intentionally
    // keep them cached for the lifetime of this popup so page flips are
    // animation-only rather than waiting on PDF.js.
    void preloadResumePages().catch(() => {
      // PdfPageCanvas still has its normal fallback/error handling.
    });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'RESUME_SHOW_PDF') {
        setMode('pdf');
        setFrameReady(false);
        setFlightState('ready');
        setZoom(1);
      }
      if (event.data?.type === 'RESUME_3D_STATE') {
        const nextState = event.data?.state;
        if (nextState === 'ready' || nextState === 'folded' || nextState === 'unfolded') {
          setFrameReady(true);
          setFlightState(nextState);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('message', onMessage);
    };
  }, [open, onClose, mode]);

  const changeZoom = (delta: number) => {
    setZoom((current) => Math.min(2.4, Math.max(1, Number((current + delta).toFixed(1)))));
  };

  const open3D = () => {
    setMode('3d');
    setFrameReady(false);
    setFlightState('ready');
  };

  const runFlightAction = () => {
    if (!flightFrameRef.current?.contentWindow || !frameReady) return;
    flightFrameRef.current.contentWindow.postMessage({ type: 'RESUME_FLIGHT_ACTION' }, '*');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md p-2 sm:p-5 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume viewer"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[0_30px_100px_rgba(0,0,0,.42)] flex flex-col"
            style={{
              width: 'min(92vw, 620px, calc((92vh - 58px) * 0.7071))',
            }}
          >
            <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
              <div className="min-w-0">
                <p className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)]">Mohammad Arshil Siddiqui</p>
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                  Resume · {mode === '3d' ? '3D Resume' : `Page ${page + 1} of ${PAGE_COUNT}`}
                </p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {mode === 'pdf' && (
                  <div className="hidden sm:flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] p-1">
                    <button
                      type="button"
                      onClick={() => changeZoom(-0.1)}
                      disabled={zoom <= 1}
                      className="w-8 h-8 rounded-full grid place-items-center text-[var(--text-primary)] disabled:opacity-35 hover:bg-[var(--bg-secondary)] transition-colors"
                      aria-label="Zoom out"
                    >
                      <ZoomOut size={16} />
                    </button>
                    <span className="px-1 text-xs font-semibold text-[var(--text-secondary)] tabular-nums">{Math.round(zoom * 100)}%</span>
                    <button
                      type="button"
                      onClick={() => changeZoom(0.1)}
                      disabled={zoom >= 2.4}
                      className="w-8 h-8 rounded-full grid place-items-center text-[var(--text-primary)] disabled:opacity-35 hover:bg-[var(--bg-secondary)] transition-colors"
                      aria-label="Zoom in"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </div>
                )}

                {mode === 'pdf' ? (
                  <button
                    type="button"
                    onClick={open3D}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] grid place-items-center hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                    aria-label="Open 3D resume"
                    title="Open 3D resume"
                  >
                    <Box size={17} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={flightState === 'unfolded' ? () => setMode('pdf') : runFlightAction}
                    disabled={!frameReady}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] grid place-items-center overflow-hidden hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-40"
                    aria-label={flightState === 'unfolded' ? 'Return to PDF' : flightState === 'folded' ? 'Unfold resume' : 'Fold resume'}
                    title={flightState === 'unfolded' ? 'Return to PDF' : flightState === 'folded' ? 'Unfold resume' : 'Fold resume'}
                  >
                    <span
                      aria-hidden="true"
                      className="w-[17px] h-[17px] block bg-current shrink-0"
                      style={{
                        WebkitMaskImage: `url(${flightState === 'unfolded' ? '/icons/pdf-return.svg' : flightState === 'folded' ? '/icons/fold.svg' : '/icons/paper-plane.svg'})`,
                        maskImage: `url(${flightState === 'unfolded' ? '/icons/pdf-return.svg' : flightState === 'folded' ? '/icons/fold.svg' : '/icons/paper-plane.svg'})`,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                      }}
                    />
                  </button>
                )}

                <a
                  href="/Arshil's resume.pdf"
                  download="Arshil's resume.pdf"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] grid place-items-center hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                  aria-label="Download resume PDF"
                >
                  <Download size={17} />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] grid place-items-center hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                  aria-label="Close resume viewer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {mode === 'pdf' ? (
                <motion.div
                  key="pdf"
                  className="relative w-full aspect-[210/297] bg-[var(--bg-secondary)] overflow-hidden shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="absolute inset-0 flex items-stretch justify-center">
                    <FlipCard
                      front={<PdfPageCanvas pageNumber={1} zoom={zoom} />}
                      back={<PdfPageCanvas pageNumber={2} zoom={zoom} />}
                      flipped={page === 1}
                      flipOnClick
                      draggable
                      dragDistance={0}
                      tilt
                      tiltMax={12}
                      glare
                      glareOpacity={0.22}
                      hoverScale={1.03}
                      perspective={1100}
                      stiffness={170}
                      damping={20}
                      width={300}
                      height={400}
                      radius={0}
                      background="var(--bg-secondary)"
                      color="var(--text-primary)"
                      shadow
                      shadowColor="#000000"
                      shadowOpacity={0.18}
                      ariaLabel="Flip resume page"
                      className="resume-flip-card"
                      onFlipChange={(flipped) => setPage(flipped ? 1 : 0)}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="3d"
                  className="relative w-full aspect-[210/297] bg-black overflow-hidden shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <iframe
                    ref={flightFrameRef}
                    title="Folding resume flight"
                    src="/resume-3d.html"
                    className="w-full h-full border-0 bg-[#03040a]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

async function loadAndRenderPage(pageNumber: number): Promise<HTMLCanvasElement> {
  const pdf = await loadResumePdf();
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2.2 });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas context unavailable');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

function PdfPageCanvas({ pageNumber, zoom }: { pageNumber: number; zoom: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // The modal preloads both pages. If this page is already warm, this is
        // just a cheap canvas copy; otherwise it falls back to loading it now.
        const sourceCanvas = getCachedResumePage(pageNumber) ?? await loadAndRenderPage(pageNumber);
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        canvas.width = sourceCanvas.width;
        canvas.height = sourceCanvas.height;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) throw new Error('Canvas context unavailable');

        ctx.drawImage(sourceCanvas, 0, 0);
        canvas.style.aspectRatio = `${sourceCanvas.width} / ${sourceCanvas.height}`;
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pageNumber]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {status === 'loading' && (
        <div className="resume-skeleton absolute inset-0" aria-label="Loading resume page" role="status" />
      )}
      {status === 'error' && (
        <div className="absolute inset-0 grid place-items-center px-8 text-center text-sm text-[var(--text-muted)]">
          The resume could not be rendered in this viewer. The download button still uses the original PDF file.
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={`Resume page ${pageNumber}`}
        className={`block w-full h-full object-contain rounded-sm shadow-[0_8px_30px_rgba(0,0,0,.16)] select-none ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}
