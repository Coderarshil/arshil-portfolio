import React, { useEffect, useMemo, useRef, useState } from 'react';
import './CircularCarousel.css';

export default function CircularCarousel({
  items = [],
  preset = 'panorama',
  intro = 'spin',
  cardWidth = 294,
  aspectRatio = 1.333,
  speed = 14,
  captions = false,
  gap = 25,
  tilt = 0,
  curve = 1,
  perspective = 1800,
  autoplay = 'drift',
  interval = 3,
  direction = 'left',
  momentum = 0.6,
  snap = true,
  pauseOnHover = true,
  focusOnClick = true,
  draggable = true,
  parallax = 0.3,
  stretch = 0.5,
  fadeColor = '#000000',
  depthFade = 0.55,
  innerShade = 0.6,
  cornerRadius = 12,
  onSelect,
}) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [introDone, setIntroDone] = useState(intro !== 'spin');
  const startX = useRef(0);
  const startOffset = useRef(0);
  const offset = useRef(0);
  const velocity = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);

  const step = useMemo(() => Math.max(cardWidth + gap, 1), [cardWidth, gap]);
  const total = count * step;

  useEffect(() => {
    if (intro === 'spin') {
      const id = requestAnimationFrame(() => setIntroDone(true));
      return () => cancelAnimationFrame(id);
    }
  }, [intro]);

  useEffect(() => {
    if (autoplay !== 'drift' || count < 2 || paused || dragging) return;
    const ms = Math.max(0.5, interval) * 1000;
    const id = window.setInterval(() => {
      setActive((i) => (i + (direction === 'left' ? 1 : -1) + count) % count);
    }, ms);
    return () => window.clearInterval(id);
  }, [autoplay, count, direction, dragging, interval, paused]);

  useEffect(() => {
    if (!dragging) return;
    const tick = (t) => {
      const dt = Math.min(32, last.current ? t - last.current : 16);
      last.current = t;
      if (!dragging) return;
      offset.current += velocity.current * dt;
      velocity.current *= Math.pow(0.001, dt / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [dragging]);

  const normalizeIndex = (i) => ((i % count) + count) % count;

  const select = (index) => {
    const next = normalizeIndex(index);
    setActive(next);
    offset.current = 0;
    velocity.current = 0;
    onSelect?.(items[next], next);
  };

  const pointerDown = (e) => {
    if (!draggable) return;
    setDragging(true);
    setPaused(true);
    startX.current = e.clientX;
    startOffset.current = offset.current;
    velocity.current = 0;
    last.current = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const pointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    const next = startOffset.current + dx;
    velocity.current = (next - offset.current) / 16;
    offset.current = next;
  };

  const pointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    setPaused(false);
    const travel = offset.current;
    const threshold = step * 0.22;
    let delta = 0;
    if (Math.abs(travel) > threshold || Math.abs(velocity.current) > 0.12) {
      delta = travel < 0 ? 1 : -1;
    }
    offset.current = 0;
    velocity.current = 0;
    if (snap) select(active + delta);
  };

  const getSignedDistance = (i) => {
    let d = i - active;
    while (d > count / 2) d -= count;
    while (d < -count / 2) d += count;
    return d;
  };

  return (
    <div
      className={`circular-carousel ${introDone ? 'is-ready' : 'is-intro'} ${dragging ? 'is-dragging' : ''}`}
      style={{
        '--cc-width': `${cardWidth}px`,
        '--cc-height': `${cardWidth / aspectRatio}px`,
        '--cc-gap': `${gap}px`,
        '--cc-perspective': `${perspective}px`,
        '--cc-radius': `${cornerRadius}px`,
        '--cc-fade': fadeColor,
        '--cc-depth': depthFade,
        '--cc-shade': innerShade,
        '--cc-curve': curve,
        '--cc-stretch': stretch,
        '--cc-tilt': `${tilt}deg`,
        '--cc-parallax': parallax,
      }}
      onPointerEnter={() => pauseOnHover && setPaused(true)}
      onPointerLeave={() => pauseOnHover && !dragging && setPaused(false)}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      role="region"
      aria-label="Certifications carousel"
    >
      <div className="circular-carousel__viewport">
        <div className="circular-carousel__track">
          {items.map((item, i) => {
            const d = getSignedDistance(i);
            const ad = Math.abs(d);
            const x = d * step;
            const z = -ad * 125;
            const scale = Math.max(0.72, 1 - ad * 0.055);
            const opacity = Math.max(0.25, 1 - ad * depthFade * 0.28);
            const side = d === 0 ? 0 : Math.sign(d);
            const rotateY = side * Math.min(18, ad * 9);
            const y = Math.pow(ad, 1.15) * 20 * curve;
            const isActive = d === 0;
            const style = {
              transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rotateY}deg) rotateZ(${tilt}deg) scale(${scale})`,
              opacity,
              zIndex: 100 - Math.round(ad * 10),
              transition: dragging ? 'none' : 'transform 720ms cubic-bezier(.22,.7,.2,1), opacity 720ms ease',
            };
            return (
              <button
                key={item.src || item.title || i}
                type="button"
                className={`circular-carousel__card ${isActive ? 'is-active' : ''}`}
                style={style}
                onClick={() => focusOnClick && select(i)}
                aria-label={item.alt || item.title || `Certificate ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <div className="circular-carousel__surface">
                  <img src={item.src} alt={item.alt || ''} draggable="false" />
                  <div className="circular-carousel__shade" />
                  {captions && (item.title || item.subtitle) && (
                    <div className="circular-carousel__caption">
                      {item.title && <strong>{item.title}</strong>}
                      {item.subtitle && <span>{item.subtitle}</span>}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="circular-carousel__fade circular-carousel__fade--left" />
      <div className="circular-carousel__fade circular-carousel__fade--right" />
    </div>
  );
}
