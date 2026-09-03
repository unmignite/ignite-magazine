// Frequently asked questions.
//
// Carried over from the old Wix FAQ page. To edit, add or remove one, just
// change this file — the page renders whatever is here, and any entry with an
// empty `answer` is skipped, so a half-written FAQ never shows up publicly.
//
// Answers accept simple HTML (<strong>, <em>, <a href="…">) if you need it.

export const FAQ_GROUPS = [
  {
    id: 'general',
    label: 'General',
    blurb: 'Joining, commitment, and what Ignite actually is.',
    items: [
      {
        q: 'Is this an NAA module like before?',
        a: 'Yes, we are a NAA (Nottingham Advantage Award) module under Student Media! If you are joining us from NAA, you will be required to send in 3 submissions and attend at least 3 writing circles to qualify for your certificate.',
      },
      {
        q: "My schedule's really busy & it's holding me back from joining the team",
        a: "That's a completely valid concern! But do not fret, if you're signing up as a contributing writer or featured photographer, it's on a voluntary basis. You don't have to claim an article or take on a photo gig if you're unavailable!",
      },
      {
        q: "If I'm not a FASS student, can I still join?",
        a: 'Yes, of course! Any UNM student is welcome at IGNITE, even if you do not have prior experience.',
      },
      {
        q: 'Are there any meetings to attend?',
        a: 'So far, we are planning to host bi-weekly writing circles. These work as socials for you to meet and connect with other IGNITE team members!',
      },
      {
        q: "Okay… What's so special about IGNITE?",
        a: "If you've always wanted to interview local artists, notable figures in Malaysia, or attend special media events, there's a chance we might be able to connect you to these opportunities!",
      },
      {
        q: 'Can I apply to join the IGNITE team?',
        a: 'Our recruitment for the 25/26 IGNITE team has closed but fear not! We are always looking out for contributing writers to submit articles and avid feature photographers! Think you have what it takes? Refer to the “Contributing Writers” section above for more details.',
      },
    ],
  },
  {
    id: 'writers',
    label: 'Contributing Writers',
    blurb: 'Writing for us without joining the full committee.',
    items: [
      {
        q: 'How does a contributing writer work?',
        a: "Once you receive the link to our WhatsApp Community, join the section(s) you'd like to contribute to. Each week, your section editor will share some article ideas for you to claim. After that, you can begin writing — just be sure to submit your article before the deadline set by your editor! If you're feeling inspired, you're also welcome to suggest your own article ideas!",
      },
      {
        // Waiting on the answer for this one — it stays hidden until filled in.
        q: 'What tone should I write in?',
        a: '',
      },
      {
        q: 'Can I join as a contributing writer anytime I want?',
        a: 'Yes! Throughout the year, there will be a link for CWs to fill in their information. No interviews are required. After verification, our Co-Editors in Chief will send you an invitation link to the WhatsApp Community! However, we do recommend joining during our recruitment period or at the start of the academic year.',
      },
      {
        q: 'How many sections can I join?',
        a: 'There is no strict limit, but we recommend keeping it to a maximum of three!',
      },
      {
        q: "Can I apply to be a Contributing Writer if I'm going on exchange?",
        a: "Of course! Feel free to apply to be a contributing writer even if you're planning or potentially going on exchange! There won't be any issue at all — you can submit your articles no matter where you are.",
      },
    ],
  },
  {
    id: 'photographers',
    label: 'Featured Photographers',
    blurb: 'Shooting for Ignite, and what kit you need.',
    items: [
      {
        q: 'How does a featured photographer work?',
        a: "<p>Photo opportunities will be shared in the group chat. You may be asked to capture events, people, or venues, depending on the needs of the articles.</p><p>It's on a voluntary basis, so you don't have to take any photo gig if you're not free!</p>",
      },
      {
        q: 'Can I join as a featured photographer anytime I want?',
        a: 'Yes! You can sign up anytime during the year — no interview needed.',
      },
      {
        q: 'Do I need my own filming equipment as a feature photographer?',
        a: 'Yes, you are required to have your own professional filming equipment (e.g. digital cameras or DSLRs). Mobile photography is not permitted.',
      },
    ],
  },
]

// Only groups with at least one answered question are worth showing.
export const answeredGroups = () =>
  FAQ_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.a.trim()) })).filter(
    (g) => g.items.length
  )
