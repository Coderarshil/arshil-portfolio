import React, { useEffect, useState } from 'react';
import { ArrowLeft, Box, Download, ExternalLink, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

type ResumeView = 'choices' | '3d';

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  const [view, setView] = useState<ResumeView>('choices');

  useEffect(() => {
    if (!open) {
      setView('choices');
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
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md p-3 sm:p-5 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume options"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full ${view === '3d' ? 'max-w-6xl h-[min(92vh,900px)]' : 'max-w-xl'} overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[0_30px_100px_rgba(0,0,0,.35)]`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {view === 'choices' ? (
                <motion.div
                  key="choices"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="relative p-6 sm:p-8"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] grid place-items-center hover:border-[var(--accent-primary)] transition-colors"
                    aria-label="Close resume"
                  >
                    <X size={19} />
                  </button>

                  <div className="pr-12">
                    <p className="font-handwriting text-xl text-[var(--accent-primary)]">a little something on paper ♡</p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">My Resume</h2>
                    <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] mt-3 max-w-md">
                      Take a quick look at the interactive version, or keep the classic PDF for later.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-7">
                    <button
                      type="button"
                      onClick={() => setView('3d')}
                      className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-left hover:-translate-y-1 hover:border-[var(--accent-primary)] hover:shadow-lg transition-all"
                    >
                      <span className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] text-white grid place-items-center shadow-sm">
                        <Box size={22} />
                      </span>
                      <span className="block font-serif text-xl font-bold text-[var(--text-primary)] mt-5">3D Resume</span>
                      <span className="block text-sm text-[var(--text-secondary)] mt-1">Open the folding resume with its animation.</span>
                      <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-[var(--accent-primary)]">Open 3D view <ExternalLink size={14} /></span>
                    </button>

                    <a
                      href="/resume.pdf"
                      download="Mohammad-Arshil-Siddiqui-Resume.pdf"
                      className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-left hover:-translate-y-1 hover:border-[var(--accent-primary)] hover:shadow-lg transition-all"
                    >
                      <span className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-primary)] grid place-items-center">
                        <Download size={22} />
                      </span>
                      <span className="block font-serif text-xl font-bold text-[var(--text-primary)] mt-5">Download PDF</span>
                      <span className="block text-sm text-[var(--text-secondary)] mt-1">Save the standard resume to your device.</span>
                      <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-[var(--accent-primary)]">Download <Download size={14} /></span>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.22 }}
                  className="h-full flex flex-col bg-[#08090c]"
                >
                  <div className="shrink-0 flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setView('choices')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-color)] text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                    <span className="font-serif font-bold text-[var(--text-primary)]">Interactive 3D Resume</span>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] grid place-items-center hover:border-[var(--accent-primary)] transition-colors"
                      aria-label="Close resume"
                    >
                      <X size={17} />
                    </button>
                  </div>
                  <iframe
                    title="Interactive 3D folding resume"
                    src="/resume-3d.html"
                    className="w-full flex-1 border-0 bg-[#08090c]"
                    loading="eager"
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
