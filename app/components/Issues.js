'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import IssueCard from './IssueCard';
import { EVENTS as ALL_EVENTS } from '../lib/events-data';

const INTRO_HEADING = 'Join the campaign on the road.';

// Pull from the shared catalogue so the homepage cards route to the same
// detail pages used by /events/[slug]. The first five give us the same five
// cards that were here before the listing page existed.
const EVENTS = ALL_EVENTS.slice(0, 5).map((e, i) => ({
  slug: e.slug,
  image: `https://picsum.photos/800/500?random=${i + 1}`,
  tag: e.tag,
  date: e.date,
  title: e.title,
  location: `${e.venue}, ${e.address}`,
  cta: 'RSVP',
}));

export default function Issues() {
  const pinRef     = useRef(null);
  const railRef    = useRef(null);
  const headingRef = useRef(null);

  // Signature heading reveal — per-letter "departure-board flip" cascade.
  // Each letter rotates down from above (rotateX -100° → 0°) like an airport
  // events board updating, with a slight overshoot. Triggered once when the
  // intro enters the viewport.
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const chars = heading.querySelectorAll('.issues__heading-char');
    if (chars.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(chars, { rotateX: 0, opacity: 1 });
      return;
    }

    gsap.set(chars, {
      rotateX: -100,
      opacity: 0,
      transformOrigin: '50% 0%',
      transformPerspective: 800,
      willChange: 'transform, opacity',
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        gsap.to(chars, {
          rotateX: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.035,
          ease: 'back.out(1.7)',
          clearProps: 'willChange,transformPerspective',
        });
      });
    }, { threshold: 0.35 });
    io.observe(heading);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const rail = railRef.current;
    const pin = pinRef.current;
    if (!rail || !pin) return;

    const buildScroll = () => {
      const padX = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pad-x')) || 24;
      const distance = rail.scrollWidth - window.innerWidth + padX * 2;
      return Math.max(distance, 0);
    };

    const tween = gsap.to(rail, {
      x: () => -buildScroll(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + buildScroll(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    document.fonts?.ready?.then(refresh);
    const t1 = setTimeout(refresh, 400);
    const t2 = setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener('resize', refresh);
      clearTimeout(t1);
      clearTimeout(t2);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="events" className="issues">
      <div className="issues__intro">
        <div>
          <div className="eyebrow" data-reveal style={{ marginBottom: 32, color: 'var(--ink-40)' }}>
            Upcoming Events
          </div>
          <h2
            className="h1 issues__heading"
            ref={headingRef}
            aria-label={INTRO_HEADING}
          >
            {INTRO_HEADING.split(' ').map((word, wi, arr) => (
              <Fragment key={wi}>
                <span className="issues__heading-word" aria-hidden="true">
                  {Array.from(word).map((ch, ci) => (
                    <span key={ci} className="issues__heading-char">{ch}</span>
                  ))}
                </span>
                {wi < arr.length - 1 && ' '}
              </Fragment>
            ))}
          </h2>
        </div>
        <Link href="/events" data-cursor="link">View all events <span>→</span></Link>
      </div>

      <div className="issues__pin" ref={pinRef}>
        <div className="issues__rail" ref={railRef}>
          {EVENTS.map((event, i) => (
            <IssueCard key={event.slug} index={i} event={event} />
          ))}
        </div>
      </div>

      <div className="issues__foot">
        <Link href="/events" className="issues__foot-cta" data-cursor="hover">
          View All Events
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
