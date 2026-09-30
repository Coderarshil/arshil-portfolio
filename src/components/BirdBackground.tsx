import React, { useEffect, useRef } from 'react';

type Bird = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  size: number;
  phase: number;
  seed: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/**
 * Lightweight ambient flock for the Hero.
 * The flock keeps moving when the pointer is idle; the pointer is only a
 * temporary repulsion/influence, never a target that the birds settle on.
 */
export const BirdBackground = React.memo(function BirdBackground({ dark = false }: { dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const darkRef = useRef(dark);

  useEffect(() => {
    darkRef.current = dark;
  }, [dark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let pointerX = -1000;
    let pointerY = -1000;
    let pointerActive = false;
    let pointerLastSeen = 0;
    let birds: Bird[] = [];

    const seedRandom = (seed: number) => {
      let value = seed || 1;
      return () => {
        value = (value * 16807) % 2147483647;
        return (value - 1) / 2147483646;
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 640 ? 14 : width < 1024 ? 20 : 30;
      const random = seedRandom(Math.round(width * 13 + height * 7));
      birds = Array.from({ length: count }, (_, index) => {
        const angle = random() * Math.PI * 2;
        const speed = 0.32 + random() * 0.45;
        return {
          x: random() * width,
          y: random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          speed,
          size: 2.5 + random() * 2.7,
          phase: random() * Math.PI * 2,
          seed: index + random(),
        };
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      pointerActive = true;
      pointerLastSeen = performance.now();
    };

    const onPointerLeave = () => {
      pointerActive = false;
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        last = performance.now();
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const drawBird = (bird: Bird, now: number, alpha: number) => {
      const speed = Math.hypot(bird.vx, bird.vy) || 0.001;
      const angle = Math.atan2(bird.vy, bird.vx);
      const flap = Math.sin(now * 0.006 + bird.phase) * 0.32;
      const wing = bird.size * (1.65 + flap);
      const body = bird.size * 1.05;

      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = darkRef.current ? 'rgba(255,255,255,0.78)' : 'rgba(55,35,25,0.48)';
      ctx.beginPath();
      ctx.ellipse(0, 0, body * 1.25, body * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-body * 0.15, -body * 0.18);
      ctx.quadraticCurveTo(-wing * 0.35, -wing * 0.8, -wing, -wing * (0.42 + flap * 0.5));
      ctx.quadraticCurveTo(-wing * 0.35, -wing * 0.22, body * 0.18, 0);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-body * 0.15, body * 0.18);
      ctx.quadraticCurveTo(-wing * 0.35, wing * 0.8, -wing, wing * (0.42 + flap * 0.5));
      ctx.quadraticCurveTo(-wing * 0.35, wing * 0.22, body * 0.18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = clamp((now - last) / 16.666, 0.35, 2.2);
      last = now;
      ctx.clearRect(0, 0, width, height);

      // Pointer influence expires quickly. Birds then continue with ambient
      // flocking, so an idle cursor never becomes a gathering point.
      const pointerFresh = pointerActive && now - pointerLastSeen < 1800;

      for (let i = 0; i < birds.length; i += 1) {
        const bird = birds[i];
        let alignX = 0;
        let alignY = 0;
        let cohesionX = 0;
        let cohesionY = 0;
        let separationX = 0;
        let separationY = 0;
        let neighbours = 0;

        for (let j = 0; j < birds.length; j += 1) {
          if (i === j) continue;
          const other = birds[j];
          const dx = other.x - bird.x;
          const dy = other.y - bird.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < 11500) {
            neighbours += 1;
            alignX += other.vx;
            alignY += other.vy;
            cohesionX += other.x;
            cohesionY += other.y;
            if (distSq < 1150) {
              const inv = 1 / distSq;
              separationX -= dx * inv * 45;
              separationY -= dy * inv * 45;
            }
          }
        }

        if (neighbours) {
          alignX = alignX / neighbours - bird.vx;
          alignY = alignY / neighbours - bird.vy;
          cohesionX = cohesionX / neighbours - bird.x;
          cohesionY = cohesionY / neighbours - bird.y;
        }

        bird.vx += (alignX * 0.013 + cohesionX * 0.00055 + separationX * 0.002) * dt;
        bird.vy += (alignY * 0.013 + cohesionY * 0.00055 + separationY * 0.002) * dt;

        // Gentle wandering keeps the flock alive even when no pointer is moving.
        const wander = now * 0.00032 + bird.seed * 1.73;
        bird.vx += Math.cos(wander) * 0.009 * dt;
        bird.vy += Math.sin(wander * 1.19) * 0.009 * dt;

        if (pointerFresh) {
          const dx = bird.x - pointerX;
          const dy = bird.y - pointerY;
          const distSq = dx * dx + dy * dy;
          const radius = 155;
          if (distSq > 0 && distSq < radius * radius) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * 0.34;
            bird.vx += (dx / dist) * force * dt;
            bird.vy += (dy / dist) * force * dt;
          }
        }

        const velocity = Math.hypot(bird.vx, bird.vy) || 0.001;
        const maxSpeed = bird.speed * 2.2;
        if (velocity > maxSpeed) {
          bird.vx = (bird.vx / velocity) * maxSpeed;
          bird.vy = (bird.vy / velocity) * maxSpeed;
        }

        bird.x += bird.vx * dt * 1.65;
        bird.y += bird.vy * dt * 1.65;

        const margin = 26;
        if (bird.x < -margin) bird.x = width + margin;
        if (bird.x > width + margin) bird.x = -margin;
        if (bird.y < -margin) bird.y = height + margin;
        if (bird.y > height + margin) bird.y = -margin;

        drawBird(bird, now, darkRef.current ? 0.78 : 0.62);
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    reduceMotion.addEventListener?.('change', onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener?.('change', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-birds"
    />
  );
});
