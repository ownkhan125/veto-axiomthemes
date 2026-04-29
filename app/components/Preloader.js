'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';

export default function Preloader() {
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(2, '0'));
  const widthPct = useTransform(count, (v) => `${v}%`);
  const timers = useRef([]);

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: 1.4,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.4,
    });

    // Exit after count reaches 100 — total ~2.4 s
    const t = setTimeout(() => setDone(true), 2400);
    timers.current.push(t);

    // Release scroll lock a beat after exit begins
    const release = setTimeout(() => {
      document.body.classList.remove('is-loading');
    }, 3000);
    timers.current.push(release);

    return () => {
      controls.stop();
      timers.current.forEach(clearTimeout);
    };
  }, [count]);

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      animate={done ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (done && typeof document !== 'undefined') {
          const el = document.querySelector('.preloader');
          if (el) el.style.display = 'none';
        }
      }}
      aria-hidden="true"
    >
      <motion.div
        className="preloader__mark"
        initial={{ y: '110%' }}
        animate={done ? { y: '-110%' } : { y: '0%' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        veto®
      </motion.div>
      <motion.div className="preloader__counter">
        <motion.span>{rounded}</motion.span>
      </motion.div>
      <div className="preloader__bar">
        <motion.i style={{ width: widthPct }} />
      </div>
    </motion.div>
  );
}
