import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';

function getAge() {
  const dob = new Date(2008, 8, 24);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday = now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export const Hero = React.memo(function Hero({ onPlay }: { onPlay: () => void }) {
  const theme = useAppStore(s => s.theme);
  const isEspresso = theme === 'espresso';
  const [artworkReady, setArtworkReady] = useState(false);
  const [showPlayInvite, setShowPlayInvite] = useState(false);
  const age = useMemo(getAge, []);

  useEffect(() => setArtworkReady(false), [theme]);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.section
      id="home"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="pt-16 lg:pt-24 pb-4 lg:pb-0 px-4 sm:px-6 max-w-[1400px] mx-auto min-h-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.2fr_0.8fr] lg:grid-rows-[auto_auto] gap-8 lg:gap-x-4 xl:gap-x-8 items-center lg:items-start relative">
        <div className="relative z-20 flex flex-col justify-start md:row-span-2 lg:row-span-2 md:h-full lg:h-full lg:pt-8 w-full md:pr-4 lg:pr-10 lg:pb-12">
          <div className="relative h-full flex flex-col justify-center lg:justify-start lg:-mt-2 transition-[opacity,transform] duration-700">
            <motion.h1
              initial={{ opacity: 0, y: 15, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block font-serif text-[3.5rem] lg:text-[4.5rem] xl:text-[5.5rem] font-bold text-[var(--text-primary)] leading-[1.05] lg:leading-[0.95] tracking-[-0.02em] mb-4 md:mb-6 lg:mb-5"
            >
              Hi, I’m
              <br />
              <span className="italic text-[var(--accent-light)]">Arshil</span>
              <span className="text-[var(--text-muted)] font-handwriting text-5xl lg:text-[3.5rem] xl:text-[4.5rem] opacity-60 transform -rotate-12 lg:ml-2">♡</span>
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block md:hidden font-serif text-[2.5rem] sm:text-[3.2rem] font-bold text-[var(--text-primary)] leading-[1.1] tracking-[-0.02em] mb-3 text-left"
            >
              Hi, I’m
              <br />
              <span className="italic text-[var(--accent-light)]">Arshil</span><span className="text-[var(--text-muted)] font-handwriting text-3xl opacity-80">♡</span>
            </motion.h1>

            <div className="relative">
              <p className="text-[var(--text-secondary)] text-[0.95rem] md:text-lg lg:text-[1.1rem] leading-relaxed lg:leading-[1.5] max-w-[340px] md:max-w-full lg:max-w-[470px] font-medium lg:tracking-wide">
                Student • Developer • AI Enthusiast
                <br />
                Hi, I’m Arshil, a {age}-year-old student creative developer and AI enthusiast.
              </p>
            </div>

            <div className="hidden md:flex mt-8 md:mt-10 lg:mt-5 items-center mb-8 md:mb-0 lg:mb-2">
              <span className="font-handwriting text-[1.2rem] lg:text-[1.25rem] text-[#b89574] dark:text-[#d4af8c] transform -rotate-[3deg]">
                Instead of complaining about the problem, why not fix it?
              </span>
              <svg className="w-16 h-8 lg:w-16 lg:h-6 text-[#b89574] dark:text-[#d4af8c] ml-2 mt-2 lg:mt-1 lg:-translate-y-0.5 opacity-70" viewBox="0 0 100 50">
                <path d="M10,25 Q50,40 90,20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M85,15 L92,18 L87,27" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="block md:hidden mt-4 mb-1">
              <span className="font-handwriting text-[1.15rem] text-[#b89574] dark:text-[#d4af8c] tracking-wide">
                Instead of complaining about the problem, why not fix it?
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[310px] sm:max-w-[360px] md:max-w-full lg:max-w-[480px] xl:max-w-[550px] aspect-square flex items-center justify-center mx-auto z-30 md:pt-4 lg:pt-0 pb-0 md:pb-0 lg:col-start-2 lg:row-start-1 lg:justify-self-center -mt-2 md:mt-0 overflow-visible">
          <div className="absolute inset-4 lg:inset-0 rounded-full bg-[var(--accent-primary)]/15 lg:bg-[var(--accent-light)]/5 blur-[50px] lg:blur-[80px] z-[-1] animate-pulse" style={{ animationDuration: '4.8s' }} />

          <div className="hidden lg:block absolute -top-12 lg:-top-16 left-1/2 -translate-x-1/2 w-48 h-40 opacity-40 z-20 pointer-events-none mix-blend-screen filter blur-[20px]">
            <motion.div animate={{ y: [0, -60], opacity: [0, 0.4, 0], scale: [1, 1.5] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }} className="absolute top-4 left-1/4 w-20 h-24 bg-white/40 rounded-[100%]" />
            <motion.div animate={{ y: [0, -70], opacity: [0, 0.3, 0], scale: [1, 1.7] }} transition={{ repeat: Infinity, duration: 6.5, delay: 2, ease: 'easeInOut' }} className="absolute top-8 left-1/2 w-24 h-32 bg-white/40 rounded-[100%]" />
          </div>

          <motion.button
            type="button"
            onClick={() => setShowPlayInvite(v => !v)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 lg:inset-2 custom-mask-image mix-blend-multiply dark:mix-blend-normal cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40 transition-transform duration-500 ${showPlayInvite ? 'scale-[0.985]' : 'scale-100'}`}
            style={{
              maskImage: 'radial-gradient(ellipse at center, black 44%, transparent 68%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 44%, transparent 70%)',
            }}
            aria-label="Click for a little surprise"
          >
            <img
              src="/arshil-cappuccino.webp"
              alt="Arshil integrated into cappuccino latte art"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isEspresso ? 'opacity-0 scale-[0.96]' : 'opacity-100 scale-100'}`}
              style={{ objectPosition: 'center center' }}
              loading={isEspresso ? 'lazy' : 'eager'}
              decoding="async"
              fetchPriority={isEspresso ? 'auto' : 'high'}
              onLoad={() => !isEspresso && setArtworkReady(true)}
            />
            <img
              src="/arshil-espresso.webp"
              alt="Arshil reflected in espresso"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isEspresso ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              style={{ objectPosition: 'center center' }}
              loading={isEspresso ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={isEspresso ? 'high' : 'auto'}
              onLoad={() => isEspresso && setArtworkReady(true)}
            />
          </motion.button>

          <div className="absolute top-[5%] right-[5%] lg:right-[14%] lg:top-[12%] bg-[#f4ebd0] dark:bg-[#D4C3A3] text-[#4a331a] p-3 md:p-3 w-28 md:w-32 rounded shadow-lg transform rotate-[3deg] border border-[#e8dfc8] scale-[0.85] lg:scale-[0.85] z-40 transition-transform hover:rotate-[5deg] hover:scale-95 hover:z-50">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[40px] h-[16px] bg-white/50 shadow-sm rotate-[4deg] border border-black/5 backdrop-blur-[1px]" />
            <p className="font-handwriting text-[0.95rem] md:text-[1.1rem] font-bold leading-tight m-0 relative z-10">learn.<br />build. ★</p>
          </div>

          <div className="absolute bottom-[10%] left-[5%] md:left-[0%] lg:bottom-[15%] lg:left-[-20%] xl:left-[-15%] bg-[#f4ebd0] dark:bg-[#D4C3A3] text-[#4a331a] p-3 lg:p-4 w-[140px] md:w-[150px] lg:w-[180px] rounded shadow-lg transform -rotate-[3deg] border border-[#e8dfc8] dark:border-[#b8a88c] scale-90 lg:scale-[0.95] z-40 transition-transform hover:-rotate-[1deg] hover:scale-[0.98] hover:z-50">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-[40px] h-[16px] bg-white/60 dark:bg-white/20 shadow-sm rotate-[2deg] border border-black/5 dark:border-white/10" />
            <p className="font-handwriting text-[1.05rem] lg:text-[1.25rem] font-bold leading-tight m-0 transform -rotate-[1deg] relative z-10 antialiased">
              curious
              <br />
              by default
              <br />♡
            </p>
          </div>

          <AnimatePresence mode="wait">
            {showPlayInvite && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="absolute z-50 right-[0%] bottom-[3%] sm:right-[-1%] sm:bottom-[1%] lg:right-[2%] lg:bottom-[3%] bg-[var(--sticky-bg)] border border-[var(--sticky-border)] shadow-lg rounded-xl px-4 py-3 rotate-[2deg] max-w-[190px] text-center"
              >
                <p className="font-handwriting text-xl text-[var(--sticky-text)] leading-tight">Yep, that’s me. ♡</p>
                <button type="button" onClick={onPlay} className="font-handwriting text-lg text-[var(--sticky-text)] underline underline-offset-2 decoration-2 hover:opacity-75 transition-opacity">
                  Wanna play??
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden md:flex absolute -bottom-8 md:-bottom-12 lg:-bottom-2 left-1/2 -translate-x-[45%] lg:-translate-x-[50%] w-full flex-col lg:flex-row items-center justify-center opacity-80 z-10 scale-[0.85] lg:scale-90 origin-center whitespace-nowrap">
            <motion.span layout className="font-handwriting text-[1.1rem] lg:text-[1.2rem] text-[#b89574] dark:text-[#d4af8c] flex items-center">
              <AnimatePresence mode="wait">
                <motion.span key={theme} initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.5 }} animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }} exit={{ clipPath: 'inset(0 0 0 100%)', opacity: 0.5 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="inline-block">
                  {isEspresso ? 'espresso' : 'cappuccino'}
                </motion.span>
              </AnimatePresence>
              <motion.span layout>&nbsp;energy included.</motion.span>
            </motion.span>
            <svg className="hidden lg:block w-10 h-10 ml-2 transform -translate-y-2 lg:-translate-y-3 lg:rotate-6" viewBox="0 0 100 100">
              <path d="M10,70 Q50,90 90,40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#b89574] dark:text-[#d4af8c]" />
              <path d="M75,35 L90,40 L85,55" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#b89574] dark:text-[#d4af8c]" />
            </svg>
          </div>
        </div>

        <div className="hidden md:flex absolute left-0 bottom-0 lg:bottom-1 z-40 items-center gap-3">
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-5 py-2.5 rounded-xl font-serif text-[0.95rem] font-bold hover:bg-[var(--accent-hover)] transition-all shadow-sm">
            View my resume →
          </a>
        </div>

        <div className="block md:hidden w-full text-center -mt-9 mb-4 relative z-30 select-none">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-10 h-10 text-[#b89574] dark:text-[#d4af8c] opacity-80" viewBox="0 0 100 60" fill="none">
              <path d="M80,48 C60,35 65,22 80,12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M65,18 L80,12 L75,26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-handwriting text-[1.25rem] text-[#b89574] dark:text-[#d4af8c] tracking-wide">
              <AnimatePresence mode="wait">
                <motion.span key={theme} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {isEspresso ? 'espresso' : 'cappuccino'}
                </motion.span>
              </AnimatePresence>{' '}
              energy included.
            </span>
          </div>
        </div>

        <div className="block md:hidden w-full flex justify-center mt-2 mb-10 relative z-10">
          <motion.button
            onClick={() => scrollTo('#about')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-[92%] sm:w-auto max-w-[340px] px-8 py-3.5 bg-gradient-to-r from-[#704224] to-[#452715] dark:from-[#b89172] dark:to-[#735035] text-white dark:text-amber-950 rounded-full font-serif text-[1.1rem] font-bold shadow-[0_12px_40px_rgba(212,149,106,0.3)] hover:shadow-[0_16px_48px_rgba(212,149,106,0.4)] transition-all flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            <span>A little about me</span><span className="text-xl animate-pulse">☕</span>
          </motion.button>
        </div>

        <div className="hidden md:flex lg:bg-transparent lg:p-0 mx-auto w-full max-w-[340px] sm:max-w-full lg:max-w-[400px] xl:max-w-[440px] mt-10 md:mt-12 lg:mt-0 transition-all duration-500 ease-in-out md:col-start-2 lg:col-start-2 lg:row-start-2 lg:justify-self-center lg:self-start flex-col sm:block items-center">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center lg:justify-start gap-4 lg:gap-4 w-full">
            <button onClick={() => scrollTo('#about')} className="w-full sm:w-auto lg:w-auto bg-[var(--accent-light)] lg:bg-[var(--accent-primary)] text-white px-6 py-3 lg:py-2.5 lg:px-5 rounded-xl font-serif text-[1.05rem] lg:text-[0.95rem] font-medium lg:font-bold hover:bg-[var(--accent-hover)] transition-all shadow-sm flex items-center justify-center gap-2 shrink-0">
              A little about me <span>☕</span>
            </button>
            <div onClick={() => scrollTo('#projects')} className="group text-[0.95rem] lg:text-[0.85rem] font-medium lg:font-semibold text-[var(--text-primary)] lg:text-[var(--text-secondary)] hover:text-[var(--accent-primary)] cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 transition-colors tracking-tight w-full sm:w-auto mt-1 sm:mt-0">
              See what I build
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 lg:ml-0.5 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});
