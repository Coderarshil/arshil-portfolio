import React, { useEffect } from 'react';
import { Lenis } from '../lib/lenis/lenis';
import { setLenisInstance } from '../lib/smoothScroll';
import { useAppStore } from '../lib/store';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const animations = useAppStore(s => s.animations);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: animations !== 'calmer',
      syncTouch: animations !== 'calmer',
      touchMultiplier: 1,
      wheelMultiplier: 1,
      lerp: 0.1,
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });

    setLenisInstance(lenis);

    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, [animations]);

  return <>{children}</>;
}
