'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReduced || !hasHover) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const down = () => cursor.classList.add('is-down');
    const up = () => cursor.classList.remove('is-down');

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);

    // Use delegated hover detection — robust to async-rendered components
    const onOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const media = target.closest('[data-cursor="media"]');
      const text = target.closest('input, textarea');
      const hover = target.closest(
        'a, button, .chip, .priorities__row, .endorse__cell, [data-cursor="link"], [data-cursor="hover"]'
      );

      cursor.classList.remove('is-hover', 'is-media', 'is-text');
      if (media) {
        cursor.setAttribute('data-label', media.getAttribute('data-label') || 'View');
        cursor.classList.add('is-media');
      } else if (text) {
        cursor.classList.add('is-text');
      } else if (hover) {
        cursor.classList.add('is-hover');
      }
    };
    const onOut = (e) => {
      if (!e.relatedTarget) {
        cursor.classList.remove('is-hover', 'is-media', 'is-text');
      }
    };
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);

    // Clear hover states on scroll (pointerenter/leave don't fire on scroll)
    const clearHover = () => cursor.classList.remove('is-hover', 'is-media', 'is-text');
    const getLenis = () => (typeof window !== 'undefined' ? window.__lenis : null);
    let lenis = getLenis();
    let tries = 0;
    const interval = setInterval(() => {
      lenis = getLenis();
      if (lenis) {
        lenis.on('scroll', clearHover);
        clearInterval(interval);
      }
      if (++tries > 40) clearInterval(interval);
    }, 100);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      if (lenis) lenis.off('scroll', clearHover);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <div className="cursor__ring"></div>
      <div className="cursor__dot"></div>
    </div>
  );
}
