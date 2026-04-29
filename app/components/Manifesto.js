'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Wrap each whitespace-separated word inside `root` in <span class="word">.
// Preserves inline tags (e.g. <em>) since we walk text nodes only.
// Idempotent — bails if the root has already been split.
function splitWords(root) {
  if (!root) return [];
  if (root.querySelector('.word')) {
    return Array.from(root.querySelectorAll('.word'));
  }

  const textNodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) textNodes.push(n);

  const out = [];
  textNodes.forEach((node) => {
    const text = node.nodeValue;
    if (!text || !/\S/.test(text)) return;

    const frag = document.createDocumentFragment();
    text.split(/(\s+)/).forEach((chunk) => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        frag.appendChild(document.createTextNode(chunk));
      } else {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = chunk;
        frag.appendChild(span);
        out.push(span);
      }
    });
    node.parentNode.replaceChild(frag, node);
  });
  return out;
}

export default function Manifesto() {
  const sectionRef = useRef(null);
  const pullRef = useRef(null);
  const colsRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 900px)').matches;
    if (reduce || !wide) return;

    gsap.registerPlugin(ScrollTrigger);

    const pullWords = splitWords(pullRef.current);
    const colWords = [];
    if (colsRef.current) {
      colsRef.current.querySelectorAll('p').forEach((p) => {
        colWords.push(...splitWords(p));
      });
    }
    if (pullWords.length + colWords.length === 0) return;

    section.classList.add('is-scrub');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + Math.round(window.innerHeight * 1.6),
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Reveal headline first, then column paragraphs. Stagger spans the
      // available "duration" (timeline units; mapped 1:1 to scroll progress
      // by ScrollTrigger), so word count doesn't change pacing.
      const PULL_SPAN = 4;
      const COL_SPAN = 5;
      const GAP = 0.4;

      tl.fromTo(
        pullWords,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: 'none',
          duration: 0.45,
          stagger: pullWords.length > 1 ? PULL_SPAN / (pullWords.length - 1) : 0,
        },
        0
      );

      if (colWords.length) {
        tl.fromTo(
          colWords,
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: 'none',
            duration: 0.4,
            stagger: colWords.length > 1 ? COL_SPAN / (colWords.length - 1) : 0,
          },
          PULL_SPAN + GAP
        );
      }
    }, section);

    return () => {
      ctx.revert();
      section.classList.remove('is-scrub');
    };
  }, []);

  return (
    <section id="about" className="manifesto" ref={sectionRef}>
      <div className="eyebrow manifesto__eyebrow" data-reveal>About Alex</div>

      <h2 className="manifesto__pull" ref={pullRef} data-reveal>
        We don't run on slogans. We run on <em>receipts</em> — what we've done, and what we'll deliver next.
      </h2>

      <div className="manifesto__columns" ref={colsRef}>
        <div data-reveal>
          <h4>Who I am</h4>
          <p>
            Third-generation Nevadan. Former public defender. Small-business owner. I've met payroll, stood in courtrooms,
            and watched my neighbors get priced out of the state we built.
          </p>
        </div>
        <div data-reveal data-reveal-delay="0.08">
          <h4>How I govern</h4>
          <p>
            I read the bill. I take the meetings you can't get. I publish my votes with plain-English reasoning — every
            one of them, on the campaign site, within 48 hours.
          </p>
        </div>
        <div data-reveal data-reveal-delay="0.16">
          <h4>Who I'm for</h4>
          <p>
            Working families, veterans, tribal nations, educators, nurses, small-business owners. The people who hold
            this state together and get talked over in Washington.
          </p>
        </div>
      </div>
    </section>
  );
}
