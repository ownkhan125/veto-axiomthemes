'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Hero — modeled on the editorial "DESIGN / EDGE / CREATIVE / AGENCY" layout:
// massive left-aligned block typography across four lines, a small dark
// thumbnail integrated inline with the third line, a tiny body caption at
// upper-right, and a faint vertical dotted grid as background depth. Entry
// is a staggered cinematic build driven by a single GSAP timeline.

const HEADING_LINES = ['THE', 'ISSUES', 'DRIVING', 'THIS CAMPAIGN.'];
const CAPTION_TEXT  = 'An independent senate campaign rooted in listening, learning, and answering to working families.';
// Highlight a single word in the caption — mirrors the "award" highlight in the reference.
const CAPTION_HIGHLIGHT = 'independent';

// Per-line snake grid — each horizontal/vertical line hosts a small bright
// segment that travels its length once per cycle, staggered so streams of
// energy crawl through the mesh one after another.
const GRID_H_COUNT  = 18; // covers ~1152px height (cell × 18)
const GRID_V_COUNT  = 32; // covers ~2048px width  (cell × 32)
const PULSE_STAGGER = 0.22; // seconds between each line's snake start
const PULSE_CYCLE   = (GRID_H_COUNT + GRID_V_COUNT) * PULSE_STAGGER; // 11s loop
// Note: each line's snake-travel window is ~14% of PULSE_CYCLE, hardcoded
// in the gridSnakeH/gridSnakeV @keyframes in globals.css. Keep them in
// sync if changing the constants above.

// Deterministic shuffle — keeps SSR/CSR markup identical while interleaving
// horizontal & vertical lines into an organic, non-rastered chain order.
function shuffleSeeded(arr, seed = 0xC0FFEE) {
  const out = arr.slice();
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const GRID_LINES = shuffleSeeded([
  ...Array.from({ length: GRID_H_COUNT }, (_, i) => ({ o: 'h', i })),
  ...Array.from({ length: GRID_V_COUNT }, (_, i) => ({ o: 'v', i })),
]);

export default function Hero() {
  const linesRef    = useRef([]);
  const ornamentRef = useRef(null);
  const thumbRef    = useRef(null);
  const captionRef  = useRef(null);

  useEffect(() => {
    const lines    = linesRef.current.filter(Boolean).map((el) => el.querySelector('.hero__line-inner'));
    const ornament = ornamentRef.current;
    const thumb    = thumbRef.current;
    const caption  = captionRef.current;
    const captionWords = caption ? Array.from(caption.querySelectorAll('.hero__caption-word')) : [];

    if (lines.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set([...lines, ornament, thumb, ...captionWords], { y: 0, opacity: 1 });
      return;
    }

    // Phase 0 — pre-build state
    gsap.set(lines,        { yPercent: 110, opacity: 1, force3D: true });
    gsap.set(ornament,     { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
    gsap.set(thumb,        { scaleX: 0, opacity: 0, transformOrigin: '0% 50%' });
    gsap.set(captionWords, { y: 12, opacity: 0 });

    const isLoading = document.body.classList.contains('is-loading');
    const startDelay = isLoading ? 2.7 : 0.2;

    // Absolute timeline positions (s) — predictable ordering even with overlap.
    const T_LINES    = 0.20; // first heading line
    const T_ORNAMENT = 0.80; // accent curve after ISSUES
    const T_THUMB    = 1.00; // small thumbnail before DRIVING
    const T_CAPTION  = 1.10; // body copy on the right

    const tl = gsap.timeline({ delay: startDelay });

    // Phase B — heading lines slide up out of their masks, staggered
    tl.to(lines, {
      yPercent: 0,
      duration: 1.05,
      stagger: 0.11,
      ease: 'expo.out',
    }, T_LINES);

    // Phase C — ornament after ISSUES pops in with a small overshoot
    if (ornament) {
      tl.to(ornament, {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'back.out(2)',
      }, T_ORNAMENT);
    }

    // Phase D — thumbnail expands horizontally into place
    if (thumb) {
      tl.to(thumb, {
        scaleX: 1,
        opacity: 1,
        duration: 0.85,
        ease: 'expo.out',
      }, T_THUMB);
    }

    // Phase E — caption words fade in word-by-word
    if (captionWords.length) {
      tl.to(captionWords, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.05,
        ease: 'power2.out',
      }, T_CAPTION);
    }

    return () => { tl.kill(); };
  }, []);

  // Caption text → word spans for the staggered fade-in.
  const captionWords = CAPTION_TEXT.split(' ').map((w, i) => {
    const isHighlight = w.replace(/[^a-z]/gi, '').toLowerCase() === CAPTION_HIGHLIGHT;
    return (
      <span
        key={i}
        className={`hero__caption-word${isHighlight ? ' hero__caption-word--mark' : ''}`}
      >
        {w}
      </span>
    );
  });

  return (
    <header className="hero">
      <div className="grid-overlay" aria-hidden="true">
        {GRID_LINES.map((line, order) => (
          <span
            key={`${line.o}-${line.i}`}
            className={`grid-overlay__line grid-overlay__line--${line.o}`}
            style={{
              '--idx':   line.i,
              '--delay': `${order * PULSE_STAGGER}s`,
              '--cycle': `${PULSE_CYCLE}s`,
            }}
          />
        ))}
      </div>

      <div className="hero__layout">
        <h1 className="hero__h1" aria-label={HEADING_LINES.join(' ')}>
          {HEADING_LINES.map((line, i) => {
            const isOrnamentLine = i === 1; // after ISSUES
            const isThumbLine    = i === 2; // before DRIVING
            return (
              <span
                key={i}
                ref={(el) => { linesRef.current[i] = el; }}
                className={`hero__line${isOrnamentLine ? ' hero__line--orn' : ''}${isThumbLine ? ' hero__line--thumb' : ''}`}
              >
                {isThumbLine && (
                  <span ref={thumbRef} className="hero__thumb" aria-hidden="true">
                    <video
                      src="/asset/images/hero-video.webm"
                      autoPlay muted loop playsInline preload="metadata"
                      className="hero__thumb-media"
                    />
                  </span>
                )}
                <span className="hero__line-inner">{line}</span>
                {isOrnamentLine && (
                  <span ref={ornamentRef} className="hero__ornament" aria-hidden="true">
                    <svg viewBox="0 0 64 96" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 16 L50 48 L18 80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </span>
            );
          })}
        </h1>

        <aside className="hero__caption" ref={captionRef}>
          {captionWords.reduce((acc, node, idx) => {
            if (idx > 0) acc.push(<span key={`s-${idx}`}> </span>);
            acc.push(node);
            return acc;
          }, [])}
        </aside>
      </div>
    </header>
  );
}
