'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Renders the original HTML creative inside an iframe at native resolution
// (1080×1080 or 1080×1920) and CSS-transforms it down to whatever container it
// sits in. The creative itself is never resized, cropped, padded, or wrapped —
// it always renders at the size it was designed for, then the whole iframe is
// uniformly scaled so the design fills the container with the correct aspect
// ratio. Body shim CSS in each public copy strips standalone-viewing chrome
// (dark mat, padding) without altering the .stage that holds the design.

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PostFrame({ post, eager = false, sizing = 'contain' }) {
  const hostRef = useRef(null);
  const [scale, setScale] = useState(0);

  useIsoLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const compute = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      const sw = w / post.width;
      const sh = h / post.height;
      // 'contain' = scale so the full creative fits inside the box (never crops);
      // since the box matches the creative's aspect ratio, sw === sh in practice,
      // but contain protects against sub-pixel rounding causing one-side clipping.
      setScale(sizing === 'cover' ? Math.max(sw, sh) : Math.min(sw, sh));
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(host);
    return () => ro.disconnect();
  }, [post.width, post.height, sizing]);

  return (
    <div ref={hostRef} className="postframe">
      <iframe
        title={post.title}
        src={post.file}
        className="postframe__frame"
        loading={eager ? 'eager' : 'lazy'}
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          width: post.width,
          height: post.height,
          transform: `scale(${scale || 0.0001})`,
          opacity: scale ? 1 : 0,
        }}
      />
    </div>
  );
}
