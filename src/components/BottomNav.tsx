import React from 'react';
import { Home, UserRound, FolderOpen, Mail, Coffee } from 'lucide-react';

export function BottomNav() {
  const go = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  const items = [
    { label: 'Home', icon: Home, target: '#home' },
    { label: 'About', icon: UserRound, target: '#about' },
    { label: 'Projects', icon: FolderOpen, target: '#projects' },
    { label: 'Contact', icon: Mail, target: '#contact' },
  ];
  return <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-t border-[var(--border-color)]/15 pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"><div className="flex items-center justify-around h-16">
    {items.slice(0,2).map(({label,icon:Icon,target}) => <button key={label} onClick={() => go(target)} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"><Icon size={21}/><span className="text-[10px] font-medium">{label}</span></button>)}
    <button onClick={() => go('#projects')} className="relative -top-5 flex items-center justify-center w-14 h-14 bg-[var(--accent-primary)] rounded-full text-white shadow-xl active:scale-95 border-2 border-[var(--bg-primary)]/65" aria-label="Projects"><Coffee size={23}/></button>
    {items.slice(2).map(({label,icon:Icon,target}) => <button key={label} onClick={() => go(target)} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"><Icon size={21}/><span className="text-[10px] font-medium">{label}</span></button>)}
  </div></div>;
}
