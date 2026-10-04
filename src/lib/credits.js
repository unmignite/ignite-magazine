// Who worked on an article.
//
// Credits used to be three fixed keys — writer, editor, chief — set once when
// the article was created and never shown in the Studio again. That had two
// problems: a second editor had nowhere to go, and because nothing displayed
// them, the editor silently stayed as whoever happened to be logged in.
//
// They're an ordered list of { role, name } now, so a masthead can be as long
// as the work needs. The three-key shape is still read back, so the articles
// carrying it keep their credits without being re-saved.

// Offered as suggestions, not enforced — the roles box takes any text, because
// a magazine invents a credit line the moment someone does a new kind of job.
export const ROLE_CHOICES = [
  'Writer / Journalist',
  'Editor',
  'Co-Editor',
  'Editor-in-Chief',
  'Co-Editor-in-Chief',
  'Sub-Editor',
  'Photographer',
  'Illustrator',
  'Designer',
]

// What a new article starts with: the shape, spelled out, with nothing filled
// in. Deliberately not seeded from the logged-in user — the person typing an
// article into the Studio is very often not the person who wrote or edited it.
export const STARTER_CREDITS = [
  { role: 'Writer / Journalist', name: '' },
  { role: 'Editor', name: '' },
]

const LEGACY_ORDER = [
  ['writer', 'Writer / Journalist'],
  ['editor', 'Editor'],
  ['chief', 'Co-Editor-in-Chief'],
]

const clean = (v) => String(v ?? '').trim()

// Either shape in, a clean list out. Rows with no name are dropped, so a blank
// row left behind in the editor never reaches a reader.
export function creditList(credits) {
  if (Array.isArray(credits)) {
    return credits
      .filter((c) => c && typeof c === 'object' && clean(c.name))
      .map((c) => ({ role: clean(c.role) || 'Credit', name: clean(c.name) }))
  }
  if (!credits || typeof credits !== 'object') return []
  return LEGACY_ORDER
    .filter(([key]) => clean(credits[key]))
    .map(([key, role]) => ({ role, name: clean(credits[key]) }))
}

// The list as the editor should show it: real credits if there are any, the
// empty shape if there are none, so an article with nothing on it still says
// what belongs there.
export const creditsForEditing = (credits) => {
  const list = creditList(credits)
  return list.length ? list : STARTER_CREDITS.map((c) => ({ ...c }))
}
