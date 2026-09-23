import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { flushSync } from 'react-dom';

export interface FileRecord {
  id: string;
  name: string;
  tool: string;
  timestamp: number;
}

interface AppState {
  theme: 'cappuccino' | 'espresso' | 'system';
  animations: 'calmer' | 'default';
  recentFiles: FileRecord[];
  regularBrews: string[];
  customAvatars: Record<string, string>;
  dailyUploadBytes?: number;
  lastUploadResetDate?: string;
  addUploadBytes?: (bytes: number) => boolean;
  setCustomAvatar: (userId: string, dataUrl: string) => void;
  addRecentFile: (record: Omit<FileRecord, 'id' | 'timestamp'>) => void;
  clearRecentFiles: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'cappuccino' | 'espresso' | 'system') => void;
  setAnimations: (mode: 'calmer' | 'default') => void;
  addRegularBrew: (toolId: string) => void;
  removeRegularBrew: (toolId: string) => void;
  reorderRegularBrews: (toolIds: string[]) => void;
  authModal: 'login' | 'signup' | 'forgotPassword' | null;
  setAuthModal: (type: 'login' | 'signup' | 'forgotPassword' | null) => void;
  uploadWorkspaceOpen: boolean;
  setUploadWorkspaceOpen: (open: boolean) => void;
  showTicTacToe: boolean;
  setShowTicTacToe: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'cappuccino',
      animations: 'default',
      recentFiles: [],
      regularBrews: ['mergePdf', 'splitPdf', 'compressPdf', 'pdfToWord', 'pdfToExcel', 'jpgToPdf'], // default example favorites
      customAvatars: {},
      dailyUploadBytes: 0,
      lastUploadResetDate: '',
      authModal: null,
      uploadWorkspaceOpen: false,
      showTicTacToe: false,
      setUploadWorkspaceOpen: (open) => set({ uploadWorkspaceOpen: open }),
      setShowTicTacToe: (open) => set({ showTicTacToe: open }),
      setAuthModal: (type) => set({ authModal: type }),
      addUploadBytes: (bytes: number) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const state = get();
        let currentBytes = state.dailyUploadBytes || 0;
        let lastDate = state.lastUploadResetDate || '';

        if (lastDate !== todayStr) {
          currentBytes = 0;
          lastDate = todayStr;
        }

        const limit = 100 * 1024 * 1024; // 100MB daily limit
        if (currentBytes + bytes > limit) {
          return false;
        }

        set({
          dailyUploadBytes: currentBytes + bytes,
          lastUploadResetDate: lastDate
        });
        return true;
      },
      setCustomAvatar: (userId, dataUrl) => set((state) => ({
        customAvatars: { ...state.customAvatars, [userId]: dataUrl }
      })),
      addRecentFile: (record) => set((state) => {
        const newRecord: FileRecord = {
          ...record,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now()
        };
        const updated = [newRecord, ...(state.recentFiles || [])].slice(0, 10);
        return { recentFiles: updated };
      }),
      clearRecentFiles: () => set({ recentFiles: [] }),
      toggleTheme: () => {
        const state = get();
        const newTheme = state.theme === 'cappuccino' ? 'espresso' : 'cappuccino';
        
        const applyTheme = () => {
          if (newTheme === 'espresso') {
            document.documentElement.classList.add('espresso-mode');
          } else {
            document.documentElement.classList.remove('espresso-mode');
          }
        };

        if (document.startViewTransition && state.animations !== 'calmer') {
          document.documentElement.classList.add('view-transition-active');
          const transition = document.startViewTransition(() => {
            flushSync(() => {
              set({ theme: newTheme });
            });
            applyTheme();
          });
          transition.finished.finally(() => {
            document.documentElement.classList.remove('view-transition-active');
          });
        } else {
          document.documentElement.classList.add('theme-transition');
          set({ theme: newTheme });
          applyTheme();
          setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
          }, 1200);
        }
      },
      setTheme: (theme) => {
        const state = get();
        const applyTheme = () => {
          if (theme === 'espresso') {
            document.documentElement.classList.add('espresso-mode');
          } else if (theme === 'cappuccino') {
            document.documentElement.classList.remove('espresso-mode');
          } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('espresso-mode');
            } else {
              document.documentElement.classList.remove('espresso-mode');
            }
          }
        };

        if (document.startViewTransition && state.animations !== 'calmer') {
          document.documentElement.classList.add('view-transition-active');
          const transition = document.startViewTransition(() => {
            flushSync(() => {
              set({ theme });
            });
            applyTheme();
          });
          transition.finished.finally(() => {
            document.documentElement.classList.remove('view-transition-active');
          });
        } else {
          document.documentElement.classList.add('theme-transition');
          set({ theme });
          applyTheme();
          setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
          }, 1200);
        }
      },
      setAnimations: (mode) => set((state) => {
        if (mode === 'calmer') {
          document.documentElement.classList.add('reduce-motion');
        } else {
          document.documentElement.classList.remove('reduce-motion');
        }
        return { animations: mode };
      }),
      addRegularBrew: (toolId) => set((state) => ({
        regularBrews: state.regularBrews.includes(toolId) ? state.regularBrews : [...state.regularBrews, toolId]
      })),
      removeRegularBrew: (toolId) => set((state) => ({
        regularBrews: state.regularBrews.filter(id => id !== toolId)
      })),
      reorderRegularBrews: (toolIds) => set({ regularBrews: toolIds })
    }),
    {
      name: 'coffee-pdf-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        animations: state.animations, 
        recentFiles: state.recentFiles, 
        regularBrews: state.regularBrews, 
        customAvatars: state.customAvatars,
        dailyUploadBytes: state.dailyUploadBytes,
        lastUploadResetDate: state.lastUploadResetDate
      }),
    }  
  )
);
