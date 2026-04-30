import { notFound } from 'next/navigation';
import { EVENTS, findEventBySlug } from '../../lib/events-data';
import EventDetailClient from './EventDetailClient';

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

// Next.js 15: dynamic-segment `params` are now async. They must be awaited
// before any property is read — otherwise the worker dereferences a Promise
// and crashes with "Jest worker encountered child process exceptions".
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = findEventBySlug(slug);
  if (!event) return { title: 'Event — Veto · Reyna for Nevada' };
  return {
    title: `${event.title} — Veto · Reyna for Nevada`,
    description: event.short,
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = findEventBySlug(slug);
  if (!event) notFound();
  return <EventDetailClient event={event} />;
}
