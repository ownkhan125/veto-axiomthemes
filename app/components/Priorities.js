'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PRIORITIES = [
  { name: 'Healthcare',      tag: 'Insurance · Access · Cost',      image: 'https://picsum.photos/700/500?random=1' },
  { name: 'Economy & Jobs',  tag: 'Wages · Small business · Trades', image: 'https://picsum.photos/700/500?random=2' },
  { name: 'Housing',         tag: 'Supply · Protections · Ownership', image: 'https://picsum.photos/700/500?random=3' },
  { name: 'Education',       tag: 'K–12 · Higher ed · Career tech',  image: 'https://picsum.photos/700/500?random=4' },
  { name: 'Climate & Water', tag: 'Colorado River · Grid · Land',    image: 'https://picsum.photos/700/500?random=5' },
  { name: 'Democracy',       tag: 'Voting rights · Ethics · Courts', image: 'https://picsum.photos/700/500?random=6' },
];

export default function Priorities() {
  const sectionRef = useRef(null);
  const floaterRef = useRef(null);
  const floaterInnerRef = useRef(null);
  // One persistent <img> per priority. Avoids the dual-img + src-swap design
  // whose fromTo({opacity:0}) on rapid hover would slam a still-visible image
  // down to 0, causing the "floater moves but image disappears" bug.
  const imgsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    const rows = Array.from(section.querySelectorAll('.priorities__row'));

    // ---------- Scroll entrance ----------
    let entranceTween = null;
    if (rows.length) {
      if (reduced) {
        gsap.set(rows, { opacity: 1, y: 0 });
      } else {
        try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* already registered */ }
        gsap.set(rows, { opacity: 0, y: 30 });
        entranceTween = gsap.to(rows, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }
    }

    // ---------- Tablet/mobile: tap-to-reveal ----------
    const tapHandlers = [];
    if (!isDesktop) {
      const onRowTap = (e) => {
        const row = e.currentTarget;
        rows.forEach((r) => { if (r !== row) r.classList.remove('is-active'); });
        row.classList.toggle('is-active');
      };
      rows.forEach((r) => {
        r.addEventListener('click', onRowTap);
        tapHandlers.push([r, onRowTap]);
      });
    }

    // ---------- Cursor-following floater (desktop + fine pointer only) ----------
    let cleanupFloater = () => {};
    const floater = floaterRef.current;
    const floaterInner = floaterInnerRef.current;
    const imgs = imgsRef.current.filter(Boolean);

    if (hasFinePointer && isDesktop && !reduced && floater && floaterInner && imgs.length === rows.length) {
      gsap.set(floater, {
        opacity: 0,
        scale: 0.85,
        rotation: 0,
        x: 0, y: 0,
        xPercent: -50, yPercent: -50,
      });
      gsap.set(floaterInner, { rotation: 0 });
      // All imgs start hidden; the active row's img will be faded in.
      gsap.set(imgs, { opacity: 0 });

      const xTo = gsap.quickTo(floater, 'x',        { duration: 0.5,  ease: 'power3.out' });
      const yTo = gsap.quickTo(floater, 'y',        { duration: 0.5,  ease: 'power3.out' });
      const rTo = gsap.quickTo(floater, 'rotation', { duration: 0.65, ease: 'power3.out' });

      let activeRow = null;
      let activeIdx = -1;
      let visible   = false;
      let inView    = false;
      let lastX = 0;
      let lastY = 0;
      let prevX = 0;

      const showFloater = (x, y) => {
        if (visible) return;
        visible = true;
        gsap.set(floater, { x, y });
        prevX = x;
        gsap.killTweensOf(floater, 'opacity,scale');
        gsap.to(floater, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.killTweensOf(floaterInner, 'rotation');
        gsap.fromTo(
          floaterInner,
          { rotation: -3 },
          { rotation: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }
        );
      };

      const hideFloater = () => {
        if (!visible) return;
        visible = false;
        gsap.killTweensOf(floater, 'opacity,scale');
        gsap.to(floater, {
          opacity: 0,
          scale: 0.85,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: 'auto',
        });
      };

      // Crossfade by toggling opacity on independent <img> elements.
      // overwrite:'auto' picks up from current opacity if interrupted, so a
      // rapid swap during a fade-in continues smoothly to 1 instead of being
      // slammed back to 0.
      const setActiveImage = (idx) => {
        if (idx === activeIdx) return;
        const prev = activeIdx;
        activeIdx = idx;
        if (prev >= 0 && imgs[prev]) {
          gsap.to(imgs[prev], {
            opacity: 0,
            duration: 0.28,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        }
        if (idx >= 0 && imgs[idx]) {
          gsap.to(imgs[idx], {
            opacity: 1,
            duration: 0.28,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        }
      };

      const moveFollow = (x, y) => {
        const dx = x - prevX;
        prevX = x;
        const tilt = gsap.utils.clamp(-5, 5, dx * 0.45);
        xTo(x);
        yTo(y);
        rTo(tilt);
      };

      const setActiveRow = (row, x, y) => {
        if (activeRow === row) return;
        activeRow = row;
        if (row) {
          const idx = rows.indexOf(row);
          if (idx !== -1) setActiveImage(idx);
          if (!visible) showFloater(x, y);
        } else {
          hideFloater();
          // Keep activeIdx so on re-entry we can crossfade from it.
        }
      };

      // ---------- Per-row mouse events ----------
      const rowHandlers = [];
      rows.forEach((row) => {
        const onEnter = (e) => {
          if (!inView) return;
          lastX = e.clientX; lastY = e.clientY;
          setActiveRow(row, e.clientX, e.clientY);
          gsap.set(floater, { x: e.clientX, y: e.clientY });
          prevX = e.clientX;
        };
        const onMove = (e) => {
          lastX = e.clientX; lastY = e.clientY;
          if (!inView) return;
          if (activeRow !== row) setActiveRow(row, e.clientX, e.clientY);
          moveFollow(e.clientX, e.clientY);
        };
        const onLeave = (e) => {
          const next = e.relatedTarget;
          if (next instanceof Node) {
            const stillInsideRow =
              next instanceof Element && next.closest('.priorities__row');
            if (stillInsideRow) return;
          }
          if (activeRow === row) setActiveRow(null);
        };

        row.addEventListener('mouseenter', onEnter);
        row.addEventListener('mousemove',  onMove);
        row.addEventListener('mouseleave', onLeave);
        rowHandlers.push([row, onEnter, onMove, onLeave]);
      });

      const onSectionLeave = () => setActiveRow(null);
      section.addEventListener('mouseleave', onSectionLeave);

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inView = entry.isIntersecting;
            if (!inView) {
              activeRow = null;
              hideFloater();
            }
          });
        },
        { threshold: 0 }
      );
      io.observe(section);

      const onWindowMove = (e) => {
        lastX = e.clientX; lastY = e.clientY;
      };
      window.addEventListener('mousemove', onWindowMove, { passive: true });

      const reevaluate = () => {
        if (!inView) {
          if (activeRow) setActiveRow(null);
          return;
        }
        const el = document.elementFromPoint(lastX, lastY);
        const row = el && el.closest ? el.closest('.priorities__row') : null;
        if (row && rows.indexOf(row) !== -1) {
          if (activeRow !== row) setActiveRow(row, lastX, lastY);
          gsap.set(floater, { x: lastX, y: lastY });
          prevX = lastX;
        } else if (activeRow) {
          setActiveRow(null);
        }
      };

      window.addEventListener('scroll', reevaluate, { passive: true });

      let lenis = (typeof window !== 'undefined') ? window.__lenis : null;
      if (lenis) lenis.on('scroll', reevaluate);
      let tries = 0;
      const lenisInterval = setInterval(() => {
        if (lenis) { clearInterval(lenisInterval); return; }
        const l = (typeof window !== 'undefined') ? window.__lenis : null;
        if (l) {
          lenis = l;
          lenis.on('scroll', reevaluate);
          clearInterval(lenisInterval);
        }
        if (++tries > 40) clearInterval(lenisInterval);
      }, 100);

      cleanupFloater = () => {
        rowHandlers.forEach(([row, en, mv, lv]) => {
          row.removeEventListener('mouseenter', en);
          row.removeEventListener('mousemove',  mv);
          row.removeEventListener('mouseleave', lv);
        });
        section.removeEventListener('mouseleave', onSectionLeave);
        window.removeEventListener('mousemove', onWindowMove);
        window.removeEventListener('scroll', reevaluate);
        io.disconnect();
        if (lenis) lenis.off('scroll', reevaluate);
        clearInterval(lenisInterval);
      };
    }

    return () => {
      cleanupFloater();
      tapHandlers.forEach(([el, fn]) => el.removeEventListener('click', fn));
      if (entranceTween) {
        if (entranceTween.scrollTrigger) entranceTween.scrollTrigger.kill();
        entranceTween.kill();
      }
    };
  }, []);

  return (
    <section className="priorities" ref={sectionRef}>
      <div className="priorities__head">
        <div className="eyebrow priorities__eyebrow" data-reveal>Our Priorities</div>
        <h2 className="h1 priorities__title" data-reveal>Six fronts. One mandate.</h2>
      </div>

      <div className="priorities__list">
        {PRIORITIES.map((p, i) => (
          <div
            className="priorities__row"
            key={p.name}
            data-image={p.image}
          >
            <span className="priorities__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="priorities__name">{p.name}</span>
            <span className="priorities__tag">{p.tag}</span>
            <img
              className="priorities__row-img"
              src={p.image}
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      <div className="priorities__floater" ref={floaterRef} aria-hidden="true">
        <div className="priorities__floater-inner" ref={floaterInnerRef}>
          {PRIORITIES.map((p, i) => (
            <img
              key={p.name}
              ref={(el) => { imgsRef.current[i] = el; }}
              className="priorities__floater-img"
              src={p.image}
              alt=""
            />
          ))}
        </div>
      </div>
    </section>
  );
}
