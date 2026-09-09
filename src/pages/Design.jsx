import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'
import { can } from '../lib/roles'
import {
  COLOR_FIELDS, SECTION_FIELDS, STATUS_FIELDS,
  FONT_FIELDS, FONT_CHOICES, readableInk,
} from '../lib/theme'
import { SECTIONS, accentVars } from '../data/sections'

// One swatch: colour picker, name, hint, hex box. `group` is the key in the
// theme object it writes to — 'colors', 'sections' or 'status'.
function ColorRow({ field, group, draft, update, renameable = false, hint }) {
  const name = renameable ? (draft.labels?.[field.key] ?? field.label) : field.label
  return (
    <div className="color-row">
      <input
        type="color"
        value={draft[group][field.key]}
        onChange={(e) => update([group, field.key], e.target.value)}
        aria-label={name}
      />
      <div className="color-meta">
        {renameable ? (
          <input
            className="label-input"
            value={name}
            onChange={(e) => update(['labels', field.key], e.target.value)}
            title="Rename this swatch — cosmetic only, nothing else changes"
            spellCheck="false"
          />
        ) : (
          <span className="label-fixed">{name}</span>
        )}
        <span>{hint ?? field.hint}</span>
      </div>
      <input
        className="hex-input"
        value={draft[group][field.key]}
        onChange={(e) => update([group, field.key], e.target.value)}
        spellCheck="false"
      />
    </div>
  )
}

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
          <Link to="/studio/layout" className="btn-ghost" style={{ textDecoration: 'none' }}>Layout →</Link>
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
          <h2>Brand palette</h2>
          <p className="hint palette-note">
            Decorative only — the logo dot, hover highlights and the join banner.
            Nothing here changes a section colour or a button's meaning.
          </p>
          {COLOR_FIELDS.map((f) => (
            <ColorRow key={f.key} field={f} group="colors" draft={draft} update={update} renameable />
          ))}
        </section>

        <section className="design-block">
          <h2>Section colours</h2>
          <p className="hint palette-note">
            One per section, used for its chip and the banner on its page.
            All white gives the monochrome look.
          </p>
          {SECTION_FIELDS.map((f) => {
            const c = draft.sections[f.key]
            // Say out loud what the automatic ink is doing, so a pale colour
            // that "does nothing" on white isn't a mystery.
            const ink = readableInk(c, null)
            return (
              <ColorRow
                key={f.key}
                field={f}
                group="sections"
                draft={draft}
                update={update}
                hint={
                  ink
                    ? 'Underlines and drop caps use this colour too.'
                    : 'Too pale to read on white — underlines and drop caps stay black.'
                }
              />
            )
          })}
        </section>

        <section className="design-block">
          <h2>Section intros</h2>
          <p className="hint palette-note">
            The italic line under a section's title, on its own page. Clear one
            and the title stands alone.
          </p>
          {SECTION_FIELDS.map((f) => (
            <div className="blurb-row" key={f.key}>
              <label htmlFor={`blurb-${f.key}`}>{f.label}</label>
              <textarea
                id={`blurb-${f.key}`}
                rows={2}
                value={draft.blurbs?.[f.key] ?? ''}
                onChange={(e) => update(['blurbs', f.key], e.target.value)}
                placeholder="No intro line"
              />
            </div>
          ))}
        </section>

        <section className="design-block">
          <h2>Status colours</h2>
          <p className="hint palette-note">
            These carry meaning rather than style. Readers and editors expect red
            to mean “this can't be undone” — worth leaving alone.
          </p>
          {STATUS_FIELDS.map((f) => (
            <ColorRow key={f.key} field={f} group="status" draft={draft} update={update} />
          ))}
          <div className="status-preview">
            <button type="button" className="btn-danger" disabled>Delete</button>
            <span className="status-chip draft">draft</span>
            <span className="status-chip published">published</span>
          </div>
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
            {SECTIONS.map((s) => (
              <span key={s.slug} className="chip" style={accentVars(s)}>{s.name}</span>
            ))}
          </div>

          <div className="preview-card" style={accentVars(SECTIONS[0])}>
            <span className="chip">{SECTIONS[0].name}</span>
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
            <span className="read-now" style={{ borderBottom: '3px solid var(--accent-ink)' }}>Read now →</span>
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
