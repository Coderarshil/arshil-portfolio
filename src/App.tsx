import React, { useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PortfolioSections } from './components/PortfolioSections';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { TicTacToeWidget } from './components/TicTacToeWidget';
import { useAppStore } from './lib/store';

export default function App() {
  const theme = useAppStore(s => s.theme);
  const animations = useAppStore(s => s.animations);
  const showTicTacToe = useAppStore(s => s.showTicTacToe);
  const setShowTicTacToe = useAppStore(s => s.setShowTicTacToe);

  useEffect(() => {
    document.title = 'Mohammad Arshil Siddiqui — Portfolio';
    document.documentElement.classList.toggle('espresso-mode', theme === 'espresso');
    document.documentElement.style.colorScheme = theme === 'espresso' ? 'dark' : 'light';
    document.documentElement.classList.toggle('reduce-motion', animations === 'calmer');
  }, [theme, animations]);

  return (
    <MotionConfig reducedMotion={animations === 'calmer' ? 'always' : 'user'}>
      <div className="min-h-screen font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden pb-[80px] md:pb-0">
        <Header />
        <main className="flex flex-col items-center relative w-full min-h-[60vh] overflow-x-hidden md:overflow-visible">
          <Hero onPlay={() => setShowTicTacToe(true)} />
          <PortfolioSections />
        </main>
        <Footer />
        <BottomNav />
        <AnimatePresence>
          {showTicTacToe && <TicTacToeWidget onClose={() => setShowTicTacToe(false)} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
