import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react';
import './TearTicket.css';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function TearTicket({
  children = null,
  stub = null,
  image = '',
  imageAlt = '',
  scrim = true,
  imageRadius = 8,
  orientation = 'horizontal',
  torn: controlledTorn,
  defaultTorn = false,
  onTear,
  width = 460,
  height = 250,
  stubSize = 150,
  radius = 16,
  holes = 12,
  holeSize = 6,
  notch = 3,
  roughness = 0,
  tearAngle = 30,
  stretch = 30,
  resistance = 0.45,
  rotate = 4,
  tilt = true,
  tiltMax = 9,
  tiltReach = 260,
  parallax = 6,
  perspective = 1000,
  background = '#27272a',
  color = '#f5f5f5',
  border = true,
  borderColor = '',
  borderWidth = 1,
  stubBackground = '',
  recenter = true,
  disabled = false,
  ariaLabel = 'Tear off the stub',
  className = ''
}) {
  const reduce = useReducedMotion();
  const controlled = controlledTorn !== undefined;
  const [innerTorn, setInnerTorn] = useState(defaultTorn);
  const torn = controlled ? controlledTorn : innerTorn;
  const [dragging, setDragging] = useState(false);
  const [drag, setDrag] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0, drag: 0 });
  const rootRef = useRef(null);
  const vertical = orientation === 'vertical';
  const hingeAxis = vertical ? 'y' : 'x';
  const maxDrag = Math.max(44, stretch * 2.4);
  const tearThreshold = Math.max(72, width * 0.16);
  const axisSize = vertical ? height : width;
  const hinge = axisSize - stubSize;

  const tiltX = useSpring(0, { stiffness: 220, damping: 24, mass: 0.6 });
  const tiltY = useSpring(0, { stiffness: 220, damping: 24, mass: 0.6 });
  const tiltXValue = useTransform(tiltX, v => (reduce || !tilt ? 0 : v));
  const tiltYValue = useTransform(tiltY, v => (reduce || !tilt ? 0 : v));

  useEffect(() => {
    if (!tilt || reduce || dragging || torn) {
      tiltX.set(0);
      tiltY.set(0);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = pointer.x - (rect.left + rect.width / 2);
    const dy = pointer.y - (rect.top + rect.height / 2);
    const reach = Math.max(1, tiltReach);
    tiltY.set(clamp((dx / reach) * tiltMax, -tiltMax, tiltMax));
    tiltX.set(clamp((-dy / reach) * tiltMax, -tiltMax, tiltMax));
  }, [pointer, dragging, torn, tilt, reduce, tiltMax, tiltReach, tiltX, tiltY]);

  const finishTear = useCallback(() => {
    if (disabled || torn) return;
    if (!controlled) setInnerTorn(true);
    onTear?.();
    setDragging(false);
    setDrag(maxDrag);
  }, [controlled, disabled, maxDrag, onTear, torn]);

  const release = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const current = Math.abs(drag);
    if (current >= tearThreshold) finishTear();
    else if (recenter) setDrag(0);
  }, [drag, dragging, finishTear, recenter, tearThreshold]);

  const onPointerDown = e => {
    if (disabled || torn) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY, drag };
    setDragging(true);
  };

  const onPointerMove = e => {
    setPointer({ x: e.clientX, y: e.clientY });
    if (!dragging) return;
    const delta = vertical ? e.clientY - startRef.current.y : e.clientX - startRef.current.x;
    const direction = vertical ? 1 : 1;
    setDrag(clamp(startRef.current.drag + delta * direction, 0, maxDrag));
  };

  const onKeyDown = e => {
    if (disabled || torn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      finishTear();
    }
  };

  const transform = vertical
    ? `translateY(${drag}px) rotate(${Math.min(tearAngle, drag * 0.22)}deg)`
    : `translateX(${drag}px) rotate(${Math.min(tearAngle, drag * 0.08)}deg)`;

  const styleVars = {
    '--tt-width': `${width}px`,
    '--tt-height': `${height}px`,
    '--tt-stub': `${stubSize}px`,
    '--tt-radius': `${radius}px`,
    '--tt-bg': background,
    '--tt-color': color,
    '--tt-border': borderColor || color,
    '--tt-border-width': `${borderWidth}px`,
    '--tt-hole-size': `${holeSize}px`,
    '--tt-holes': holes,
    '--tt-notch': `${notch}px`,
    '--tt-rotate': `${rotate}deg`,
    '--tt-perspective': `${perspective}px`,
    '--tt-image-radius': `${imageRadius}px`,
    '--tt-scrim': scrim ? 1 : 0,
    '--tt-roughness': roughness,
    '--tt-axis': hingeAxis,
  };

  return (
    <div
      ref={rootRef}
      className={`tear-ticket ${vertical ? 'tear-ticket--vertical' : 'tear-ticket--horizontal'} ${torn ? 'is-torn' : ''} ${dragging ? 'is-dragging' : ''} ${className}`}
      style={styleVars}
      onPointerMove={onPointerMove}
      onPointerLeave={() => !dragging && setPointer({ x: 0, y: 0 })}
    >
      <motion.div
        className="tear-ticket__stage"
        style={{ rotateX: tiltXValue, rotateY: tiltYValue }}
      >
        <div className="tear-ticket__body">
          <div className="tear-ticket__art" aria-hidden={image ? undefined : true}>
            {image && <img src={image} alt={imageAlt} />}
            {scrim && <div className="tear-ticket__scrim" />}
          </div>
          <div className="tear-ticket__content">{children}</div>
          <div className="tear-ticket__perforation" aria-hidden="true" />
        </div>

        {!torn && (
          <div
            className="tear-ticket__stub"
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            onPointerDown={onPointerDown}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={onKeyDown}
            style={{
              transform,
              background: stubBackground || background,
              color,
              cursor: disabled ? 'default' : dragging ? 'grabbing' : 'grab',
              touchAction: 'none'
            }}
          >
            <div className="tear-ticket__stub-content">{stub}</div>
            <div className="tear-ticket__stub-perforation" aria-hidden="true" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
