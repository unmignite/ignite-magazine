import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEFAULT_THEME, mergeTheme, applyTheme } from '../lib/theme'
import { DEFAULT_HOMEPAGE, withDefaults } from '../lib/blocks'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [homepage, setHomepage] = useState(DEFAULT_HOMEPAGE)
  const [loaded, setLoaded] = useState(false)

  // Load the saved theme once, for everyone — visitors included.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoaded(true)
      return
    }
    let active = true
    ;(async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('theme, homepage')
        .eq('id', 1)
        .maybeSingle()
      if (!active) return

      const merged = mergeTheme(data?.theme)
      setTheme(merged)
      applyTheme(merged)

      // An empty array means "never edited" — fall back to the built-in layout.
      const saved = Array.isArray(data?.homepage) ? data.homepage : []
      setHomepage(saved.length ? saved.map(withDefaults) : DEFAULT_HOMEPAGE)

      setLoaded(true)
    })()
    return () => { active = false }
  }, [])

  // Live preview: any change to the working theme paints immediately.
  const preview = useCallback((next) => {
    setTheme(next)
    applyTheme(next)
  }, [])

  const save = useCallback(async (next) => {
    const { data: session } = await supabase.auth.getSession()
    const { error } = await supabase
      .from('site_settings')
      .update({ theme: next, updated_by: session?.session?.user?.id ?? null })
      .eq('id', 1)
    if (error) return { ok: false, error: error.message }
    setTheme(next)
    applyTheme(next)
    return { ok: true }
  }, [])

  const resetToDefaults = useCallback(() => {
    preview(DEFAULT_THEME)
  }, [preview])

  // Homepage layout — previewed locally, then persisted.
  const previewHomepage = useCallback((blocks) => setHomepage(blocks), [])

  const saveHomepage = useCallback(async (blocks) => {
    const { data: session } = await supabase.auth.getSession()
    const { error } = await supabase
      .from('site_settings')
      .update({ homepage: blocks, updated_by: session?.session?.user?.id ?? null })
      .eq('id', 1)
    if (error) return { ok: false, error: error.message }
    setHomepage(blocks)
    return { ok: true }
  }, [])

  const resetHomepage = useCallback(() => setHomepage(DEFAULT_HOMEPAGE), [])

  return (
    <ThemeContext.Provider
      value={{
        theme, loaded, preview, save, resetToDefaults,
        homepage, previewHomepage, saveHomepage, resetHomepage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
