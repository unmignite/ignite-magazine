import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedArticles } from '../data/seedArticles'
import { USERS } from '../data/users'

const ARTICLES_KEY = 'ignite.articles.v1'
const SESSION_KEY = 'ignite.session.v1'

const StoreContext = createContext(null)

const loadArticles = () => {
  try {
    const raw = localStorage.getItem(ARTICLES_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Could not read saved articles, falling back to seed data', e)
  }
  return seedArticles
}

const loadSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return null
}

export function StoreProvider({ children }) {
  const [articles, setArticles] = useState(loadArticles)
  const [user, setUser] = useState(loadSession)

  useEffect(() => {
    try {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles))
    } catch (e) {
      alert('Could not save changes locally — storage is full. Large uploaded images are the usual culprit; try using image URLs instead.')
    }
  }, [articles])

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  const api = useMemo(() => ({
    articles,
    user,

    login(email, password) {
      const found = USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      )
      if (!found) return { ok: false, error: 'Invalid email or password.' }
      const { password: _pw, ...safe } = found
      setUser(safe)
      return { ok: true, user: safe }
    },

    logout() {
      setUser(null)
    },

    getArticle(idOrSlug) {
      return articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug)
    },

    saveArticle(article) {
      setArticles((prev) => {
        const exists = prev.some((a) => a.id === article.id)
        if (exists) return prev.map((a) => (a.id === article.id ? article : a))
        return [article, ...prev]
      })
    },

    deleteArticle(id) {
      setArticles((prev) => prev.filter((a) => a.id !== id))
    },

    toggleFeatured(id) {
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, featured: !a.featured } : a)))
    },

    resetToSeed() {
      localStorage.removeItem(ARTICLES_KEY)
      setArticles(seedArticles)
    },
  }), [articles, user])

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
