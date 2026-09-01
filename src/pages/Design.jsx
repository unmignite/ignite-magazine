import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'
import { can } from '../lib/roles'
import { COLOR_FIELDS, FONT_FIELDS, FONT_CHOICES, DEFAULT_THEME } from '../lib/theme'
import { SECTIONS } from '../data/sections'

export default function Design() {
  const { user } = useStore()
  const { theme, preview, save, resetToDefaults } = useTheme()
  const [draft, setDraft] = useState(theme)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  // Keep the form in step with the live theme (e.g. after Reset).
  useEffect(() => setDraft(theme), [theme])

  if (!can(user, 'design')) {
    return (
      <div className="studio">
        <h1 className="display" style={{ fontSize: '2rem' }}>Not your department</h1>
        <p style={{ marginTop: '1rem' }}>
          Only the Web Manager or a Designer can restyle the site.{' '}
          <Link to="/studio" style={{ borderBottom: '2px solid var(--pink)' }}>Back to the Studio</Link>
        </p>
      </div>
    )
  }

  const update = (path, value) => {
    const next = { ...draft, [path[0]]: { ...draft[path[0]], [path[1]]: value } }
    setDraft(next)
    preview(next) // paint it immediately
  }

  const onSave = async () => {
    setBusy(true)
    setMessage('')
    const res = await save(draft)
    setBusy(false)
    setMessage(res.ok ? 'Saved — the whole site now uses this theme.' : res.error)
  }

  return (
    <div className="studio design-page">
      <div className="studio-head">
        <h1>Design<em>.</em></h1>
        <div className="studio-tools">
          <Link to="/studio" className="btn-ghost" style={{ textDecoration: 'none' }}>← Studio</Link>
          <button className="btn-ghost" onClick={resetToDefaults}>Reset to defaults</button>
          <button className="btn-primary" onClick={onSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save theme'}
          </button>
        </div>
      </div>

      <p className="design-intro">
        Changes preview live as you edit — nothing is public until you press Save.
        Saving restyles every page and all {' '}
        <Link to="/studio" style={{ borderBottom: '2px solid var(--pink)' }}>articles</Link> at once.
      </p>

      {message && (
        <div className={message.startsWith('Saved') ? 'design-ok' : 'login-error'}>{message}</div>
      )}

      <div className="design-grid">
        <section className="design-block">
          <h2>Palette</h2>
          {COLOR_FIELDS.map((f) => (
            <div className="color-row" key={f.key}>
              <input
                type="color"
                value={draft.colors[f.key]}
                onChange={(e) => update(['colors', f.key], e.target.value)}
                aria-label={draft.labels?.[f.key] ?? f.label}
              />
              <div className="color-meta">
                <input
                  className="label-input"
                  value={draft.labels?.[f.key] ?? f.label}
                  onChange={(e) => update(['labels', f.key], e.target.value)}
                  title="Rename this swatch — cosmetic only, nothing else changes"
                  spellCheck="false"
                />
                <span>{f.hint}</span>
              </div>
              <input
                className="hex-input"
                value={draft.colors[f.key]}
                onChange={(e) => update(['colors', f.key], e.target.value)}
                spellCheck="false"
              />
            </div>
          ))}
        </section>

        <section className="design-block">
          <h2>Typography</h2>
          {FONT_FIELDS.map((f) => (
            <div className="field" key={f.key}>
              <label>{f.label}</label>
              <select
                value={draft.fonts[f.key]}
                onChange={(e) => update(['fonts', f.key], e.target.value)}
              >
                {FONT_CHOICES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <p className="hint">{f.hint}</p>
              <p className="font-sample" style={{ fontFamily: draft.fonts[f.key] }}>
                Embrace the unknown, explore the unseen.
              </p>
            </div>
          ))}

          <h2 style={{ marginTop: '2rem' }}>Landing carousel</h2>
          <div className="field">
            <label>Seconds per slide — {(draft.hero.intervalMs / 1000).toFixed(1)}s</label>
            <input
              type="range"
              min="2000"
              max="15000"
              step="500"
              value={draft.hero.intervalMs}
              onChange={(e) => update(['hero', 'intervalMs'], Number(e.target.value))}
            />
            <p className="hint">How long each featured article stays on screen.</p>
          </div>
        </section>

        <section className="design-block">
          <h2>Preview</h2>
          <p className="hint" style={{ marginBottom: '1rem' }}>
            The rest of the site is already showing your changes — open it in another tab.
          </p>

          <div className="swatch-row">
            {SECTIONS.slice(0, 6).map((s) => (
              <span
                key={s.slug}
                className="chip"
                style={{ background: s.color, color: s.slug === 'the-review' ? '#fff' : '#000' }}
              >
                {s.name}
              </span>
            ))}
          </div>

          <div className="preview-card">
            <span className="chip" style={{ background: 'var(--yellow)' }}>Music</span>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>
              A Headline In The Display Font
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--grey)' }}>
              The dek sits here in the accent font, italic and quiet.
            </p>
            <p style={{ fontFamily: 'var(--font-body)' }}>
              Body copy runs in the body font. <strong>Bold</strong> and{' '}
              <em>italic</em> both appear in article text.
            </p>
            <blockquote>A pull quote, in the accent font.</blockquote>
            <span className="read-now" style={{ borderBottom: '3px solid var(--pink)' }}>Read now →</span>
          </div>
        </section>
      </div>

      <p className="studio-note">
        Fonts are limited to a bundled set so the site keeps working offline and loads fast.
        To add another, install it and extend <code>FONT_CHOICES</code> in{' '}
        <code>src/lib/theme.js</code>.
      </p>
    </div>
  )
}
