import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Github, Instagram, Linkedin, Mail, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAppStore } from '../lib/store';

export function LogoSVG({ className }: { className?: string }) {
  return <img src="/coffeelogo.svg" className={className} alt="Coffee cup" aria-hidden="true" />;
}

const navItems = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['Things I’ve Done', '#done'],
  ['Certifications', '#certifications'],
  ['Contact', '#contact'],
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const theme = useAppStore(s => s.theme);
  const avatar = theme === 'espresso' ? '/arshil-espresso.png' : '/arshil-cappuccino.png';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || profileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, profileOpen]);

  const go = (href: string) => {
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${scrolled ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md shadow-sm border-b border-[var(--border-color)]/50 py-3' : 'bg-transparent py-4 lg:py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <button onClick={() => go('#home')} className="flex items-center gap-3 shrink-0 text-left" aria-label="Go home">
            <div className="w-11 h-11 rounded-xl border-2 border-[var(--accent-light)] flex items-center justify-center bg-[var(--bg-card)] shadow-sm p-2">
              <LogoSVG className="w-full h-full object-contain text-[var(--accent-primary)]" />
            </div>
            <div className="flex flex-col leading-[1.05] mt-1 text-[var(--text-primary)]">
              <span className="font-serif font-bold text-[1.02rem] sm:text-[1.22rem] tracking-tight">Mohammad Arshil Siddiqui</span>
              <span className="font-handwriting text-[0.78rem] text-[var(--accent-primary)] font-medium tracking-wide">student · developer · AI enthusiast</span>
            </div>
          </button>

          <nav className="hidden lg:flex justify-center items-center gap-5 xl:gap-7 shrink-0 mt-1">
            {navItems.map(([label, href], i) => (
              <a key={label} href={href} onClick={(e) => { e.preventDefault(); go(href); }} className={`text-[11px] xl:text-[12.5px] font-semibold transition-colors relative group ${i === 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)] hover:text-[var(--accent-primary)]'}`}>
                {label}
                <span className={`absolute -bottom-[6px] left-0 h-[2px] bg-[var(--accent-primary)] transition-all ${i === 0 ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 lg:gap-3 shrink-0">
            <ThemeToggle />
            <button onClick={() => setProfileOpen(true)} className="hidden sm:flex w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--bg-secondary)] shadow-sm cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]" aria-label="Open Arshil summary">
              <img src={avatar} alt="Arshil" className="w-full h-full object-cover" />
            </button>
            <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm hover:border-[var(--accent-primary)] transition-all" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation">
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.24 }} className="fixed inset-0 z-[100] bg-[var(--bg-primary)]/95 backdrop-blur-3xl flex flex-col p-6">
            <div className="flex items-center justify-between">
              <div className="font-handwriting text-2xl text-[var(--accent-primary)]">a little tour of me ☕</div>
              <button className="text-[var(--text-primary)] p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X size={30} /></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-7 text-3xl font-serif">
              {navItems.map(([label, href]) => (
                <a key={label} href={href} className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors" onClick={(e) => { e.preventDefault(); go(href); }}>{label}</a>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)] pt-5">
              <button onClick={() => { setMobileMenuOpen(false); setProfileOpen(true); }} className="flex items-center gap-3 text-left">
                <img src={avatar} alt="Arshil" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border-color)]" />
                <span className="font-handwriting text-xl text-[var(--accent-primary)]">Yep, that’s me.</span>
              </button>
              <div className="flex items-center gap-2"><Github size={17}/><Instagram size={17}/><Linkedin size={17}/></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && (
          <motion.div className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileOpen(false)}>
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-[860px] max-h-[90vh] overflow-auto hide-scrollbar bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.28)] p-5 sm:p-7">
              <button onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--bg-secondary)] text-[var(--accent-primary)] flex items-center justify-center border border-[var(--border-color)]" aria-label="Close summary"><X size={17}/></button>
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
                <div className="bg-[var(--profile-bg)] border border-[var(--profile-border)] rounded-xl p-5 relative min-h-[330px] flex flex-col items-center text-center overflow-hidden">
                  <div className="absolute -top-3 w-16 h-7 bg-white/30 dark:bg-white/10 border border-black/5 dark:border-white/10 rotate-2" />
                  <img src={avatar} alt="Arshil" className="w-28 h-28 rounded-full object-cover border-4 border-[var(--bg-card)] shadow-lg mt-5 mb-4" />
                  <p className="font-serif font-bold text-xl text-[var(--profile-text-primary)]">Mohammad Arshil Siddiqui</p>
                  <p className="text-xs text-[var(--profile-text-secondary)] mt-1">Student · Developer · AI Enthusiast</p>
                  <p className="font-handwriting text-xl text-[var(--profile-text-secondary)] mt-6">“Instead of complaining about the problem, why not fix it?”</p>
                  <div className="mt-auto flex flex-wrap justify-center gap-2 pt-5">
                    {['curious', 'adaptive', 'experimental'].map(x => <span key={x} className="px-3 py-1 rounded-full border border-[var(--profile-border)] text-xs text-[var(--profile-text-secondary)]">{x}</span>)}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SummaryCard icon={<Sparkles size={16}/>} title="What I’m into" body="AI, creative technology, design, Android, the web, Japanese, football, anime, music, drawing, writing, open science and learning." note="always exploring" />
                  <SummaryCard icon={<Mail size={16}/>} title="What I build" body="Small ideas, useful experiments and open-source projects — usually just to see how far I can take an idea." note="made to learn" />
                  <SummaryCard title="How I work" body="Fast learner. Team worker. Problem solver. Adaptive, curious and creative — and very willing to try the weird idea." note="experiment first" />
                  <SummaryCard title="Right now" body="Class 12 at LUCKNOW CHRISTIAN COLLEGE, studying under the Uttar Pradesh Board and building for the next chapter." note="2027 on the horizon" />
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 sm:p-5 text-center relative overflow-hidden">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-7 bg-white/30 dark:bg-white/10 rotate-1 border border-black/5 dark:border-white/10" />
                <p className="font-handwriting text-2xl text-[var(--accent-primary)]">Thanks for stopping by. ☕</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">There’s probably another experiment brewing somewhere.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SummaryCard({ icon, title, body, note }: { icon?: React.ReactNode; title: string; body: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2 text-[var(--accent-primary)] text-xs font-semibold uppercase tracking-[0.08em]">{icon}{title}</div>
      <p className="font-serif text-lg font-bold text-[var(--text-primary)] mt-2">{title === 'What I build' ? 'I like making ideas tangible.' : title === 'How I work' ? 'Curiosity does the driving.' : title === 'Right now' ? 'Still learning. Still building.' : 'A lot of different things.'}</p>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">{body}</p>
      <p className="font-handwriting text-lg text-[var(--accent-primary)] mt-3">{note} ♡</p>
    </div>
  );
}
