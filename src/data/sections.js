// The magazine's sections. Nav, footer, section pages and the Studio all read
// from this list — add or rename a section here and it appears everywhere.
// `slug` is what gets stored on each article, so changing one means updating
// existing articles in the database too.

export const SECTIONS = [
  { slug: 'music', name: 'Music', color: '#ff10a3', blurb: 'No filters, no censors. Just pure music journalism.' },
  { slug: 'film-tv', name: 'Film & TV', color: '#f73630', blurb: 'From the silver screen to the small screen — watched, dissected, adored.' },
  { slug: 'beauty-style', name: 'Beauty & Style', color: '#ffed00', blurb: 'Runways, racks and everything your wardrobe is afraid to ask.' },
  { slug: 'opinions', name: 'Opinions', color: '#8acd01', blurb: 'Loud thoughts, carefully written. Agree at your own risk.' },
  { slug: 'food-travel', name: 'Food & Travel', color: '#fc4c00', blurb: 'Eat first, write later. Stories from plates and places.' },
  { slug: 'news', name: 'News', color: '#f73630', blurb: 'What is happening on campus and why it matters.' },
  { slug: 'sports', name: 'Sports', color: '#8acd01', blurb: 'Sweat, rivalries and glory — varsity and beyond.' },
  { slug: 'notts-uncovered', name: 'Notts Uncovered', color: '#fc4c00', blurb: 'The hidden corners of Nottingham, uncovered one story at a time.' },
  { slug: 'the-review', name: 'The Review', color: '#737373', blurb: 'Our flagship long-reads and annual print edition.' },
]

export const sectionBySlug = (slug) => SECTIONS.find((s) => s.slug === slug)
