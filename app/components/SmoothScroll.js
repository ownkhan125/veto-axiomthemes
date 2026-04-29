'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const rafTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafTick);
    gsap.ticker.lagSmoothing(0);

    if (typeof window !== 'undefined') window.__lenis = lenis;

    // Anchor links go through Lenis
    const anchorHandler = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    };
    document.addEventListener('click', anchorHandler);

    // Trigger one ScrollTrigger.refresh after fonts load so pins pick up final layout
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 400);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1200);

    return () => {
      document.removeEventListener('click', anchorHandler);
      gsap.ticker.remove(rafTick);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
}
