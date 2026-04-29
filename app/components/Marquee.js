'use client';

export default function Marquee({ items = [], variant }) {
  // Duplicate the item list to produce a seamless loop (CSS animates the
  // track -50% over its duration).
  const content = (
    <span>
      {items.map((label, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 64 }}>
          {label}
          <i className="star" aria-hidden="true" />
        </span>
      ))}
    </span>
  );

  return (
    <section
      className={`marquee${variant === 'dark' ? ' marquee--dark' : ''}`}
      aria-hidden="true"
    >
      <div className="marquee__track">
        {content}
        {content}
      </div>
    </section>
  );
}
