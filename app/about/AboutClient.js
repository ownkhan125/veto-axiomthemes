'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, splitWords } from '../lib/reveal';

const STORY_ROWS = [
  {
    index: '01',
    title: "I'm Alex Reyna. I grew up here.",
    image: 'https://picsum.photos/900/720?random=31',
    paragraphs: [
      "Third-generation Nevadan. My grandparents kept a feed store outside Yerington — the kind of place that knew every rancher's first name and most of their kids'. My parents kept the books on the kitchen table.",
      "I learned what most working families already know: a small business doesn't run on slogans. It runs on receipts.",
    ],
    pill: 'Yerington · Reno · Carson City',
  },
  {
    index: '02',
    title: "Public defender, then small-business owner.",
    image: 'https://picsum.photos/900/720?random=32',
    reverse: true,
    paragraphs: [
      "I spent eight years as a Washoe County public defender. I sat across from people the system was failing in real time — most of them with jobs, kids, and bills. The cases were complicated. The injustice rarely was.",
      "Afterwards I started a small legal-services co-op in Reno. We served working families who couldn't afford traditional retainer rates. Twelve employees, all on payroll. Health insurance from year one.",
    ],
    pill: 'Reno · 2014 – 2024',
  },
  {
    index: '03',
    title: "Why I'm running.",
    image: 'https://picsum.photos/900/720?random=33',
    paragraphs: [
      "I watched my neighbors get priced out of the state we built. I watched the seat we're running for spend ten years in private fundraisers and zero in our towns.",
      "I'm running because Nevada deserves a senator who reads the bill, takes the meetings you can't get, and publishes their votes — every one — within 48 hours. That's not aspirational. That's the floor.",
    ],
    pill: 'Independent · People-funded',
  },
];

const VALUES = [
  { num: 'I',   name: 'Receipts over slogans',     tag: 'Transparency' },
  { num: 'II',  name: 'Read the bill',             tag: 'Diligence' },
  { num: 'III', name: 'Show up where invited',     tag: 'Service' },
  { num: 'IV',  name: 'Publish the ledger',        tag: 'Disclosure' },
  { num: 'V',   name: 'No corporate PAC dollars',  tag: 'Independence' },
  { num: 'VI',  name: 'Answer on the record',      tag: 'Accountability' },
];

const TIMELINE = [
  { year: '1986',  title: 'Born in Yerington', body: 'Third-generation Nevadan. Family ran a feed store on the edge of town.' },
  { year: '2008',  title: 'Graduated Reno High → UNR', body: 'First in the family to finish a four-year degree.' },
  { year: '2012',  title: 'Sworn in, Washoe County PD', body: 'Eight years as a public defender. Roughly 600 clients.' },
  { year: '2020',  title: 'Founded Sage & Reyna Legal', body: 'Twelve-person legal-services co-op in Reno. Sliding-scale fees.', accent: 1 },
  { year: '2024',  title: 'Stepped back from the firm', body: 'Began a year of district listening sessions across all 17 counties.' },
  { year: '2026',  title: 'Filed to run', body: 'No PAC money. No corporate underwriters. Field-funded from day one.', accent: 1 },
];

// Render a string as char-mask spans for staggered "construction" reveal.
// Words remain non-breaking units; only chars within a word are split.
function renderChars(text, charClass = 'values__char', maskClass = 'values__char-mask') {
  return text.split(/(\s+)/).map((tok, ti) => {
    if (/^\s+$/.test(tok)) return <span key={`s${ti}`}>{tok}</span>;
    return (
      <span key={`w${ti}`} className="values__name-mask">
        {Array.from(tok).map((ch, ci) => (
          <span key={ci} className={maskClass}>
            <span className={charClass}>{ch}</span>
          </span>
        ))}
      </span>
    );
  });
}

export default function AboutClient() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      // ============================================================
      // STORY ROWS — frame-build → media mask → title clip → bar → text
      // Mask direction varies per row to avoid repetitive entry.
      // ============================================================
      const maskDirections = [
        { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },   // top → bottom
        { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },   // left → right
        { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },   // bottom → top
      ];

      section.querySelectorAll('.story__row').forEach((row, idx) => {
        const media = row.querySelector('.story__media');
        const sweep = row.querySelector('[data-sweep]');
        const titleInner = row.querySelector('.story__title-inner');
        const bodies = row.querySelectorAll('.story__body');
        const indexEl = row.querySelector('.story__index');
        const pill = row.querySelector('.story__pill');
        const edges = row.querySelectorAll('[data-frame-edge]');
        const direction = maskDirections[idx % maskDirections.length];

        // Pre-set every animatable resting state up-front so reverse on
        // scroll-up returns to a known clean state (no destructive .from()).
        if (bodies.length) gsap.set(bodies, { opacity: 0, y: 16 });
        if (pill) gsap.set(pill, { opacity: 0, y: 14, scale: 0.94 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });

        // Frame edges illuminate clockwise — gives the row a "powering on" wrap.
        if (edges.length === 4) {
          gsap.set([edges[0], edges[2]], { scaleX: 0 });
          gsap.set([edges[1], edges[3]], { scaleY: 0 });
          tl.to(edges[0], { scaleX: 1, duration: 0.6, ease: EASE.fluent }, 0)
            .to(edges[1], { scaleY: 1, duration: 0.55, ease: EASE.fluent }, 0.10)
            .to(edges[2], { scaleX: 1, duration: 0.6, ease: EASE.fluent }, 0.20)
            .to(edges[3], { scaleY: 1, duration: 0.55, ease: EASE.fluent }, 0.30);
        }

        if (media) {
          gsap.set(media, { clipPath: direction.from, WebkitClipPath: direction.from });
          tl.to(media, {
            clipPath: direction.to,
            WebkitClipPath: direction.to,
            duration: 1.05,
            ease: EASE.fluent,
          }, 0.16);
        }
        // Light sweep across image after mask completes.
        if (sweep) {
          gsap.set(sweep, { left: '-30%', opacity: 0 });
          tl.to(sweep, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 0.85)
            .to(sweep, { left: '110%', duration: 1.0, ease: 'power2.inOut' }, 0.9)
            .to(sweep, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.7);
        }

        if (indexEl) {
          gsap.set(indexEl, { '--bar-w': '0px', opacity: 0, x: -8 });
          tl.to(indexEl, { '--bar-w': '36px', opacity: 1, x: 0, duration: 0.65, ease: EASE.fluent }, 0.22);
        }

        if (titleInner) {
          gsap.set(titleInner, { clipPath: 'inset(0 0 100% 0)', WebkitClipPath: 'inset(0 0 100% 0)', y: 24 });
          tl.to(titleInner, {
            clipPath: 'inset(0 0 0% 0)',
            WebkitClipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
          }, 0.34);
        }

        if (bodies.length) {
          tl.to(bodies, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: EASE.fluent }, 0.52);
        }

        if (pill) {
          tl.to(pill, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: EASE.fluent }, 0.78);
        }
      });

      // ============================================================
      // MISSION — beam draws across, then word scrub takes over.
      // ============================================================
      const mission = section.querySelector('[data-mission-block]');
      const missionPull = section.querySelector('[data-mission]');
      const missionBeam = section.querySelector('[data-mission-beam]');

      if (missionBeam) {
        gsap.set(missionBeam, { scaleX: 0 });
        gsap.to(missionBeam, {
          scaleX: 1,
          duration: 1.4,
          ease: EASE.fluent,
          scrollTrigger: { trigger: mission, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      }

      if (missionPull) {
        const words = splitWords(missionPull);
        if (words.length) {
          gsap.fromTo(
            words,
            { opacity: 0.12 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 4 / Math.max(1, words.length - 1),
              scrollTrigger: {
                trigger: missionPull,
                start: 'top 70%',
                end: 'bottom 30%',
                scrub: 0.6,
              },
            }
          );
        }
      }

      // ============================================================
      // VALUES — bottom border draws under each row; numeral fades from
      // left, name reveals char-by-char, tag fades from right.
      // ============================================================
      section.querySelectorAll('.values__row').forEach((row) => {
        const num = row.querySelector('.values__num');
        const chars = row.querySelectorAll('.values__char');
        const tag = row.querySelector('.values__tag');

        // Pre-set resting states so reverse on scroll-up returns cleanly.
        if (num) gsap.set(num, { opacity: 0, x: -14 });
        if (tag) gsap.set(tag, { opacity: 0, x: 14 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' },
        });

        gsap.set(row, { '--row-line-scale': 0 });
        tl.to(row, { '--row-line-scale': 1, duration: 0.8, ease: EASE.fluent }, 0);

        if (num) tl.to(num, { opacity: 1, x: 0, duration: 0.5, ease: EASE.fluent }, 0.05);

        if (chars.length) {
          gsap.set(chars, { yPercent: 110, opacity: 0 });
          tl.to(chars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.012,
            ease: 'expo.out',
          }, 0.12);
        }

        if (tag) tl.to(tag, { opacity: 1, x: 0, duration: 0.5, ease: EASE.fluent }, 0.32);
      });

      // ============================================================
      // TIMELINE — accent rail fills with scroll. Each milestone (dot +
      // year + body) activates as ONE synchronized unit when its row
      // enters the viewport, and deactivates in reverse when the row
      // leaves the viewport upward. No abrupt popping, no inconsistent
      // year reveals — dot and year are bound to the same play/reverse.
      // ============================================================
      const tlSection = section.querySelector('.timeline');
      if (tlSection) {
        const tlFill = tlSection.querySelector('[data-tl-fill]');
        const tlRows = tlSection.querySelectorAll('.timeline__row');

        if (tlFill) {
          gsap.fromTo(
            tlFill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: tlSection,
                start: 'top 65%',
                end: 'bottom 80%',
                scrub: 0.5,
              },
            }
          );
        }

        tlRows.forEach((row) => {
          const year = row.querySelector('.timeline__year');
          const content = row.querySelector('.timeline__content') || row.querySelector(':scope > div');
          const strong = row.querySelector('strong');
          const span = row.querySelector('span');

          // Resting (off) state — every part of the milestone starts hidden,
          // so dot, year, and content can power on as one unit.
          if (year)    gsap.set(year,    { opacity: 0, y: 14, scale: 0.94 });
          if (content) gsap.set(content, { opacity: 0, y: 14, scale: 0.985, clipPath: 'inset(0 0 100% 0)', WebkitClipPath: 'inset(0 0 100% 0)' });
          if (strong)  gsap.set(strong,  { opacity: 0, y: 10 });
          if (span)    gsap.set(span,    { opacity: 0, y: 10 });

          // One paused timeline per row. play() drives the lit state in;
          // reverse() drives it out. Dot, year, and content share the
          // exact same window and easing — perfectly synchronized.
          const DUR = 0.6;
          const EASE_IN = 'expo.out';
          const tl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
          if (year)    tl.to(year,    { opacity: 1, y: 0, scale: 1, duration: DUR, ease: EASE_IN }, 0);
          if (content) tl.to(content, {
            opacity: 1, y: 0, scale: 1,
            clipPath: 'inset(0 0 0% 0)', WebkitClipPath: 'inset(0 0 0% 0)',
            duration: DUR, ease: EASE_IN,
          }, 0);
          if (strong)  tl.to(strong,  { opacity: 1, y: 0, duration: DUR * 0.8, ease: EASE.fluent }, 0.05);
          if (span)    tl.to(span,    { opacity: 1, y: 0, duration: DUR * 0.85, ease: EASE.fluent }, 0.1);

          const activate = () => {
            row.classList.add('is-on');
            tl.play();
          };
          const deactivate = () => {
            row.classList.remove('is-on');
            tl.reverse();
          };

          // Strict viewport window — milestone is "live" only while its
          // row sits inside the activation band. Crossing either edge
          // (down past the bottom, or up past the top) powers it off.
          ScrollTrigger.create({
            trigger: row,
            start: 'top 82%',
            end: 'bottom 22%',
            onEnter: activate,
            onEnterBack: activate,
            onLeave: deactivate,
            onLeaveBack: deactivate,
          });
        });
      }

      // ============================================================
      // COLLAGE — varied mask reveals: left, bottom, right.
      // ============================================================
      const collageDirections = [
        'inset(0 100% 0 0)',  // wipe in from left
        'inset(100% 0 0 0)',  // wipe in from bottom
        'inset(0 0 0 100%)',  // wipe in from right
      ];
      section.querySelectorAll('.collage figure').forEach((fig, i) => {
        const fromClip = collageDirections[i % collageDirections.length];
        gsap.set(fig, { clipPath: fromClip, WebkitClipPath: fromClip });
        gsap.to(fig, {
          clipPath: 'inset(0 0 0 0)',
          WebkitClipPath: 'inset(0 0 0 0)',
          duration: 1.15,
          ease: EASE.fluent,
          scrollTrigger: { trigger: fig, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });

      // ============================================================
      // PAGE CTA — frame illuminates clockwise, then content cascades.
      // ============================================================
      const cta = section.querySelector('.page-cta');
      if (cta) {
        const edges = cta.querySelectorAll('[data-cta-edge]');
        const title = cta.querySelector('.page-cta__title');
        const lede = cta.querySelector('.page-cta__lede');
        const btn = cta.querySelector('.page-cta__btn');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: cta, start: 'top 82%', toggleActions: 'play none none reverse' },
        });

        if (edges.length === 4) {
          gsap.set([edges[0], edges[2]], { scaleX: 0 });
          gsap.set([edges[1], edges[3]], { scaleY: 0 });
          tl.to(edges[0], { scaleX: 1, duration: 0.7,  ease: EASE.fluent }, 0)
            .to(edges[1], { scaleY: 1, duration: 0.65, ease: EASE.fluent }, 0.18)
            .to(edges[2], { scaleX: 1, duration: 0.7,  ease: EASE.fluent }, 0.32)
            .to(edges[3], { scaleY: 1, duration: 0.65, ease: EASE.fluent }, 0.46);
        }
        if (title) tl.from(title, { opacity: 0, y: 22, duration: 0.65, ease: EASE.fluent }, 0.3);
        if (lede)  tl.from(lede,  { opacity: 0, y: 14, duration: 0.55, ease: EASE.fluent }, 0.5);
        if (btn)   tl.from(btn,   { opacity: 0, y: 14, scale: 0.94, duration: 0.55, ease: EASE.fluent }, 0.65);
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <PageShell>
      <PageHero
        eyebrow="About Alex"
        title="A senate seat earned, not bought."
        highlight="earned"
        caption="Third-generation Nevadan. Former public defender. Small-business owner. Independent — and that's not a slogan, it's a balance sheet."
        meta={[
          { label: 'Origin',     value: 'Yerington, NV' },
          { label: 'Profession', value: 'Public defender · Co-op founder' },
          { label: 'Run',        value: 'U.S. Senate · 2026' },
        ]}
      />

      <SectionDivider tone="light" align="left" />

      <div ref={sectionRef} className="about-narrative">
        <section className="story" aria-label="The story">
          {STORY_ROWS.map((row, i) => (
            <div
              key={i}
              className={`story__row${row.reverse ? ' story__row--reverse' : ''}`}
            >
              <span className="story__frame" aria-hidden="true">
                <span className="story__frame__edge story__frame__edge--t" data-frame-edge />
                <span className="story__frame__edge story__frame__edge--r" data-frame-edge />
                <span className="story__frame__edge story__frame__edge--b" data-frame-edge />
                <span className="story__frame__edge story__frame__edge--l" data-frame-edge />
              </span>
              <div className="story__media">
                <img src={row.image} alt="" loading="lazy" />
                <span className="story__media__sweep" data-sweep aria-hidden="true" />
              </div>
              <div className="story__copy">
                <span className="story__index">Chapter {row.index}</span>
                <h2 className="story__title">
                  <span className="story__title-inner">{row.title}</span>
                </h2>
                {row.paragraphs.map((p, pi) => (
                  <p key={pi} className="story__body">{p}</p>
                ))}
                {row.pill && <span className="story__pill">{row.pill}</span>}
              </div>
            </div>
          ))}
        </section>

        <SectionDivider tone="ink" label="The mission" align="center" />

        {/* Mission — beam draws across, then word scrub progresses with scroll. */}
        <section
          className="manifesto is-scrub manifesto--about-frame"
          style={{ background: 'var(--paper)' }}
          aria-label="Mission"
          data-mission-block
        >
          <span className="manifesto__beam" data-mission-beam aria-hidden="true" />
          <div className="eyebrow manifesto__eyebrow">Mission</div>
          <p className="manifesto__pull" data-mission>
            We don't run on slogans. We run on <em>receipts</em> — what we've done, what we'll deliver next, and the names of every donor over $200.
          </p>
        </section>

        <SectionDivider tone="light" label="What we believe" align="center" />

        <section className="values" aria-label="Campaign values">
          <div className="values__list">
            {VALUES.map((v) => (
              <div className="values__row" key={v.name}>
                <span className="values__num">{v.num}</span>
                <span className="values__name">{renderChars(v.name)}</span>
                <span className="values__tag">{v.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider tone="dark" label="Timeline" align="center" />

        <section className="timeline" aria-label="Career timeline">
          <div className="stage__head stage__head--single">
            <div className="eyebrow" style={{ color: 'var(--ink-40)', marginBottom: 24 }}>Career so far</div>
            <h2 className="h1" style={{ maxWidth: 18 + 'ch' }}>Six steps to the ballot.</h2>
          </div>
          <div className="timeline__rail">
            <span className="timeline__rail__fill" data-tl-fill aria-hidden="true" />
            {TIMELINE.map((t) => (
              <div className="timeline__row" key={t.year} data-accent={t.accent || 0}>
                <span className="timeline__year">{t.year}</span>
                <div>
                  <strong>{t.title}</strong>
                  <span>{t.body}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="collage" aria-label="Field photos">
          <figure><img src="https://picsum.photos/600/750?random=41" alt="" loading="lazy" /></figure>
          <figure><img src="https://picsum.photos/600/800?random=42" alt="" loading="lazy" /></figure>
          <figure><img src="https://picsum.photos/600/750?random=43" alt="" loading="lazy" /></figure>
        </section>

        <section className="page-cta">
          <span className="page-cta__frame" aria-hidden="true">
            <span className="page-cta__frame__edge page-cta__frame__edge--t" data-cta-edge />
            <span className="page-cta__frame__edge page-cta__frame__edge--r" data-cta-edge />
            <span className="page-cta__frame__edge page-cta__frame__edge--b" data-cta-edge />
            <span className="page-cta__frame__edge page-cta__frame__edge--l" data-cta-edge />
          </span>
          <div className="page-cta__inner">
            <div>
              <h2 className="page-cta__title">Read the campaign's <em>full ledger</em>.</h2>
              <p className="page-cta__lede">
                Every donation over $200, every consultant invoice, every quarterly disclosure. We publish it because we'd ask any other senator to.
              </p>
            </div>
            <Link href="/contact" className="page-cta__btn" data-cursor="hover">
              Request the ledger
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
