'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureGsap, isReducedMotion, EASE } from '../../lib/reveal';

// Animated section separator. A hairline rule whose center hosts a small
// bright traveling segment that moves L→R when the divider enters the
// viewport — mirrors the homepage's grid-overlay snake and gives every
// inner page the same "border light traveling between sections" cue the
// brief asks for. Optional label sits centered with two flanking rules.

export default function SectionDivider({ label, tone = 'light', align = 'center' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const rules = el.querySelectorAll('[data-divider-rule]');
      const labelEl = el.querySelector('[data-divider-label]');
      const beam = el.querySelector('[data-divider-beam]');

      gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });
      if (labelEl) gsap.set(labelEl, { opacity: 0, y: 8 });
      if (beam) gsap.set(beam, { xPercent: -100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });

      tl.to(rules, { scaleX: 1, duration: 1.0, ease: EASE.fluent, stagger: 0.10 }, 0);
      if (labelEl) tl.to(labelEl, { opacity: 1, y: 0, duration: 0.55, ease: EASE.fluent }, 0.18);
      if (beam) {
        tl.to(beam, {
          xPercent: 100,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.inOut',
        }, 0.05);
        tl.to(beam, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 1.4);
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`section-div section-div--${tone} section-div--${align}`}
      ref={ref}
      aria-hidden="true"
    >
      <span className="section-div__rail" data-divider-rule />
      {label && (
        <>
          <span className="section-div__label" data-divider-label>{label}</span>
          <span className="section-div__rail" data-divider-rule />
        </>
      )}
      <span className="section-div__beam" data-divider-beam />
    </div>
  );
}
