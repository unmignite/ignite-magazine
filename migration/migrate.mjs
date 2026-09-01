// ============================================================================
// One-time migration: unmignite.com (Wix) → Supabase
// ============================================================================
// Pulls every published post from the old Wix blog, converts each body to the
// clean semantic HTML this site renders, re-hosts every image into Supabase
// Storage, and upserts the result into public.articles.
//
//   node migration/migrate.mjs --limit 3 --dry-run   # inspect output, write nothing
//   node migration/migrate.mjs --limit 3             # migrate 3 posts for real
//   node migration/migrate.mjs                       # migrate everything
//
// Requires SUPABASE_SECRET_KEY in .env.local (gitignored). That key bypasses
// Row-Level Security, which is why it lives only on the machine running this
// and should be revoked once the migration is done.
//
// Safe to re-run: posts are upserted by slug, images by deterministic path, and
// completed slugs are recorded in migration/progress.json so an interrupted run
// resumes instead of starting over.
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { parse } from 'node-html-parser'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const PROGRESS_FILE = join(HERE, 'progress.json')
const SITE = 'https://www.unmignite.com'
const BLOG_APP_ID = '14bcded7-0066-7c35-14d7-466cb3f09103'

// Wix category id → our section slug (see src/data/sections.js)
const CATEGORY_MAP = {
  '09c38e5b-963e-49eb-9620-e94a294c79e2': 'food-travel',
  '4b3eda87-2734-45ab-8ae3-99250a795d8e': 'film-tv',
  'a45237ca-bafa-4685-8981-d25cf06adced': 'beauty-style',
  '5de8232d-f7ba-4651-a2a8-d94e9e7775e9': 'music',
  '8dea6fb7-c130-4848-8170-b97d7be0a05d': 'opinions',
  'fc0ab51e-b12b-4fbe-b7d6-a05eea477442': 'news',
  'cd029b44-5648-4433-a775-d967c9fc4f43': 'notts-uncovered',
  '249d8bdb-3805-484b-ba00-e781f0dbc9c9': 'sports',
}

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const LIMIT = (() => {
  const i = args.indexOf('--limit')
  return i !== -1 ? Number(args[i + 1]) : Infinity
})()

// ---------------------------------------------------------------- env + client

const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const SUPABASE_URL = env.VITE_SUPABASE_URL
const SECRET = env.SUPABASE_SECRET_KEY

if (!DRY_RUN && !SECRET) {
  console.error(
    '\nMissing SUPABASE_SECRET_KEY in .env.local.\n' +
    'Add it (Supabase dashboard → Project Settings → API → secret key), or\n' +
    'run with --dry-run to preview the conversion without writing anything.\n'
  )
  process.exit(1)
}

const supabase = DRY_RUN ? null : createClient(SUPABASE_URL, SECRET, {
  auth: { persistSession: false },
})

// ---------------------------------------------------------------- helpers

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Wix drops connections under load; retry with backoff.
async function fetchRetry(url, opts = {}, tries = 4) {
  let lastErr
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, opts)
      if (r.status >= 500) throw new Error(`HTTP ${r.status}`)
      return r
    } catch (e) {
      lastErr = e
      await sleep(800 * (i + 1))
    }
  }
  throw lastErr
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  hellip: '…', mdash: '—', ndash: '–', middot: '·',
}

// The source HTML already contains entities (&quot;, &#x27;). Escaping those
// again would turn "&quot;" into the literal text &quot; on the page, so they
// must be decoded to real characters BEFORE re-escaping.
const decodeEntities = (s) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x'
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10)
      return Number.isFinite(n) && n > 0 ? String.fromCodePoint(n) : whole
    }
    const key = code.toLowerCase()
    return key in NAMED_ENTITIES ? NAMED_ENTITIES[key] : whole
  })

// Rebuild a paragraph's inner HTML, keeping meaning (bold/italic/links) and
// discarding Wix's presentation classes so our stylesheet takes over.
function inlineHtml(node) {
  let out = ''
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      out += escapeHtml(decodeEntities(child.rawText ?? ''))
      continue
    }
    if (child.nodeType !== 1) continue

    const tag = child.rawTagName?.toLowerCase()
    const inner = inlineHtml(child)
    if (!inner.trim() && tag !== 'br') continue

    if (tag === 'strong' || tag === 'b') out += `<strong>${inner}</strong>`
    else if (tag === 'em' || tag === 'i') out += `<em>${inner}</em>`
    else if (tag === 'u') out += `<u>${inner}</u>`
    else if (tag === 'br') out += '<br />'
    else if (tag === 'a') {
      const href = child.getAttribute('href')
      out += href ? `<a href="${href}">${inner}</a>` : inner
    } else {
      out += inner // unwrap spans/divs
    }
  }
  return out
}

// Normalise any Wix image URL to a web-sized version, and give it a stable id.
function wixImage(src) {
  const m = src?.match(/\/media\/([^/?]+)/)
  if (!m) return null
  const mediaId = m[1]
  return {
    mediaId,
    downloadUrl: `https://static.wixstatic.com/media/${mediaId}/v1/fit/w_1600,h_1600,q_85/${mediaId}`,
    storagePath: `migrated/${mediaId.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
  }
}

// ---------------------------------------------------------------- extraction

async function getInstanceToken() {
  const r = await fetchRetry(`${SITE}/_api/v1/access-tokens`)
  const j = await r.json()
  return j.apps[BLOG_APP_ID].instance
}

async function listAllPosts(instance) {
  const all = []
  let offset = 0
  while (true) {
    const r = await fetchRetry(
      `${SITE}/_api/communities-blog-node-api/_api/posts?offset=${offset}&size=50`,
      { headers: { instance } }
    )
    const batch = await r.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    all.push(...batch)
    if (batch.length < 50) break
    offset += 50
  }
  return all
}

const normalise = (s) => s.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

// Wix repeats the excerpt as the first body paragraph on most posts. Our
// article page already shows the dek as a standfirst, so keeping both would
// print the same sentence twice — once italic, once with a drop cap.
function dropDuplicateIntro(parts, dek) {
  if (!dek || !parts.length) return parts
  const first = parts[0]
  if (!first.startsWith('<p>')) return parts
  const a = normalise(first).slice(0, 60)
  const b = normalise(dek).slice(0, 60)
  return a && a === b ? parts.slice(1) : parts
}

// Turn a post page into { bodyHtml, images[], cover, tags[] }
function extractPost(html, dek = '') {
  const root = parse(html)

  const cover = html.match(/property="og:image" content="([^"]+)"/)?.[1] || ''

  const tags = root
    .querySelectorAll('a[href*="/tags/"]')
    .map((a) => a.text.trim())
    .filter(Boolean)

  const images = []
  const parts = []

  for (const block of root.querySelectorAll('[data-breakout]')) {
    const heading = block.querySelector('h1,h2,h3,h4,h5,h6')
    const img = block.querySelector('img')
    const quote = block.querySelector('blockquote')
    const para = block.querySelector('p')

    if (heading) {
      const inner = inlineHtml(heading)
      // Wix uses h2–h6 loosely; our design has two levels.
      const level = /h[12]/.test(heading.rawTagName) ? 'h2' : 'h3'
      if (inner.trim()) parts.push(`<${level}>${inner}</${level}>`)
    } else if (quote) {
      const inner = inlineHtml(quote)
      if (inner.trim()) parts.push(`<blockquote><p>${inner}</p></blockquote>`)
    } else if (img) {
      const info = wixImage(img.getAttribute('src') || '')
      if (info) {
        images.push(info)
        parts.push(`<img src="__IMG__${info.mediaId}__" alt="" />`)
      }
    } else if (para) {
      const inner = inlineHtml(para)
      if (inner.trim()) parts.push(`<p>${inner}</p>`)
    }
  }

  const coverInfo = wixImage(cover)
  if (coverInfo) images.push(coverInfo)

  return {
    bodyHtml: dropDuplicateIntro(parts, dek).join('\n'),
    images,
    coverMediaId: coverInfo?.mediaId || null,
    tags: [...new Set(tags)].slice(0, 6),
  }
}

// ---------------------------------------------------------------- image hosting

const uploadedCache = new Map()

async function rehostImage(info) {
  if (uploadedCache.has(info.mediaId)) return uploadedCache.get(info.mediaId)

  const publicUrl = supabase.storage.from('article-images').getPublicUrl(info.storagePath).data.publicUrl

  // Already re-hosted by an earlier run? Reuse it rather than downloading
  // hundreds of megabytes again.
  try {
    const head = await fetch(publicUrl, { method: 'HEAD' })
    if (head.ok) {
      uploadedCache.set(info.mediaId, publicUrl)
      return publicUrl
    }
  } catch { /* fall through and upload */ }

  const res = await fetchRetry(info.downloadUrl)
  if (!res.ok) throw new Error(`image download failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())

  const ext = (info.mediaId.split('.').pop() || 'jpg').toLowerCase()
  const contentType =
    ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg'

  const { error } = await supabase.storage
    .from('article-images')
    .upload(info.storagePath, buf, { contentType, cacheControl: '31536000', upsert: true })

  if (error) throw new Error(`image upload failed: ${error.message}`)

  const url = supabase.storage.from('article-images').getPublicUrl(info.storagePath).data.publicUrl
  uploadedCache.set(info.mediaId, url)
  return url
}

// ---------------------------------------------------------------- main

const progress = existsSync(PROGRESS_FILE)
  ? JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'))
  : { done: [] }

const saveProgress = () => writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 1))

console.log(`\nMigration — ${DRY_RUN ? 'DRY RUN (nothing will be written)' : 'LIVE'}\n`)

const instance = await getInstanceToken()
const posts = await listAllPosts(instance)
console.log(`Found ${posts.length} posts on the old site.`)

const todo = posts.filter((p) => !progress.done.includes(p.slug)).slice(0, LIMIT)
console.log(`Migrating ${todo.length} (${progress.done.length} already done).\n`)

let ok = 0
let failed = 0
const samples = []

for (const [i, post] of todo.entries()) {
  const label = `[${i + 1}/${todo.length}] ${post.slug.slice(0, 52)}`
  try {
    const html = await (await fetchRetry(`${SITE}/post/${post.slug}`)).text()
    const dek = (post.excerpt || '').trim()
    const { bodyHtml, images, coverMediaId, tags } = extractPost(html, dek)

    let body = bodyHtml
    let cover = ''

    if (!DRY_RUN) {
      for (const info of images) {
        const url = await rehostImage(info)
        body = body.split(`__IMG__${info.mediaId}__`).join(url)
        if (info.mediaId === coverMediaId) cover = url
      }
    } else {
      for (const info of images) body = body.split(`__IMG__${info.mediaId}__`).join(`[image: ${info.mediaId}]`)
    }

    const section = CATEGORY_MAP[(post.categoryIds || [])[0]] || 'news'

    const row = {
      slug: post.slug,
      title: post.title || 'Untitled',
      dek,
      section,
      author: post.owner?.name || 'Ignite',
      date: (post.firstPublishedDate || new Date().toISOString()).slice(0, 10),
      read_time: post.timeToRead || 4,
      cover,
      cover_credit: '',
      tags,
      // `featured` is deliberately omitted. It is an editorial choice made in
      // the Studio, not something to inherit from Wix — and leaving it out
      // means re-running this migration never clobbers a curated carousel
      // (nor trips the admin-only guard on that column).
      status: 'published',
      credits: { writer: post.owner?.name || '', editor: '', chief: '' },
      body,
    }

    if (DRY_RUN) {
      samples.push({ ...row, body: body.slice(0, 600) + (body.length > 600 ? '…' : ''), imageCount: images.length })
      console.log(`  ok   ${label}  (${images.length} images, ${bodyHtml.length} chars)`)
    } else {
      const { error } = await supabase.from('articles').upsert(row, { onConflict: 'slug' })
      if (error) throw new Error(error.message)
      progress.done.push(post.slug)
      saveProgress()
      console.log(`  ok   ${label}  (${images.length} images)`)
    }
    ok++
  } catch (e) {
    console.log(`  FAIL ${label}\n       ${e.message}`)
    failed++
  }
}

if (DRY_RUN && samples.length) {
  writeFileSync(join(HERE, 'dry-run-sample.json'), JSON.stringify(samples, null, 2))
  console.log(`\nWrote migration/dry-run-sample.json for inspection.`)
}

console.log(`\nDone. ${ok} succeeded, ${failed} failed.`)
if (!DRY_RUN) console.log(`Total migrated so far: ${progress.done.length}/${posts.length}\n`)
