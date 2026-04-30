// Shared events catalogue used by /events listing and /events/[slug] detail.
// Keeps a single source of truth so the cards and detail pages stay in sync.

export const EVENT_TAGS = [
  'All',
  'Town Hall',
  'Fundraiser',
  'Volunteer Event',
  'Community Meetup',
];

export const EVENTS = [
  {
    slug: 'astoria-warrenton-crab-wine-fest',
    image: 'https://picsum.photos/1280/720?random=21',
    tag: 'Community Meetup',
    date: 'Apr 24',
    time: '11:00 AM – 5:00 PM PT',
    title: 'Astoria Warrenton Crab & Wine Fest',
    venue: 'Clatsop County Fair and Expo Center',
    address: '92937 Walluski Loop, Astoria, OR 97103',
    locationShort: 'Astoria, OR',
    host: 'Pacific Coast Volunteers',
    capacity: '350 attendees',
    short:
      'A community gathering where Alex meets neighbors over local food, regional wine, and frank conversation about coastal priorities.',
    description: [
      "Stop by the Veto booth at the largest spring festival on Oregon's North Coast. Alex will be on the ground all afternoon — no podium, no press handler, just direct conversation with anyone who shows up.",
      "Bring questions. Bring skepticism. Coastal towns get talked about in Salem and Washington but rarely talked to. We're flipping that.",
    ],
    schedule: [
      { time: '11:00 AM', label: 'Doors open · Registration', body: 'Find the Veto booth near the main entrance. Volunteers will check you in.' },
      { time: '12:30 PM', label: 'Walking conversation', body: 'Alex circulates the festival floor — informal Q&A, no scripts, no aides.' },
      { time: '2:00 PM',  label: 'Roundtable on coastal economy', body: 'Public conversation with fishing and tourism leaders. Open seating.' },
      { time: '4:30 PM',  label: 'Closing remarks',           body: 'Brief recap of the day and an open invite to the volunteer onboard.' },
    ],
    bring: [
      { title: 'Yourself', body: 'No ticket needed. Veto events are always free and open.' },
      { title: 'Questions', body: 'Hard ones especially. Submit anonymously at the booth.' },
      { title: 'A friend', body: 'Movements grow person to person. Bring someone who hasn\'t shown up yet.' },
    ],
  },
  {
    slug: 'district-community-town-hall-hillsboro',
    image: 'https://picsum.photos/1280/720?random=22',
    tag: 'Town Hall',
    date: 'May 3',
    time: '6:30 PM – 8:30 PM PT',
    title: 'District Community Town Hall — Open Q&A',
    venue: 'Hillsboro Civic Center',
    address: '150 E Main St, Hillsboro, OR 97123',
    locationShort: 'Hillsboro, OR',
    host: 'Reyna for Nevada · Field Office West',
    capacity: '500 attendees',
    short:
      'Two hours, no slides, every question answered on the record. Childcare provided in the lobby.',
    description: [
      'This is a real town hall — not a stage-managed rally. The first ninety minutes are reserved entirely for audience questions, asked aloud or written on a card. The last thirty are for follow-ups.',
      'If we don\'t have an answer, we\'ll say so — and post a written response on the campaign site within a week.',
    ],
    schedule: [
      { time: '6:00 PM',  label: 'Doors open',           body: 'Childcare available in Room B. ASL interpretation in front rows.' },
      { time: '6:30 PM',  label: 'Brief introduction',  body: 'Five minutes — what we\'ve heard around the district this month.' },
      { time: '6:45 PM',  label: 'Open Q&A',            body: 'Microphones at four positions. Written cards collected continuously.' },
      { time: '8:30 PM',  label: 'Stay & talk',         body: 'Alex stays an extra 30 minutes to answer one-on-one.' },
    ],
    bring: [
      { title: 'A photo ID is not required', body: 'Anyone can attend. We don\'t collect attendee names.' },
      { title: 'Hard questions', body: 'Particularly ones a polished campaign would dodge.' },
      { title: 'Optional: a card', body: 'Index cards at the door for written questions if you\'d rather not stand.' },
    ],
  },
  {
    slug: 'spring-fundraiser-portland',
    image: 'https://picsum.photos/1280/720?random=23',
    tag: 'Fundraiser',
    date: 'May 10',
    time: '7:00 PM – 10:00 PM PT',
    title: 'Spring Campaign Fundraiser Dinner',
    venue: 'The Governor Hotel · Heritage Ballroom',
    address: '614 SW 11th Ave, Portland, OR 97205',
    locationShort: 'Portland, OR',
    host: 'Reyna for Nevada · Finance Committee',
    capacity: '180 attendees',
    short:
      'Small-dollar dinner. $75 suggested, pay-what-you-can ladder available, no donor over $5,000 in this room.',
    description: [
      'A working dinner. Three courses, three short conversations, all under one roof. We publish the donor list (over $200) on the campaign site within 72 hours of every fundraiser — including this one.',
      'No corporate underwriters, no industry tables. Volunteers staff the night.',
    ],
    schedule: [
      { time: '7:00 PM',  label: 'Reception',            body: 'Drinks and introductions in the foyer.' },
      { time: '7:45 PM',  label: 'Dinner is served',     body: 'Three courses by a local cooperative kitchen.' },
      { time: '8:30 PM',  label: 'On-the-record talk',   body: 'Alex and Field Director Mara Soto on the spring strategy.' },
      { time: '9:30 PM',  label: 'Open floor',           body: 'Q&A with attendees. We close on time.' },
    ],
    bring: [
      { title: 'Whatever feels right', body: 'No suggested attire. The room reads better with normal clothes.' },
      { title: 'A receipt mindset', body: 'Every dollar in this room shows up in the next quarterly ledger.' },
      { title: 'A question', body: 'Even the donors don\'t get a pass on Q&A.' },
    ],
  },
  {
    slug: 'canvass-day-oregon-1st',
    image: 'https://picsum.photos/1280/720?random=24',
    tag: 'Volunteer Event',
    date: 'May 17',
    time: '9:00 AM – 1:00 PM PT',
    title: "Canvassing Day — Oregon's 1st District",
    venue: 'Campaign HQ · Field Garage',
    address: 'PO Box 238, 47 Main St, Gaston, OR 97119',
    locationShort: 'Gaston, OR',
    host: 'Reyna for Nevada · Volunteer Operations',
    capacity: '120 volunteers',
    short:
      'Half-day door-knock with the field team. Coffee, a quick training, and 90-minute walk shifts.',
    description: [
      'No experience needed. Pair up with a veteran canvasser, get a route, and walk. We bring the clipboards and the script — you bring the legs and the curiosity.',
      'Lunch is on the campaign. Carpools coordinated from Hillsboro and Forest Grove.',
    ],
    schedule: [
      { time: '9:00 AM',  label: 'Coffee & sign-in',     body: 'Doors open at 8:45 if you want to arrive early.' },
      { time: '9:30 AM',  label: 'Training',             body: 'Twenty-minute primer on the doors and the data app.' },
      { time: '10:00 AM', label: 'First walk shift',     body: '90 minutes in the field with a partner.' },
      { time: '12:00 PM', label: 'Lunch & debrief',      body: 'What worked, what didn\'t, and an optional second shift.' },
    ],
    bring: [
      { title: 'Comfortable shoes', body: 'You\'ll cover roughly a mile per shift.' },
      { title: 'A water bottle', body: 'Refill station at HQ.' },
      { title: 'A phone', body: 'For the canvass app — we\'ll set it up at sign-in.' },
    ],
  },
  {
    slug: 'memorial-day-parade-forest-grove',
    image: 'https://picsum.photos/1280/720?random=25',
    tag: 'Community Meetup',
    date: 'May 25',
    time: '10:00 AM – 1:00 PM PT',
    title: 'Memorial Day Community Parade & Gathering',
    venue: 'Forest Grove Downtown',
    address: 'Pacific Ave, Forest Grove, OR 97116',
    locationShort: 'Forest Grove, OR',
    host: 'Pacific County Volunteers',
    capacity: 'Open public event',
    short:
      'Walking with the campaign banner alongside local veterans groups. After the parade — community lunch in Lincoln Park.',
    description: [
      'A quieter event. The campaign walks at the back of the parade so the day stays about local veterans, not us.',
      'Afterwards: a no-program, no-podium gathering in Lincoln Park. Sandwiches, lawn chairs, real conversations.',
    ],
    schedule: [
      { time: '10:00 AM', label: 'Line-up',              body: 'Meet at the corner of Pacific and Main. Look for the Veto banner.' },
      { time: '10:30 AM', label: 'Parade step-off',      body: 'Walk lasts approximately 45 minutes.' },
      { time: '12:00 PM', label: 'Park gathering',       body: 'Lincoln Park, Pavilion 2. Family-friendly.' },
    ],
    bring: [
      { title: 'A folding chair', body: 'Pavilion 2 has limited seating.' },
      { title: 'Sunscreen', body: 'There\'s no shade on the parade route.' },
      { title: 'Children, dogs, neighbors', body: 'Quiet community day. All welcome.' },
    ],
  },
  {
    slug: 'reno-rural-roadshow',
    image: 'https://picsum.photos/1280/720?random=26',
    tag: 'Town Hall',
    date: 'Jun 7',
    time: '5:30 PM – 7:30 PM PT',
    title: 'Rural Roadshow — Stop 04 — Reno North',
    venue: 'Pioneer Center for the Performing Arts',
    address: '100 S Virginia St, Reno, NV 89501',
    locationShort: 'Reno, NV',
    host: 'Reyna for Nevada',
    capacity: '900 attendees',
    short:
      'Fourth stop on the rural roadshow. Open Q&A, livestreamed and captioned for the rest of the district.',
    description: [
      'The roadshow visits twelve rural and exurban communities through the summer. Each stop is two hours, on the record, and answered on the campaign site within a week.',
      'Childcare and ASL interpretation provided. RSVP if you can — walk-ups welcome until capacity.',
    ],
    schedule: [
      { time: '5:00 PM',  label: 'Doors open',           body: 'Walk-ups welcome until 5:25.' },
      { time: '5:30 PM',  label: 'Opening remarks',      body: 'Five minutes — what we\'re hearing around the state this month.' },
      { time: '5:45 PM',  label: 'Open Q&A',             body: 'Two microphones, written-card alternative, no time limit.' },
      { time: '7:30 PM',  label: 'Close',                body: 'Alex stays 20 extra minutes for one-on-one.' },
    ],
    bring: [
      { title: 'Yourself', body: 'Anyone can attend, no ID required.' },
      { title: 'A question', body: 'Anonymous cards collected at the door.' },
      { title: 'Tissues, optional', body: 'These rooms get real.' },
    ],
  },
];

export const findEventBySlug = (slug) => EVENTS.find((e) => e.slug === slug);
