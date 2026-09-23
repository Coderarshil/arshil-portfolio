import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Github, Instagram, Linkedin } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAppStore } from '../lib/store';
import { ProfileSummary } from './ProfileSummary';

const navItems = [
  ['Home', '#home'], ['About', '#about'], ['Projects', '#projects'], ['Skills', '#skills'],
  ['Things I’ve Done', '#done'], ['Certifications', '#certifications'], ['Contact', '#contact'],
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

  return <>
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${scrolled ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md shadow-sm border-b border-[var(--border-color)]/50 py-3' : 'bg-transparent py-4 lg:py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        <button onClick={() => setProfileOpen(true)} className="flex items-center gap-4 shrink-0 text-left" aria-label="Open Arshil summary">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--accent-light)] flex items-center justify-center bg-[var(--bg-card)] shadow-sm overflow-hidden p-0.5 transition-transform hover:scale-105">
            <img src={avatar} alt="Mohammad Arshil Siddiqui" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col leading-[1.05] mt-1 text-[var(--text-primary)]">
            <span className="font-serif font-bold text-[1.15rem] sm:text-[1.4rem] tracking-tight">Mohammad Arshil Siddiqui</span>
            <span className="font-handwriting text-[0.8rem] text-[var(--accent-primary)] font-medium tracking-wide">student · developer · AI enthusiast</span>
          </div>
        </button>

        <nav className="hidden lg:flex justify-center items-center gap-5 xl:gap-7 shrink-0 mt-1">
          {navItems.map(([label, href], i) => <a key={label} href={href} onClick={e => { e.preventDefault(); go(href); }} className={`text-[11px] xl:text-[12.5px] font-semibold transition-colors relative group ${i === 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)] hover:text-[var(--accent-primary)]'}`}>
            {label}<span className={`absolute -bottom-[6px] left-0 h-[2px] bg-[var(--accent-primary)] transition-all ${i === 0 ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </a>)}
        </nav>

        <div className="flex items-center justify-end gap-2 lg:gap-3 shrink-0">
          <ThemeToggle />
          <button onClick={() => setProfileOpen(true)} className="hidden sm:flex w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--bg-secondary)] shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]" aria-label="Open Arshil summary">
            <img src={avatar} alt="Arshil" className="w-full h-full object-cover" />
          </button>
          <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm hover:border-[var(--accent-primary)] transition-all" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu size={20} strokeWidth={2} /></button>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {mobileMenuOpen && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.24 }} className="fixed inset-0 z-[100] bg-[var(--bg-primary)]/95 backdrop-blur-3xl flex flex-col p-6">
        <div className="flex items-center justify-between"><button onClick={() => { setMobileMenuOpen(false); setProfileOpen(true); }} className="flex items-center gap-3 text-left"><img src={avatar} alt="Arshil" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border-color)]" /><span className="font-handwriting text-xl text-[var(--accent-primary)]">Yep, that’s me.</span></button><button className="text-[var(--text-primary)] p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X size={30} /></button></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-7 text-3xl font-serif">{navItems.map(([label, href]) => <a key={label} href={href} className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors" onClick={e => { e.preventDefault(); go(href); }}>{label}</a>)}</div>
        <div className="flex items-center justify-center gap-5 border-t border-[var(--border-color)] pt-5 text-[var(--text-muted)]"><a href="https://github.com/Coderarshil" aria-label="GitHub"><Github size={19}/></a><a href="https://instagram.com/arshil7474" aria-label="Instagram"><Instagram size={19}/></a><a href="https://www.linkedin.com/in/mohammad-arshil-siddiqui-0121132a5" aria-label="LinkedIn"><Linkedin size={19}/></a></div>
      </motion.div>}
    </AnimatePresence>

    <AnimatePresence>{profileOpen && <ProfileSummary onClose={() => setProfileOpen(false)} />}</AnimatePresence>
  </>;
}
