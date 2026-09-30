import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type FolderFloatProps = {
  items: string[];
  label: string;
  sublabel: string;
  trigger?: 'hover' | 'click';
  closeOnSelect?: boolean;
  physics?: boolean;
  drift?: number;
  onSelect?: (value: string, index: number) => void;
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
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function FolderFloat({
  items,
  label,
  sublabel,
  trigger = 'hover',
  closeOnSelect = true,
  physics = true,
  drift = 0.5,
  onSelect,
  folderColor = '#d5b08a',
  frontColor = '#c89568',
  paperColor = '#fffaf4',
  itemColor = '#fffaf4',
  itemTextColor = '#2c1810',
  labelColor = '#fffaf4',
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
}: FolderFloatProps) {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const effectiveTrigger = isMobile ? 'click' : trigger;
  const shouldAnimate = !(prefersReducedMotion ?? false);

  const positions = useMemo(() => {
    // FolderFloat-style burst: papers fan upward and outward from the
    // folder instead of forming a circular orbit. This mirrors the
    // reference interaction while keeping all ten portfolio skills readable.
    const desktop = [
      [-132, -116, -8], [-42, -150, 3], [48, -154, 7], [138, -112, 10],
      [-158, -48, -6], [-55, -58, -2], [58, -56, 4], [158, -46, 8],
      [-105, 18, -5], [105, 16, 6],
    ] as const;
    const mobile = [
      [-92, -112, -8], [0, -138, 2], [92, -112, 8],
      [-116, -54, -7], [-38, -66, -2], [40, -66, 3], [116, -54, 7],
      [-92, 2, -5], [0, -4, 1], [92, 2, 5],
    ] as const;

    const base = isMobile ? mobile : desktop;
    const scale = Math.min(1, spread / 180);
    return items.map((_, index) => {
      const [x, y, rotation] = base[index % base.length];
      return {
        x: x * scale,
        y: y * scale - lift * 0.08,
        rotation: rotation * Math.min(1, tilt / 8),
      };
    });
  }, [items, isMobile, lift, spread, tilt]);

  const spring = physics && shouldAnimate
    ? {
        type: 'spring' as const,
        stiffness: 210,
        damping: clamp(28 - bounce * 10, 16, 30),
        mass: 0.9,
      }
    : {
        duration: openDuration / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      };

  const handleFolderClick = () => {
    if (effectiveTrigger === 'click') setOpen(value => !value);
  };
  const handleSelect = (value: string, index: number) => {
    setSelected(index);
    onSelect?.(value, index);
    if (closeOnSelect) setOpen(false);
  };

  const themeVars = {
    '--folder-color': folderColor,
    '--folder-front': frontColor,
    '--folder-paper': paperColor,
    '--folder-item': itemColor,
    '--folder-item-text': itemTextColor,
    '--folder-label': labelColor,
  } as React.CSSProperties;

  return (
    <div
      className="folder-float"
      style={{
        ...themeVars,
        '--folder-width': `${width}px`,
        '--folder-height': `${height}px`,
        '--folder-radius': `${radius}px`,
        '--folder-open-duration': `${openDuration}ms`,
      } as React.CSSProperties}
      onMouseEnter={() => effectiveTrigger === 'hover' && setOpen(true)}
      onMouseLeave={() => effectiveTrigger === 'hover' && setOpen(false)}
    >
      <div className="folder-float-stage" aria-label={`${label}, ${sublabel}`}>
        <div className="folder-float-papers" aria-hidden={!open}>
          {items.map((item, index) => {
            const { x, y, rotation } = positions[index];
            const targetX = open ? x : 0;
            const targetY = open ? y : 16;
            const targetRotate = open ? rotation : 0;
            const driftAmount = shouldAnimate ? Math.max(0, drift) * (index % 2 === 0 ? 1 : -1) : 0;
            const isSelected = selected === index;

            return (
              <motion.button
                key={`${item}-${index}`}
                type="button"
                className="folder-float-paper"
                initial={false}
                animate={
                  open
                    ? {
                        x: targetX,
                        y: targetY,
                        rotate: targetRotate,
                        opacity: 1,
                        scale: isSelected ? 1.04 : 1,
                      }
                    : {
                        x: targetX,
                        y: targetY,
                        rotate: targetRotate,
                        opacity: 0,
                        scale: 0.72,
                      }
                }
                transition={{
                  ...spring,
                  delay: shouldAnimate ? (open ? index * (stagger / 1000) : (items.length - index) * 0.018) : 0,
                }}
                whileHover={shouldAnimate ? { scale: 1.06, rotate: targetRotate + (index % 2 ? 1 : -1) } : undefined}
                onClick={() => handleSelect(item, index)}
                style={{
                  '--paper-drift': `${driftAmount}px`,
                  '--paper-index': index,
                  pointerEvents: open ? 'auto' : 'none',
                } as React.CSSProperties}
                tabIndex={open ? 0 : -1}
              >
                <span className="folder-float-paper-tape" aria-hidden="true" />
                <span className="folder-float-paper-text">{item}</span>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          className="folder-float-shell"
          initial={false}
          animate={
            shouldAnimate
              ? {
                  y: open ? -lift * 0.14 : 0,
                  rotate: open ? -tilt * 0.12 : 0,
                }
              : undefined
          }
          transition={spring}
        >
          <motion.div
            className="folder-float-back"
            animate={shouldAnimate ? { rotateX: open ? 0 : 0 } : undefined}
            transition={{ duration: openDuration / 1000 }}
          />
          <motion.div
            className="folder-float-flap"
            animate={shouldAnimate ? { rotateX: open ? flapAngle : restAngle } : { rotateX: restAngle }}
            transition={{
              ...(physics && shouldAnimate ? spring : { duration: openDuration / 1000, ease: [0.22, 1, 0.36, 1] as const }),
            }}
          />
          <motion.button
            type="button"
            className="folder-float-front"
            onClick={handleFolderClick}
            aria-expanded={open}
            aria-label={open ? `Close ${label}` : `Open ${label}`}
            whileTap={shouldAnimate ? { scale: 0.985 } : undefined}
          >
            <span className="folder-float-label">{label}</span>
            <span className="folder-float-sublabel">{sublabel}</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
