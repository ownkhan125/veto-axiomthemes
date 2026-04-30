import EventsClient from './EventsClient';

export const metadata = {
  title: 'Events — Veto · Reyna for Nevada',
  description:
    'Town halls, fundraisers, canvass days, and community meetups. Find a Veto campaign event near you and RSVP.',
};

export default function EventsPage() {
  return <EventsClient />;
}
