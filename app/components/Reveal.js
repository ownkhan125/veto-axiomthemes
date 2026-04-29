'use client';

import { useEffect } from 'react';

// Adds .is-revealed when elements with [data-reveal] cross the viewport.
// A single global observer keeps this cheap and race-free.
export default function Reveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('[data-reveal]');
    if (prefersReduced) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const d = entry.target.getAttribute('data-reveal-delay');
            if (d) entry.target.style.transitionDelay = `${parseFloat(d)}s`;
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    // Observe both initial and any future [data-reveal] (e.g. if a section
    // mounts asynchronously). Re-observe after microtask in case of hydration.
    const observeAll = () => {
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => io.observe(el));
    };
    observeAll();
    const t = setTimeout(observeAll, 200);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return null;
}
