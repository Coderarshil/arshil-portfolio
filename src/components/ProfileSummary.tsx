import React from 'react';
import { X, Sparkles, Code2, Heart, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../lib/store';

export function ProfileSummary({ onClose }: { onClose: () => void }) {
  const theme = useAppStore(s => s.theme);
  const espresso = theme === 'espresso';
  const avatar = espresso ? '/arshil-espresso.png' : '/arshil-cappuccino.png';
  const polaroid = espresso ? '/polaroidexpresso.webp' : '/polaroidcappuccino.webp';

  return (
    <motion.div
      className="fixed inset-0 z-[110] bg-black/30 dark:bg-black/55 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, x: '-50%', y: '-45%', scale: 0.96 }}
        animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
        exit={{ opacity: 0, x: '-50%', y: '-45%', scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-1/2 left-1/2 w-[96%] max-w-[840px] max-h-[calc(100vh-48px)] overflow-auto hide-scrollbar bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.28)] p-5 sm:p-7"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] rounded-full text-[var(--accent-primary)] border border-[var(--border-color)] shadow-sm" aria-label="Close summary">
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
          <div className="relative bg-[var(--profile-bg)] rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-[2.5rem] p-5 pt-8 min-h-[330px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[var(--profile-border)] overflow-hidden">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[var(--profile-tape-bg)] rotate-[-1deg] border border-[var(--profile-tape-border)] shadow-sm" />
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-[#FFFDF5] to-[var(--profile-bg)] rounded-tr-[1.2rem] rounded-bl-[0.5rem] shadow-[4px_-4px_10px_rgba(0,0,0,0.12)]" />
            <img src={avatar} alt="Arshil" className="relative z-10 w-28 h-28 rounded-full object-cover border-4 border-[var(--bg-card)] shadow-lg mx-auto mt-2 mb-4" />
            <p className="relative z-10 font-serif font-bold text-xl text-[var(--profile-text-primary)] text-center leading-tight">Mohammad Arshil Siddiqui</p>
            <p className="relative z-10 text-xs text-[var(--profile-text-secondary)] text-center mt-1">Student · Developer · AI Enthusiast</p>
            <p className="relative z-10 font-handwriting text-xl text-[var(--profile-text-secondary)] text-center mt-6 leading-tight">“Instead of complaining about the problem, why not fix it?”</p>
            <div className="relative z-10 mt-5 flex flex-wrap justify-center gap-2">
              {['curious', 'adaptive', 'experimental'].map(x => <span key={x} className="px-3 py-1 rounded-full border border-[var(--profile-border)] text-xs text-[var(--profile-text-secondary)]">{x}</span>)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard icon={<Sparkles size={16} />} title="What I’m into" body="AI, creative technology, design, Android, the web, Japanese, football, anime, music, drawing, writing, open science and learning." note="always exploring ♡" />
            <SummaryCard icon={<Code2 size={16} />} title="What I build" body="Small ideas, useful experiments and open-source projects — usually just to see how far I can take an idea." note="made to learn ♡" />
            <SummaryCard icon={<Heart size={16} />} title="How I work" body="Fast learner. Team worker. Problem solver. Adaptive, curious and creative — and very willing to try the weird idea." note="experiment first ♡" />
            <SummaryCard icon={<BookOpen size={16} />} title="Right now" body="Class 12 at LUCKNOW CHRISTIAN COLLEGE, studying under the Uttar Pradesh Board and building for the next chapter." note="2027 on the horizon ♡" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5 items-center">
          <div className="polaroid-card-container relative p-3 pb-9 bg-[#fdfbf6] dark:bg-[#cdb190] shadow-[0_8px_24px_rgba(0,0,0,0.08),_0_2px_4px_rgba(0,0,0,0.04)] -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/45 dark:bg-white/20 shadow-sm rotate-2 border border-black/5" />
            <img src={polaroid} alt="Coffee polaroid" className="w-full aspect-square object-cover" />
            <p className="absolute bottom-2 left-0 right-0 text-center font-handwriting text-lg text-[#6d523e] dark:text-[#f3d7bd]">still brewing ♡</p>
          </div>
          <div className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 sm:p-6 text-center overflow-hidden">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-7 bg-white/30 dark:bg-white/10 rotate-1 border border-black/5 dark:border-white/10" />
            <p className="font-handwriting text-2xl text-[var(--accent-primary)]">Thanks for stopping by. ☕</p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">There’s probably another experiment brewing somewhere.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SummaryCard({ icon, title, body, note }: { icon?: React.ReactNode; title: string; body: string; note: string }) {
  return <div className="relative bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[0_2px_15px_rgba(0,0,0,0.02)] rounded-[1.25rem] p-5 min-h-[150px]">
    <div className="flex items-start gap-3">
      {icon && <div className="w-9 h-9 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">{icon}</div>}
      <div><span className="text-[0.65rem] uppercase tracking-wider font-bold text-[var(--accent-primary)] opacity-80">{title}</span><h3 className="font-serif font-bold text-[1.15rem] leading-tight mt-1 text-[var(--text-primary)]">{title === 'What I’m into' ? 'A lot of different things.' : title === 'What I build' ? 'I like making ideas tangible.' : title === 'How I work' ? 'Curiosity does the driving.' : 'Still learning. Still building.'}</h3></div>
    </div>
    <p className="text-[0.82rem] leading-[1.35] text-[var(--text-secondary)] mt-3">{body}</p>
    <p className="font-handwriting text-base text-[var(--accent-primary)] mt-3">{note}</p>
  </div>;
}
