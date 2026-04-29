'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

const TIERS = [
  { amount: 25, impact: '1 day of doors knocked in a swing precinct.' },
  { amount: 50, impact: '100 voter contacts made by trained volunteers.' },
  { amount: 100, impact: 'Sustains a field office for a full day.' },
  { amount: 250, impact: 'Funds a weekend canvass across a county.' },
];

const CARDS = [
  {
    index: '01',
    label: 'Give',
    title: 'Chip in once or monthly.',
    body: 'Every dollar goes to organizers, not consultants. Recurring gifts let us hire field staff a month sooner.',
    cta: 'Donate now',
    href: '#donate-form',
  },
  {
    index: '02',
    label: 'Show up',
    title: 'Volunteer in your neighborhood.',
    body: 'Doors, phones, events, translation. Pick a lane — a regional lead reaches you within 48 hours.',
    cta: 'Join a team',
    href: '#volunteer',
  },
  {
    index: '03',
    label: 'Amplify',
    title: 'Spread the word.',
    body: 'Forward a town hall, share a clip, write a letter to your local paper. Reach beats followers.',
    cta: 'Get the kit',
    href: '#donate-form',
  },
];

const STATS = [
  { value: '12,400+', label: 'individual donors' },
  { value: '$1.2M', label: 'raised, no PACs' },
  { value: '87', label: 'cities organizing' },
  { value: '0', label: 'corporate dollars' },
];

export default function GetInvolved() {
  const sectionRef = useRef(null);
  const totalValueRef = useRef(null);
  const [cadence, setCadence] = useState('monthly');
  const [tier, setTier] = useState(50);
  const [custom, setCustom] = useState('');

  // Section spotlight (pre-existing).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (isReducedMotion()) return;

    const xTo = gsap.quickTo(el, '--mx', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, '--my', { duration: 0.5, ease: 'power3.out' });

    const cards = el.querySelectorAll('[data-spotlight]');
    const cardSetters = Array.from(cards).map((c) => ({
      el: c,
      xTo: gsap.quickTo(c, '--cx', { duration: 0.35, ease: 'power3.out' }),
      yTo: gsap.quickTo(c, '--cy', { duration: 0.35, ease: 'power3.out' }),
    }));

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      cardSetters.forEach(({ el: c, xTo: cx, yTo: cy }) => {
        const cr = c.getBoundingClientRect();
        cx(e.clientX - cr.left);
        cy(e.clientY - cr.top);
      });
    };
    const onEnter = () => el.classList.add('is-lit');
    const onLeave = () => el.classList.remove('is-lit');

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Progressive section build: head → form → cards → pledge → stats.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const head = el.querySelectorAll('.donate__head [data-reveal], .donate__head .lede');
      const formHead = el.querySelector('.donate__form-head');
      const cadenceTabs = el.querySelectorAll('.donate__cadence-btn');
      const tierBtns = el.querySelectorAll('.donate__tier');
      const total = el.querySelector('.donate__total');
      const sendBtn = el.querySelector('.donate__send');
      const cards = el.querySelectorAll('.donate__card');
      const pledge = el.querySelector('.donate__pledge');
      const stats = el.querySelectorAll('.donate__stat');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        head,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: DUR.short, stagger: 0.1, ease: EASE.fluent },
        0
      );
      if (formHead) {
        tl.fromTo(
          formHead.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: DUR.short, stagger: 0.08, ease: EASE.fluent },
          0.15
        );
      }
      tl.fromTo(
        cadenceTabs,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: DUR.micro, stagger: 0.06, ease: EASE.fluent },
        0.3
      );
      tl.fromTo(
        tierBtns,
        { opacity: 0, y: 18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: DUR.short, stagger: 0.06, ease: 'back.out(1.3)' },
        0.4
      );
      if (total) {
        tl.fromTo(total, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.short, ease: EASE.fluent }, 0.6);
      }
      if (sendBtn) {
        tl.fromTo(sendBtn, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.short, ease: EASE.fluent }, 0.7);
      }
      tl.fromTo(
        cards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: DUR.short, stagger: 0.12, ease: EASE.fluent },
        0.45
      );
      if (pledge) {
        tl.fromTo(pledge, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: DUR.short, ease: EASE.fluent }, 0.7);
      }
      tl.fromTo(
        stats,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: DUR.short, stagger: 0.08, ease: EASE.fluent },
        0.85
      );
    }, el);

    return () => ctx.revert();
  }, []);

  // Tween the total amount when cadence/tier changes — feels alive instead of an instant swap.
  const finalAmount = tier === 'other' ? Number(custom) || 0 : tier;
  const annual = cadence === 'monthly' ? finalAmount * 12 : finalAmount;
  const prevAnnualRef = useRef(annual);

  useEffect(() => {
    const node = totalValueRef.current;
    if (!node) return;
    const from = prevAnnualRef.current;
    const to = annual;
    prevAnnualRef.current = to;
    if (isReducedMotion() || from === to) {
      node.textContent = `$${to.toLocaleString()}`;
      return;
    }
    const obj = { v: from };
    const tween = gsap.to(obj, {
      v: to,
      duration: 0.6,
      ease: EASE.fluent,
      onUpdate: () => {
        node.textContent = `$${Math.round(obj.v).toLocaleString()}`;
      },
    });
    return () => tween.kill();
  }, [annual]);

  const submit = (e) => {
    e.preventDefault();
    alert(`Thanks. Routing $${finalAmount} ${cadence === 'monthly' ? 'monthly' : 'one-time'} contribution.`);
  };

  return (
    <section id="involved" className="donate" ref={sectionRef} aria-label="Donate and engage">
      <div className="donate__spotlight" aria-hidden="true" />

      <div className="donate__head">
        <div>
          <div className="eyebrow donate__eyebrow" data-reveal style={{ marginBottom: 28 }}>
            Power the campaign
          </div>
          <h2 className="h1" data-reveal>Movements run on people, not PACs.</h2>
        </div>
        <p className="lede donate__lede" data-reveal>
          Every dollar here funds organizers, doors, and field offices — never consultants or ad buyers
          chasing impressions. Pick a tier. Pick a lane. Show up.
        </p>
      </div>

      <div className="donate__grid">
        <form
          id="donate-form"
          className="donate__form"
          data-spotlight
          onSubmit={submit}
        >
          <div className="donate__form-head">
            <span className="donate__index">01 / Give</span>
            <h3 className="donate__form-title">Fund the fight.</h3>
          </div>

          <div className="donate__cadence" role="tablist" aria-label="Donation cadence">
            {['monthly', 'one-time'].map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cadence === c}
                className={`donate__cadence-btn${cadence === c ? ' is-active' : ''}`}
                onClick={() => setCadence(c)}
                data-cursor="hover"
              >
                {c === 'monthly' ? 'Monthly' : 'One-time'}
              </button>
            ))}
          </div>

          <div className="donate__tiers" role="radiogroup" aria-label="Donation amount">
            {TIERS.map((t) => (
              <button
                key={t.amount}
                type="button"
                role="radio"
                aria-checked={tier === t.amount}
                className={`donate__tier${tier === t.amount ? ' is-active' : ''}`}
                onClick={() => { setTier(t.amount); setCustom(''); }}
                data-cursor="hover"
              >
                <span className="donate__tier-amount">${t.amount}</span>
                <span className="donate__tier-impact">{t.impact}</span>
              </button>
            ))}
            <label className={`donate__tier donate__tier--other${tier === 'other' ? ' is-active' : ''}`} data-cursor="hover">
              <span className="donate__tier-amount">
                $
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  placeholder="Other"
                  value={custom}
                  onFocus={() => setTier('other')}
                  onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
                  aria-label="Custom amount"
                />
              </span>
              <span className="donate__tier-impact">Custom amount — every bit matters.</span>
            </label>
          </div>

          <div className="donate__total" aria-live="polite">
            <span className="donate__total-label">{cadence === 'monthly' ? 'Per year' : 'Today'}</span>
            <span className="donate__total-value">
              <span ref={totalValueRef}>${annual.toLocaleString()}</span>
              {cadence === 'monthly' && finalAmount > 0 && (
                <em> · ${finalAmount}/mo</em>
              )}
            </span>
          </div>

          <button type="submit" className="donate__send" data-cursor="hover">
            <span>Donate {cadence === 'monthly' ? 'monthly' : 'now'}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </button>

          <p className="donate__small">
            Federal contribution limits apply. We do not accept corporate or PAC money.
          </p>
        </form>

        <div className="donate__cards">
          {CARDS.slice(1).map((c) => (
            <a
              key={c.index}
              href={c.href}
              className="donate__card"
              data-spotlight
              data-cursor="hover"
            >
              <div className="donate__card-head">
                <span className="donate__index">{c.index} / {c.label}</span>
                <svg className="donate__card-arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                </svg>
              </div>
              <h3 className="donate__card-title">{c.title}</h3>
              <p className="donate__card-body">{c.body}</p>
              <span className="donate__card-cta">{c.cta}</span>
            </a>
          ))}

          <div className="donate__pledge" data-spotlight>
            <span className="donate__pledge-mark" aria-hidden="true">§</span>
            <div>
              <h4 className="donate__pledge-title">Transparency, by default.</h4>
              <p className="donate__pledge-body">
                We publish every receipt over $200 and post quarterly ledgers. No dark money. No
                PAC envelopes. Read the books anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="donate__stats">
        {STATS.map((s) => (
          <div key={s.label} className="donate__stat">
            <div className="donate__stat-value">{s.value}</div>
            <div className="donate__stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
