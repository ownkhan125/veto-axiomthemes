'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PageShell from '../components/internal/PageShell';
import PageHero from '../components/internal/PageHero';
import SectionDivider from '../components/internal/SectionDivider';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

const WAYS = [
  {
    label: 'Doors',
    title: 'Canvass your neighborhood',
    body: 'Two-hour walk shifts, paired with a veteran canvasser. We bring the clipboards, scripts, and walk lists. You bring the legs and the curiosity.',
  },
  {
    label: 'Phones',
    title: 'Phone bank from anywhere',
    body: 'Evenings, lunch breaks, a Saturday morning — even one shift fills 80–120 voter contacts. Call from home with a script and an autodialer.',
  },
  {
    label: 'Events',
    title: 'Help host town halls',
    body: 'Greeters, set-up, ASL coordination, childcare, parking. Town halls run because volunteers run them — not consultants.',
  },
];

const INTERESTS = [
  'Canvassing',
  'Phone banking',
  'Events',
  'Translation',
  'Childcare',
  'Driving / rides',
  'Data entry',
  'Social media',
];

const HOURS = ['Weekday mornings', 'Weekday evenings', 'Saturdays', 'Sundays'];

function Field({ id, label, type = 'text', required, autoComplete, placeholder, fullWidth, ...rest }) {
  return (
    <div className={`formpanel__field${fullWidth ? ' formpanel__field--full' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} {...rest} />
    </div>
  );
}

export default function VolunteerClient() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [interests, setInterests] = useState(new Set());
  const [hours, setHours] = useState(new Set());
  const [count, setCount] = useState(12847);

  const toggleSet = (set, setter) => (v) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  };

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Live counter — gentle drift while the page is open.
  useEffect(() => {
    if (isReducedMotion()) return;
    const id = setInterval(() => {
      setCount((n) => n + 1 + Math.floor(Math.random() * 3));
    }, 5500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const cols = section.querySelectorAll('.movement__col');
      gsap.set(cols, { opacity: 0, y: 36 });
      gsap.to(cols, {
        opacity: 1, y: 0,
        duration: DUR.short, stagger: 0.12, ease: EASE.fluent,
        scrollTrigger: { trigger: cols[0], start: 'top 80%', toggleActions: 'play none none none' },
      });

      const formSide = section.querySelector('.movement__form-side');
      if (formSide) {
        gsap.from(formSide, {
          opacity: 0, x: -24,
          duration: 0.9, ease: EASE.fluent,
          scrollTrigger: { trigger: formSide, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }

      // ============================================================
      // STAGED VOLUNTEER FORM ENTRANCE
      //   Stage 1 — frame edges trace clockwise (form chrome materializes)
      //   Stage 2 — head + labels + inputs fade up with stagger
      //   Stage 3 — chips, helper, submit pop; submit pulses
      // ============================================================
      const form = section.querySelector('.movement__form-wrap .formpanel');
      if (form) {
        const edges = form.querySelectorAll('[data-frame-edge]');
        const head = form.querySelector('.formpanel__head');
        const headChildren = head ? head.querySelectorAll(':scope > *') : [];
        const fields = form.querySelectorAll('.formpanel__field');
        const chips = form.querySelectorAll('.formpanel__chips .chip');
        const submit = form.querySelector('.formpanel__send');
        const helper = form.querySelector('.formpanel__small');

        // Pre-arm: hide chrome and content; preserve form's background so
        // backdrop-filter has something to operate on but tone the surface
        // down so it materializes during stage 1.
        gsap.set(form, { borderColor: 'transparent' });
        if (headChildren.length) gsap.set(headChildren, { opacity: 0, y: 14 });
        if (fields.length) gsap.set(fields, { opacity: 0, y: 18 });
        if (chips.length) gsap.set(chips, { opacity: 0, y: 8, scale: 0.9 });
        if (submit) gsap.set(submit, { opacity: 0, y: 14, scale: 0.94 });
        if (helper) gsap.set(helper, { opacity: 0, y: 8 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: form,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Stage 1 — frame draws clockwise (top, right, bottom, left)
        if (edges.length === 4) {
          tl.to(edges[0], { scaleX: 1, duration: 0.55, ease: 'power3.out' }, 0)
            .to(edges[1], { scaleY: 1, duration: 0.55, ease: 'power3.out' }, 0.18)
            .to(edges[2], { scaleX: 1, duration: 0.55, ease: 'power3.out' }, 0.36)
            .to(edges[3], { scaleY: 1, duration: 0.55, ease: 'power3.out' }, 0.54);
        }
        // Form natural border re-appears as edges complete
        tl.to(form, {
          borderColor: 'rgba(255,255,255,.10)',
          duration: 0.45,
          ease: 'power2.out',
        }, 0.85);

        // Stage 2 — content powers on
        if (headChildren.length) {
          tl.to(headChildren, {
            opacity: 1, y: 0,
            duration: 0.55, stagger: 0.08, ease: 'power3.out',
          }, 1.05);
        }
        if (fields.length) {
          tl.to(fields, {
            opacity: 1, y: 0,
            duration: 0.5, stagger: 0.045, ease: 'power3.out',
            onStart: () => {
              // Mark each field as traced so its accent underline draws via CSS.
              fields.forEach((f, i) => {
                setTimeout(() => f.setAttribute('data-traced', 'true'), i * 45);
              });
            },
          }, 1.22);
        }

        // Stage 3 — interactive elements activate
        if (chips.length) {
          tl.to(chips, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.4, stagger: 0.025, ease: 'back.out(1.5)',
          }, '>-0.1');
        }
        if (helper) {
          tl.to(helper, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '<0.1');
        }
        if (submit) {
          tl.to(submit, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.5, ease: 'back.out(1.6)',
          }, '<0');
          // Soft activation pulse — accent halo grows then settles
          tl.fromTo(submit,
            { boxShadow: '0 0 0 0 rgba(255,90,31,0)' },
            { boxShadow: '0 0 0 14px rgba(255,90,31,0)', duration: 0.85, ease: 'power2.out' },
            '<0.15'
          );
        }
      }

      const counter = section.querySelector('[data-vol-counter]');
      if (counter) {
        const obj = { v: 12000 };
        gsap.to(obj, {
          v: count,
          duration: 1.4, ease: EASE.fluent,
          onUpdate: () => { counter.textContent = Math.round(obj.v).toLocaleString(); },
          scrollTrigger: { trigger: counter, start: 'top 90%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Reflect counter changes after initial mount.
  useEffect(() => {
    const counter = sectionRef.current?.querySelector('[data-vol-counter]');
    if (counter) counter.textContent = count.toLocaleString();
  }, [count]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Get involved"
        title="Join the movement."
        highlight="movement"
        caption="Your time builds the campaign. One shift fills doors, lights up phones, or staffs a town hall — and the field office gets one step closer to election day."
        meta={[
          { label: 'Active volunteers', value: '12,847+' },
          { label: 'Counties organized', value: '17 of 17' },
          { label: 'Time commitment',    value: 'Two hours, your way' },
        ]}
      />

      <SectionDivider tone="dark" align="center" label="Pick a lane" />

      <div ref={sectionRef}>
        <section className="movement" aria-label="Ways to volunteer">
          <p className="movement__pull">
            Movements run on people, not <em>PACs</em>. The campaign hires field staff a month sooner for every hundred volunteers who sign on.
          </p>

          <div className="movement__cols">
            {WAYS.map((w) => (
              <div className="movement__col" key={w.label}>
                <strong>{w.label}</strong>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>

          <div className="movement__form-wrap">
            <div className="movement__form-side">
              <div className="eyebrow" style={{ color: 'var(--ink-40)', marginBottom: 24 }}>Step up</div>
              <h3>Sign on. A regional lead reaches you within 48 hours.</h3>
              <p>
                We don't drown new volunteers in onboarding emails. One human responds, asks two questions, and slots you into the team that fits.
              </p>
              <ul className="movement__bullets">
                <li>No experience required — every shift is paired and trained.</li>
                <li>Translation, childcare, and driving roles are paid stipend after your second shift.</li>
                <li>Schedule shows up in your inbox the Sunday before. Reply to opt out anytime.</li>
              </ul>

              <div style={{ marginTop: 36, padding: '24px 0', borderTop: '1px solid rgba(255,255,255,.10)', borderBottom: '1px solid rgba(255,255,255,.10)' }}>
                <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 8 }}>
                  Live across the district
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <strong
                    data-vol-counter
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 400,
                      fontSize: 'clamp(36px, 4.4vw, 56px)',
                      letterSpacing: '-.02em',
                      color: 'var(--paper)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {count.toLocaleString()}
                  </strong>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', letterSpacing: 0 }}>
                    supporters joining the movement
                  </span>
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="formpanel formpanel--ink">
                <div className="formpanel__success" role="status" aria-live="polite">
                  <span className="formpanel__index">Welcome to the field</span>
                  <h4>You're in.</h4>
                  <p>
                    A regional lead will email within 48 hours with two questions and a first-shift option that matches your availability.
                  </p>
                </div>
              </div>
            ) : (
              <form className="formpanel formpanel--ink" onSubmit={submit}>
                <span className="formpanel__frame" aria-hidden="true">
                  <span className="formpanel__frame-edge formpanel__frame-edge--t" data-frame-edge />
                  <span className="formpanel__frame-edge formpanel__frame-edge--r" data-frame-edge />
                  <span className="formpanel__frame-edge formpanel__frame-edge--b" data-frame-edge />
                  <span className="formpanel__frame-edge formpanel__frame-edge--l" data-frame-edge />
                </span>
                <div className="formpanel__head">
                  <span className="formpanel__index">Join the movement</span>
                  <h3 className="formpanel__title">Tell us how to find you.</h3>
                  <p className="formpanel__lede">Five fields. Thirty seconds. The rest happens by reply email.</p>
                </div>

                <div className="formpanel__grid">
                  <Field id="vol-first" label="First name"  required autoComplete="given-name"  placeholder="Jane" />
                  <Field id="vol-last"  label="Last name"   required autoComplete="family-name" placeholder="Reyna" />
                  <Field id="vol-email" label="Email"       type="email" required autoComplete="email"     placeholder="you@example.com" />
                  <Field id="vol-phone" label="Phone"       type="tel"   autoComplete="tel"               placeholder="(775) 555-0184" />
                  <Field id="vol-zip"   label="ZIP code"    inputMode="numeric" pattern="[0-9]{5}" maxLength={5} autoComplete="postal-code" placeholder="89501" />
                  <Field id="vol-city"  label="City / Town" required placeholder="Reno" />

                  <div className="formpanel__field formpanel__field--full">
                    <label>Areas of interest</label>
                    <div className="formpanel__chips" role="group" aria-label="Areas of interest">
                      {INTERESTS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          className={`chip${interests.has(s) ? ' chip--active' : ''}`}
                          onClick={() => toggleSet(interests, setInterests)(s)}
                          data-cursor="hover"
                          aria-pressed={interests.has(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="formpanel__field formpanel__field--full">
                    <label>When can you show up?</label>
                    <div className="formpanel__chips" role="group" aria-label="Availability">
                      {HOURS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          className={`chip${hours.has(s) ? ' chip--active' : ''}`}
                          onClick={() => toggleSet(hours, setHours)(s)}
                          data-cursor="hover"
                          aria-pressed={hours.has(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="formpanel__field formpanel__field--full">
                    <label htmlFor="vol-notes">Anything else? <span style={{ color: 'var(--ink-50)', textTransform: 'none', letterSpacing: 0 }}>· optional</span></label>
                    <textarea id="vol-notes" rows={3} placeholder="Skills, languages, transportation needs, anything else." />
                  </div>

                  <div className="formpanel__field--full">
                    <button type="submit" className="formpanel__send" data-cursor="hover">
                      <span>Join the movement</span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                      </svg>
                    </button>
                    <p className="formpanel__small" style={{ marginTop: 14 }}>
                      We email you, never sell your address, and you can unsubscribe with one click.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>

        <SectionDivider tone="ink" label="Questions first?" align="center" />

        <section className="page-cta">
          <div className="page-cta__inner">
            <div>
              <h2 className="page-cta__title">Not ready to commit? <em>Ask first.</em></h2>
              <p className="page-cta__lede">
                Submit a question publicly or privately. We answer on the record within seven days, and we'll route you to the right team if you want one.
              </p>
            </div>
            <Link href="/ask" className="page-cta__btn" data-cursor="hover">
              Ask a question
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
