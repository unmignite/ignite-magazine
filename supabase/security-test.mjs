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

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed ? 1 : 0)
