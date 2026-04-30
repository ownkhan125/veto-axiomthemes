'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';
import { EVENTS, EVENT_TAGS } from '../lib/events-data';

const HERO_META = [
  { label: 'Active stops',  value: `${EVENTS.length} this quarter` },
  { label: 'Format',        value: 'Town halls · Canvass · Community' },
  { label: 'RSVP fee',      value: 'Always free' },
];

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5C5.51472 1.5 3.5 3.51472 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.51472 10.4853 1.5 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
    </svg>
  );
}

function EventCard({ event }) {
  const [day, month] = (event.date || '').split(' ');
  const href = `/events/${event.slug}`;
  return (
    <article className="evcard" data-cursor="hover">
      <div className="evcard__media">
        <img src={event.image} alt="" loading="lazy" draggable={false} />
        <div className="evcard__date">
          <strong>{month}</strong>
          <span>{day}</span>
        </div>
      </div>

      <div className="evcard__body">
        <span className="evcard__tag">{event.tag}</span>
        <h3 className="evcard__title">{event.title}</h3>
        <p className="evcard__loc">
          <PinIcon />
          <span>{event.venue} · {event.locationShort}</span>
        </p>
        <div className="evcard__foot">
          <span className="evcard__time">{event.time}</span>
          <span className="evcard__cta" aria-hidden="true">
            RSVP <ArrowIcon />
          </span>
        </div>
      </div>

      {/* Full-card click cover — entire card routes to the detail page. */}
      <Link
        href={href}
        className="evcard__cover"
        aria-label={`${event.title} — view details and RSVP`}
      />
      <span className="evcard__edge" aria-hidden="true" />
    </article>
  );
}

export default function EventsClient() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return EVENTS;
    return EVENTS.filter((e) => e.tag === filter);
  }, [filter]);

  // Filter chips entrance — runs once on mount.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const filters = section.querySelectorAll('.evlist__filters > *');
      gsap.set(filters, { opacity: 0, y: 14 });

      gsap.to(filters, {
        opacity: 1, y: 0,
        duration: DUR.short, stagger: 0.05, ease: EASE.fluent,
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Timeline activation — spine fill scrubs with scroll, each row's node +
  // branch + card light up sequentially as the row enters the viewport, and
  // power down again on scroll-up. Re-runs on filter change so freshly
  // mounted rows are wired correctly.
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || isReducedMotion()) return;
    if (!filtered.length) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const spineFill = timeline.querySelector('[data-spine-fill]');
      const rows = timeline.querySelectorAll('[data-evrow]');

      if (spineFill) {
        gsap.fromTo(
          spineFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timeline,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 0.6,
            },
          }
        );
      }

      rows.forEach((row, i) => {
        const card = row.querySelector('.evcard');
        const isLeft = i % 2 === 0;
        const restingRotation = isLeft ? -1.4 : 1.4;
        const restingX = isLeft ? -24 : 24;

        if (card) {
          gsap.set(card, {
            opacity: 0,
            y: 36,
            x: restingX,
            scale: 0.94,
            rotateZ: restingRotation,
            transformOrigin: isLeft ? 'right center' : 'left center',
          });
        }

        const tl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
        if (card) {
          tl.to(card, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotateZ: 0,
            duration: 0.85,
            ease: 'expo.out',
          }, 0.18);
        }

        ScrollTrigger.create({
          trigger: row,
          start: 'top 82%',
          end: 'bottom 18%',
          onEnter: () => { row.classList.add('is-active'); tl.play(); },
          onEnterBack: () => { row.classList.add('is-active'); tl.play(); },
          onLeaveBack: () => { row.classList.remove('is-active'); tl.reverse(); },
        });
      });

      // Refresh once after layout to position triggers correctly.
      ScrollTrigger.refresh();
    }, timeline);

    return () => ctx.revert();
  }, [filtered]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Upcoming Events"
        title="On the road, in your community."
        highlight="community"
        caption="Every stop on the calendar is open, free, and answered on the record. Find one near you, RSVP, and show up."
        meta={HERO_META}
      />

      <SectionDivider tone="light" align="left" />

      <section className="evlist" ref={sectionRef} aria-label="Upcoming events">
        <div className="evlist__filters" role="tablist" aria-label="Filter events by type">
          {EVENT_TAGS.map((t) => (
            <button
              type="button"
              key={t}
              role="tab"
              aria-selected={filter === t}
              className={`chip chip--ink${filter === t ? ' is-active' : ''}`}
              onClick={() => setFilter(t)}
              data-cursor="hover"
            >
              {t}
            </button>
          ))}
          <span className="evlist__count">
            <strong>{filtered.length.toString().padStart(2, '0')}</strong>
            {filter === 'All' ? 'upcoming events' : `${filter.toLowerCase()}s`}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="evlist__empty">
            <h3 className="h3">No matching events.</h3>
            <p>Try a different category, or <Link href="/ask">submit a question</Link> and we'll route you to your regional lead.</p>
          </div>
        ) : (
          <ol className="evtimeline" ref={timelineRef} aria-label="Event timeline">
            <span className="evtimeline__spine" aria-hidden="true">
              <span className="evtimeline__spine-line" />
              <span className="evtimeline__spine-fill" data-spine-fill />
            </span>
            {filtered.map((e, i) => (
              <li
                key={e.slug}
                className={`evtimeline__row evtimeline__row--${i % 2 === 0 ? 'left' : 'right'}`}
                data-evrow
              >
                <span className="evtimeline__node" aria-hidden="true">
                  <span className="evtimeline__node-ring" />
                  <span className="evtimeline__node-dot" />
                  <span className="evtimeline__node-pulse" />
                </span>
                <span className="evtimeline__branch" aria-hidden="true">
                  <span className="evtimeline__branch-line" />
                  <span className="evtimeline__branch-tip" />
                </span>
                <div className="evtimeline__card-wrap">
                  <EventCard event={e} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <SectionDivider tone="light" label="Don't see one near you?" align="center" />

      <section className="page-cta">
        <div className="page-cta__inner">
          <div>
            <h2 className="page-cta__title">
              We come where we're <em>asked</em> first.
            </h2>
            <p className="page-cta__lede">
              No event in your county yet? Tell us and we'll route a regional lead. The next stop on the roadshow is built from these requests.
            </p>
          </div>
          <Link href="/ask" className="page-cta__btn" data-cursor="hover">
            Request a stop <ArrowIcon />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
