'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PageShell from '../../components/internal/PageShell';
import PageHero from '../../components/internal/PageHero';
import SectionDivider from '../../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../../lib/reveal';
import { EVENTS } from '../../lib/events-data';

function ArrowIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
    </svg>
  );
}

function RsvpForm({ event }) {
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(1);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="formpanel formpanel--ink" data-reveal>
        <div className="formpanel__success" role="status" aria-live="polite">
          <span className="formpanel__index">RSVP confirmed</span>
          <h4>You're on the list.</h4>
          <p>
            We'll send a confirmation and a parking note within an hour. Reply with any access needs and we'll arrange them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="formpanel formpanel--ink" onSubmit={submit} data-reveal>
      <div className="formpanel__head">
        <span className="formpanel__index">RSVP · {event.date}</span>
        <h3 className="formpanel__title">Reserve your seat.</h3>
        <p className="formpanel__lede">No tickets, no donation gate. Just lets the field team plan capacity.</p>
      </div>

      <div className="formpanel__grid">
        <div className="formpanel__field">
          <label htmlFor="rsvp-first">First name</label>
          <input id="rsvp-first" type="text" required autoComplete="given-name" placeholder="Jane" />
        </div>
        <div className="formpanel__field">
          <label htmlFor="rsvp-last">Last name</label>
          <input id="rsvp-last" type="text" required autoComplete="family-name" placeholder="Reyna" />
        </div>
        <div className="formpanel__field">
          <label htmlFor="rsvp-email">Email</label>
          <input id="rsvp-email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </div>
        <div className="formpanel__field">
          <label htmlFor="rsvp-phone">Phone <span style={{ color: 'var(--ink-50)', textTransform: 'none', letterSpacing: 0 }}>· optional</span></label>
          <input id="rsvp-phone" type="tel" autoComplete="tel" placeholder="(775) 555-0184" />
        </div>
        <div className="formpanel__field">
          <label htmlFor="rsvp-zip">ZIP code</label>
          <input id="rsvp-zip" type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} autoComplete="postal-code" placeholder="89501" />
        </div>
        <div className="formpanel__field">
          <label htmlFor="rsvp-count">Party size</label>
          <input
            id="rsvp-count"
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
          />
        </div>

        <div className="formpanel__field formpanel__field--full">
          <label htmlFor="rsvp-access">Access needs <span style={{ color: 'var(--ink-50)', textTransform: 'none', letterSpacing: 0 }}>· optional</span></label>
          <textarea id="rsvp-access" rows={3} placeholder="ASL, accessible seating, childcare, dietary, transportation…" />
        </div>

        <div className="formpanel__field--full">
          <button type="submit" className="formpanel__send" data-cursor="hover">
            <span>Confirm RSVP</span>
            <ArrowIcon size={14} />
          </button>
          <p className="formpanel__small" style={{ marginTop: 14 }}>
            Confirmation arrives by email. We never sell or share attendee lists.
          </p>
        </div>
      </div>
    </form>
  );
}

export default function EventDetailClient({ event }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      // Schedule rows draw in sequentially.
      const rows = section.querySelectorAll('.evdetail__schedule-row');
      if (rows.length) {
        gsap.set(rows, { opacity: 0, x: -16 });
        gsap.to(rows, {
          opacity: 1, x: 0,
          duration: DUR.short, stagger: 0.08, ease: EASE.fluent,
          scrollTrigger: { trigger: rows[0], start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      const blocks = section.querySelectorAll('.evdetail__block');
      blocks.forEach((b) => {
        gsap.from(b, {
          opacity: 0, y: 24,
          duration: DUR.short, ease: EASE.fluent,
          scrollTrigger: { trigger: b, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });

      const aside = section.querySelector('.evdetail__aside');
      if (aside) {
        gsap.from(aside, {
          opacity: 0, y: 24,
          duration: 0.8, ease: EASE.fluent,
          scrollTrigger: { trigger: aside, start: 'top 88%', toggleActions: 'play none none none' },
        });
      }

      const bringItems = section.querySelectorAll('.evdetail__bring li');
      if (bringItems.length) {
        gsap.set(bringItems, { opacity: 0, y: 18 });
        gsap.to(bringItems, {
          opacity: 1, y: 0,
          duration: DUR.short, stagger: 0.07, ease: EASE.fluent,
          scrollTrigger: { trigger: bringItems[0], start: 'top 88%', toggleActions: 'play none none none' },
        });
      }

      const media = section.querySelector('.evdetail__media');
      if (media) {
        gsap.fromTo(
          media,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.1, ease: EASE.fluent,
            scrollTrigger: { trigger: media, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [event.slug]);

  // Pick three related events (excluding current).
  const related = EVENTS.filter((e) => e.slug !== event.slug).slice(0, 3);

  return (
    <PageShell>
      <PageHero
        eyebrow={event.tag}
        title={event.title}
        caption={event.short}
        meta={[
          { label: 'Date',    value: event.date },
          { label: 'Time',    value: event.time },
          { label: 'Venue',   value: event.venue },
          { label: 'Location',value: event.locationShort },
        ]}
      />

      <SectionDivider tone="light" align="left" />

      <section className="evdetail" ref={sectionRef} aria-label={event.title}>
        <div className="evdetail__shell">
          <div className="evdetail__main">
            <div className="evdetail__media">
              <img src={event.image} alt="" />
            </div>

            <div className="evdetail__body">
              <div className="evdetail__block">
                <div className="eyebrow">About this event</div>
                <h2>What to expect.</h2>
                {event.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="evdetail__block">
                <div className="eyebrow">Schedule</div>
                <h2>Run of the day.</h2>
                <div className="evdetail__schedule">
                  {event.schedule.map((row, i) => (
                    <div key={i} className="evdetail__schedule-row">
                      <span className="evdetail__schedule-time">{row.time}</span>
                      <div className="evdetail__schedule-body">
                        <strong>{row.label}</strong>
                        <span>{row.body}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="evdetail__block">
                <div className="eyebrow">Come ready</div>
                <h2>What to bring.</h2>
                <ul className="evdetail__bring">
                  {event.bring.map((b, i) => (
                    <li key={i}>
                      <strong>{b.title}</strong>
                      <span>{b.body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="evdetail__aside">
            <div className="evdetail__info" data-reveal>
              <div className="evdetail__info-row">
                <span className="evdetail__info-label">When</span>
                <span className="evdetail__info-value">{event.date} · {event.time}</span>
              </div>
              <div className="evdetail__info-row">
                <span className="evdetail__info-label">Where</span>
                <span className="evdetail__info-value">{event.venue}</span>
                <span className="evdetail__info-value" style={{ color: 'var(--ink-50)', fontSize: 13, marginTop: 2 }}>{event.address}</span>
              </div>
              <div className="evdetail__info-row">
                <span className="evdetail__info-label">Hosted by</span>
                <span className="evdetail__info-value">{event.host}</span>
              </div>
              <div className="evdetail__info-row">
                <span className="evdetail__info-label">Capacity</span>
                <span className="evdetail__info-value">{event.capacity}</span>
              </div>
            </div>

            <RsvpForm event={event} />
          </aside>
        </div>
      </section>

      <SectionDivider tone="ink" label="Related stops" align="center" />

      <section className="evlist" aria-label="Related events">
        <div className="evlist__grid">
          {related.map((e) => {
            const [day, month] = (e.date || '').split(' ');
            const rhref = `/events/${e.slug}`;
            return (
              <article className="evcard" key={e.slug} data-cursor="hover">
                <div className="evcard__media">
                  <img src={e.image} alt="" loading="lazy" />
                  <div className="evcard__date">
                    <strong>{month}</strong>
                    <span>{day}</span>
                  </div>
                </div>
                <div className="evcard__body">
                  <span className="evcard__tag">{e.tag}</span>
                  <h3 className="evcard__title">{e.title}</h3>
                  <p className="evcard__loc">
                    <span>{e.venue} · {e.locationShort}</span>
                  </p>
                  <div className="evcard__foot">
                    <span className="evcard__time">{e.time}</span>
                    <span className="evcard__cta" aria-hidden="true">RSVP <ArrowIcon /></span>
                  </div>
                </div>
                <Link href={rhref} className="evcard__cover" aria-label={`${e.title} — view details and RSVP`} />
                <span className="evcard__edge" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta__inner">
          <h2 className="page-cta__title">Have a question first? <em>Ask before you RSVP.</em></h2>
          <Link href="/ask" className="page-cta__btn" data-cursor="hover">
            Submit a question <ArrowIcon />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
