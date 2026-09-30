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
    // A deliberate burst layout gives the impression that the papers are
    // being launched from the folder instead of forming a rigid orbit.
    const count = Math.max(items.length, 1);
    const mobileSpread = Math.min(spread, 138);
    const effectiveSpread = isMobile ? mobileSpread : spread;
    const stageWidth = isMobile ? 320 : 560;
    const stageHeight = isMobile ? 350 : 410;
    const rx = Math.min(effectiveSpread * 1.15, stageWidth / 2 - 34);
    const ry = Math.min(effectiveSpread * 0.72, stageHeight / 2 - 38);

    return items.map((_, index) => {
      const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
      const horizontalSkew = index % 2 === 0 ? 1.04 : 0.96;
      const x = Math.cos(angle) * rx * horizontalSkew;
      const y = Math.sin(angle) * ry - lift * 0.28;
      const rotation = Math.sin(angle * 1.6) * tilt;
      return { x, y, rotation };
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

  const handleFolderClick = () => setOpen(value => !value);
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
