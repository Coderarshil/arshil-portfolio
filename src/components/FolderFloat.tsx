import React, { useState } from 'react';
import { motion } from 'motion/react';

const FOLDER = '#ffffff';
const FRONT = '#d4956a';
const PAPER = '#f5f5f5';
const ITEM = '#fcf3cc';
const ITEM_TEXT = '#18181b';
const LABEL = '#f5f5f5';

const skills = [
  { text: 'Creative', x: -78, y: -101, r: -8 },
  { text: 'Design', x: 0, y: -125, r: 3 },
  { text: 'Experimental', x: 82, y: -101, r: 7 },
  { text: 'Communication', x: -83, y: -41, r: -7 },
  { text: 'Extrovert', x: 12, y: -66, r: 2 },
  { text: 'Adaptive', x: 97, y: -41, r: -5 },
  { text: 'Fast learner', x: -83, y: 14, r: 7 },
  { text: 'Team worker', x: 15, y: -6, r: 4 },
  { text: 'Problem solver', x: 92, y: 34, r: -4 },
  { text: 'Curious', x: 97, y: 65, r: 8 },
] as const;

export function FolderFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="folder-float" aria-label="Skills folder">
      <div className="folder-float-stage">
        <div className="folder-float-items" aria-hidden={!open}>
          {skills.map((skill, i) => (
            <motion.div
              key={skill.text}
              className="folder-float-pill"
              initial={false}
              animate={open
                ? { x: skill.x, y: skill.y, rotate: skill.r, opacity: 1, scale: 1 }
                : { x: 0, y: 12, rotate: 0, opacity: 0, scale: 0.72 }}
              transition={{
                type: 'spring',
                stiffness: 430,
                damping: 24,
                mass: 0.75,
                bounce: 0.3,
                delay: open ? i * 0.045 : (skills.length - i) * 0.018,
              }}
              style={{ zIndex: 10 + i }}
            >
              {skill.text}
            </motion.div>
          ))}
        </div>

        <motion.button
          type="button"
          className={`folder-float-button${open ? ' is-open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close skills folder' : 'Open skills folder'}
          whileTap={{ scale: 0.985 }}
        >
          <span className="folder-float-back" />
          <motion.span
            className="folder-float-paper"
            animate={open
              ? { y: -34, rotate: -8, scale: 1.02 }
              : { y: 0, rotate: 0, scale: 1 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="folder-float-flap"
            animate={open
              ? { rotateX: 36, y: -2 }
              : { rotateX: 0, y: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="folder-float-front"
            animate={open
              ? { y: 34, rotate: -8 }
              : { y: 0, rotate: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="folder-float-label">Skills??</span>
            <span className="folder-float-sublabel">Just a student</span>
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
