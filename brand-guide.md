# Brand Guide

> **Reference study of** [itsdesignade.com](https://www.itsdesignade.com/) — *Top Social Media Agency | Creative Agency in the US*
> Captured at 1440×900 desktop and 390×844 mobile. Built on Webflow (jQuery + Webflow IX2).
>
> This guide distills the visual language into a system a new studio can build on. Where the source uses Webflow Interactions, the rebuild blueprint uses **GSAP + Lenis + IntersectionObserver** for equivalent — or better — motion quality.

---

## Table of contents

1. [Essence](#1-essence)
2. [Color system](#2-color-system)
3. [Typography](#3-typography)
4. [Spatial system](#4-spatial-system)
5. [Motion & interaction](#5-motion--interaction)
6. [Components](#6-components)
7. [Voice & principles](#7-voice--principles)
8. [Implementation blueprint](#8-implementation-blueprint)

---

## 1. Essence

A **monochrome editorial stage for work-led storytelling**. The system itself is deliberately mute — black, white, grayscale — so the *projects* carry all the color. Typography is set at oversized scale with minimal decoration; motion is sparing but confident.

| Brand mood board | |
|---|---|
| Keywords | bold · editorial · confident · premium-cool · photography-led |
| What it is not | busy · playful · gradient-heavy · illustrative · corporate |
| Closest peers | Pentagram, Instrument, Locomotive, Studio Output |

---

## 2. Color system

All UI color is black, white, and a six-step grayscale ramp. Accent hues appear **only** inside case-study imagery — never in nav chrome, CTAs, or headlines.

### 2.1 Core palette

| Token | Value | Role | On dark contrast | On light contrast |
|---|---|---|---|---|
| `--ink` | `#000000` | Primary text, dark surfaces, borders | — | 21:1 |
| `--paper` | `#FFFFFF` | Default surface, text on dark | 21:1 | — |
| `--offblack` | `#0A0A0A` | Footer, stage-dark sections | — | 19.8:1 |
| `--accent` | `#FF5A1F` | *One pixel only* — hero status dot | — | 3.4:1 |

> **Restraint rule**: the accent color appears **once per page**, on the live "booking" indicator. It signals motion (pulse animation) and never carries body copy or CTAs. If you're reaching for it a second time, you've broken the system.

### 2.2 Grayscale ramp

| Token | Value | Use | Contrast on paper |
|---|---|---|---|
| `--ink-90` | `#141414` | Body on paper (optional richer black) | 20:1 |
| `--ink-80` | `#222222` | Nav links, UI chrome text | 16.1:1 |
| `--ink-70` | `#333333` | Secondary nav, captions | 12.6:1 |
| `--ink-60` | `#3F3F3F` | Footnotes | 10.4:1 |
| `--ink-50` | `#767676` | Paragraph copy on paper | 4.8:1 |
| `--ink-40` | `#969696` | Placeholder, tertiary labels | 3.1:1 — use ≥ 18 px |
| `--ink-30` | `#BFBFBF` | Icons on paper | — |
| `--ink-20` | `#DDDDDD` | Hairline dividers | — |
| `--ink-10` | `#F2F2F2` | Subtle section fills (rarely used) | — |

### 2.3 Do / Don't

- **Do** let photography + brand-color illustration supply saturation.
- **Do** flip the system between sections — full-bleed `#0A0A0A` ↔ full-bleed `#FFF`.
- **Don't** introduce brand color into buttons, links, or headlines.
- **Don't** use the accent on two elements of the same page at the same time.

---

## 3. Typography

### 3.1 Family
**Sharp Sans No 1** — a geometric humanist sans (single-storey *a*, circular *o*, generous counters). Free substitute: **Inter Tight**. Paid-tier equivalents: Aktiv Grotesk, Söhne, Suisse Int'l.

One **serif accent** is used for numerals and italic pull-quotes: **Fraunces** (variable, italic 300). This single contrast carries the editorial authority without introducing a second personality.

### 3.2 Weight loadout

| Weight | Role |
|---|---|
| 400 Book | Paragraph body, placeholder labels |
| 500 | Nav links, chip labels, service tags |
| 600 | Mid-hierarchy headlines (section titles) |
| 700 | Display H1, hero wordmark, numbered service items |
| 800 | Reserved — oversized glyphs on case cards only |

Italic 300 of **Fraunces** is used **only** for:
- Phase numerals (*"Phase I", "Phase II"* in the process section)
- Italic emphasis inside pull-quotes (*"endings"*, *"frkn"*)

### 3.3 Type scale (desktop, 1440 px reference)

| Role | Size | Leading | Weight | Tracking |
|---|---|---|---|---|
| **Display / hero wordmark** | `clamp(72px, 22vw, 376px)` | 0.82 | 700 | −0.042em |
| **H1** | `clamp(44px, 6.2vw, 96px)` | 1.0 | 700 | −0.018em |
| **Manifesto pull-quote** | `clamp(36px, 5.2vw, 84px)` | 1.04 | 600 | −0.018em |
| **H2 / card title** | `clamp(30px, 3vw, 46px)` | 1.05 | 500 | −0.010em |
| **H3** | `clamp(26px, 2.8vw, 40px)` | 1.18 | 500 | −0.008em |
| **Lede** | `clamp(17px, 1.45vw, 20px)` | 1.55 | 400 | 0 |
| **Body** | `14–16px` | 1.5 | 400 | 0 |
| **Eyebrow / label** | `12px` | 1.0 | 500 | **+0.14em · UPPERCASE** |
| **Chip / button** | `13–14px` | 1.0 | 500 | 0 |
| **Numerals (Fraunces)** | `clamp(44px, 6vw, 84px)` | 1.0 | 400 italic | −0.025em |

### 3.4 Casing rules

- **Lowercase** the wordmark and the hero headline. Makes the brand whisper.
- **Sentence case** project titles, pull-quotes, CTAs.
- **UPPERCASE** *only* structural labels and eyebrows (`THE STUDIO`, `METHOD`, `CAPABILITIES`, `SEND BRIEF`). When you go uppercase, add `+0.14em` letter-spacing. Never both uppercase *and* small.

### 3.5 Letter-spacing

- Display & H1 → **negative** (−0.02 to −0.04em). Big type needs tightening.
- Body → **0**. No extra tracking.
- Eyebrows & labels → **+0.14em**. This is the only place tracked caps appear.

### 3.6 Type specimen

```
╭─ Display ───────────────────────────────────╮
│  northkin                                   │
╰─────────────────────────────────────────────╯
╭─ H1 ────────────────────────────────────────╮
│  Recent brand work, 2023 – 2026.            │
╰─────────────────────────────────────────────╯
╭─ Pull-quote ────────────────────────────────╮
│  We pitch endings — what your brand         │
│  looks like once we're done with it.        │
╰─────────────────────────────────────────────╯
╭─ Eyebrow ───────────────────────────────────╮
│  ──  SELECTED WORK                          │
╰─────────────────────────────────────────────╯
╭─ Body ──────────────────────────────────────╮
│  Small teams. One studio lead per project.  │
│  No account layer between you and the       │
│  people doing the work.                     │
╰─────────────────────────────────────────────╯
```

---

## 4. Spatial system

### 4.1 Grid

A **single full-bleed column** with inner lateral padding. No 12-column grid ceremony.

```
┌─── viewport ───────────────────────────────────┐
│ ← pad-x →                          ← pad-x →  │
│ ┌──────────────────────────────────────────┐  │
│ │         CONTENT MAX-WIDTH (fluid)        │  │
│ │                                          │  │
│ └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

`--pad-x: clamp(20px, 4vw, 88px);` gives 20 px on mobile, 88 px on desktop. Hairline dividers inside sections extend edge-to-edge; only *content* respects the inner padding.

### 4.2 Vertical rhythm

| Token | Value | Applied to |
|---|---|---|
| `--section-pad` | `clamp(80px, 10vw, 160px)` | Every standard content section |
| Hero | `100vh` | First viewport |
| Sticky overlap | `−720 px` top margin (reference) | Dark footer rising under page |
| Strip | `28 px` block padding | Availability bar, marquee |
| Intra-card stack | `14–24 px` | Chip row ↔ title ↔ keywords |

### 4.3 Spacing scale

A flat 4 px increment: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 80 · 100 · 120 · 160`.

### 4.4 Page proportions

- Reference source: **~13,200 px tall** (≈ 14.7 viewports).
- This rebuild: **~11,500 px** (≈ 12.8 viewports) — two sections deeper (Process + Numbers) at less decorated scale.
- The length *is* the narrative. Don't compress.

---

## 5. Motion & interaction

### 5.1 Motion philosophy

> Slow the page. Fast the interactions.

- **Body scroll** is smooth-eased (Lenis, 1.15 s duration, exponential easing).
- **UI state changes** resolve in ≤ 340 ms.
- **Marquees** run at a constant 42 s linear loop; no ease.
- **Pinned horizontal scroll** — the signature move — runs at `scrub: 0.8` so wheel input drives X translation with a soft lag.

### 5.2 Timing & easing tokens

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(.22,.61,.36,1)` | Most hovers, CTA state changes |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Entrance reveals |
| `--ease-inout` | `cubic-bezier(.76,0,.24,1)` | Sticky fills, slide reveals |
| `--t-fast` | `0.18 s` | Underline/dot grow, cursor scale |
| `--t-med` | `0.34 s` | Chip invert, card lift, image scale |
| `--t-slow` | `0.60 s` | Hero/section reveal |

### 5.3 Motion inventory

| Pattern | Where | Duration |
|---|---|---|
| Pinned horizontal reel | The Work section | `scrub 0.8`, total ≈ viewport-equivalent |
| Marquee (linear loop) | Top strip, dark bottom strip | 42 s infinite |
| Hero letter stagger | Hero wordmark reveal | 1.2 s total, 50 ms each |
| Number count-up | Numbers strip | 2.2 s, eased |
| Scroll fade-up | All eyebrows / H1s / ledes | 1.0 s (IntersectionObserver) |
| Cursor ring scale | On hover over interactive | 0.35 s |
| Link underline draw | Nav links | 0.5 s (scaleX from left) |
| Sticky fill slide | CTA, client cell hover | 0.5 s (translateY 100% → 0) |
| Card glyph scale | Case card hover | 1.0 s |

### 5.4 The custom cursor

Four states, all via CSS classes on a fixed-position div with `mix-blend-mode: difference` so it reads on every background.

| State | CSS class | Visual |
|---|---|---|
| **Default** | — | 44 px ring + 6 px dot, white |
| **Hover** (link / button / chip) | `.is-hover` | Ring grows to 76 px, fills 15% white, dot fades |
| **Text** (input / textarea) | `.is-text` | Morphs to a 4 × 34 px I-beam |
| **Media** (case card) | `.is-media` | Ring grows to 110 px, "View" label appears |
| **Down** (click) | `.is-down` | Ring scales to 0.85, fills 30% white |

Hover states **must clear on scroll** — `pointerenter/leave` don't fire on scroll, so you'll strand the cursor in *View* mode if you don't hook `lenis.on('scroll', clearCursor)`.

### 5.5 What to avoid

- Fade-in everything. (The source doesn't, and resisting the urge is the discipline.)
- Scroll-jacking. Smooth-scroll velocity, never override direction or delta.
- More than one dominant motion focal point per viewport.
- Text that animates on hover.
- Shadows, gradients, or glows on UI chrome. Weight comes from type + borders.

---

## 6. Components

### 6.1 Pill chip

```
┌─────────────┐
│  Branding   │    border: 1px solid currentColor
└─────────────┘    border-radius: 999px
                   padding: 8–10px × 16–20px
                   font: 500 13–14px sans
                   hover: invert fill ↔ stroke
                   active: always filled
```

### 6.2 Primary CTA (send brief, start project)

```
┌──────────────────────────┐
│ Send brief  →            │   bg: #000, text: #fff
└──────────────────────────┘   hover: ::before slides up
                                from translateY(100%) → 0
                                creating a reverse-fill reveal
                                arrow slides 4 px ↗ on hover
```

### 6.3 Project / case card

- Full-bleed brand color (per project, *not* brand palette).
- Oversized letterform as background glyph (mix-blend-mode: overlay).
- Top-right: pill CTA with `backdrop-filter: blur(6px)`.
- Top-left: `CASE 0X` index in 11 px tracked caps.
- Bottom-left stack: chip row → title (30–46 px, weight 500) → bullet-separated keywords (12 px tracked caps).
- Hover: card lifts `-10 px`, bg scales `1.04`, glyph lifts `-8 px`.

### 6.4 Numbered service row

- Full-width row, hairline top border.
- 38 × 38 outlined circle with numeral (1–6).
- Name in 700 / 96 px / −0.025em.
- Service tag far right, uppercase tracked caps.
- Hover: row shifts `padding-left: 24px`, circle fills to `#000`, tag fades out as an arrow SVG slides in from left (−20 px → 0).

### 6.5 Client logo cell

- `aspect-ratio: 5 / 2`.
- 1 px hairline grid.
- Wordmark in 16–22 px weight 700.
- Hover: `::before` panel slides up from bottom (translateY 100 → 0) over 0.6 s `ease-inout`, flipping the cell to black with white text — no fade, no scale.

### 6.6 Form field

- Line-only underline inputs (no box).
- Label: 12 px tracked caps, `--ink-50`, above the field.
- Input: 18 px sans, padding 10–14 px.
- Focus state: underline color shifts to `--accent` (the *only* other place the accent appears, beyond the hero dot).
- Categorical answers use the chip component from §6.1. Budget = single-select, services = multi-select.

### 6.7 Marquee

- `overflow: hidden`, inner track animated `translateX 0 → −50%` over 42 s linear.
- Track contains **two identical copies** of the content for seamless loop.
- Pauses on hover.
- Separator: a filled dot (●) in `currentColor`, 18 × 18 px.

---

## 7. Voice & principles

### 7.1 Voice

- **Declarative fragments.** "Selected work." "We pitch endings." "No recycled decks."
- **Short sentences.** Max 14 words in body; much less in eyebrows and CTAs.
- **Occasional slang, used once.** "frkn" on the source; "Operators, not committees." here. It's seasoning, not a personality.
- **Imperatives.** *Start a project. Send brief. View archive.* Never *"Click here."*

### 7.2 Words to avoid

*Unlock · Empower · Synergy · Ecosystem · Solutions · Innovate · Welcome · Journey · Experience · Tailored*

### 7.3 Eight design principles

1. **Photography is the color system.** The brand stays monochrome so the work doesn't fight for attention.
2. **Scale before decoration.** A 96 px headline on a clean field outperforms a 24 px headline with effects.
3. **Sticky beats scroll-jack.** Pin, translate, reveal. Never hijack velocity.
4. **One motion focal point per viewport.** A pin *or* an orb *or* a marquee. Not all three.
5. **Full-bleed or nothing.** Gutters live *inside* a section, not around it.
6. **Lowercase the brand, uppercase the structure.** The wordmark whispers; the labels shout.
7. **Borders, fills, and weight only.** No drop shadows or gradients in chrome. Gradients are allowed *once* — footer wordmark.
8. **Length is narrative.** Don't fight the 12–15-viewport page. Trust the reader.

---

## 8. Implementation blueprint

The reference site is built on Webflow + IX2 + jQuery. This rebuild uses:

| Concern | Library | Why |
|---|---|---|
| Smooth body scroll | **Lenis 1.x** | Inertial feel without hijacking velocity |
| Pin + horizontal scroll | **GSAP + ScrollTrigger** | Robust pin spacer, `scrub` support |
| Entrance reveals | **IntersectionObserver + CSS transitions** | Simpler, no race with `ScrollTrigger.refresh()` |
| Custom cursor | **GSAP `quickTo`** | 60 fps X/Y tracking without cumulative drift |
| Marquees | **CSS `@keyframes`** | Constant-velocity loops don't need JS |
| Count-up numerals | **GSAP `to` + `onUpdate`** | Eases into integer values |
| Clock | `Intl.DateTimeFormat` + `setInterval(30s)` | Timezone-aware |

### 8.1 Scroll + ScrollTrigger wiring

```js
const lenis = new Lenis({
  duration: 1.15,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 8.2 Pinned horizontal reel (exact pattern)

```js
const buildScroll = () => Math.max(
  rail.scrollWidth - window.innerWidth + padX * 2, 0
);
gsap.to(rail, {
  x: () => -buildScroll(),
  ease: 'none',
  scrollTrigger: {
    trigger: pin,
    start: 'top top',
    end: () => '+=' + buildScroll(),
    pin: true,
    scrub: 0.8,
    invalidateOnRefresh: true,
    anticipatePin: 1,
  },
});
// Refresh after fonts/layout settle — without this, the pin distance
// collapses to 0 when ScrollTrigger evaluates end() too early.
document.fonts.ready.then(() => ScrollTrigger.refresh());
setTimeout(() => ScrollTrigger.refresh(), 350);
```

### 8.3 Reveal primitive

```css
[data-reveal-up] { opacity: 0; transform: translateY(32px); }
.is-revealed {
  opacity: 1; transform: translateY(0);
  transition: opacity 1s cubic-bezier(.16,1,.3,1),
              transform 1s cubic-bezier(.16,1,.3,1);
}
```

```js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-revealed');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('[data-reveal-up]').forEach(el => io.observe(el));
```

### 8.4 Accessibility notes

- All motion respects `@media (prefers-reduced-motion: reduce)` — marquee stops, reveals become instant, cursor animation disables.
- Custom cursor falls back to native on `@media (hover: none), (pointer: coarse)`.
- Color contrasts ≥ 4.5:1 for body copy (`--ink-50` on `--paper`, `--ink-40` on `--offblack`).
- Pill buttons and chips retain visible focus rings via `:focus-visible`.

---

## Appendix — file inventory

| File | Contents |
|---|---|
| `brand-guide.md` | This document |
| `index.html` | Self-contained rebuild (Northkin®) — single file, CDN-loaded Lenis + GSAP |
| `C:/tmp/designade-*.png` | Reference screenshots from the capture pass |
| `C:/tmp/nk-*.png` | Verification screenshots of the rebuild |
