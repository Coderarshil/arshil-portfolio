import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../lib/store';

type VantaBirdEffect = {
  destroy?: () => void;
  setOptions?: (options: Record<string, unknown>) => void;
};

type VantaGlobal = {
  BIRDS: (options: Record<string, unknown>) => VantaBirdEffect;
};

declare global {
  interface Window {
    VANTA?: VantaGlobal;
  }
}

/**
 * Vanta Birds background for the Hero.
 * The effect is deliberately kept behind all Hero content and is recreated
 * when the site's light/dark theme changes so the bird palette stays exact.
 */
export const BirdBackground = React.memo(function BirdBackground() {
  const isEspresso = useAppStore((state) => state.theme === 'espresso');
  const animations = useAppStore((state) => state.animations);
  const effectRef = useRef<VantaBirdEffect | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedByPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reducedByApp = animations === 'calmer';

    if (reducedByPreference || reducedByApp) {
      effectRef.current?.destroy?.();
      effectRef.current = null;
      host.replaceChildren();
      return;
    }

    const VANTA = window.VANTA;
    if (!VANTA?.BIRDS) {
      // The CDN scripts are loaded in index.html before the React bundle.
      // Fail quietly rather than breaking the Hero if a CDN is temporarily unavailable.
      return;
    }

    effectRef.current?.destroy?.();
    effectRef.current = null;
    host.replaceChildren();

    const backgroundColor = isEspresso ? 0x0f0a06 : 0xfaf6f1;
    const birdColor = isEspresso ? 0xffffff : 0xc89568;
    const birdColor2 = isEspresso ? 0x808080 : 0x91450e;

    effectRef.current = VANTA.BIRDS({
      el: host,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor,
      color1: birdColor,
      color2: birdColor2,
      quantity: 3,
      birdSize: 0.8,
    });

    return () => {
      effectRef.current?.destroy?.();
      effectRef.current = null;
      host.replaceChildren();
    };
  }, [animations, isEspresso]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="hero-birds"
    />
  );
});
