'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { gsap } from 'gsap';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

// Live-feed roster — fictional but plausible supporter list cycled into the
// "across the district" feed on the right of the form. Keeps the section
// feeling alive without pulling real PII anywhere.
const SUPPORTERS = [
  { name: 'Maya Reyes',      city: 'Astoria, OR',       interest: 'Canvassing',     accent: '#FF5A1F' },
  { name: 'Daniel Kim',      city: 'Hillsboro, OR',     interest: 'Phone Banking',  accent: '#3C6EF0' },
  { name: 'Sara Thomas',     city: 'Portland, OR',      interest: 'Events',         accent: '#9067E6' },
  { name: 'Marcus Johnson',  city: 'Forest Grove, OR',  interest: 'Fundraising',    accent: '#E6A854' },
  { name: 'Linh Pham',       city: 'Tigard, OR',        interest: 'Social Media',   accent: '#3FA88A' },
  { name: 'Esme Vega',       city: 'Beaverton, OR',     interest: 'Canvassing',     accent: '#FF5A1F' },
  { name: 'Jordan Bell',     city: 'Salem, OR',         interest: 'Phone Banking',  accent: '#3C6EF0' },
  { name: 'Aisha Nakamura',  city: 'Eugene, OR',        interest: 'Events',         accent: '#9067E6' },
  { name: 'Owen Castillo',   city: 'Gresham, OR',       interest: 'Canvassing',     accent: '#E6A854' },
  { name: 'Priya Shah',      city: 'Lake Oswego, OR',   interest: 'Fundraising',    accent: '#3FA88A' },
];

const initialsOf = (name) =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const WAYS = [
  {
    icon: '🚪',
    title: 'Canvassing',
    body: 'Go door-to-door in your neighborhood to connect with voters and share our message.',
  },
  {
    icon: '📞',
    title: 'Phone Banking',
    body: 'Make calls from home to reach supporters and spread awareness across the district.',
  },
  {
    icon: '📣',
    title: 'Community Events',
    body: 'Join us at local events, rallies, and town halls to represent the campaign.',
  },
];

const INTERESTS = [
  'Canvassing',
  'Phone Banking',
  'Events',
  'Fundraising',
  'Social Media',
  'Other',
];

function WayCard({ way, i }) {
  const ref = useRef(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.5 });
  const rotateY = useTransform(sx, [-1, 1], [-4, 4]);
  const rotateX = useTransform(sy, [-1, 1], [3, -3]);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  return (
    <motion.div
      className="volunteer__way"
      ref={ref}
      data-vol-card
      data-vol-card-index={i}
      style={{ rotateX, rotateY }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="volunteer__way-icon" aria-hidden="true" data-vol-icon>{way.icon}</span>
      <span className="volunteer__way-edge" aria-hidden="true" />
      <h3 data-vol-card-title>{way.title}</h3>
      <p data-vol-card-body>{way.body}</p>
    </motion.div>
  );
}

export default function Volunteer() {
  const sectionRef = useRef(null);
  const [interests, setInterests] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (v) => {
    setInterests((prev) => {
      const s = new Set(prev);
      s.has(v) ? s.delete(v) : s.add(v);
      return s;
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const head = section.querySelector('.volunteer__head');
      const cards = section.querySelectorAll('[data-vol-card]');
      const cardEdges = section.querySelectorAll('.volunteer__way-edge');
      const cardIcons = section.querySelectorAll('[data-vol-icon]');
      const cardTitles = section.querySelectorAll('[data-vol-card-title]');
      const cardBodies = section.querySelectorAll('[data-vol-card-body]');
      const fields = section.querySelectorAll('.volunteer__form .volunteer__field');
      const chips = section.querySelectorAll('.volunteer__chips .chip');
      const sendBtn = section.querySelector('.volunteer__send');

      // Master timeline scrubbed by section entrance — feels assembled.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Fire-energy gradient scoped to .volunteer__bottom. Triggers off that
      //    container's viewport entry — *not* the parent section — so it lights
      //    up only when the form/feed row is actually on screen. One-shot via
      //    `toggleActions: 'play none none none'`.
      const bottom = section.querySelector('[data-vol-bottom]');
      const bg = section.querySelector('[data-vol-bg]');
      if (bottom && bg) {
        // Pre-arm the initial state immediately so the wipe is always
        // observable on entry — no inheriting whatever GSAP last left behind.
        gsap.set(bg, {
          clipPath: 'inset(0 100% 0 0)',
          WebkitClipPath: 'inset(0 100% 0 0)',
        });
        gsap.fromTo(
          bg,
          {
            clipPath: 'inset(0 100% 0 0)',
            WebkitClipPath: 'inset(0 100% 0 0)',
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            WebkitClipPath: 'inset(0 0% 0 0)',
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bottom,
              start: 'top 88%',
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 1) header copy fades + lifts
      if (head) {
        tl.fromTo(
          head.querySelectorAll('[data-reveal], .lede'),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: DUR.short, stagger: 0.12, ease: EASE.fluent },
          0
        );
      }

      // 2) cards land in sequence, edges draw across the bottom of each card
      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: DUR.short, stagger: 0.14, ease: EASE.fluent },
          '-=0.35'
        );
        tl.fromTo(
          cardIcons,
          { scale: 0.6, rotate: -10, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: DUR.short, stagger: 0.14, ease: 'back.out(1.6)' },
          '-=0.55'
        );
        tl.fromTo(
          cardTitles,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: DUR.micro, stagger: 0.14, ease: EASE.fluent },
          '-=0.45'
        );
        tl.fromTo(
          cardBodies,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: DUR.micro, stagger: 0.14, ease: EASE.fluent },
          '-=0.35'
        );
        tl.fromTo(
          cardEdges,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, stagger: 0.14, ease: EASE.fluent, transformOrigin: 'left center' },
          '-=0.5'
        );
      }

      // ---- Bottom-row staged volunteer-form entrance ----
      //   Stage 1 — frame edges trace clockwise around the form
      //   Stage 2 — fields fade up + live feed glides in (parallel)
      //   Stage 3 — chips pop, submit lifts with a soft activation pulse
      const live = section.querySelector('.volunteer__live');
      const formEl = section.querySelector('.volunteer__form');
      const formEdges = section.querySelectorAll('[data-vol-form-edge]');
      if (bottom && (fields.length || chips.length || sendBtn || live)) {
        // Pre-arm so there's no flash before the bottom-row trigger fires.
        if (fields.length) gsap.set(fields, { opacity: 0, y: 18 });
        if (chips.length)  gsap.set(chips,  { opacity: 0, y: 8, scale: 0.92 });
        if (sendBtn)       gsap.set(sendBtn, { opacity: 0, y: 14, scale: 0.94 });
        if (live)          gsap.set(live,    { opacity: 0, y: 24, scale: 0.98 });

        const btl = gsap.timeline({
          scrollTrigger: {
            trigger: bottom,
            start: 'top 88%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });

        // Stage 1 — frame draws clockwise (top, right, bottom, left)
        if (formEdges.length === 4) {
          btl.to(formEdges[0], { scaleX: 1, duration: 0.5, ease: 'power3.out' }, 0)
             .to(formEdges[1], { scaleY: 1, duration: 0.5, ease: 'power3.out' }, 0.16)
             .to(formEdges[2], { scaleX: 1, duration: 0.5, ease: 'power3.out' }, 0.32)
             .to(formEdges[3], { scaleY: 1, duration: 0.5, ease: 'power3.out' }, 0.48);
        }

        // Stage 2 — fields rise; live feed enters in parallel
        if (fields.length) {
          btl.to(fields, {
            opacity: 1, y: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: 'power3.out',
            onStart: () => {
              fields.forEach((f, i) => {
                setTimeout(() => f.setAttribute('data-traced', 'true'), i * 40);
              });
            },
          }, 0.85);
        }
        if (live) {
          btl.to(live, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.65,
            ease: 'power3.out',
          }, 0.85);
        }

        // Stage 3 — chips pop, submit lifts with activation pulse
        if (chips.length) {
          btl.to(chips, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.35,
            stagger: 0.025,
            ease: 'back.out(1.5)',
          }, '>-0.05');
        }
        if (sendBtn) {
          btl.to(sendBtn, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.45,
            ease: 'back.out(1.6)',
          }, '<0.05');
          btl.fromTo(sendBtn,
            { boxShadow: '0 0 0 0 rgba(255,90,31,0)' },
            { boxShadow: '0 0 0 14px rgba(255,90,31,0)', duration: 0.85, ease: 'power2.out' },
            '<0.1'
          );
        }
      }
    }, section);

    return () => ctx.revert();
  }, [submitted]);

  return (
    <section id="volunteer" className="volunteer" ref={sectionRef}>
      <div className="volunteer__head">
        <div>
          <div className="eyebrow" data-reveal style={{ color: 'var(--ink-40)', marginBottom: 28 }}>
            Get involved
          </div>
          <h2 className="h1" data-reveal>Join the Movement</h2>
        </div>
        <p className="lede" data-reveal>
          Your time and energy can make a real difference. Sign up to volunteer and help us build a better future.
        </p>
      </div>

      <div className="volunteer__ways">
        {WAYS.map((w, i) => (<WayCard way={w} i={i} key={w.title} />))}
      </div>

      <div className="volunteer__bottom" data-vol-bottom>
      <div className="volunteer__bg" data-vol-bg aria-hidden="true">
        <img
          src="/asset/images/volunteer-gradient.webp"
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
      <div className="volunteer__form-wrap">
        {submitted ? (
          <div className="volunteer__success" role="status" aria-live="polite">
            <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 24 }}>You're in</div>
            <h3 className="h2">Thanks for stepping up.</h3>
            <p>
              We'll reach out within 48 hours to plug you into the right team. Welcome to the movement.
            </p>
          </div>
        ) : (
          <form className="volunteer__form" onSubmit={submit} noValidate={false}>
            <span className="volunteer__form-frame" aria-hidden="true">
              <span className="volunteer__form-frame-edge volunteer__form-frame-edge--t" data-vol-form-edge />
              <span className="volunteer__form-frame-edge volunteer__form-frame-edge--r" data-vol-form-edge />
              <span className="volunteer__form-frame-edge volunteer__form-frame-edge--b" data-vol-form-edge />
              <span className="volunteer__form-frame-edge volunteer__form-frame-edge--l" data-vol-form-edge />
            </span>
            <div className="volunteer__field">
              <label htmlFor="vol-first">First name</label>
              <input id="vol-first" type="text" placeholder="Jane" required autoComplete="given-name" />
            </div>
            <div className="volunteer__field">
              <label htmlFor="vol-last">Last name</label>
              <input id="vol-last" type="text" placeholder="Reyna" required autoComplete="family-name" />
            </div>
            <div className="volunteer__field">
              <label htmlFor="vol-email">Email</label>
              <input id="vol-email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="volunteer__field">
              <label htmlFor="vol-phone">Phone</label>
              <input id="vol-phone" type="tel" placeholder="(775) 555-0184" autoComplete="tel" />
            </div>
            <div className="volunteer__field">
              <label htmlFor="vol-zip">ZIP code</label>
              <input
                id="vol-zip"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                placeholder="89501"
                autoComplete="postal-code"
              />
            </div>

            <div className="volunteer__field volunteer__field--full">
              <label>Areas of interest</label>
              <div className="volunteer__chips" role="group" aria-label="Areas of interest">
                {INTERESTS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`chip${interests.has(s) ? ' chip--active' : ''}`}
                    onClick={() => toggleInterest(s)}
                    data-cursor="hover"
                    aria-pressed={interests.has(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="volunteer__field volunteer__field--full">
              <label htmlFor="vol-msg">Message <span className="volunteer__opt">— optional</span></label>
              <textarea
                id="vol-msg"
                rows={4}
                placeholder="Skills, availability, anything you want us to know."
              />
            </div>

            <div className="volunteer__field--full">
              <button type="submit" className="volunteer__send" data-cursor="hover">
                <span>Join Movement</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
      <LiveFeed />
      </div>
    </section>
  );
}

// ---- Live supporter feed (right column of the form row) -------------------
// Premium animated panel: pulsing radar background, ticking counter, and a
// rolling list of supporters joining. AnimatePresence handles the per-row
// flip-in / flip-out so insertions feel mechanical-precise, not janky.
function LiveFeed() {
  const VISIBLE = 4;
  const ROTATE_MS = 3500;
  const TICK_MS   = 5500;

  const counterRef = useRef(null);
  const sectionRef = useRef(null);
  const [cursor, setCursor] = useState(0);
  const [count,  setCount]  = useState(12847);

  // Visible window over the supporter list; entry id ensures stable keys
  // for AnimatePresence even after the cursor wraps past the array length.
  const visible = useMemo(() => {
    const out = [];
    for (let i = 0; i < VISIBLE; i++) {
      const idx = (cursor + i) % SUPPORTERS.length;
      const s = SUPPORTERS[idx];
      out.push({ ...s, id: `${cursor + i}-${s.name}` });
    }
    return out;
  }, [cursor]);

  // Pause the rotators while the section isn't visible — saves cycles and
  // means the user always lands on the "first" entry when they arrive.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (isReducedMotion()) return;

    let rotateId, tickId, observed = false;
    const start = () => {
      if (observed) return;
      observed = true;
      rotateId = setInterval(() => setCursor((c) => c + 1), ROTATE_MS);
      tickId   = setInterval(() => setCount((n) => n + 1 + Math.floor(Math.random() * 3)), TICK_MS);
    };
    const stop = () => {
      observed = false;
      clearInterval(rotateId);
      clearInterval(tickId);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? start() : stop()));
    }, { threshold: 0.15 });
    io.observe(el);
    return () => { io.disconnect(); stop(); };
  }, []);

  // Counter tween — animates between integer values with `ensureGsap`.
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    if (isReducedMotion()) { el.textContent = count.toLocaleString(); return; }
    ensureGsap();
    const obj = { v: parseInt(el.textContent.replace(/,/g, ''), 10) || count };
    gsap.to(obj, {
      v: count,
      duration: 1.2,
      ease: EASE.fluent,
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString(); },
    });
  }, [count]);

  return (
    <aside className="volunteer__visual" ref={sectionRef} aria-hidden="true">
      <div className="volunteer__live">
        <div className="volunteer__live-rings" aria-hidden="true">
          <span /><span /><span />
        </div>

        <header className="volunteer__live-head">
          <span className="volunteer__live-dot" />
          <span className="volunteer__live-headtxt">Live · Across the district</span>
        </header>

        <div className="volunteer__live-counter">
          <strong ref={counterRef}>{count.toLocaleString()}</strong>
          <span>supporters joining the movement</span>
        </div>

        <ul className="volunteer__live-feed">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((s) => (
              <motion.li
                key={s.id}
                className="volunteer__live-item"
                layout
                initial={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0,   filter: 'blur(0px)' }}
                exit={{    opacity: 0, y: 14,  filter: 'blur(4px)' }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <span className="volunteer__live-avatar" style={{ background: s.accent }}>
                  {initialsOf(s.name)}
                </span>
                <div className="volunteer__live-meta">
                  <strong>{s.name}</strong>
                  <small>{s.city} · {s.interest}</small>
                </div>
                <span className="volunteer__live-time">just now</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <footer className="volunteer__live-foot">
          <span className="volunteer__live-pulse" aria-hidden="true" />
          Updated continuously
        </footer>
      </div>
    </aside>
  );
}
