import { Navigate, useParams } from 'react-router-dom'

// Keeps links to the old Wix site working.
//
// Years of Instagram posts, shared links and Google results point at the old
// URL shapes. When unmignite.com starts serving this site, those must not 404 —
// so we translate them to the equivalent page here.
//
//   /post/<slug>          → /article/<slug>
//   /music, /film-tv …    → /section/<slug>
//   /sports-1             → /section/sports          (Wix's suffixed slugs)
//   /notts-uncovered-1    → /section/notts-uncovered
//   /the-review           → /articles                (section no longer exists)
//
// Safe to keep indefinitely; it costs nothing and old links live a long time.

export const LEGACY_SECTION_PATHS = {
  'music': 'music',
  'film-tv': 'film-tv',
  'beauty-style': 'beauty-style',
  'opinions': 'opinions',
  'food-travel': 'food-travel',
  'news': 'news',
  'sports-1': 'sports',
  'sports': 'sports',
  'notts-uncovered-1': 'notts-uncovered',
  'notts-uncovered': 'notts-uncovered',
}

// /post/:slug — the old article URL shape.
export function LegacyPostRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/article/${slug}`} replace />
}

// Where a bare old path like /music or /sports-1 should go, or null if it
// isn't a legacy URL at all. A plain function so the caller can fall through
// to the 404 page — a component can't signal "no match" by returning null,
// because the element itself is always truthy.
export function legacyTargetFor(pathname) {
  const first = pathname.split('/').filter(Boolean)[0]
  if (!first) return null
  if (LEGACY_SECTION_PATHS[first]) return `/section/${LEGACY_SECTION_PATHS[first]}`
  if (first === 'the-review') return '/articles'
  return null
}
