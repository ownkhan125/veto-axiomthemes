'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

const FILTERS = ['All', 'Labor', 'Press', 'Elected', 'Civic'];

const ENDORSERS = [
  { name: 'Nevada State AFL-CIO',          tag: 'Labor' },
  { name: 'NV Fire Fighters Assn.',        tag: 'Labor' },
  { name: 'SEIU Local 1107',               tag: 'Labor' },
  { name: 'Carpenters Local 1977',         tag: 'Labor' },
  { name: 'Nurses United NV',              tag: 'Labor' },
  { name: 'Teamsters Joint Council 7',     tag: 'Labor' },
  { name: 'Reno Gazette Editorial',        tag: 'Press' },
  { name: 'Sierra Sun-Tribune',            tag: 'Press' },
  { name: 'Las Vegas Independent',         tag: 'Press' },
  { name: 'Nevada Current',                tag: 'Press' },
  { name: 'Senator Maria Chen',            tag: 'Elected' },
  { name: 'Gov. James Whitfield',          tag: 'Elected' },
  { name: 'Mayor Renata Bell, Reno',       tag: 'Elected' },
  { name: 'Rep. Andrea Calloway',          tag: 'Elected' },
  { name: 'AG Kwame Forrester',            tag: 'Elected' },
  { name: 'Battle Born PAC',               tag: 'Civic' },
  { name: 'Nevada Veterans Alliance',      tag: 'Civic' },
  { name: 'PLAN — Progressive Leadership Alliance', tag: 'Civic' },
  { name: 'Make the Road Nevada',          tag: 'Civic' },
  { name: 'Indivisible Reno',              tag: 'Civic' },
];

const QUOTES = [
  {
    body: 'Reyna takes the meetings nobody else has time for. We endorsed early because we trust how she <em>listens</em> — not just how she votes.',
    author: 'Diego Vargas',
    role: 'President · Nevada State AFL-CIO',
  },
  {
    body: "She read our 142-page water study before our first meeting. That's what voters in this district have been waiting on for a decade.",
    author: 'Joanna Whitehorn',
    role: 'Editorial Board · Sierra Sun-Tribune',
  },
  {
    body: 'I have served beside a lot of senators. Few publish their votes within 48 hours, with reasoning. Reyna pledges to. <em>Believe her.</em>',
    author: 'Gov. James Whitfield',
    role: 'Former Nevada Governor',
  },
  {
    body: "Independent isn't a slogan when you actually refuse the corporate PAC checks. We've seen the books. They're refusing.",
    author: 'Patty Hall',
    role: 'Co-chair · Battle Born PAC',
  },
];

export default function EndorsementsClient() {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return ENDORSERS;
    return ENDORSERS.filter((e) => e.tag === filter);
  }, [filter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const filters = section.querySelectorAll('.endorse-page__filters > *');
      gsap.set(filters, { opacity: 0, y: 14 });
      gsap.to(filters, {
        opacity: 1, y: 0,
        duration: DUR.short, stagger: 0.05, ease: EASE.fluent,
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' },
      });

      const quotes = section.querySelectorAll('.endorse-page__quote');
      gsap.set(quotes, { opacity: 0, y: 30 });
      gsap.to(quotes, {
        opacity: 1, y: 0,
        duration: DUR.short, stagger: 0.12, ease: EASE.fluent,
        scrollTrigger: { trigger: quotes[0], start: 'top 82%', toggleActions: 'play none none none' },
      });

      const cta = section.querySelector('.endorse-page__cta');
      if (cta) {
        gsap.from(cta, {
          opacity: 0, y: 28,
          duration: 0.8, ease: EASE.fluent,
          scrollTrigger: { trigger: cta, start: 'top 86%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Re-stagger cells on filter change.
  useEffect(() => {
    if (isReducedMotion()) return;
    const cells = sectionRef.current?.querySelectorAll('.endorse__cell');
    if (!cells || !cells.length) return;
    gsap.fromTo(
      cells,
      { opacity: 0, y: 18, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: EASE.fluent }
    );
  }, [filtered]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Endorsements"
        title="Backed by Nevadans who do the work."
        highlight="work"
        caption="A partial list — updated weekly as more labor councils, editorial boards, elected officials, and civic groups weigh in. No corporate PAC money, every donor over $200 published."
        meta={[
          { label: 'Endorsers', value: `${ENDORSERS.length}+ and growing` },
          { label: 'Cadence',   value: 'Updated weekly' },
          { label: 'PAC dollars in this list', value: '$0' },
        ]}
      />

      <SectionDivider tone="light" align="left" />

      <section className="endorse-page" ref={sectionRef} aria-label="Endorsement directory">
        <div className="endorse-page__filters" role="tablist" aria-label="Filter endorsements">
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`chip chip--ink${filter === f ? ' chip--active' : ''}`}
              onClick={() => setFilter(f)}
              data-cursor="hover"
            >
              {f}
            </button>
          ))}
          <span className="evlist__count">
            <strong>{filtered.length.toString().padStart(2, '0')}</strong>
            endorsements{filter !== 'All' ? ` · ${filter.toLowerCase()}` : ''}
          </span>
        </div>

        <div className="endorse__grid" role="list" style={{ position: 'relative', zIndex: 2 }}>
          {filtered.map((c) => (
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

        <SectionDivider tone="light" label="In their words" align="center" />

        <div className="endorse-page__quotes">
          {QUOTES.map((q, i) => (
            <article className="endorse-page__quote" key={i}>
              <span className="endorse-page__quote-mark" aria-hidden="true">"</span>
              <p
                className="endorse-page__quote-body"
                dangerouslySetInnerHTML={{ __html: q.body }}
              />
              <div className="endorse-page__quote-author">
                <strong>{q.author}</strong>
                <span>{q.role}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="endorse-page__cta">
          <h3>Lead a labor council, editorial board, or civic group? <br/>Add your endorsement.</h3>
          <Link href="/contact?topic=endorsement" data-cursor="hover">
            Endorse the campaign
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
