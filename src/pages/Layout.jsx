import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'
import { can } from '../lib/roles'
import { BLOCK_TYPES, SOURCE_CHOICES, newBlock, sourceLabel, slotsFor } from '../lib/blocks'
import { uploadImage } from '../lib/supabase'

export default function LayoutEditor() {
  const { user, articles } = useStore()
  const { homepage, previewHomepage, saveHomepage, resetHomepage } = useTheme()
  const [blocks, setBlocks] = useState(homepage)
  const [openId, setOpenId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => setBlocks(homepage), [homepage])

  if (!can(user, 'design')) {
    return (
      <div className="studio">
        <h1 className="display" style={{ fontSize: '2rem' }}>Not your department</h1>
        <p style={{ marginTop: '1rem' }}>
          Only the Web Manager or a Designer can rearrange the homepage.{' '}
          <Link to="/studio" style={{ borderBottom: '2px solid var(--pink)' }}>Back to the Studio</Link>
        </p>
      </div>
    )
  }

  // Every mutation previews immediately so the homepage reflects it on the next visit.
  const commit = (next) => {
    setBlocks(next)
    previewHomepage(next)
    setMessage('')
  }

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    commit(next)
  }

  const remove = (i) => {
    if (!window.confirm(`Remove the “${BLOCK_TYPES[blocks[i].type].label}” block?`)) return
    commit(blocks.filter((_, k) => k !== i))
  }

  const add = (type) => {
    const b = newBlock(type)
    commit([...blocks, b])
    setOpenId(b.id)
  }

  const setField = (i, key, value) => {
    const next = [...blocks]
    next[i] = { ...next[i], [key]: value }
    commit(next)
  }

  const onSave = async () => {
    setBusy(true)
    const res = await saveHomepage(blocks)
    setBusy(false)
    setMessage(res.ok ? 'Saved — this is the live homepage now.' : res.error)
  }

  return (
    <div className="studio design-page">
      <div className="studio-head">
        <h1>Layout<em>.</em></h1>
        <div className="studio-tools">
          <Link to="/studio" className="btn-ghost" style={{ textDecoration: 'none' }}>← Studio</Link>
          <Link to="/" className="btn-ghost" style={{ textDecoration: 'none' }}>View homepage</Link>
          <button className="btn-ghost" onClick={resetHomepage}>Reset to default</button>
          <button className="btn-primary" onClick={onSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save layout'}
          </button>
        </div>
      </div>

      <p className="design-intro">
        The homepage is built from these blocks, top to bottom. Reorder them, change
        what each one shows, or add new ones. Nothing is public until you press Save.
      </p>

      {message && (
        <div className={message.startsWith('Saved') ? 'design-ok' : 'login-error'}>{message}</div>
      )}

      <ol className="block-list">
        {blocks.map((block, i) => {
          const def = BLOCK_TYPES[block.type]
          if (!def) return null
          const open = openId === block.id
          return (
            <li className={`block-item ${open ? 'open' : ''}`} key={block.id}>
              <div className="block-bar">
                <span className="block-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="block-id">
                  <strong>{def.label}</strong>
                  <span>
                    {def.summary
                      ? def.summary(block)
                      : (block.source ? sourceLabel(block.source) : def.blurb) +
                        (block.count ? ` · ${block.count} articles` : '')}
                  </span>
                </div>
                <div className="block-actions">
                  <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} title="Move down">↓</button>
                  <button onClick={() => setOpenId(open ? null : block.id)}>
                    {open ? 'Done' : 'Edit'}
                  </button>
                  <button className="del" onClick={() => remove(i)} title="Remove block">✕</button>
                </div>
              </div>

              {open && (
                <div className="block-form">
                  {def.fields.map((f) => (
                    <BlockField
                      key={f.key}
                      field={f}
                      block={block}
                      articles={articles}
                      value={block[f.key]}
                      onChange={(v) => setField(i, f.key, v)}
                    />
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className="add-block">
        <h3>Add a block</h3>
        <div className="add-block-grid">
          {Object.entries(BLOCK_TYPES).map(([type, def]) => (
            <button key={type} onClick={() => add(type)}>
              <strong>{def.label}</strong>
              <span>{def.blurb}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BlockField({ field, value, onChange, block, articles }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  // One dropdown per position in the layout. Leaving a slot on Automatic is the
  // point of the thing — pin the two or three that matter this week and let the
  // rest keep themselves current.
  if (field.type === 'picks') {
    const picks = value || {}
    const choices = articles
      .filter((a) => a.status === 'published')
      .sort((a, b) => (a.date < b.date ? 1 : -1))

    const set = (slotKey, id) => {
      const next = { ...picks }
      if (id) next[slotKey] = id
      else delete next[slotKey] // an empty pin is just noise in the saved layout
      onChange(next)
    }

    return (
      <div className="field field-wide">
        <label>{field.label}</label>
        <p className="hint">
          Automatic slots fill with the newest stories that aren't already pinned
          here, so the same article never shows up twice.
        </p>
        <div className="slot-list">
          {slotsFor(block).map((s) => (
            <div className={`slot-row ${s.side}`} key={s.key}>
              <span className="slot-label">{s.label}</span>
              <select value={picks[s.key] || ''} onChange={(e) => set(s.key, e.target.value)}>
                <option value="">Automatic</option>
                {choices.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (field.type === 'source') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {SOURCE_CHOICES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'toggle') {
    return (
      <div className="field">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={value !== false}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div className="field">
        <label>{field.label} — {value}</label>
        <input
          type="range"
          min={field.min}
          max={field.max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }

  if (field.type === 'image') {
    const pick = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      e.target.value = ''
      setUploading(true)
      try {
        onChange(await uploadImage(file))
      } catch (err) {
        alert(err.message)
      } finally {
        setUploading(false)
      }
    }
    return (
      <div className="field">
        <label>{field.label}</label>
        <div className="cover-preview" style={{ marginBottom: '0.6rem' }}>
          {value ? <img src={value} alt="" /> : <span>No image yet</span>}
        </div>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
        <div className="upload-row" style={{ marginTop: '0.6rem' }}>
          <label className="btn-ghost">
            {uploading ? 'Uploading…' : 'Upload image'}
            <input ref={fileRef} type="file" accept="image/*" onChange={pick} />
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className="field">
      <label>{field.label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
