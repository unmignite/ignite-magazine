import { supabase, isSupabaseConfigured } from './supabase'

// Records that an article was read. Deliberately records nothing about WHO
// read it: no IP, no user agent, no cookie, no identifier. See the header of
// supabase/analytics.sql — keeping it anonymous is what lets the site run
// without a cookie banner.

const SEEN_KEY = 'ignite.viewed.v1'

// One view per article per browser session, so a reader scrolling back and
// forth doesn't inflate the count.
const alreadyCounted = (id) => {
  try {
    const seen = JSON.parse(sessionStorage.getItem(SEEN_KEY) || '[]')
    if (seen.includes(id)) return true
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id]))
    return false
  } catch {
    return false // private mode: count it, don't crash
  }
}

// Only the host, never the full referring URL (which can carry search terms
// and other personal detail).
const referrerHost = () => {
  try {
    if (!document.referrer) return null
    const host = new URL(document.referrer).hostname.replace(/^www\./, '')
    return host === window.location.hostname ? null : host
  } catch {
    return null
  }
}

export async function recordView(articleId, { isStaff = false } = {}) {
  if (!isSupabaseConfigured || !articleId) return
  // Don't count editors reading their own drafts and previews.
  if (isStaff) return
  if (navigator.webdriver) return // automated browsers
  if (document.visibilityState === 'hidden') return // prerender / background tab
  if (alreadyCounted(articleId)) return

  try {
    await supabase.from('article_views').insert({
      article_id: articleId,
      referrer_host: referrerHost(),
      device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
    })
  } catch {
    // Analytics must never break the page for a reader.
  }
}

export async function fetchOverview(days = 30) {
  const { data, error } = await supabase.rpc('analytics_overview', { days })
  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}
