'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PageShell from '../../components/internal/PageShell';
import SectionDivider from '../../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../../lib/reveal';
import { SOCIAL_POSTS } from '../../lib/social-posts-data';
import PostFrame from '../PostFrame';

function ArrowIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function FullViewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 6V2H6M14 6V2H10M2 10V14H6M14 10V14H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function FullViewOverlay({ post, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.classList.add('is-full-view');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-full-view');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="smfull"
      role="dialog"
      aria-modal="true"
      aria-label={`${post.title} — full view`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="smfull__chrome">
        <span className="smfull__label">
          <span className="smfull__dot" aria-hidden="true" />
          Full view · {post.format === 'story' ? '1080 × 1920' : '1080 × 1080'}
        </span>
        <button
          type="button"
          className="smfull__close"
          onClick={onClose}
          aria-label="Close full view"
          data-cursor="hover"
        >
          <span /><span />
        </button>
      </div>

      <div className="smfull__stage">
        <div
          className="smfull__holder"
          style={{
            aspectRatio: post.aspect,
            '--post-aspect': post.aspect,
          }}
        >
          <PostFrame post={post} eager />
        </div>
      </div>

      <p className="smfull__hint">Press Esc to exit · Click the dark area to close</p>
    </div>
  );
}

export default function SocialPostDetailClient({ post, prev, next }) {
  const stageRef = useRef(null);
  const [fullView, setFullView] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll('[data-reveal]');
      gsap.set(targets, { opacity: 0, y: 24 });
      gsap.to(targets, {
        opacity: 1, y: 0,
        duration: DUR.short, stagger: 0.08, ease: EASE.fluent, delay: 0.1,
      });
    }, el);

    return () => ctx.revert();
  }, [post.slug]);

  // ←/→ keys traverse the library while no overlay is open.
  useEffect(() => {
    if (fullView) return;
    const onKey = (e) => {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft' && prev)  window.location.href = `/social-media-posts/${prev.slug}`;
      if (e.key === 'ArrowRight' && next) window.location.href = `/social-media-posts/${next.slug}`;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, fullView]);

  return (
    <PageShell>
      <article className="smdetail" ref={stageRef}>
        <div className="smdetail__crumbs" data-reveal>
          <Link href="/social-media-posts" className="smdetail__back" data-cursor="hover">
            <ChevronLeft />
            <span>Library</span>
          </Link>
          <span className="smdetail__num">
            {String(post.index).padStart(2, '0')} / {String(SOCIAL_POSTS.length).padStart(2, '0')}
          </span>
        </div>

        <div className="smdetail__layout">
          <div className="smdetail__stage">
            <div
              className="smdetail__holder"
              style={{ aspectRatio: post.aspect }}
            >
              <PostFrame post={post} eager />
              <span className="smdetail__edge" aria-hidden="true" />
            </div>
            <div className="smdetail__stage-foot">
              <span className="smdetail__format">
                {post.format === 'story' ? '9 : 16 · 1080 × 1920 · Story' : '1 : 1 · 1080 × 1080 · Feed'}
              </span>
              <button
                type="button"
                className="smdetail__fullbtn"
                onClick={() => setFullView(true)}
                data-cursor="hover"
              >
                <FullViewIcon />
                <span>Open full view</span>
              </button>
            </div>
          </div>

          <aside className="smdetail__side">
            <span className="smdetail__eyebrow" data-reveal>
              <span className="smdetail__eyebrow-dot" aria-hidden="true" />
              {post.category}
            </span>
            <h1 className="smdetail__title" data-reveal>
              {post.title}
            </h1>
            <p className="smdetail__lede" data-reveal>{post.summary}</p>

            <dl className="smdetail__specs" data-reveal>
              <div>
                <dt>Format</dt>
                <dd>{post.format === 'story' ? 'Story · 9 : 16' : 'Feed post · 1 : 1'}</dd>
              </div>
              <div>
                <dt>Resolution</dt>
                <dd>{post.width} × {post.height}</dd>
              </div>
              <div>
                <dt>Palette</dt>
                <dd>{post.palette}</dd>
              </div>
              <div>
                <dt>Accent</dt>
                <dd>{post.accent}</dd>
              </div>
            </dl>

            <div className="smdetail__actions" data-reveal>
              <button
                type="button"
                className="smdetail__primary"
                onClick={() => setFullView(true)}
                data-cursor="hover"
              >
                <span>View full creative</span>
                <ArrowIcon />
              </button>
              <a
                href={post.file}
                target="_blank"
                rel="noopener noreferrer"
                className="smdetail__ghost"
                data-cursor="hover"
              >
                <span>Open standalone HTML</span>
                <ArrowIcon />
              </a>
            </div>

            <p className="smdetail__hint" data-reveal>
              Use ← / → to walk the library. Press <kbd>F</kbd> on the full view to enter, <kbd>Esc</kbd> to exit.
            </p>
          </aside>
        </div>
      </article>

      <SectionDivider tone="light" align="center" />

      <nav className="smnav" aria-label="Adjacent posts">
        {prev ? (
          <Link href={`/social-media-posts/${prev.slug}`} className="smnav__cell smnav__cell--prev" data-cursor="hover">
            <span className="smnav__dir"><ChevronLeft />Previous</span>
            <span className="smnav__title">{prev.title}</span>
            <span className="smnav__cat">{prev.category} · {prev.format === 'story' ? 'Story' : 'Feed'}</span>
          </Link>
        ) : <span className="smnav__cell smnav__cell--empty" aria-hidden="true" />}

        <Link href="/social-media-posts" className="smnav__center" data-cursor="hover">
          <span className="smnav__grid" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span /><span />
          </span>
          <span>Back to library</span>
        </Link>

        {next ? (
          <Link href={`/social-media-posts/${next.slug}`} className="smnav__cell smnav__cell--next" data-cursor="hover">
            <span className="smnav__dir">Next<ChevronRight /></span>
            <span className="smnav__title">{next.title}</span>
            <span className="smnav__cat">{next.category} · {next.format === 'story' ? 'Story' : 'Feed'}</span>
          </Link>
        ) : <span className="smnav__cell smnav__cell--empty" aria-hidden="true" />}
      </nav>

      {fullView && (
        <FullViewOverlay post={post} onClose={() => setFullView(false)} />
      )}
    </PageShell>
  );
}
