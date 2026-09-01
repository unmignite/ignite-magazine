// The magazine's sections. Nav, footer, section pages and the Studio all read
// from this list — add or rename a section here and it appears everywhere.
// `slug` is what gets stored on each article, so changing one means updating
// existing articles in the database too.
//
// Colours point at the themeable palette (see src/lib/theme.js) rather than
// fixed hex, so restyling the site in the Studio's Design panel updates every
// section chip, underline and accent automatically.

export const SECTIONS = [
  { slug: 'music', name: 'Music', color: 'var(--pink)', blurb: 'No filters, no censors. Just pure music journalism.' },
  { slug: 'film-tv', name: 'Film & TV', color: 'var(--red)', blurb: 'From the silver screen to the small screen — watched, dissected, adored.' },
  { slug: 'beauty-style', name: 'Beauty & Style', color: 'var(--yellow)', blurb: 'Runways, racks and everything your wardrobe is afraid to ask.' },
  { slug: 'opinions', name: 'Opinions', color: 'var(--green)', blurb: 'Loud thoughts, carefully written. Agree at your own risk.' },
  { slug: 'food-travel', name: 'Food & Travel', color: 'var(--orange)', blurb: 'Eat first, write later. Stories from plates and places.' },
  { slug: 'news', name: 'News', color: 'var(--red)', blurb: 'What is happening on campus and why it matters.' },
  { slug: 'sports', name: 'Sports', color: 'var(--green)', blurb: 'Sweat, rivalries and glory — varsity and beyond.' },
  { slug: 'notts-uncovered', name: 'Notts Uncovered', color: 'var(--orange)', blurb: 'The hidden corners of Nottingham, uncovered one story at a time.' },
]

export const sectionBySlug = (slug) => SECTIONS.find((s) => s.slug === slug)
