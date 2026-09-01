// ============================================================================
// Security test — attacks our own database with nothing but the PUBLIC key.
// ============================================================================
// The publishable key ships inside the browser bundle, so anyone can extract it
// and make these exact calls. This script proves what they can and cannot do.
//
// Run it after any change to the policies in schema.sql:
//   node supabase/security-test.mjs
//
// Every check must PASS. A failure means the database is exposed — fix the
// policies before shipping.
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

// Read .env.local without adding a dependency.
const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

let passed = 0
let failed = 0

const check = (name, ok, detail) => {
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}`)
  if (detail) console.log(`        ${detail}`)
  ok ? passed++ : failed++
}

console.log('\nAttacking the database as an anonymous visitor')
console.log('using only the public key that ships in the browser.\n')

// --- 1. Reading published articles SHOULD work (that's the whole site) -------
{
  const { data, error } = await supabase.from('articles').select('id, title, status')
  check(
    'anon CAN read published articles',
    !error,
    error ? `unexpected error: ${error.message}` : `${data.length} article(s) visible`
  )

  // --- 2. ...but drafts must never appear --------------------------------
  const drafts = (data || []).filter((a) => a.status !== 'published')
  check(
    'anon CANNOT see drafts',
    drafts.length === 0,
    drafts.length ? `LEAKED ${drafts.length} draft(s): ${drafts.map((d) => d.title).join(', ')}` : 'no drafts returned'
  )
}

// --- 3. Writing must be refused --------------------------------------------
{
  const { error } = await supabase.from('articles').insert({
    slug: `attack-${Date.now()}`,
    title: 'Unauthorised article',
    section: 'news',
    status: 'published',
  })
  check('anon CANNOT insert an article', Boolean(error), error ? `blocked: ${error.message}` : 'INSERT SUCCEEDED — database is writable by the public')
}

// --- 4. Editing an existing article must change nothing ---------------------
{
  const { data, error } = await supabase
    .from('articles')
    .update({ title: 'DEFACED' })
    .neq('slug', '')
    .select()
  const changed = (data || []).length
  check(
    'anon CANNOT edit articles',
    changed === 0,
    changed ? `MODIFIED ${changed} row(s)` : `no rows modified${error ? ` (${error.message})` : ''}`
  )
}

// --- 5. Deleting must remove nothing ---------------------------------------
{
  const { data, error } = await supabase.from('articles').delete().neq('slug', '').select()
  const removed = (data || []).length
  check(
    'anon CANNOT delete articles',
    removed === 0,
    removed ? `DELETED ${removed} row(s)` : `no rows deleted${error ? ` (${error.message})` : ''}`
  )
}

// --- 6. Editor accounts must not be readable by the public ------------------
{
  const { data, error } = await supabase.from('profiles').select('id, name, role')
  const leaked = (data || []).length
  check(
    'anon CANNOT read editor profiles',
    Boolean(error) || leaked === 0,
    error ? `blocked: ${error.message}` : leaked ? `LEAKED ${leaked} profile(s)` : 'no rows returned'
  )
}

// --- 7. Nobody uploads images without logging in ---------------------------
{
  const { error } = await supabase.storage
    .from('article-images')
    .upload(`attack-${Date.now()}.txt`, new Blob(['unauthorised']))
  check('anon CANNOT upload to storage', Boolean(error), error ? `blocked: ${error.message}` : 'UPLOAD SUCCEEDED')
}

// ============================================================================
// Part 2 — the editor/admin boundary.
// ============================================================================
// Only runs if TEST_EDITOR_EMAIL / TEST_EDITOR_PASSWORD are set in .env.local.
// Use the SHARED editor account (never a personal admin one). This proves the
// limits the access model depends on: a Section Editor may write, but must not
// delete articles or change what appears on the landing carousel.

if (env.TEST_EDITOR_EMAIL && env.TEST_EDITOR_PASSWORD) {
  console.log('Signing in as a Section Editor to test the role boundary.\n')

  const ed = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  const { error: signInErr } = await ed.auth.signInWithPassword({
    email: env.TEST_EDITOR_EMAIL,
    password: env.TEST_EDITOR_PASSWORD,
  })

  if (signInErr) {
    check('editor can sign in', false, signInErr.message)
  } else {
    check('editor CAN sign in', true)

    // Should be allowed: see drafts, and create.
    const { data: all } = await ed.from('articles').select('id, status, featured')
    check('editor CAN see drafts', (all || []).some((a) => a.status !== 'published'),
      `${(all || []).length} article(s) visible`)

    const probeSlug = `role-test-${Date.now()}`
    const { data: made, error: insErr } = await ed
      .from('articles')
      .insert({ slug: probeSlug, title: 'Role boundary probe', section: 'news', status: 'draft' })
      .select()
      .single()
    check('editor CAN create an article', !insErr, insErr?.message)

    // Should be refused: featuring, and deleting.
    if (made) {
      const { error: featErr } = await ed.from('articles').update({ featured: true }).eq('id', made.id)
      check('editor CANNOT feature an article', Boolean(featErr), featErr?.message || 'FEATURE SUCCEEDED')

      const { data: del } = await ed.from('articles').delete().eq('id', made.id).select()
      check('editor CANNOT delete an article', (del || []).length === 0,
        (del || []).length ? 'DELETED its own article' : 'delete refused')

      // Clean up the probe using the admin key if one is available.
      if (env.SUPABASE_SECRET_KEY) {
        const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY)
        await admin.from('articles').delete().eq('slug', probeSlug)
        console.log('        (probe article cleaned up)')
      } else {
        console.log(`        NOTE: delete draft "${probeSlug}" in the Studio — no admin key to clean it up`)
      }
    }
    await ed.auth.signOut()
  }
} else {
  console.log('Skipping the editor/admin boundary tests.')
  console.log('To run them, add TEST_EDITOR_EMAIL and TEST_EDITOR_PASSWORD')
  console.log('(the shared editor account) to .env.local.')
}

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed ? 1 : 0)
