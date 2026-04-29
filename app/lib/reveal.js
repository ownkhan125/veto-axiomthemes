'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Shared easing tokens used across every section's entry motion. Mirrors the
// CSS custom properties so JS-driven and CSS-driven motion read identically.
export const EASE = {
  fluent: 'cubic-bezier(0.16, 1, 0.3, 1)',  // signature campaign curve
  soft:   'power2.out',                      // gentle fade-ups
  snap:   'power3.out',                      // fast lifts
  inOut:  'cubic-bezier(0.65, 0, 0.35, 1)',  // symmetrical loops
};

export const DUR = {
  micro: 0.4,
  short: 0.7,
  med:   1.0,
  long:  1.3,
};

export function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Wrap whitespace-tokens of `root` text descendants in <span class="word">.
// Idempotent. Preserves inline tags (em, strong, etc).
export function splitWords(root) {
  if (!root) return [];
  if (root.querySelector('.word')) {
    return Array.from(root.querySelectorAll('.word'));
  }
  const textNodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) textNodes.push(n);
  const out = [];
  textNodes.forEach((node) => {
    const t = node.nodeValue;
    if (!t || !/\S/.test(t)) return;
    const frag = document.createDocumentFragment();
    t.split(/(\s+)/).forEach((chunk) => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        frag.appendChild(document.createTextNode(chunk));
      } else {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = chunk;
        frag.appendChild(span);
        out.push(span);
      }
    });
    node.parentNode.replaceChild(frag, node);
  });
  return out;
}

// Stagger fade-up. Returns the tween for caller-side cleanup.
export function staggerIn(targets, opts = {}) {
  const {
    trigger,
    start = 'top 85%',
    y = 28,
    duration = DUR.short,
    stagger = 0.08,
    ease = EASE.soft,
    delay = 0,
    once = true,
  } = opts;
  if (!targets || (targets.length === 0 && !targets.length)) return null;
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      delay,
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
          }
        : undefined,
    }
  );
}

// Draw an SVG-style progressive border on `el` using a clip-path that grows
// from 0 → 100% perimeter. Cheaper than animating multiple borders.
export function drawBorder(el, opts = {}) {
  const { trigger, start = 'top 85%', duration = DUR.med, ease = EASE.fluent, delay = 0 } = opts;
  if (!el) return null;
  return gsap.fromTo(
    el,
    {
      clipPath: 'inset(0 100% 0 0)',
      WebkitClipPath: 'inset(0 100% 0 0)',
    },
    {
      clipPath: 'inset(0 0% 0 0)',
      WebkitClipPath: 'inset(0 0% 0 0)',
      duration,
      ease,
      delay,
      scrollTrigger: trigger ? { trigger, start, toggleActions: 'play none none none' } : undefined,
    }
  );
}

// Number tween — counts from current value to target, calling `onUpdate` with
// the current rounded integer. The caller renders the value.
export function tweenNumber(from, to, onUpdate, opts = {}) {
  const { duration = 1.6, ease = EASE.soft, delay = 0 } = opts;
  const obj = { v: from };
  return gsap.to(obj, {
    v: to,
    duration,
    ease,
    delay,
    onUpdate: () => onUpdate(Math.round(obj.v)),
  });
}

// Ensure GSAP plugins are registered exactly once.
let registered = false;
export function ensureGsap() {
  if (registered) return;
  if (typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}
