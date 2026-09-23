import React, { useState } from 'react';
import { Home, UserRound, FolderOpen, Mail } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { ProfileSummary } from './ProfileSummary';

export function BottomNav() {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const theme = useAppStore(s => s.theme);
  const avatar = theme === 'espresso' ? '/arshil-espresso.webp' : '/arshil-cappuccino.webp';
  const go = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  const items = [
    { label: 'Home', icon: Home, target: '#home' },
    { label: 'About', icon: UserRound, target: '#about' },
    { label: 'Projects', icon: FolderOpen, target: '#projects' },
    { label: 'Contact', icon: Mail, target: '#contact' },
  ];
  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-t border-[var(--border-color)]/20 pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="relative grid grid-cols-5 items-center h-16">
          {items.slice(0, 2).map(({ label, icon: Icon, target }, index) => (
            <button key={label} onClick={() => go(target)} className={`${index === 0 ? 'col-start-1' : 'col-start-2'} flex flex-col items-center justify-center w-full h-full gap-1 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors`}>
              <Icon size={21} /><span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}

          <button
            onClick={() => setSummaryOpen(true)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[26px] flex items-center justify-center w-[70px] h-[70px] rounded-full bg-[var(--accent-primary)] text-white shadow-[0_10px_30px_rgba(139,69,19,0.28)] active:scale-95 border-[3px] border-[var(--bg-primary)] overflow-hidden p-[3px] z-10"
            aria-label="Open Arshil profile summary"
          >
            <span className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-card)] block">
              <img src={avatar} alt="Arshil" className="w-full h-full object-cover" />
            </span>
          </button>

          {items.slice(2).map(({ label, icon: Icon, target }, index) => (
            <button key={label} onClick={() => go(target)} className={`${index === 0 ? 'col-start-4' : 'col-start-5'} flex flex-col items-center justify-center w-full h-full gap-1 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors`}>
              <Icon size={21} /><span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {summaryOpen && <ProfileSummary onClose={() => setSummaryOpen(false)} />}
    </>
  );
}
