'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';
import {
  SOCIAL_POSTS,
  SOCIAL_CATEGORIES,
  SOCIAL_FORMATS,
} from '../lib/social-posts-data';
import PostFrame from './PostFrame';

function ArrowIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const HERO_META = [
  { label: 'Designs',  value: `${SOCIAL_POSTS.length} in series I` },
  { label: 'Formats',  value: 'Feed posts · Stories' },
  { label: 'Library',  value: 'Always free to share' },
];

function PostCard({ post }) {
  const href = `/social-media-posts/${post.slug}`;
  return (
    <article className={`smcard smcard--${post.format}`} data-cursor="hover">
      <div className="smcard__media">
        <div className="smcard__frame" style={{ aspectRatio: post.aspect }}>
          <PostFrame post={post} />
        </div>
        <span className="smcard__chip" aria-hidden="true">
          {post.format === 'story' ? '9 : 16 · Story' : '1 : 1 · Feed'}
        </span>
      </div>

      <div className="smcard__body">
        <div className="smcard__meta">
          <span className="smcard__num">
            {String(post.index).padStart(2, '0')} / {String(SOCIAL_POSTS.length).padStart(2, '0')}
          </span>
          <span className="smcard__cat">{post.category}</span>
        </div>
        <h3 className="smcard__title">{post.title}</h3>
        <p className="smcard__sum">{post.summary}</p>
        <div className="smcard__foot">
          <span className="smcard__accent">{post.accent}</span>
          <span className="smcard__cta" aria-hidden="true">
            Open <ArrowIcon />
          </span>
        </div>
      </div>

      <Link
        href={href}
        className="smcard__cover"
        aria-label={`${post.title} — open detail and full-view`}
      />
      <span className="smcard__edge" aria-hidden="true" />
    </article>
  );
}

export default function SocialPostsClient() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [category, setCategory] = useState('All');
  const [format, setFormat] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SOCIAL_POSTS.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (format !== 'all' && p.format !== format) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.category} ${p.summary} ${p.accent} ${p.palette}`.toLowerCase();
      return hay.includes(q);
    });
  }, [category, format, query]);

  // Filter chips & search entrance.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll('.smfilters > *');
      gsap.set(items, { opacity: 0, y: 14 });
      gsap.to(items, {
        opacity: 1, y: 0,
        duration: DUR.short, stagger: 0.05, ease: EASE.fluent,
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Card stagger on filter change.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || isReducedMotion()) return;
    if (!filtered.length) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll('.smcard');
      gsap.fromTo(cards,
        { opacity: 0, y: 28, scale: 0.985 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: DUR.short, stagger: 0.05, ease: EASE.fluent,
        }
      );
    }, grid);

    return () => ctx.revert();
  }, [filtered]);

  const totalForCat = (cat) =>
    cat === 'All' ? SOCIAL_POSTS.length : SOCIAL_POSTS.filter((p) => p.category === cat).length;

  return (
    <PageShell>
      <PageHero
        eyebrow="Social Library"
        title="Posts you can post."
        highlight="post"
        caption="A premium library of feed and story creatives — every design rendered exactly as it was built, with no cropping. Filter by format or theme, preview in full, then open the detail page for the standalone view."
        meta={HERO_META}
      />

      <SectionDivider tone="light" align="left" />

      <section className="smlist" ref={sectionRef} aria-label="Social media post library">
        <div className="smfilters" role="region" aria-label="Filter posts">
          <div className="smfilters__group" role="tablist" aria-label="Filter by category">
            {SOCIAL_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                role="tab"
                aria-selected={category === c}
                className={`chip chip--ink${category === c ? ' is-active' : ''}`}
                onClick={() => setCategory(c)}
                data-cursor="hover"
              >
                <span>{c}</span>
                <span className="chip__count">{String(totalForCat(c)).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="smfilters__row">
            <div className="smfilters__formats" role="tablist" aria-label="Filter by format">
              {SOCIAL_FORMATS.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  role="tab"
                  aria-selected={format === f.id}
                  className={`smpill${format === f.id ? ' is-active' : ''}`}
                  onClick={() => setFormat(f.id)}
                  data-cursor="hover"
                >
                  {f.label}
                </button>
              ))}
            </div>

            <label className="smsearch" data-cursor="hover">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search the library"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search posts by title, theme, or accent"
              />
              <span className="smsearch__count">
                <strong>{filtered.length.toString().padStart(2, '0')}</strong>
                <span>/ {SOCIAL_POSTS.length.toString().padStart(2, '0')}</span>
              </span>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="smlist__empty">
            <h3 className="h3">No posts match that combination.</h3>
            <p>
              Try a different category or clear the search.{' '}
              <button
                type="button"
                className="smlist__reset"
                onClick={() => { setCategory('All'); setFormat('all'); setQuery(''); }}
              >
                Reset filters
              </button>
            </p>
          </div>
        ) : (
          <div className="smgrid" ref={gridRef}>
            {filtered.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>

      <SectionDivider tone="light" label="Made for sharing" align="center" />

      <section className="page-cta">
        <div className="page-cta__inner">
          <div>
            <h2 className="page-cta__title">
              Take it to the <em>feed.</em>
            </h2>
            <p className="page-cta__lede">
              Every creative is free to share. Open a post, capture the full view, and post it on your channels —
              the only ask is that you tag the campaign so we can amplify back.
            </p>
          </div>
          <Link href="/volunteer" className="page-cta__btn" data-cursor="hover">
            Volunteer with comms <ArrowIcon />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
