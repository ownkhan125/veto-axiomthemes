'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

const OFFICES = [
  {
    num: '01',
    label: 'Reno HQ',
    address: ['300 S. Virginia St.', 'Reno, NV 89501'],
    rows: [
      { k: 'Hours',  v: 'Mon–Fri · 9 AM – 6 PM' },
      { k: 'Phone',  v: '(775) 555-0184' },
      { k: 'Email',  v: 'reno@vetocampaign.org' },
    ],
  },
  {
    num: '02',
    label: 'Las Vegas Field',
    address: ['1701 Fremont St.', 'Las Vegas, NV 89101'],
    rows: [
      { k: 'Hours',  v: 'Tues–Sat · 11 AM – 7 PM' },
      { k: 'Phone',  v: '(702) 555-0103' },
      { k: 'Email',  v: 'lasvegas@vetocampaign.org' },
    ],
  },
  {
    num: '03',
    label: 'Rural Roadshow',
    address: ['Mobile field office', 'Reaches all 17 Nevada counties'],
    rows: [
      { k: 'Schedule',  v: 'Posted weekly on /events' },
      { k: 'Email',     v: 'roadshow@vetocampaign.org' },
    ],
  },
];

const CHANNELS = [
  {
    label: 'Press inquiries',
    value: 'press@vetocampaign.org',
    href: 'mailto:press@vetocampaign.org',
  },
  {
    label: 'Endorsement requests',
    value: 'endorse@vetocampaign.org',
    href: 'mailto:endorse@vetocampaign.org',
  },
  {
    label: 'Volunteer operations',
    value: 'volunteer@vetocampaign.org',
    href: 'mailto:volunteer@vetocampaign.org',
  },
  {
    label: 'General questions',
    value: 'hello@vetocampaign.org',
    href: 'mailto:hello@vetocampaign.org',
  },
];

const SUBJECTS = [
  'General question',
  'Press inquiry',
  'Volunteer offer',
  'Endorsement',
  'Speaking request',
  'Accessibility',
  'Other',
];

function ArrowSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export default function ContactClient() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState(null);

  // Pre-fill subject if `?topic=…` provided in URL.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get('topic');
    if (t === 'endorsement') setSubject('Endorsement');
    if (t === 'press')        setSubject('Press inquiry');
    if (t === 'volunteer')    setSubject('Volunteer offer');
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const offices = section.querySelectorAll('.contact__office');
      gsap.set(offices, { opacity: 0, x: -22 });
      gsap.to(offices, {
        opacity: 1, x: 0,
        duration: DUR.short, stagger: 0.1, ease: EASE.fluent,
        scrollTrigger: { trigger: offices[0], start: 'top 80%', toggleActions: 'play none none none' },
      });

      const channels = section.querySelectorAll('.contact__channel');
      gsap.set(channels, { opacity: 0, y: 14 });
      gsap.to(channels, {
        opacity: 1, y: 0,
        duration: 0.5, stagger: 0.06, ease: EASE.fluent,
        scrollTrigger: { trigger: channels[0], start: 'top 88%', toggleActions: 'play none none none' },
      });

      const form = section.querySelector('.contact__form .formpanel');
      if (form) {
        gsap.from(form, {
          opacity: 0, y: 28,
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
        eyebrow="Contact"
        title="Reach the campaign directly."
        highlight="directly"
        caption="Every message is routed by a human within one business day. Press, volunteers, endorsement councils, and the general public — same inbox, same standard."
        meta={[
          { label: 'Reply target', value: 'One business day' },
          { label: 'Press desk',   value: 'press@vetocampaign.org' },
          { label: 'Field offices',value: 'Reno · Las Vegas · Mobile' },
        ]}
      />

      <SectionDivider tone="light" align="left" />

      <section className="contact" ref={sectionRef} aria-label="Contact campaign">
        <div className="stage__head">
          <div>
            <div className="eyebrow" data-reveal style={{ marginBottom: 28 }}>Field offices</div>
            <h2 className="h1 stage__title stage__title--narrow" data-reveal>Where we work from.</h2>
          </div>
          <p className="lede stage__lede" data-reveal>
            Walk-in hours every weekday at the Reno HQ. Las Vegas runs a different schedule — call ahead. The roadshow lives wherever this week's town hall is.
          </p>
        </div>

        <div className="contact__grid contact__form" id="message">
          <div>
            <div className="contact__offices">
              {OFFICES.map((o) => (
                <div className="contact__office" key={o.label}>
                  <span className="contact__office-num">{o.num}</span>
                  <div>
                    <strong>{o.label}</strong>
                    <address>
                      {o.address.map((a, i) => (<span key={i}>{a}{i < o.address.length - 1 ? <br /> : null}</span>))}
                    </address>
                    <div className="contact__office-rows">
                      {o.rows.map((r, i) => (
                        <span key={i}><strong>{r.k}:</strong> {r.v}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact__channels" style={{ marginTop: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 18 }}>Direct channels</div>
              {CHANNELS.map((c) => (
                <a key={c.label} href={c.href} className="contact__channel" data-cursor="hover">
                  <span className="contact__channel-meta">
                    <span>{c.label}</span>
                    <strong>{c.value}</strong>
                  </span>
                  <ArrowSm />
                </a>
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="formpanel">
              <div className="formpanel__success" role="status" aria-live="polite">
                <span className="formpanel__index">Message received</span>
                <h4>Thanks — we'll be in touch.</h4>
                <p>
                  A confirmation email is on the way. The first reply from a real human lands in your inbox within one business day.
                </p>
              </div>
            </div>
          ) : (
            <form className="formpanel" onSubmit={submit}>
              <div className="formpanel__head">
                <span className="formpanel__index">Send a message</span>
                <h3 className="formpanel__title">Tell us what you need.</h3>
                <p className="formpanel__lede">Every form goes to a real person, not a triage bot. Reply target is one business day.</p>
              </div>

              <div className="formpanel__grid">
                <div className="formpanel__field">
                  <label htmlFor="ct-first">First name</label>
                  <input id="ct-first" type="text" required autoComplete="given-name" placeholder="Jane" />
                </div>
                <div className="formpanel__field">
                  <label htmlFor="ct-last">Last name</label>
                  <input id="ct-last" type="text" required autoComplete="family-name" placeholder="Reyna" />
                </div>
                <div className="formpanel__field">
                  <label htmlFor="ct-email">Email</label>
                  <input id="ct-email" type="email" required autoComplete="email" placeholder="you@example.com" />
                </div>
                <div className="formpanel__field">
                  <label htmlFor="ct-org">Organization <span style={{ color: 'var(--ink-50)', textTransform: 'none', letterSpacing: 0 }}>· optional</span></label>
                  <input id="ct-org" type="text" autoComplete="organization" placeholder="Reno Gazette" />
                </div>

                <div className="formpanel__field formpanel__field--full">
                  <label>Subject</label>
                  <div className="formpanel__chips" role="radiogroup" aria-label="Subject">
                    {SUBJECTS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        role="radio"
                        aria-checked={subject === s}
                        className={`chip chip--ink${subject === s ? ' chip--active' : ''}`}
                        onClick={() => setSubject(s)}
                        data-cursor="hover"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="formpanel__field formpanel__field--full">
                  <label htmlFor="ct-message">Message</label>
                  <textarea id="ct-message" rows={5} required placeholder="Tell us what you need. We respond by reply-email within one business day." />
                </div>

                <div className="formpanel__field--full">
                  <button type="submit" className="formpanel__send" data-cursor="hover">
                    <span>Send message</span>
                    <ArrowSm />
                  </button>
                  <p className="formpanel__small" style={{ marginTop: 14 }}>
                    Press deadlines: mark "Press inquiry" and we'll prioritize same-day. Otherwise we reply by next business day.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>

        <SectionDivider tone="light" label="Or jump straight to" align="center" />

        <div className="endorse-page__cta">
          <h3>Want to skip the form?</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/volunteer" data-cursor="hover">Volunteer <ArrowSm /></Link>
            <Link href="/ask" data-cursor="hover" style={{ background: 'transparent', color: 'var(--paper)' }}>Ask a question <ArrowSm /></Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
