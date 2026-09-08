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
    label: 'Latest — showcase',
    blurb: 'One big story in the middle with a column of smaller ones either side.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', default: 'The Latest' },
      { key: 'source', label: 'Fill empty slots from', type: 'source', default: 'latest' },
      { key: 'left', label: 'Stories down the left', type: 'number', min: 1, max: 5, default: 3 },
      { key: 'right', label: 'Stories down the right', type: 'number', min: 1, max: 5, default: 2 },
      { key: 'picks', label: 'Which story goes where', type: 'picks', default: {} },
    ],
    summary: (b) => `${sourceLabel(b.source)} · ${slotCount(b)} articles`,
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

// Object defaults (the showcase's `picks`) have to be copied out of the
// registry. Handing every block the same object would mean pinning a story in
// one showcase pinned it in all of them.
const cloneDefault = (v) => (v && typeof v === 'object' ? structuredClone(v) : v)

let seq = 0
export const newBlock = (type) => {
  const def = BLOCK_TYPES[type]
  const block = { id: `b${Date.now()}-${seq++}`, type }
  for (const f of def.fields) block[f.key] = cloneDefault(f.default)
  return block
}

// Fill in any option a saved block is missing (e.g. after a new field is added).
export const withDefaults = (block) => {
  const def = BLOCK_TYPES[block.type]
  if (!def) return block
  const out = { ...block }
  for (const f of def.fields) if (out[f.key] === undefined) out[f.key] = cloneDefault(f.default)
  return out
}

// The layout the site ships with — identical to the original hand-built
// homepage, so an untouched install looks exactly as designed.
export const DEFAULT_HOMEPAGE = [
  { id: 'd1', type: 'hero', source: 'featured', count: 6 },
  { id: 'd2', type: 'latest', heading: 'The Latest', source: 'latest', left: 3, right: 2, picks: {} },
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

// --- showcase slots ---------------------------------------------------------
//
// The showcase has named slots rather than a flat count, so a designer can pin
// a particular story to a particular position. Slot keys are stable — 'center',
// 'left-0', 'right-1' — which means lengthening a column never shuffles what is
// already pinned somewhere else.

const SIDES = ['left', 'right']

// Slots in reading order: down the left, the big one, then down the right.
export function slotsFor(block) {
  const side = (name) =>
    Array.from({ length: block[name] ?? (name === 'left' ? 3 : 2) }, (_, i) => ({
      key: `${name}-${i}`,
      label: `${name === 'left' ? 'Left' : 'Right'} ${i + 1}`,
      side: name,
    }))
  return [...side(SIDES[0]), { key: 'center', label: 'Centre — the big one', side: 'center' }, ...side(SIDES[1])]
}

export const slotCount = (block) => slotsFor(block).length

// Pair every slot with the article that belongs in it: whatever is pinned, and
// otherwise the next story from `source` that isn't already pinned elsewhere in
// this block — so nothing appears twice. A pin whose article has since been
// deleted or unpublished quietly reverts to automatic rather than leaving a hole.
export function resolveSlots(block, articles) {
  const slots = slotsFor(block)
  const picks = block.picks || {}
  const byId = new Map(articles.filter((a) => a.status === 'published').map((a) => [a.id, a]))

  const out = slots.map((s) => ({ ...s, article: byId.get(picks[s.key]) || null }))
  const taken = new Set(out.map((s) => s.article?.id).filter(Boolean))
  const pool = articlesFor(block.source, articles, slots.length + taken.size).filter(
    (a) => !taken.has(a.id)
  )

  // Centre first, then down each column. It gets the newest story in the normal
  // case, and — pointing a showcase at a thin section — it's the slot that
  // stays filled when there aren't enough articles to go round. A big empty
  // middle beside a full side column reads as broken.
  const order = out.map((_, i) => i).sort((a, b) => (out[b].side === 'center') - (out[a].side === 'center'))

  let next = 0
  for (const i of order) if (!out[i].article) out[i].article = pool[next++] || null
  return out
}

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
