'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

const STEPS = [
  {
    num: '01',
    title: 'You submit a question.',
    body: 'Public, anonymous, or private — your choice. Up to 600 characters, plus optional context.',
  },
  {
    num: '02',
    title: 'We answer within 7 days.',
    body: 'Alex, the policy director, or a regional lead drafts the answer. Every response is reviewed before it goes out.',
  },
  {
    num: '03',
    title: 'Public answers stay on file.',
    body: 'Public Q&As are searchable and never edited after publication. Corrections are appended below the original.',
  },
];

const FEATURED = [
  {
    num: '01',
    asker: 'Marisol L. · Sparks, NV',
    when: 'Apr 12 · 2026',
    q: 'How exactly will you bring down rent in northwest Reno?',
    a: 'Three-part: (1) co-sponsor the federal Stable Rent Act, (2) push HUD to expand the LIHTC ladder for tribal nations + small landlords, (3) match Nevada-side incentives only when paired with a 5-year affordability covenant. Full memo on the Issues page.',
  },
  {
    num: '02',
    asker: 'Anonymous · Las Vegas',
    when: 'Apr 9 · 2026',
    q: "What's your stance on Yucca Mountain after the 2025 DOE memo?",
    a: 'Opposed. The DOE memo did not address the underlying water-table risk a 2017 NWPO study flagged. I will vote against any reopening rider attached to appropriations.',
  },
  {
    num: '03',
    asker: 'James K. · Elko',
    when: 'Mar 28 · 2026',
    q: "What does 'no corporate PAC dollars' actually mean for your campaign?",
    a: 'It means we refuse contributions from corporate PACs, industry trade-association PACs, and bundled employee-PAC checks. Individual contributions are accepted up to FEC limits, and we publish every donor over $200 within 72 hours.',
  },
];

const TOPICS = [
  'Healthcare',
  'Housing',
  'Education',
  'Climate / Water',
  'Economy & Jobs',
  'Democracy & Ethics',
  'Public safety',
  'Other',
];

export default function AskClient() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState(null);
  const [visibility, setVisibility] = useState('public');

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const steps = section.querySelectorAll('.ask__step');
      gsap.set(steps, { opacity: 0, y: 32 });
      gsap.to(steps, {
        opacity: 1, y: 0,
        duration: DUR.short, stagger: 0.12, ease: EASE.fluent,
        scrollTrigger: { trigger: steps[0], start: 'top 82%', toggleActions: 'play none none none' },
      });

      const items = section.querySelectorAll('.qalist__item');
      items.forEach((it) => {
        gsap.from(it, {
          opacity: 0, y: 28,
          duration: DUR.short, ease: EASE.fluent,
          scrollTrigger: { trigger: it, start: 'top 86%', toggleActions: 'play none none none' },
        });
      });

      const form = section.querySelector('.ask__form .formpanel');
      if (form) {
        gsap.from(form, {
          opacity: 0, y: 32,
          duration: 0.9, ease: EASE.fluent,
          scrollTrigger: { trigger: form, start: 'top 82%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <PageShell>
      <PageHero
        eyebrow="Ask Alex"
        title="Every question gets answered."
        highlight="answered"
        caption="Public Q&A is the campaign's primary inbox. Submit a question — we respond on the record within seven days, with a corrections record if we get something wrong."
        meta={[
          { label: 'Average response',   value: '4.2 days' },
          { label: 'Public Q&As',         value: '372 answered' },
          { label: 'Open today',          value: '11 in queue' },
        ]}
      />

      <div ref={sectionRef}>
        <section className="ask" aria-label="Ask a question">
          <div className="stage__head">
            <div>
              <div className="eyebrow" data-reveal style={{ marginBottom: 28 }}>How it works</div>
              <h2 className="h1 stage__title stage__title--narrow" data-reveal>Three steps. No PR filter.</h2>
            </div>
            <p className="lede stage__lede" data-reveal>
              The campaign answers questions like courtroom testimony — on the record, with citations when relevant, and with a correction log when we get it wrong.
            </p>
          </div>

          <div className="ask__steps">
            {STEPS.map((s) => (
              <div className="ask__step" key={s.num}>
                <span className="ask__step-num">{s.num}</span>
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          <div className="stage__head">
            <div>
              <div className="eyebrow" data-reveal style={{ marginBottom: 28 }}>Recent answers</div>
              <h2 className="h1 stage__title stage__title--narrow" data-reveal>From this district, this month.</h2>
            </div>
            <a href="#ask-archive" className="evcard__cta" data-reveal>
              Browse the archive
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
              </svg>
            </a>
          </div>

          <div className="qalist" id="ask-archive">
            {FEATURED.map((f) => (
              <article className="qalist__item" key={f.num}>
                <span className="qalist__num">{f.num}</span>
                <div>
                  <h3 className="qalist__q">{f.q}</h3>
                  <p className="qalist__a">{f.a}</p>
                  <span className="qalist__meta">
                    <strong>{f.asker}</strong>
                    <span style={{ opacity: 0.5 }}>•</span>
                    {f.when}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="ask__form" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 'clamp(40px, 5vw, 80px)', alignItems: 'start' }}>
            <div>
              <div className="eyebrow" data-reveal style={{ marginBottom: 28 }}>Submit a question</div>
              <h2 className="h1 stage__title stage__title--narrow" data-reveal>Ask anything. We'll answer.</h2>
              <p className="lede stage__lede" data-reveal style={{ marginTop: 24 }}>
                Public questions go in the queue and are answered on the record. Anonymous questions still get answered — we just won't display your name. Private questions stay between you and the campaign.
              </p>

              <ul className="movement__bullets" style={{ marginTop: 36 }}>
                <li>We don't pre-filter by topic. Hard questions get the same response time as easy ones.</li>
                <li>If we don't have an answer yet, we'll say so and tell you when we will.</li>
                <li>Corrections to past answers stay appended forever — never edited away.</li>
              </ul>
            </div>

            {submitted ? (
              <div className="formpanel">
                <div className="formpanel__success" role="status" aria-live="polite">
                  <span className="formpanel__index">Question received</span>
                  <h4>It's in the queue.</h4>
                  <p>
                    You'll get a confirmation email within an hour with your tracking number. We respond within 7 days — usually faster.
                  </p>
                </div>
              </div>
            ) : (
              <form className="formpanel" onSubmit={submit}>
                <div className="formpanel__head">
                  <span className="formpanel__index">Ask a question</span>
                  <h3 className="formpanel__title">Tell us what you want answered.</h3>
                  <p className="formpanel__lede">600 characters. Optional context. We promise a real human reply.</p>
                </div>

                <div className="formpanel__grid">
                  <div className="formpanel__field">
                    <label htmlFor="ask-name">Your name <span style={{ color: 'var(--ink-50)', textTransform: 'none', letterSpacing: 0 }}>· optional</span></label>
                    <input id="ask-name" type="text" autoComplete="name" placeholder="Jane R." />
                  </div>
                  <div className="formpanel__field">
                    <label htmlFor="ask-email">Email</label>
                    <input id="ask-email" type="email" required autoComplete="email" placeholder="you@example.com" />
                  </div>
                  <div className="formpanel__field">
                    <label htmlFor="ask-city">City / Town</label>
                    <input id="ask-city" type="text" placeholder="Reno" />
                  </div>
                  <div className="formpanel__field">
                    <label htmlFor="ask-zip">ZIP code</label>
                    <input id="ask-zip" type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} placeholder="89501" />
                  </div>

                  <div className="formpanel__field formpanel__field--full">
                    <label>Topic</label>
                    <div className="formpanel__chips" role="radiogroup">
                      {TOPICS.map((t) => (
                        <button
                          type="button"
                          key={t}
                          role="radio"
                          aria-checked={topic === t}
                          className={`chip chip--ink${topic === t ? ' chip--active' : ''}`}
                          onClick={() => setTopic(t)}
                          data-cursor="hover"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="formpanel__field formpanel__field--full">
                    <label>Visibility</label>
                    <div className="formpanel__chips" role="radiogroup">
                      {[
                        { v: 'public',    l: 'Public — show my name' },
                        { v: 'anonymous', l: 'Public — anonymous' },
                        { v: 'private',   l: 'Private — campaign only' },
                      ].map((o) => (
                        <button
                          type="button"
                          key={o.v}
                          role="radio"
                          aria-checked={visibility === o.v}
                          className={`chip chip--ink${visibility === o.v ? ' chip--active' : ''}`}
                          onClick={() => setVisibility(o.v)}
                          data-cursor="hover"
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="formpanel__field formpanel__field--full">
                    <label htmlFor="ask-q">Your question</label>
                    <textarea id="ask-q" rows={4} required maxLength={600} placeholder="Type your question here. Up to 600 characters." />
                  </div>

                  <div className="formpanel__field formpanel__field--full">
                    <label htmlFor="ask-context">Context <span style={{ color: 'var(--ink-50)', textTransform: 'none', letterSpacing: 0 }}>· optional</span></label>
                    <textarea id="ask-context" rows={3} placeholder="Background, sources, or links you'd like us to consider." />
                  </div>

                  <div className="formpanel__field--full">
                    <button type="submit" className="formpanel__send" data-cursor="hover">
                      <span>Submit question</span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                      </svg>
                    </button>
                    <p className="formpanel__small" style={{ marginTop: 14 }}>
                      We confirm receipt by email within an hour. Public answers are posted within 7 days.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
