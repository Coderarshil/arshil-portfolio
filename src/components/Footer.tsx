import React from 'react';

export function Footer() {
  return <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-16 mt-10">
    <div className="max-w-[1400px] mx-auto px-6 pb-10 flex flex-col items-center text-center">
      <p className="font-handwriting text-3xl sm:text-4xl text-[var(--accent-primary)]">Thanks for stopping by ☕</p>
      <p className="text-[var(--text-secondary)] mt-2">Made with curiosity, experiments &amp; a little too much coffee.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-[var(--text-muted)]">
        <span>Mohammad Arshil Siddiqui</span><span>•</span><span>Student · Developer · AI Enthusiast</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-5">© {new Date().getFullYear()} Arshil</p>
    </div>
  </footer>;
}
