'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function IssueCard({ event, index }) {
  const ref = useRef(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, { stiffness: 150, damping: 22, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 150, damping: 22, mass: 0.5 });

  const rotateY = useTransform(sx, [-1, 1], [-3.5, 3.5]);
  const rotateX = useTransform(sy, [-1, 1], [2.5, -2.5]);
  const lightX = useTransform(sx, [-1, 1], ['20%', '80%']);
  const lightY = useTransform(sy, [-1, 1], ['15%', '85%']);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    px.set(nx);
    py.set(ny);
  };

  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const [eventMonth, eventDay] = (event.date || '').split(' ');

  return (
    <motion.article
      className="card"
      ref={ref}
      data-cursor="media"
      data-label={event.cta}
      style={{
        '--bg': '#111',
        transformStyle: 'preserve-3d',
        perspective: '1400px',
        transformOrigin: '50% 50%',
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={{ y: -8, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 200, damping: 28, mass: 0.6 }}
    >
      <motion.div
        className="card__inner"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
        }}
      >
        <div className="card__bg">
          <img
            className="card__image"
            src={event.image}
            alt=""
            loading="lazy"
            draggable={false}
          />
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: useTransform(
                [lightX, lightY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 45%)`
              ),
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div className="card__date" aria-label={event.date}>
          <span className="card__date-day">{eventDay}</span>
          <span className="card__date-month">{eventMonth}</span>
        </div>

        <Link href="/events" className="card__cta">
          {event.cta} →
        </Link>

        <div className="card__meta">
          <div className="card__meta-top">
            <span className="chip">{event.tag}</span>
          </div>
          <h3 className="card__title">{event.title}</h3>
          <div className="card__keys">
            <span>{event.location}</span>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
