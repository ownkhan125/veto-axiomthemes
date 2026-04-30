'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ensureGsap, isReducedMotion, EASE } from '../../lib/reveal';

// Universal viewport-triggered counter. Parses a value like "12,400+", "$1.2M",
// "4.2 days", "372 answered", "17 of 17", "$0", "87" and animates the leading
// numeric portion from 0 → target when the host element enters the viewport.
// Suffix and trailing literal text are preserved verbatim. Safe with non-numeric
// values (e.g., "Yerington, NV") — those render as-is without animation.

const NUM_RE = /^(\$?)([\d,]+(?:\.\d+)?)([+%kKmMbB]*)(.*)$/;

function parseValue(raw) {
  const str = String(raw);
  const m = str.match(NUM_RE);
  if (!m) return null;
  const [, prefix = '', numStr, badge = '', rest = ''] = m;
  const target = Number(numStr.replace(/,/g, ''));
  if (isNaN(target)) return null;
  const decimals = (numStr.split('.')[1] || '').length;
  const useGrouping = numStr.includes(',');
  return { prefix, target, badge, rest, decimals, useGrouping };
}

function format({ prefix, value, badge, rest, decimals, useGrouping }) {
  let body;
  if (decimals > 0) {
    body = value.toFixed(decimals);
  } else if (useGrouping) {
    body = Math.round(value).toLocaleString();
  } else {
    body = String(Math.round(value));
  }
  return `${prefix}${body}${badge}${rest}`;
}

export default function Counter({
  value,
  duration = 1.6,
  start = 'top 88%',
  className,
  ...rest
}) {
  const ref = useRef(null);
  const parsed = parseValue(value);
  const [display, setDisplay] = useState(() => {
    if (!parsed) return String(value);
    return format({ ...parsed, value: 0 });
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const p = parseValue(value);
    if (!p) {
      setDisplay(String(value));
      return;
    }
    if (isReducedMotion()) {
      setDisplay(format({ ...p, value: p.target }));
      return;
    }
    ensureGsap();

    const obj = { v: 0 };
    setDisplay(format({ ...p, value: 0 }));

    const tween = gsap.to(obj, {
      v: p.target,
      duration,
      ease: EASE.fluent,
      onUpdate: () => setDisplay(format({ ...p, value: obj.v })),
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, duration, start]);

  // If the value isn't numeric, render plain — no animation.
  if (!parsed) {
    return (
      <span ref={ref} className={className} {...rest}>
        {String(value)}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} {...rest}>
      {display}
    </span>
  );
}
