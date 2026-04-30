'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ensureGsap, isReducedMotion, EASE, DUR } from '../lib/reveal';

export default function Footer() {
  const footerRef = useRef(null);
  const clockRef = useRef(null);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const tick = () => {
      setClock(fmt.format(new Date()));
      const node = clockRef.current;
      if (node && !isReducedMotion()) {
        gsap.fromTo(node, { opacity: 0.4 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      }
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el || isReducedMotion()) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      const cta = el.querySelector('.footer__cta');
      const cols = el.querySelectorAll('.footer__col');
      const wordmark = el.querySelector('.footer__wordmark');
      const bottomItems = el.querySelectorAll('.footer__bottom > *');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      if (cta) {
        tl.fromTo(
          cta,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: DUR.short, ease: EASE.fluent },
          0
        );
      }

      tl.fromTo(
        cols,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: DUR.short, stagger: 0.08, ease: EASE.fluent },
        0.1
      );

      if (wordmark) {
        tl.fromTo(
          wordmark,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0, ease: EASE.fluent },
          0.25
        );
        tl.fromTo(
          wordmark,
          { '--wm-fill': '0%' },
          { '--wm-fill': '100%', duration: 1.4, ease: EASE.fluent },
          0.45
        );
      }

      tl.fromTo(
        bottomItems,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: DUR.short, stagger: 0.06, ease: EASE.fluent },
        0.6
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer__cta">
        <div className="footer__cta-text">
          <span className="footer__cta-eyebrow">Join the campaign</span>
          <h3 className="footer__cta-title">A Senate seat earned, not bought.</h3>
        </div>
        <div className="footer__cta-actions">
          <Link href="/volunteer" className="footer__cta-btn footer__cta-btn--primary">
            Volunteer
          </Link>
          <Link href="/#involved" className="footer__cta-btn footer__cta-btn--ghost">
            Contribute
          </Link>
        </div>
      </div>

      <div className="footer__top">
        <div className="footer__col footer__col--brand">
          <Link href="/" className="footer__brand">veto<span>·</span></Link>
          <p className="footer__lede">
            The U.S. Senate campaign of Alex Reyna — an independent, people-funded run to represent
            Nevada in the 119th Congress.
          </p>
          <ul className="footer__social" aria-label="Social media">
            <li><a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a></li>
            <li><a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a></li>
            <li><a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">TT</a></li>
            <li><a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">X</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h5>Offices</h5>
          <div className="footer__office">
            <strong>Reno HQ</strong>
            <span>300 S. Virginia St.</span>
            <span>Reno, NV 89501</span>
          </div>
          <div className="footer__office">
            <strong>Las Vegas</strong>
            <span>1701 Fremont St.</span>
            <span>Las Vegas, NV 89101</span>
          </div>
        </div>

        <div className="footer__col">
          <h5>Campaign</h5>
          <Link href="/about">About</Link>
          <Link href="/events">Events</Link>
          <Link href="/endorsements">Endorsements</Link>
          <Link href="/ask">Ask a Question</Link>
          <Link href="/#priorities">Priorities</Link>
        </div>

        <div className="footer__col">
          <h5>Contact</h5>
          <Link href="/contact">Get in touch</Link>
          <a href="mailto:hello@vetocampaign.org">hello@vetocampaign.org</a>
          <Link href="/volunteer">Volunteer</Link>
          <Link href="/#involved">Contribute</Link>
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true">veto</div>

      <div className="footer__bottom">
        <div className="footer__bottom-left">
          <span className="footer__status"><span className="footer__dot" aria-hidden="true" />Reno · <span ref={clockRef}>{clock || '—:—'}</span></span>
          <span className="footer__sep" aria-hidden="true">/</span>
          <span>No dark money. No corporate PACs.</span>
        </div>
        <div className="footer__bottom-right">
          <span>© 2026 Reyna for Nevada</span>
          <span className="footer__sep" aria-hidden="true">/</span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>

      <p className="footer__legal">
        Paid for by Reyna for Nevada. Not authorized by any candidate or candidate's committee.
      </p>
    </footer>
  );
}
