// The site's design tokens, in one place.
//
// These defaults mirror global.css exactly, so an untouched theme looks
// identical to the hand-built design. The Design panel edits this object and
// applyTheme() pushes it onto :root as CSS custom properties — which is why
// restyling the whole site (all 138 articles included) costs one save.

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
  { key: 'yellow', cssVar: '--yellow', label: 'Yellow', hint: 'Highlights, hover states, the join banner' },
  { key: 'pink', cssVar: '--pink', label: 'Pink', hint: 'Primary accent — logo dot, pull quotes, drop caps' },
  { key: 'red', cssVar: '--red', label: 'Red', hint: 'Film & TV, News, destructive buttons' },
  { key: 'green', cssVar: '--green', label: 'Brat green', hint: 'Opinions, Sports, published badges' },
  { key: 'orange', cssVar: '--orange', label: 'Orange', hint: 'Food & Travel, Notts Uncovered, drafts' },
  { key: 'black', cssVar: '--black', label: 'Black', hint: 'Text, nav borders, footer' },
  { key: 'white', cssVar: '--white', label: 'White', hint: 'Page background' },
  { key: 'grey', cssVar: '--grey', label: 'Grey', hint: 'Secondary text, deks' },
  { key: 'greyLight', cssVar: '--grey-light', label: 'Light grey', hint: 'Dividers, placeholders' },
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
  fonts: { ...DEFAULT_THEME.fonts, ...(saved?.fonts || {}) },
  hero: { ...DEFAULT_THEME.hero, ...(saved?.hero || {}) },
})

export function applyTheme(theme) {
  const root = document.documentElement
  const t = mergeTheme(theme)

  for (const { key, cssVar } of COLOR_FIELDS) {
    if (t.colors[key]) root.style.setProperty(cssVar, t.colors[key])
  }
  for (const { key, cssVar } of FONT_FIELDS) {
    if (t.fonts[key]) root.style.setProperty(cssVar, t.fonts[key])
  }
}
