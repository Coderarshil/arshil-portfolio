import React, { useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PortfolioSections } from './components/PortfolioSections';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { TicTacToeWidget } from './components/TicTacToeWidget';
import { ResumeModal } from './components/ResumeModal';
import { useAppStore } from './lib/store';

/**
 * Keep the main portfolio tree stable while theme / animation preferences change.
 * Only the small settings layer subscribes to those store values, which avoids
 * re-rendering every section during a theme switch and helps preserve the site's
 * fluid animation feel.
 */
export default function App() {
  const showTicTacToe = useAppStore(s => s.showTicTacToe);
  const setShowTicTacToe = useAppStore(s => s.setShowTicTacToe);
  const [resumeOpen, setResumeOpen] = React.useState(false);

  return (
    <AppSettings>
      <div className="min-h-screen font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden pb-[84px] md:pb-0">
        <Header onResume={() => setResumeOpen(true)} />
        <main className="flex flex-col items-center relative w-full min-h-[60vh] overflow-x-hidden md:overflow-visible">
          <Hero onPlay={() => setShowTicTacToe(true)} onResume={() => setResumeOpen(true)} />
          <PortfolioSections />
        </main>
        <Footer />
        <BottomNav />
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
        <AnimatePresence>
          {showTicTacToe && <TicTacToeWidget onClose={() => setShowTicTacToe(false)} />}
        </AnimatePresence>
      </div>
    </AppSettings>
  );
}

const AppSettings = React.memo(function AppSettings({ children }: { children: React.ReactNode }) {
  const theme = useAppStore(s => s.theme);
  const animations = useAppStore(s => s.animations);

  useEffect(() => {
    document.title = 'Mohammad Arshil Siddiqui — Portfolio';
    document.documentElement.classList.toggle('espresso-mode', theme === 'espresso');
    document.documentElement.style.colorScheme = theme === 'espresso' ? 'dark' : 'light';
    document.documentElement.classList.toggle('reduce-motion', animations === 'calmer');
  }, [theme, animations]);

  return (
    <MotionConfig reducedMotion={animations === 'calmer' ? 'always' : 'user'}>
      {children}
    </MotionConfig>
  );
});
