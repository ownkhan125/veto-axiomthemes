'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ensureGsap, isReducedMotion, EASE } from '../../lib/reveal';
import Counter from './Counter';

// Premium internal-page hero. Mirrors the homepage hero's static grid mesh +
// snake-traveling lights so every inner page feels native to the same system.
// Heading splits per-character, a thin underline draws across the eyebrow,
// caption fades word-by-word, and a hairline divider closes the hero into the
// page below. Keeps the same colour language (black surface, white type,
// accent dot) without any heavyweight imagery.

const GRID_H_COUNT  = 12;
const GRID_V_COUNT  = 26;
const PULSE_STAGGER = 0.22;
const PULSE_CYCLE   = (GRID_H_COUNT + GRID_V_COUNT) * PULSE_STAGGER;

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

export default function PageHero({
  eyebrow,
  title,
  highlight,
  caption,
  meta,
}) {
  const headingRef = useRef(null);
  const captionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const ruleRef    = useRef(null);
  const metaRef    = useRef(null);

  useEffect(() => {
    const heading = headingRef.current;
    const caption = captionRef.current;
    const eyebrow = eyebrowRef.current;
    const rule    = ruleRef.current;
    const meta    = metaRef.current;
    if (!heading) return;

    if (isReducedMotion()) return;
    ensureGsap();

    const chars = heading.querySelectorAll('.page-hero__char');
    const captionWords = caption ? caption.querySelectorAll('.page-hero__cw') : [];
    const metaItems = meta ? meta.querySelectorAll('.page-hero__meta-item') : [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      if (eyebrow) {
        tl.fromTo(eyebrow,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: EASE.fluent },
          0
        );
      }
      if (chars.length) {
        gsap.set(chars, { yPercent: 110, opacity: 0 });
        tl.to(chars, {
          yPercent: 0, opacity: 1,
          duration: 1.0, ease: 'expo.out',
          stagger: 0.018,
        }, 0.18);
      }
      if (captionWords.length) {
        gsap.set(captionWords, { y: 12, opacity: 0 });
        tl.to(captionWords, {
          y: 0, opacity: 1,
          duration: 0.5, stagger: 0.04, ease: 'power2.out',
        }, 0.55);
      }
      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
        tl.to(rule, { scaleX: 1, duration: 1.0, ease: EASE.fluent }, 0.6);
      }
      if (metaItems.length) {
        gsap.set(metaItems, { opacity: 0, y: 14 });
        tl.to(metaItems, {
          opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: EASE.fluent,
        }, 0.75);
      }
    }, heading);

    return () => ctx.revert();
  }, []);

  // Per-character spans with whitespace preserved (each word is a non-breaking unit).
  const renderTitle = () => {
    if (!title) return null;
    const tokens = title.split(/(\s+)/);
    return tokens.map((tok, ti) => {
      if (/^\s+$/.test(tok)) return <span key={`s-${ti}`}>{' '}</span>;
      const isHl = highlight && tok.replace(/[^a-z]/gi, '').toLowerCase() === highlight.toLowerCase();
      return (
        <span
          key={`w-${ti}`}
          className={`page-hero__word${isHl ? ' page-hero__word--hl' : ''}`}
        >
          {Array.from(tok).map((ch, ci) => (
            <span key={ci} className="page-hero__char-mask">
              <span className="page-hero__char">{ch}</span>
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <header className="page-hero">
      <div className="page-hero__grid" aria-hidden="true">
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

      <div className="page-hero__layout">
        {eyebrow && (
          <div className="page-hero__eyebrow" ref={eyebrowRef}>
            <span className="page-hero__eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
        )}

        <h1 className="page-hero__title" ref={headingRef} aria-label={title}>
          {renderTitle()}
        </h1>

        {(caption || meta) && (
          <div className="page-hero__foot">
            {caption && (
              <p className="page-hero__caption" ref={captionRef}>
                {caption.split(' ').map((w, i, arr) => (
                  <span key={i}>
                    <span className="page-hero__cw">{w}</span>
                    {i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
            )}

            {meta && Array.isArray(meta) && meta.length > 0 && (
              <ul className="page-hero__meta" ref={metaRef}>
                {meta.map((m, i) => (
                  <li key={i} className="page-hero__meta-item">
                    <span className="page-hero__meta-label">{m.label}</span>
                    <Counter
                      value={m.value}
                      className="page-hero__meta-value"
                      duration={1.8}
                      start="top 95%"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <span className="page-hero__rule" ref={ruleRef} aria-hidden="true" />
    </header>
  );
}
