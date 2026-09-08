// ============================================================================
// Backfill: image credits from the archived Wix site → Supabase
// ============================================================================
// The original migration read each image's caption and threw it away — it wrote
// alt="" and dropped the <figcaption> — so every photographer credit in the
// body of every migrated article was lost. This puts them back.
//
//   node migration/backfill-captions.mjs --dry-run          # report, write nothing
//   node migration/backfill-captions.mjs --limit 3          # do three, for real
//   node migration/backfill-captions.mjs                    # do the lot
//
// Credits are stored in the img's alt attribute, NOT as <figure><figcaption>.
// That is deliberate and was measured, not guessed: running figure/figcaption
// markup through the Studio's editor configuration returns
//     <img src="…"><p>Photo Credits: …</p>
// — the caption survives as a stray body paragraph. alt comes back untouched.
// So the credit lives in alt, where an editor opening and saving an article
// cannot destroy it, and src/pages/Article.jsx builds the visible <figcaption>
// from it at render time.
//
// Requires SUPABASE_SECRET_KEY in .env.local. Safe to re-run: it only ever
// fills in a credit that is missing, and never overwrites one that is there.
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { parse } from 'node-html-parser'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')

// The custom domain now points at the new site, so the old posts are only
// reachable at the Wix-hosted address the archived site kept.
const OLD_SITE = 'https://unmignite.wixsite.com/ignite'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const LIMIT = (() => {
  const i = args.indexOf('--limit')
  return i !== -1 ? Number(args[i + 1]) : Infinity
})()

const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

if (!env.SUPABASE_SECRET_KEY) {
  console.error('SUPABASE_SECRET_KEY missing from .env.local')
  process.exit(1)
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
})

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchRetry(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
      if (res.ok) return res
      if (res.status === 404) return res
    } catch { /* network hiccup — fall through to the retry */ }
    await sleep(800 * (i + 1))
  }
  throw new Error(`fetch failed after ${tries} tries: ${url}`)
}

// The migration stored images at migrated/<mediaId with odd characters
// replaced>, so this is how a Wix media id maps to the filename in our bucket.
const storageName = (mediaId) => mediaId.replace(/[^a-zA-Z0-9._-]/g, '_')

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Pull { storage filename → credit } out of an archived post.
//
// Wix puts the same text in two places — the figcaption under the image and the
// img's alt — so take the figcaption and fall back to alt.
function creditsFromPost(html) {
  const root = parse(html)
  const out = new Map()

  for (const fig of root.querySelectorAll('figure')) {
    const img = fig.querySelector('img')
    if (!img) continue

    const caption = (fig.querySelector('figcaption')?.text || img.getAttribute('alt') || '').trim()
    if (!caption) continue

    // The <wow-image> wrapper carries the unresized media id; the img src is a
    // thumbnail URL that contains it too.
    const mediaId =
      fig.querySelector('wow-image')?.getAttribute('id') ||
      img.getAttribute('src')?.match(/\/media\/([^/?]+)/)?.[1]
    if (!mediaId) continue

    out.set(storageName(mediaId), caption.replace(/\s+/g, ' '))
  }
  return out
}

// Put the credit into each img's alt, leaving everything else alone. Only fills
// blanks: an alt somebody has already written by hand is left as it is.
function applyCredits(body, credits) {
  let filled = 0
  let missing = 0

  const next = body.replace(/<img\b[^>]*>/g, (tag) => {
    const src = tag.match(/src="([^"]*)"/)?.[1] || ''
    const file = src.split('/').pop()
    const existing = tag.match(/alt="([^"]*)"/)?.[1] || ''
    if (existing.trim()) return tag

    const credit = credits.get(file)
    if (!credit) {
      missing++
      return tag
    }

    filled++
    const withAlt = /alt="[^"]*"/.test(tag)
      ? tag.replace(/alt="[^"]*"/, `alt="${escapeAttr(credit)}"`)
      : tag.replace(/<img\b/, `<img alt="${escapeAttr(credit)}"`)
    return withAlt
  })

  return { body: next, filled, missing }
}

// ---------------------------------------------------------------------- run

const { data: articles, error } = await supabase
  .from('articles')
  .select('id, slug, title, body, cover, cover_credit')
  .order('date', { ascending: false })

if (error) {
  console.error('could not read articles:', error.message)
  process.exit(1)
}

const todo = articles.slice(0, LIMIT)
console.log(`${todo.length} article(s)${DRY_RUN ? ' — DRY RUN, nothing will be written' : ''}\n`)

let totalFilled = 0
let totalMissing = 0
let totalCovers = 0
let changedArticles = 0
const problems = []

for (const [i, a] of todo.entries()) {
  const label = `[${i + 1}/${todo.length}] ${a.slug.slice(0, 56)}`
  const imgCount = (a.body.match(/<img\b/g) || []).length
  const needsCover = !((a.cover_credit || '').trim())

  if (!imgCount && !needsCover) {
    console.log(`${label} — no images, skipped`)
    continue
  }

  try {
    const res = await fetchRetry(`${OLD_SITE}/post/${a.slug}`)
    if (res.status === 404) {
      problems.push(`${a.slug}: not found on the archived site`)
      console.log(`${label} — 404 on the old site`)
      continue
    }

    const credits = creditsFromPost(await res.text())
    const { body, filled, missing } = applyCredits(a.body, credits)

    // The cover is one of the same images, so it usually has a credit too.
    const coverFile = (a.cover || '').split('/').pop()
    const coverCredit = needsCover ? credits.get(coverFile) : null

    totalFilled += filled
    totalMissing += missing
    if (coverCredit) totalCovers++

    const changed = body !== a.body || Boolean(coverCredit)
    if (changed) changedArticles++

    console.log(
      `${label} — ${filled}/${imgCount} credited` +
        (missing ? `, ${missing} without a match` : '') +
        (coverCredit ? ', cover credited' : '')
    )

    if (changed && !DRY_RUN) {
      const patch = { body }
      if (coverCredit) patch.cover_credit = coverCredit
      const { error: err } = await supabase.from('articles').update(patch).eq('id', a.id)
      if (err) throw new Error(err.message)
    }
  } catch (e) {
    problems.push(`${a.slug}: ${e.message}`)
    console.log(`${label} — FAILED: ${e.message}`)
  }

  await sleep(350) // be gentle with the archived site
}

console.log('\n----------------------------------------')
console.log(`articles changed:      ${changedArticles}`)
console.log(`image credits filled:  ${totalFilled}`)
console.log(`cover credits filled:  ${totalCovers}`)
console.log(`images with no match:  ${totalMissing}`)
if (problems.length) {
  console.log(`\nproblems (${problems.length}):`)
  for (const p of problems) console.log('  ' + p)
}
if (DRY_RUN) console.log('\nDRY RUN — nothing was written.')
