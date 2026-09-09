// The site's design tokens, in one place.
//
// These defaults mirror global.css exactly, so an untouched theme looks
// identical to the hand-built design. The Design panel edits this object and
// applyTheme() pushes it onto :root as CSS custom properties — which is why
// restyling the whole site (all 138 articles included) costs one save.
//
// There are THREE separate palettes, deliberately kept apart:
//
//   colors    the editorial brand palette — logo dot, hover highlights, pull
//             quotes, the join banner. Decorative.
//   sections  one colour per section, used for chips and section headers.
//   status    what a colour MEANS in the Studio — danger, draft, published.
//
// They used to be a single palette, which meant you couldn't make Music white
// without also whitening the logo dot, and couldn't recolour News without
// recolouring every delete button. Splitting them is the whole point: each
// palette can now move on its own.

import { SECTIONS } from '../data/sections'

export const FONT_CHOICES = [
  { label: 'League Spartan (display)', value: "'League Spartan', 'Arial Black', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', 'Helvetica Neue', Arial, sans-serif" },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Helvetica / Arial', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: 'Courier (monospace)', value: "'Courier New', Courier, monospace" },
]

// `label` here is only the starting name. Designers can rename each swatch in
// the Design panel (a palette whose primary is green shouldn't say "Pink"), and
// the chosen names are stored in theme.labels. Renaming is purely cosmetic —
// the underlying token key and CSS variable never change, so nothing breaks.
export const COLOR_FIELDS = [
  { key: 'yellow', cssVar: '--yellow', label: 'Yellow', hint: 'Highlights and hover states' },
  { key: 'pink', cssVar: '--pink', label: 'Pink', hint: 'Primary accent — logo dot, pull quotes, links' },
  { key: 'red', cssVar: '--red', label: 'Red', hint: 'The join banner and editorial flourishes' },
  { key: 'green', cssVar: '--green', label: 'Brat green', hint: 'The join banner and editorial flourishes' },
  { key: 'orange', cssVar: '--orange', label: 'Orange', hint: 'Editorial flourishes' },
  { key: 'black', cssVar: '--black', label: 'Black', hint: 'Text, nav borders, footer' },
  { key: 'white', cssVar: '--white', label: 'White', hint: 'Page background' },
  { key: 'grey', cssVar: '--grey', label: 'Grey', hint: 'Secondary text, deks' },
  { key: 'greyLight', cssVar: '--grey-light', label: 'Light grey', hint: 'Dividers, placeholders' },
]

// One swatch per section, generated from the section list so adding a section
// in src/data/sections.js automatically gives it a colour control here.
export const SECTION_FIELDS = SECTIONS.map((s) => ({
  key: s.slug,
  cssVar: `--sec-${s.slug}`,
  inkVar: `--sec-${s.slug}-ink`,
  label: s.name,
}))

// Colours that carry meaning rather than style. These are the ones you should
// think twice about: red reads as "this deletes something" everywhere on the
// web, so changing it changes what the button communicates, not just how it
// looks.
export const STATUS_FIELDS = [
  { key: 'danger', cssVar: '--danger', label: 'Danger', hint: 'Delete buttons and anything irreversible' },
  { key: 'draft', cssVar: '--draft', label: 'Draft', hint: 'Unpublished articles in the Studio' },
  { key: 'published', cssVar: '--published', label: 'Published', hint: 'Live articles and saved-successfully flashes' },
]

export const FONT_FIELDS = [
  { key: 'display', cssVar: '--font-display', label: 'Display font', hint: 'Headlines, logo, buttons' },
  { key: 'body', cssVar: '--font-body', label: 'Body font', hint: 'Article text and navigation' },
  { key: 'serif', cssVar: '--font-serif', label: 'Accent font', hint: 'Italic deks and pull quotes' },
]

// Default swatch names, derived from COLOR_FIELDS so a newly added colour
// automatically gets a sensible starting name.
export const DEFAULT_LABELS = Object.fromEntries(
  COLOR_FIELDS.map((f) => [f.key, f.label])
)

export const DEFAULT_THEME = {
  labels: DEFAULT_LABELS,
  colors: {
    black: '#0a0a0a',
    white: '#ffffff',
    grey: '#737373',
    greyLight: '#e8e8e6',
    yellow: '#ffed00',
    red: '#f73630',
    pink: '#ff10a3',
    green: '#8acd01',
    orange: '#fc4c00',
  },
  // Every section starts white — the monochrome editorial look. Give one a
  // colour here and only that section changes; nothing else on the site moves.
  sections: Object.fromEntries(SECTIONS.map((s) => [s.slug, '#ffffff'])),
  // The italic line under a section's title. Starts as the copy written in
  // src/data/sections.js and is editable in Studio → Design from then on, so
  // rewording one doesn't need a developer.
  blurbs: Object.fromEntries(SECTIONS.map((s) => [s.slug, s.blurb])),
  status: {
    danger: '#f73630',
    draft: '#fc4c00',
    published: '#8acd01',
  },
  fonts: {
    display: "'League Spartan', 'Arial Black', sans-serif",
    body: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
    serif: "'Times New Roman', Times, serif",
  },
  hero: {
    intervalMs: 6000,
  },
}

// Saved themes may be partial or from an older version — merge over defaults so
// a missing key never blanks out the site.
export const mergeTheme = (saved) => ({
  labels: { ...DEFAULT_LABELS, ...(saved?.labels || {}) },
  colors: { ...DEFAULT_THEME.colors, ...(saved?.colors || {}) },
  sections: { ...DEFAULT_THEME.sections, ...(saved?.sections || {}) },
  blurbs: { ...DEFAULT_THEME.blurbs, ...(saved?.blurbs || {}) },
  status: { ...DEFAULT_THEME.status, ...(saved?.status || {}) },
  fonts: { ...DEFAULT_THEME.fonts, ...(saved?.fonts || {}) },
  hero: { ...DEFAULT_THEME.hero, ...(saved?.hero || {}) },
})

// --- readable ink -----------------------------------------------------------
//
// A section colour has two jobs. On the black section banner it's a fill, so
// white is perfect. On a white page it's a hairline — an underline, a drop cap,
// a pull-quote bar — and there a white (or yellow) accent is simply invisible.
//
// So every section colour gets a companion "ink": the same colour when it's
// dark enough to read on white, and black when it isn't. Derived automatically,
// so the Design panel stays one swatch per section and nothing can vanish.

const srgbToLinear = (c) =>
  c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

// WCAG relative luminance. Returns null for anything that isn't a 3- or 6-digit
// hex, so a half-typed value in the colour field can't crash the page.
function luminance(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim())
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const [r, g, b] = [0, 2, 4].map((i) => srgbToLinear(parseInt(h.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Below this contrast against white, a 2–3px line reads as nothing at all.
// White scores 1.0, yellow 1.21, brat green 1.94 — all fall back to black.
// Orange (3.4), pink (3.6) and red (3.8) keep their colour.
const MIN_CONTRAST_ON_WHITE = 2.5

export function readableInk(hex, fallback = 'var(--black)') {
  const l = luminance(hex)
  if (l === null) return fallback
  return (1.05 / (l + 0.05)) < MIN_CONTRAST_ON_WHITE ? fallback : hex
}

export function applyTheme(theme) {
  const root = document.documentElement
  const t = mergeTheme(theme)

  for (const { key, cssVar } of COLOR_FIELDS) {
    if (t.colors[key]) root.style.setProperty(cssVar, t.colors[key])
  }
  for (const { key, cssVar, inkVar } of SECTION_FIELDS) {
    const c = t.sections[key]
    if (!c) continue
    root.style.setProperty(cssVar, c)
    root.style.setProperty(inkVar, readableInk(c, t.colors.black))
  }
  for (const { key, cssVar } of STATUS_FIELDS) {
    if (t.status[key]) root.style.setProperty(cssVar, t.status[key])
  }
  for (const { key, cssVar } of FONT_FIELDS) {
    if (t.fonts[key]) root.style.setProperty(cssVar, t.fonts[key])
  }
}
