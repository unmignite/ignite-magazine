// The magazine's sections. Nav, footer, section pages and the Studio all read
// from this list — add or rename a section here and it appears everywhere.
// `slug` is what gets stored on each article, so changing one means updating
// existing articles in the database too.
//
// Each section owns a colour in the Design panel's "Section colours" palette,
// reached here as --sec-<slug>. That palette is separate from the brand palette
// and from the status colours, so a section can be recoloured without touching
// the logo dot, and a delete button stays red no matter what the sections do.
//
// Every section also has an "ink" — the same colour when it's dark enough to
// read on a white page, black when it isn't. It's derived automatically in
// src/lib/theme.js; you never set it by hand. Use `color` for fills (chips, the
// black section banner) and `ink` for hairlines on white (underlines, drop
// caps, pull-quote bars) — see accentVars() below.

export const SECTIONS = [
  { slug: 'music', name: 'Music', blurb: 'No filters, no censors. Just pure music journalism.' },
  { slug: 'film-tv', name: 'Film & TV', blurb: 'From the silver screen to the small screen — watched, dissected, adored.' },
  { slug: 'beauty-style', name: 'Beauty & Style', blurb: 'Runways, racks and everything your wardrobe is afraid to ask.' },
  { slug: 'opinions', name: 'Opinions', blurb: 'Loud thoughts, carefully written. Agree at your own risk.' },
  { slug: 'food-travel', name: 'Food & Travel', blurb: 'Eat first, write later. Stories from plates and places.' },
  { slug: 'news', name: 'News', blurb: 'What is happening on campus and why it matters.' },
  { slug: 'sports', name: 'Sports', blurb: 'Sweat, rivalries and glory — varsity and beyond.' },
  { slug: 'notts-uncovered', name: 'Notts Uncovered', blurb: 'The hidden corners of Nottingham, uncovered one story at a time.' },
].map((s) => ({
  ...s,
  color: `var(--sec-${s.slug})`,
  ink: `var(--sec-${s.slug}-ink)`,
}))

export const sectionBySlug = (slug) => SECTIONS.find((s) => s.slug === slug)

// Spread onto any element that should take a section's colour. Children then
// read var(--accent) for fills and var(--accent-ink) for lines on white.
// Pass nothing (an unknown section) and it falls back to the brand accent.
export const accentVars = (section) => ({
  '--accent': section?.color ?? 'var(--pink)',
  '--accent-ink': section?.ink ?? 'var(--pink)',
})
