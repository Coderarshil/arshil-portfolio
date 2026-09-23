import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { ProfileSummary } from './ProfileSummary';
import { useAppStore } from '../lib/store';

export function Header() {
  const theme = useAppStore(s => s.theme);
  const isEspresso = theme === 'espresso';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const avatar = isEspresso ? '/arshil-espresso.png' : '/arshil-cappuccino.png';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || summaryOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, summaryOpen]);

  const nav = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${scrolled ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md shadow-sm border-b border-[var(--border-color)]/50 py-3' : 'bg-transparent py-4 lg:py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0 md:flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setSummaryOpen(true)}
              className="w-11 h-11 rounded-full border-2 border-[var(--accent-light)] flex items-center justify-center bg-[var(--bg-card)] shadow-sm overflow-hidden shrink-0 hover:scale-[1.03] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
              aria-label="Open Arshil's profile summary"
            >
              <img src={avatar} alt="Arshil" className="w-full h-full object-cover" />
            </button>
            <button type="button" onClick={() => setSummaryOpen(true)} className="flex flex-col leading-[1.05] mt-1 text-left text-[var(--text-primary)] min-w-0">
              <span className="font-serif font-bold text-[1.2rem] lg:text-[1.38rem] tracking-tight truncate">Mohammad Arshil Siddiqui</span>
              <span className="font-handwriting text-[0.78rem] text-[var(--accent-primary)] font-medium tracking-wide">student · developer · AI enthusiast</span>
            </button>
          </div>

          <nav className="hidden md:flex justify-center flex-[2] items-center gap-6 lg:gap-10 shrink-0 mt-1" aria-label="Main navigation">
            {nav.map((link, i) => (
              <a key={link.label} href={link.href} className={`text-[13px] lg:text-[14.5px] font-semibold transition-colors relative group ${i === 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)] hover:text-[var(--accent-primary)]'}`}>
                {link.label}
                <span className={`absolute -bottom-[6px] left-0 h-[2px] bg-[var(--accent-primary)] transition-all ${i === 0 ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3 lg:gap-5 shrink-0 md:flex-1">
            <ThemeToggle />
            <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm hover:border-[var(--accent-primary)] transition-all" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[var(--bg-primary)]/95 backdrop-blur-3xl flex flex-col p-6"
            initial={{ opacity: 0, x: '8%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '8%' }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setSummaryOpen(true)} className="flex items-center gap-3 text-left">
                <span className="w-11 h-11 rounded-full border-2 border-[var(--accent-light)] overflow-hidden shrink-0 bg-[var(--bg-card)]">
                  <img src={avatar} alt="Arshil" className="w-full h-full object-cover" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-serif font-bold text-lg text-[var(--text-primary)]">Mohammad Arshil Siddiqui</span>
                  <span className="font-handwriting text-sm text-[var(--accent-primary)]">tap for a little summary</span>
                </span>
              </button>
              <button className="text-[var(--text-primary)] p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X size={30} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8 text-3xl font-serif">
              {nav.map((link, i) => (
                <a key={link.label} href={link.href} className={`${i === 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)] hover:text-[var(--accent-primary)]'} transition-colors`} onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <button type="button" className="font-handwriting text-2xl text-[var(--accent-primary)]" onClick={() => { setMobileMenuOpen(false); setSummaryOpen(true); }}>
                a little about me ♡
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {summaryOpen && <ProfileSummary onClose={() => setSummaryOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
