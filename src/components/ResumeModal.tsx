import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Plane,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

type ResumeMode = 'pdf' | '3d';

const pages = [
  '/resume-pages/page-1.webp',
  '/resume-pages/page-2.webp',
];

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<ResumeMode>('pdf');
  const [frameReady, setFrameReady] = useState(false);
  const flightFrameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!open) {
      setPage(0);
      setZoom(1);
      setMode('pdf');
      setFrameReady(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && mode === 'pdf') {
        setPage((current) => Math.max(0, current - 1));
      }
      if (event.key === 'ArrowRight' && mode === 'pdf') {
        setPage((current) => Math.min(pages.length - 1, current + 1));
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'RESUME_SHOW_PDF') {
        setMode('pdf');
        setFrameReady(false);
        setZoom(1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('message', onMessage);
    };
  }, [open, onClose, mode]);

  const open3D = () => {
    setMode('3d');
    setFrameReady(false);
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
            className="relative w-full max-w-5xl h-[min(94vh,980px)] overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[0_30px_100px_rgba(0,0,0,.42)]"
          >
            <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
              <div className="min-w-0">
                <p className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)]">Mohammad Arshil Siddiqui</p>
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">Resume · {mode === '3d' ? '3D Resume' : `Page ${page + 1} of ${pages.length}`}</p>
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

                <a
                  href="/resume.pdf"
                  download="Mohammad-Arshil-Siddiqui-Resume.pdf"
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
                  className="absolute inset-0 pt-[58px] pb-2 bg-[var(--bg-secondary)] overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="absolute inset-0 overflow-auto px-2 sm:px-5 py-3 sm:py-5">
                    <div className="min-h-full flex items-start justify-center">
                      <img
                        src={pages[page]}
                        alt={`Resume page ${page + 1}`}
                        className="block w-full max-w-[980px] h-auto origin-top rounded-sm shadow-[0_8px_30px_rgba(0,0,0,.16)] select-none transition-transform duration-200 ease-out"
                        draggable={false}
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'center top', marginBottom: `${Math.max(0, (zoom - 1) * 40)}px` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                    disabled={page === 0}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/95 shadow-lg grid place-items-center text-[var(--text-primary)] disabled:opacity-25 hover:border-[var(--accent-primary)] transition-all"
                    aria-label="Previous resume page"
                  >
                    <ArrowLeft size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(pages.length - 1, current + 1))}
                    disabled={page === pages.length - 1}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/95 shadow-lg grid place-items-center text-[var(--text-primary)] disabled:opacity-25 hover:border-[var(--accent-primary)] transition-all"
                    aria-label="Next resume page"
                  >
                    <ArrowRight size={19} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/95 shadow-lg px-2 py-1.5">
                    <button
                      type="button"
                      onClick={open3D}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-primary)] text-white px-5 py-2.5 text-sm font-bold shadow-md hover:bg-[var(--accent-hover)] transition-all"
                    >
                      3D Resume <Plane size={15} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="3d"
                  className="absolute inset-0 pt-[58px] bg-black overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <iframe
                    ref={flightFrameRef}
                    title="Folding resume flight"
                    src="/resume-3d.html"
                    onLoad={() => setFrameReady(true)}
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
