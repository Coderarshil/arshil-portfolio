import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { flushSync } from 'react-dom';

interface AppState {
  theme: 'cappuccino' | 'espresso';
  animations: 'calmer' | 'default';
  showTicTacToe: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'cappuccino' | 'espresso') => void;
  setAnimations: (mode: 'calmer' | 'default') => void;
  setShowTicTacToe: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'cappuccino',
      animations: 'default',
      showTicTacToe: false,
      setShowTicTacToe: (open) => set({ showTicTacToe: open }),
      toggleTheme: () => {
        const state = get();
        const next = state.theme === 'cappuccino' ? 'espresso' : 'cappuccino';
        const apply = () => {
          document.documentElement.classList.toggle('espresso-mode', next === 'espresso');
          document.documentElement.style.colorScheme = next === 'espresso' ? 'dark' : 'light';
        };
        if (document.startViewTransition && state.animations !== 'calmer') {
          document.documentElement.classList.add('view-transition-active');
          const transition = document.startViewTransition(() => {
            flushSync(() => set({ theme: next }));
            apply();
          });
          transition.finished.finally(() => document.documentElement.classList.remove('view-transition-active'));
        } else {
          document.documentElement.classList.add('theme-transition');
          set({ theme: next });
          apply();
          window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 1200);
        }
      },
      setTheme: (theme) => {
        const state = get();
        const apply = () => {
          document.documentElement.classList.toggle('espresso-mode', theme === 'espresso');
          document.documentElement.style.colorScheme = theme === 'espresso' ? 'dark' : 'light';
        };
        if (document.startViewTransition && state.animations !== 'calmer') {
          document.documentElement.classList.add('view-transition-active');
          const transition = document.startViewTransition(() => {
            flushSync(() => set({ theme }));
            apply();
          });
          transition.finished.finally(() => document.documentElement.classList.remove('view-transition-active'));
        } else {
          document.documentElement.classList.add('theme-transition');
          set({ theme });
          apply();
          window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 1200);
        }
      },
      setAnimations: (mode) => {
        document.documentElement.classList.toggle('reduce-motion', mode === 'calmer');
        set({ animations: mode });
      },
    }),
    { name: 'arshil-portfolio-storage', partialize: (state) => ({ theme: state.theme, animations: state.animations }) }
  )
);
