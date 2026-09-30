'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as Matter from 'matter-js';

export type FolderFloatItem = string | { label: string; value: string };
export type FolderFloatTrigger = 'hover' | 'click';

type Size = { w: number; h: number };
type Entry = { label: string; value: string };

type FolderFloatProps = {
  items?: FolderFloatItem[];
  label?: string;
  sublabel?: string;
  trigger?: FolderFloatTrigger;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
  physics?: boolean;
  drift?: number;
  onSelect?: (value: string, index: number) => void;
  onOpenChange?: (open: boolean) => void;
  folderColor?: string;
  frontColor?: string;
  paperColor?: string;
  itemColor?: string;
  itemTextColor?: string;
  labelColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  spread?: number;
  lift?: number;
  tilt?: number;
  flapAngle?: number;
  restAngle?: number;
  openDuration?: number;
  stagger?: number;
  bounce?: number;
  className?: string;
};

const DEFAULT_ITEMS: FolderFloatItem[] = ['Try a warmer palette', 'Tighten the spacing', 'Logo feels small', 'Love the new hero'];
const PAD = 28;
const CHAR = 6.8;
const GAP = 12;
const ROW = 52;

const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

function layout(list: Entry[], spread: number, lift: number, tilt: number, sizes: (Size | null)[]) {
  const rows: { items: { i: number; pw: number }[]; width: number }[] = [];
  let row: { i: number; pw: number }[] = [];
  let rowWidth = 0;

  list.forEach((item, i) => {
    const pw = sizes[i]?.w ?? PAD + item.label.length * CHAR;
    if (row.length && rowWidth + GAP + pw > spread * 2) {
      rows.push({ items: row, width: rowWidth });
      row = [];
      rowWidth = 0;
    }
    row.push({ i, pw });
    rowWidth += (row.length > 1 ? GAP : 0) + pw;
  });
  if (row.length) rows.push({ items: row, width: rowWidth });

  const pos: { x: number; y: number; r: number }[] = [];
  rows.forEach((r, ri) => {
    let x = -r.width / 2;
    const shift = (ri % 2 ? 1 : -1) * Math.min(16, spread * 0.1);
    r.items.forEach(({ i, pw }) => {
      const j = jitter(i);
      pos[i] = {
        x: x + pw / 2 + shift + (j - 0.5) * 6,
        y: -lift - ri * ROW - j * 6,
        r: tilt * (j * 2 - 1),
      };
      x += pw + GAP;
    });
  });
  return pos;
}

export default function FolderFloat({
  items = DEFAULT_ITEMS,
  label = 'Design feedback',
  sublabel = '',
  trigger = 'hover',
  defaultOpen = false,
  closeOnSelect = true,
  physics = true,
  drift = 0.5,
  onSelect,
  onOpenChange,
  folderColor = '#3f3f46',
  frontColor = '#52525b',
  paperColor = '#f5f5f5',
  itemColor = '#f5f5f5',
  itemTextColor = '#18181b',
  labelColor = '#f5f5f5',
  width = 200,
  height = 148,
  radius = 14,
  spread = 180,
  lift = 26,
  tilt = 8,
  flapAngle = 34,
  restAngle = 16,
  openDuration = 520,
  stagger = 45,
  bounce = 0.3,
  className = '',
}: FolderFloatProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [live, setLive] = useState(false);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [reduce, setReduce] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const world = useRef<{ engine: Matter.Engine | null; bodies: Matter.Body[]; raf: number; last: number; t0: number }>({ engine: null, bodies: [], raf: 0, last: 0, t0: 0 });
  const list: Entry[] = items.map(item => (typeof item === 'string' ? { label: item, value: item } : item));
  const n = list.length;
  const sub = sublabel || `${n} ${n === 1 ? 'note' : 'notes'}`;
  const pos = layout(list, spread, lift, tilt, sizes);

  const hover = trigger === 'hover';
  const [coarse, setCoarse] = useState(false);
  const effectiveClick = !hover || coarse;

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const next = pillRefs.current.slice(0, n).map(el => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
      if (next.some(s => !s)) return;
      const sized = next as Size[];
      setSizes(prev => prev.length === sized.length && prev.every((s, i) => s.w === sized[i].w && s.h === sized[i].h) ? prev : sized);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [n, list.map(item => item.label).join('|')]);

  const stopPhysics = useCallback(() => {
    const w = world.current;
    cancelAnimationFrame(w.raf);
    w.raf = 0;
    if (w.engine) {
      Matter.Composite.clear(w.engine.world, false, true);
      Matter.Engine.clear(w.engine);
      w.engine = null;
    }
    w.bodies = [];
    setLive(false);
  }, []);

  const startPhysics = useCallback(() => {
    if (reduce || !physics || !open) return;
    const w = world.current;
    if (w.engine || pillRefs.current.slice(0, n).some(el => !el)) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engine.enableSleeping = false;
    w.engine = engine;
    w.bodies = pillRefs.current.slice(0, n).map((el, i) => {
      const size = { w: el!.offsetWidth, h: el!.offsetHeight };
      const body = Matter.Bodies.rectangle(pos[i].x, pos[i].y + size.h / 2, size.w, size.h, {
        chamfer: { radius: Math.min(size.h / 2 - 1, 16) },
        restitution: 0.35 + bounce * 0.35,
        friction: 0,
        frictionAir: 0.08,
        inertia: Infinity,
      });
      return body;
    });

    const zoneLeft = -spread - 8;
    const zoneRight = spread + 8;
    const zoneTop = Math.min(...pos.map(p => p.y)) - 16;
    const zoneBottom = -lift + Math.max(...w.bodies.map((b, i) => sizes[i]?.h ?? 34));
    const wall = 80;
    Matter.Composite.add(engine.world, [
      ...w.bodies,
      Matter.Bodies.rectangle((zoneLeft + zoneRight) / 2, zoneTop - wall / 2, zoneRight - zoneLeft + wall * 2, wall, { isStatic: true }),
      Matter.Bodies.rectangle((zoneLeft + zoneRight) / 2, zoneBottom + wall / 2, zoneRight - zoneLeft + wall * 2, wall, { isStatic: true }),
      Matter.Bodies.rectangle(zoneLeft - wall / 2, (zoneTop + zoneBottom) / 2, wall, zoneBottom - zoneTop + wall * 2, { isStatic: true }),
      Matter.Bodies.rectangle(zoneRight + wall / 2, (zoneTop + zoneBottom) / 2, wall, zoneBottom - zoneTop + wall * 2, { isStatic: true }),
    ]);

    setLive(true);
    w.last = performance.now();
    w.t0 = w.last;
    const tick = (now: number) => {
      if (!world.current.engine) return;
      const state = world.current;
      const dt = Math.min(32, now - state.last || 16);
      state.last = now;
      const t = (now - state.t0) / 1000;
      const force = Math.max(0.00001, drift * 0.00005);
      state.bodies.forEach((body, i) => {
        const phase = i * 1.37;
        Matter.Body.applyForce(body, body.position, {
          x: Math.sin(t * 0.9 + phase) * force * body.mass,
          y: Math.cos(t * 1.2 + phase * 1.7) * force * body.mass,
        });
        const el = pillRefs.current[i];
        if (el) {
          el.style.setProperty('--x', `${body.position.x.toFixed(1)}px`);
          el.style.setProperty('--y', `${(body.position.y - (sizes[i]?.h ?? 34) / 2).toFixed(1)}px`);
          el.style.setProperty('--r', `${body.angle * 10 + pos[i].r}deg`);
        }
      });
      Matter.Engine.update(state.engine, dt);
      state.raf = requestAnimationFrame(tick);
    };
    w.raf = requestAnimationFrame(tick);
  }, [reduce, physics, open, n, pos, spread, lift, sizes, bounce, drift]);

  useEffect(() => {
    if (!open) {
      stopPhysics();
      return;
    }
    if (!physics || reduce) return;
    const timer = window.setTimeout(startPhysics, openDuration + Math.max(0, n - 1) * stagger + 80);
    return () => window.clearTimeout(timer);
  }, [open, physics, reduce, openDuration, n, stagger, startPhysics, stopPhysics]);

  useEffect(() => () => stopPhysics(), [stopPhysics]);

  const set = (next: boolean) => {
    setOpen(prev => {
      if (prev === next) return prev;
      onOpenChange?.(next);
      return next;
    });
  };

  const pick = (item: Entry, i: number) => {
    onSelect?.(item.value, i);
    if (closeOnSelect) set(false);
  };

  const themeVars = {
    '--ff-w': `${width}px`,
    '--ff-h': `${height}px`,
    '--ff-r': `${radius}px`,
    '--ff-back': folderColor,
    '--ff-front': frontColor,
    '--ff-paper': paperColor,
    '--ff-item': itemColor,
    '--ff-item-ink': itemTextColor,
    '--ff-label': labelColor,
    '--ff-spread': `${spread}px`,
    '--ff-lift': `${lift}px`,
    '--ff-angle': `${flapAngle}deg`,
    '--ff-rest': `${restAngle}deg`,
    '--ff-open': `${openDuration}ms`,
    '--ff-stagger': `${stagger}ms`,
    '--ff-n': n,
  } as React.CSSProperties;

  return (
    <div
      className={`folder-float${className ? ` ${className}` : ''}`}
      style={themeVars}
      data-open={open ? '' : undefined}
      data-live={live ? '' : undefined}
      data-physics={physics ? '' : undefined}
      data-trigger={trigger}
      onPointerEnter={hover && !coarse ? () => set(true) : undefined}
      onPointerLeave={hover && !coarse ? () => set(false) : undefined}
    >
      <div ref={anchorRef} className="folder-float__items" aria-hidden={!open}>
        {list.map((item, i) => (
          <button
            key={`${item.value}-${i}`}
            ref={el => { pillRefs.current[i] = el; }}
            type="button"
            className="folder-float__item"
            style={{ '--i': i, '--x': `${pos[i]?.x ?? 0}px`, '--y': `${pos[i]?.y ?? 0}px`, '--r': `${pos[i]?.r ?? 0}deg` } as React.CSSProperties}
            onClick={() => pick(item, i)}
            tabIndex={open ? 0 : -1}
          >
            <span className="folder-float__drift">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="folder-float__folder">
        <span className="folder-float__back" aria-hidden="true" />
        <span className="folder-float__paper" aria-hidden="true" />
        <div className="folder-float__front" aria-hidden="true">
          <span className="folder-float__label">{label}</span>
          <span className="folder-float__sub">{sub}</span>
        </div>
        <button
          type="button"
          className="folder-float__trigger"
          aria-label={open ? `Close ${label}` : `Open ${label}`}
          aria-expanded={open}
          onClick={() => effectiveClick && set(!open)}
        />
      </div>
    </div>
  );
}
