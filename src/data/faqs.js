// Frequently asked questions.
//
// Questions were carried over from the old Wix FAQ page. To edit, add or
// remove one, just change this file — the page renders whatever is here, and
// any entry with an empty `answer` is skipped, so a half-written FAQ never
// shows up publicly.
//
// Answers accept simple HTML (<strong>, <em>, <a href="…">) if you need it.

export const FAQ_GROUPS = [
  {
    id: 'general',
    label: 'General',
    blurb: 'Joining, commitment and what Ignite actually is.',
    items: [
      { q: 'Is this an NAA module like before?', a: '' },
      { q: "My schedule's really busy & it's holding me back from joining the team", a: '' },
      { q: "If I'm not a FASS student, can I still join?", a: '' },
      { q: 'Are there any meetings to attend?', a: '' },
      { q: "Okay… What's so special about IGNITE?", a: '' },
      { q: 'Can I apply to join the IGNITE team?', a: '' },
    ],
  },
  {
    id: 'writers',
    label: 'Contributing Writers',
    blurb: 'Writing for us without joining the full committee.',
    items: [
      { q: 'How does a contributing writer work?', a: '' },
      { q: 'What tone should I write in?', a: '' },
      { q: 'Can I join as a contributing writer anytime I want?', a: '' },
      { q: 'How many sections can I join?', a: '' },
      { q: "Can I apply to be a Contributing Writer if I'm going on exchange?", a: '' },
    ],
  },
  {
    id: 'photographers',
    label: 'Featured Photographers',
    blurb: 'Shooting for Ignite, and what kit you need.',
    items: [
      { q: 'How does a featured photographer work?', a: '' },
      { q: 'Can I join as a featured photographer anytime I want?', a: '' },
      { q: 'Do I need my own filming equipment as a feature photographer?', a: '' },
    ],
  },
]

// Only groups with at least one answered question are worth showing.
export const answeredGroups = () =>
  FAQ_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.a.trim()) })).filter(
    (g) => g.items.length
  )
