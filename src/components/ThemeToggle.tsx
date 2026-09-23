import React from 'react';
import { useAppStore } from '../lib/store';
import { Sun, Moon, Coffee } from 'lucide-react';

export const ThemeToggle = React.memo(function ThemeToggle() {
  const theme = useAppStore(s => s.theme);
  const toggleTheme = useAppStore(s => s.toggleTheme);
  const isDark = theme === 'espresso';

  return (
    <>
    <button 
      onClick={toggleTheme}
      className={`hidden md:flex relative w-16 h-[36px] rounded-full items-center transition-colors duration-500 ease-in-out ${isDark ? 'bg-[#3b2b20] border-[#524436]/60' : 'bg-[#fcf8f2] border-[#ede3d5]'} border p-1`}
      aria-label="Toggle theme"
    >
      <div 
        className={`w-7 h-7 rounded-full bg-white dark:bg-[#1a130d] shadow-sm flex items-center justify-center relative z-10 transform transition-transform duration-500 ease-in-out`}
        style={{ transform: `translateX(${isDark ? '26px' : '0px'})` }}
      >
        {isDark ? <Moon size={14} strokeWidth={2.5} className="text-[#e3ccb8]" /> : <Sun size={14} strokeWidth={2.5} className="text-[#a68666]" />}
      </div>
    </button>
    <button 
       onClick={toggleTheme}
       className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all"
    >
      {isDark ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
    </button>
    </>
  );
});
