'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const DESKTOP_LEFT = [
  { href: '/about',         label: 'About' },
  { href: '/ask',           label: 'Ask' },
  { href: '/endorsements',  label: 'Endorsements' },
];
const DESKTOP_RIGHT = [
  { href: '/events',    label: 'Events' },
  { href: '/volunteer', label: 'Volunteer' },
];
// Full menu used on mobile — keeps all the same links available in one place.
const MOBILE_LINKS = [
  { href: '/about',        label: 'About' },
  { href: '/events',       label: 'Events' },
  { href: '/volunteer',    label: 'Volunteer' },
  { href: '/endorsements', label: 'Endorsements' },
  { href: '/ask',          label: 'Ask a Question' },
  { href: '/contact',      label: 'Contact' },
];

const ArrowUpRight = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ marginLeft: 6 }}>
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
  </svg>
);

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;

    document.body.classList.add('is-nav-open');
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.classList.remove('is-nav-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <div className="nav__group nav__group--left">
          {DESKTOP_LEFT.map(l => (
            <Link key={l.href} href={l.href} className="nav__link">{l.label}</Link>
          ))}
        </div>

        <Link href="/" className="nav__brand" aria-label="Veto — home">
          veto<sup>®</sup>
        </Link>

        <div className="nav__group nav__group--right">
          {DESKTOP_RIGHT.map(l => (
            <Link key={l.href} href={l.href} className="nav__link">{l.label}</Link>
          ))}
          <Link href="/#involved" className="nav__cta" data-cursor="hover">
            Donate<ArrowUpRight />
          </Link>
        </div>

        <button
          type="button"
          className="nav__burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
          data-cursor="hover"
        >
          <span className="nav__burger-line" />
          <span className="nav__burger-line" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="nav-menu__top">
              <Link href="/" className="nav__brand" onClick={close} aria-label="Veto — home">
                veto<sup>®</sup>
              </Link>
              <button
                type="button"
                className="nav-menu__close"
                aria-label="Close menu"
                onClick={close}
                data-cursor="hover"
              >
                <span /><span />
              </button>
            </div>

            <ul className="nav-menu__links">
              {MOBILE_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24, transition: { duration: 0.25 } }}
                  transition={{ delay: 0.18 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={l.href} onClick={close}>
                    <span className="nav-menu__num">0{i + 1}</span>
                    <span className="nav-menu__label">{l.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="nav-menu__foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/#involved" className="nav-menu__cta" onClick={close} data-cursor="hover">
                Donate<ArrowUpRight size={12} />
              </Link>
              <a href="mailto:hello@vetocampaign.org" className="nav-menu__email" onClick={close}>
                hello@vetocampaign.org
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
