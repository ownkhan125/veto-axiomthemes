'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

const CELLS = [
  { name: 'NV Fire Fighters Assn.', tag: 'Labor' },
  { name: 'Nevada State AFL-CIO',   tag: 'Labor' },
  { name: 'Reno Gazette Editorial', tag: 'Press' },
  { name: 'Sierra Sun-Tribune',     tag: 'Press' },
  { name: 'Senator Maria Chen',     tag: 'Elected' },
  { name: 'Gov. James Whitfield',   tag: 'Elected' },
  { name: 'Battle Born PAC',        tag: 'Civic' },
  { name: 'Nevada Veterans Alliance', tag: 'Civic' },
];

export default function Endorsements() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduced || !fine) return;

    let mx = 0, my = 0;
    let sx = 0, sy = 0;
    let active = false;
    let rafId = null;
    let sectionRect = null;

    const refreshRect = () => { sectionRect = section.getBoundingClientRect(); };

    const writeSpot = () => {
      section.style.setProperty('--sx', `${sx}px`);
      section.style.setProperty('--sy', `${sy}px`);
    };

    const tick = () => {
      const dx = mx - sx;
      const dy = my - sy;
      // Critically-damped feel: slow enough to glide, fast enough to track.
      sx += dx * 0.14;
      sy += dy * 0.14;
      writeSpot();
      if (active || Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const onEnter = (e) => {
      refreshRect();
      mx = e.clientX - sectionRect.left;
      my = e.clientY - sectionRect.top;
      // Snap on first entry so the spotlight materialises at the cursor —
      // CSS opacity transition handles the fade-in, no sweep across the section.
      sx = mx; sy = my;
      writeSpot();
      section.classList.add('is-spotlight');
      active = true;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      if (!sectionRect) refreshRect();
      mx = e.clientX - sectionRect.left;
      my = e.clientY - sectionRect.top;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      section.classList.remove('is-spotlight');
      active = false;
    };

    const onResize = () => { if (active) refreshRect(); };
    const getLenis = () => (typeof window !== 'undefined' ? window.__lenis : null);
    let lenis = getLenis();
    let lenisTries = 0;
    const lenisInterval = setInterval(() => {
      if (lenis) { clearInterval(lenisInterval); return; }
      const l = getLenis();
      if (l) {
        lenis = l;
        lenis.on('scroll', onResize);
        clearInterval(lenisInterval);
      }
      if (++lenisTries > 40) clearInterval(lenisInterval);
    }, 100);

    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });

    return () => {
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      if (lenis) lenis.off('scroll', onResize);
      clearInterval(lenisInterval);
      if (rafId) cancelAnimationFrame(rafId);
      section.classList.remove('is-spotlight');
    };
  }, []);

  // Section progressive build: head fades up → cells stagger in by tag-group,
  // each card with a draw-in bottom rule.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const headBits = section.querySelectorAll('.endorse__head [data-reveal]');
      const cells = Array.from(section.querySelectorAll('.endorse__cell'));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        headBits,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: DUR.short, stagger: 0.1, ease: EASE.fluent },
        0
      );

      // Group cells by their data-group attribute (set in JSX) so labor →
      // press → elected → civic roll in as four micro-waves.
      const groups = ['Labor', 'Press', 'Elected', 'Civic'];
      groups.forEach((g, idx) => {
        const groupCells = cells.filter((c) => c.dataset.group === g);
        if (!groupCells.length) return;
        tl.fromTo(
          groupCells,
          { opacity: 0, y: 22, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: DUR.short, stagger: 0.07, ease: EASE.fluent },
          0.25 + idx * 0.18
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="events" className="endorse" ref={sectionRef}>
      <div className="endorse__head">
        <div>
          <div className="eyebrow" data-reveal style={{ marginBottom: 28 }}>Endorsements</div>
          <h2 className="h1" data-reveal>Backed by Nevadans who do the work.</h2>
        </div>
        <p className="lede" data-reveal>
          A partial list — updated weekly as more labor councils, editorial boards, and elected officials weigh in.
          No corporate PAC money accepted, and we publish every donor over $200.
        </p>
      </div>

      <div className="endorse__grid" role="list">
        {CELLS.map((c) => (
          <div
            className="endorse__cell"
            role="listitem"
            key={c.name}
            data-group={c.tag}
            data-cursor="hover"
          >
            <span>
              {c.name}
              <small>{c.tag}</small>
            </span>
          </div>
        ))}
      </div>

      {/* Spotlight: a single overlay above the cells that gently dims the
          periphery and lays a whisper of warm light at the cursor. No
          mix-blend tinting of the whole section, no breathing/pulsing. */}
      <div className="endorse__spotlight" aria-hidden="true">
        <div className="endorse__spotlight-dim"></div>
        <div className="endorse__spotlight-lift"></div>
      </div>
    </section>
  );
}
