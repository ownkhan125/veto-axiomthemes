'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

const CELLS = [
  { target: 36,     suffix: '',  label: 'Counties visited' },
  { target: 1280,   suffix: '+', label: 'Volunteers on the ground' },
  { target: 42,     suffix: 'k', label: 'Small-dollar donors' },
  { target: 0,      suffix: '',  label: 'Corporate PAC dollars', override: '$0' },
];

const Counter = forwardRef(function Counter({ cell, i }, ref) {
  const elRef = useRef(null);
  const [display, setDisplay] = useState(cell.override ? cell.override : '0');
  const [stamped, setStamped] = useState(!!cell.override);

  useImperativeHandle(ref, () => ({
    startCount() {
      if (cell.override) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: cell.target,
        duration: 1.6,
        ease: EASE.fluent,
        onUpdate: () => setDisplay(String(Math.round(obj.v))),
        onComplete: () => setStamped(true),
      });
    },
    finishImmediately() {
      if (cell.override) return;
      setDisplay(String(cell.target));
      setStamped(true);
    },
  }), [cell]);

  return (
    <div className="metrics__cell" ref={elRef} data-metrics-cell data-metrics-i={i}>
      <span className="metrics__cell-rule" aria-hidden="true" data-metrics-rule />
      <strong>
        {cell.override ? (
          <span data-metrics-value>{display}</span>
        ) : (
          <>
            <span data-metrics-value>{display}</span>
            <sup data-metrics-suffix data-stamp={stamped ? '1' : '0'}>
              {cell.suffix}
            </sup>
          </>
        )}
      </strong>
      <span data-metrics-label>{cell.label}</span>
    </div>
  );
});

export default function Metrics() {
  const sectionRef = useRef(null);
  const counterRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (isReducedMotion()) {
      counterRefs.current.forEach((c) => c?.finishImmediately());
      return;
    }

    ensureGsap();

    const ctx = gsap.context(() => {
      const cells  = section.querySelectorAll('[data-metrics-cell]');
      const values = section.querySelectorAll('[data-metrics-value]');
      const labels = section.querySelectorAll('[data-metrics-label]');
      const rules  = section.querySelectorAll('[data-metrics-rule]');

      // Pre-arm: hide every animated layer before the section enters view.
      // No per-card scale variance — all cards rise from the same offset and
      // settle at exactly the same size, so the grid stays perfectly even.
      gsap.set(cells, {
        opacity: 0,
        y: 32,
        willChange: 'transform, opacity',
      });
      gsap.set(values, { opacity: 0, y: 14 });
      gsap.set(labels, { opacity: 0, y: 10 });
      gsap.set(rules,  { scaleX: 0 });

      const STEP = 0.08; // tighter, uniform cell-to-cell stagger

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Cards rise + fade in unison. Power ease keeps the motion premium
      //    without overshoot — equal weight across all four cards.
      tl.to(cells, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: STEP,
        clearProps: 'willChange',
      }, 0);

      // 2. Numeric values fade up just behind their card, then start counting.
      tl.to(values, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: EASE.soft,
        stagger: STEP,
      }, 0.2);

      counterRefs.current.forEach((c, idx) => {
        if (!c?.startCount) return;
        tl.call(() => c.startCount(), [], 0.28 + idx * STEP);
      });

      // 3. Hairline rule draws across each cell after the number lands.
      tl.to(rules, {
        scaleX: 1,
        duration: 0.8,
        ease: EASE.fluent,
        stagger: STEP,
        transformOrigin: 'left center',
      }, 0.4);

      // 4. Labels arrive last — content assembled, not dropped in all at once.
      tl.to(labels, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: EASE.soft,
        stagger: STEP,
      }, 0.55);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="metrics" aria-label="Campaign metrics" ref={sectionRef}>
      {CELLS.map((c, i) => (
        <Counter
          key={c.label}
          cell={c}
          i={i}
          ref={(el) => { counterRefs.current[i] = el; }}
        />
      ))}
    </section>
  );
}
