// The homepage as data.
//
// The landing page is an ordered list of blocks stored in
// site_settings.homepage. Designers add, remove, reorder and configure them in
// Studio → Layout; this file is the single registry describing what each block
// is and which options it takes, so the editor builds its own forms and the
// renderer stays a simple switch.
//
// Adding a new block type means: describe it here, then render it in
// src/components/HomeBlocks.jsx. The editor needs no changes.

import { SECTIONS } from '../data/sections'

export const SOURCE_CHOICES = [
  { value: 'featured', label: 'Featured articles (★ in the Studio)' },
  { value: 'latest', label: 'Latest articles, any section' },
  ...SECTIONS.map((s) => ({ value: s.slug, label: s.name })),
]

export const BLOCK_TYPES = {
  hero: {
    label: 'Hero carousel',
    blurb: 'Full-screen covers that auto-advance. The A24-style landing.',
    fields: [
      { key: 'source', label: 'Show', type: 'source', default: 'featured' },
      { key: 'count', label: 'How many slides', type: 'number', min: 2, max: 12, default: 6 },
    ],
  },
  latest: {
    label: 'Latest — lead + list',
    blurb: 'One large story beside a stacked list. The classic front page.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', default: 'The Latest' },
      { key: 'source', label: 'Show', type: 'source', default: 'latest' },
      { key: 'count', label: 'Total articles', type: 'number', min: 2, max: 9, default: 5 },
    ],
  },
  'section-row': {
    label: 'Section row — grid',
    blurb: 'A heading and a row of article cards.',
    fields: [
      { key: 'source', label: 'Section', type: 'source', default: 'music' },
      { key: 'count', label: 'Articles', type: 'number', min: 2, max: 12, default: 3 },
      { key: 'heading', label: 'Heading (blank = section name)', type: 'text', default: '' },
    ],
  },
  carousel: {
    label: 'Article carousel',
    blurb: 'A horizontally scrolling row — good for long back catalogues.',
    fields: [
      { key: 'source', label: 'Show', type: 'source', default: 'film-tv' },
      { key: 'count', label: 'Articles', type: 'number', min: 3, max: 20, default: 8 },
      { key: 'heading', label: 'Heading (blank = section name)', type: 'text', default: '' },
    ],
  },
  image: {
    label: 'Full-width image',
    blurb: 'A striking image band. Upload or paste a URL.',
    fields: [
      { key: 'src', label: 'Image', type: 'image', default: '' },
      { key: 'caption', label: 'Caption / credit', type: 'text', default: '' },
      { key: 'height', label: 'Height (vh)', type: 'number', min: 20, max: 90, default: 55 },
    ],
  },
  banner: {
    label: 'Call-to-action banner',
    blurb: 'The loud black panel — recruiting, events, announcements.',
    fields: [
      { key: 'line1', label: 'Line 1', type: 'text', default: 'Embrace the unknown.' },
      { key: 'line2', label: 'Line 2', type: 'text', default: 'Explore the unseen.' },
      { key: 'line3', label: 'Line 3', type: 'text', default: 'Discover the unheard.' },
      { key: 'text', label: 'Supporting text', type: 'textarea', default: 'Ignite is written, shot, edited and designed by students of the University of Nottingham Malaysia. Writers, photographers, designers — we want you.' },
      { key: 'buttonLabel', label: 'Button label', type: 'text', default: 'Join Ignite' },
      { key: 'buttonUrl', label: 'Button link', type: 'text', default: 'https://www.instagram.com/unm_ignite/' },
    ],
  },
}

let seq = 0
export const newBlock = (type) => {
  const def = BLOCK_TYPES[type]
  const block = { id: `b${Date.now()}-${seq++}`, type }
  for (const f of def.fields) block[f.key] = f.default
  return block
}

// Fill in any option a saved block is missing (e.g. after a new field is added).
export const withDefaults = (block) => {
  const def = BLOCK_TYPES[block.type]
  if (!def) return block
  const out = { ...block }
  for (const f of def.fields) if (out[f.key] === undefined) out[f.key] = f.default
  return out
}

// The layout the site ships with — identical to the original hand-built
// homepage, so an untouched install looks exactly as designed.
export const DEFAULT_HOMEPAGE = [
  { id: 'd1', type: 'hero', source: 'featured', count: 6 },
  { id: 'd2', type: 'latest', heading: 'The Latest', source: 'latest', count: 5 },
  { id: 'd3', type: 'section-row', source: 'music', count: 3, heading: '' },
  { id: 'd4', type: 'section-row', source: 'film-tv', count: 3, heading: '' },
  { id: 'd5', type: 'section-row', source: 'beauty-style', count: 3, heading: '' },
  {
    id: 'd6',
    type: 'banner',
    line1: 'Embrace the unknown.',
    line2: 'Explore the unseen.',
    line3: 'Discover the unheard.',
    text: 'Ignite is written, shot, edited and designed by students of the University of Nottingham Malaysia. Writers, photographers, designers — we want you.',
    buttonLabel: 'Join Ignite',
    buttonUrl: 'https://www.instagram.com/unm_ignite/',
  },
]

// Resolve a block's `source` into actual articles.
export function articlesFor(source, articles, count) {
  const published = articles.filter((a) => a.status === 'published')
  const byDate = [...published].sort((a, b) => (a.date < b.date ? 1 : -1))

  if (source === 'featured') {
    const featured = byDate.filter((a) => a.featured)
    // Fall back to the newest stories so the hero is never empty.
    return (featured.length ? featured : byDate).slice(0, count)
  }
  if (source === 'latest') return byDate.slice(0, count)
  return byDate.filter((a) => a.section === source).slice(0, count)
}

export const sourceLabel = (source) =>
  SOURCE_CHOICES.find((c) => c.value === source)?.label || source
