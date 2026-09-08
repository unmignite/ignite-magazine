import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The app shows a setup screen rather than white-screening when these are missing.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

export const IMAGE_BUCKET = 'article-images'

// The database uses snake_case; the React app uses camelCase.
// The must_read column arrives with supabase/must-read.sql. Until that has been
// run, sending the field would fail the entire save with "column
// articles.must_read does not exist", so the writer only includes it once the
// database has actually handed it back to us. That way the code and the
// migration can land in either order without breaking the Studio.
let hasMustRead = false
export const mustReadReady = () => hasMustRead

export function rowToArticle(row) {
  if ('must_read' in row) hasMustRead = true
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.dek ?? '',
    section: row.section,
    author: row.author ?? '',
    date: row.date,
    readTime: row.read_time ?? 4,
    cover: row.cover ?? '',
    coverCredit: row.cover_credit ?? '',
    tags: row.tags ?? [],
    featured: Boolean(row.featured),
    mustRead: Boolean(row.must_read),
    status: row.status,
    credits: row.credits ?? {},
    body: row.body ?? '',
  }
}

export const articleToRow = (a) => ({
  slug: a.slug,
  title: a.title,
  dek: a.dek ?? '',
  section: a.section,
  author: a.author ?? '',
  date: a.date,
  read_time: Number(a.readTime) || 4,
  cover: a.cover ?? '',
  cover_credit: a.coverCredit ?? '',
  tags: a.tags ?? [],
  featured: Boolean(a.featured),
  ...(hasMustRead ? { must_read: Boolean(a.mustRead) } : {}),
  status: a.status,
  credits: a.credits ?? {},
  body: a.body ?? '',
})

// Uploads an image to the public bucket and returns its permanent URL.
// Replaces the old base64-into-localStorage approach.
export async function uploadImage(file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false })

  if (error) throw new Error(`Image upload failed: ${error.message}`)

  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
}
