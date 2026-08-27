import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  supabase,
  isSupabaseConfigured,
  rowToArticle,
  articleToRow,
} from '../lib/supabase'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)          // session + profile (name, role)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // --- 1. Track the auth session -------------------------------------------
  // Nothing async runs inside onAuthStateChange: calling back into supabase
  // from that callback can deadlock the client, so we only store the session
  // here and react to it in the effects below.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => sub.subscription.unsubscribe()
  }, [])

  // --- 2. Load the profile (name + role) for the logged-in user ------------
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true

    if (!session?.user) {
      setUser(null)
      return
    }

    ;(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!active) return
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: data?.name || session.user.email.split('@')[0],
        role: data?.role || 'editor',
      })
    })()

    return () => { active = false }
  }, [session])

  // --- 3. Load articles, and reload when who's asking changes --------------
  // Row-Level Security decides what comes back: the public gets published
  // articles, logged-in staff also get drafts. The query is the same either way.
  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const { data, error: err } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false })

    if (err) {
      setError(err.message)
      return
    }
    setError('')
    setArticles((data || []).map(rowToArticle))
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      await refresh()
      if (active) setLoading(false)
    })()
    return () => { active = false }
  }, [refresh, user])

  const api = useMemo(() => ({
    articles,
    user,
    loading,
    error,
    refresh,

    async login(email, password) {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (err) return { ok: false, error: err.message }
      return { ok: true }
    },

    async logout() {
      await supabase.auth.signOut()
    },

    getArticle(idOrSlug) {
      return articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug)
    },

    // Insert when the article has no database id yet, update otherwise.
    // Returns { ok, article?, error? } — the caller decides what to show.
    async saveArticle(article) {
      const row = articleToRow(article)

      if (article.id) {
        const { data, error: err } = await supabase
          .from('articles')
          .update(row)
          .eq('id', article.id)
          .select()
          .single()
        if (err) return { ok: false, error: err.message }
        const saved = rowToArticle(data)
        setArticles((prev) => prev.map((a) => (a.id === saved.id ? saved : a)))
        return { ok: true, article: saved }
      }

      const { data, error: err } = await supabase
        .from('articles')
        .insert(row)
        .select()
        .single()
      if (err) return { ok: false, error: err.message }
      const saved = rowToArticle(data)
      setArticles((prev) => [saved, ...prev])
      return { ok: true, article: saved }
    },

    async deleteArticle(id) {
      const { error: err } = await supabase.from('articles').delete().eq('id', id)
      if (err) return { ok: false, error: err.message }
      setArticles((prev) => prev.filter((a) => a.id !== id))
      return { ok: true }
    },

    // Blocked in the database for non-admins by a trigger, so a Section Editor
    // gets a real error here rather than a silently ignored click.
    async toggleFeatured(id) {
      const current = articles.find((a) => a.id === id)
      if (!current) return { ok: false, error: 'Article not found.' }

      const { data, error: err } = await supabase
        .from('articles')
        .update({ featured: !current.featured })
        .eq('id', id)
        .select()
        .single()

      if (err) return { ok: false, error: err.message }
      const saved = rowToArticle(data)
      setArticles((prev) => prev.map((a) => (a.id === saved.id ? saved : a)))
      return { ok: true }
    },
  }), [articles, user, loading, error, refresh])

  if (!isSupabaseConfigured) return <SetupNotice />

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

function SetupNotice() {
  return (
    <div className="setup-notice">
      <h1 className="display">Setup needed</h1>
      <p>
        This site needs its database connection before it can run. Copy
        <code> .env.example </code> to <code> .env.local </code> and fill in
        <code> VITE_SUPABASE_URL </code> and <code> VITE_SUPABASE_ANON_KEY </code>
        from the Supabase dashboard (Project Settings → API), then restart
        <code> npm run dev</code>.
      </p>
      <p className="hint">See HANDOVER.md for the full setup walkthrough.</p>
    </div>
  )
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
