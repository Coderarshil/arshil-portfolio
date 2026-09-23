import React, { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
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
    const apply = () => {
      document.documentElement.classList.toggle('espresso-mode', theme === 'espresso');
      document.documentElement.style.colorScheme = theme === 'espresso' ? 'dark' : 'light';
      if (animations === 'calmer') document.documentElement.classList.add('reduce-motion');
      else document.documentElement.classList.remove('reduce-motion');
    };
    apply();
  }, [theme, animations]);

  useEffect(() => {
    document.title = 'Mohammad Arshil Siddiqui — Portfolio';
  }, []);

  return <MotionConfig reducedMotion={animations === 'calmer' ? 'always' : 'user'}>
    <div className="min-h-screen font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden pb-[80px] md:pb-0">
      <Header />
      <main className="flex flex-col items-center relative w-full min-h-[60vh] overflow-x-hidden md:overflow-visible">
        <Hero onPlay={() => setShowTicTacToe(true)} />
        <PortfolioSections />
      </main>
      <Footer />
      <BottomNav />
      {showTicTacToe && <TicTacToeWidget onClose={() => setShowTicTacToe(false)} />}
    </div>
  </MotionConfig>;
}
