import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExt from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useStore } from '../context/StoreContext'
import { can } from '../lib/roles'
import { SECTIONS } from '../data/sections'
import { uploadImage } from '../lib/supabase'
import NotFound from './NotFound'

const PALETTE = [
  { name: 'Black', value: '#0a0a0a' },
  { name: 'Yellow', value: '#ffed00' },
  { name: 'Red', value: '#f73630' },
  { name: 'Pink', value: '#ff10a3' },
  { name: 'Brat green', value: '#8acd01' },
  { name: 'Orange', value: '#fc4c00' },
  { name: 'Grey', value: '#737373' },
]

const FONTS = [
  { label: 'Body — Montserrat', value: '' },
  { label: 'Display — League Spartan', value: "'League Spartan', sans-serif" },
  { label: 'Serif — Times', value: "'Times New Roman', Times, serif" },
  { label: 'Helvetica', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
]

const slugify = (t) =>
  t.toLowerCase().replace(/[’'"“”.,!?:;()]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')


function Toolbar({ editor }) {
  const fileInputRef = useRef(null)
  if (!editor) return null

  const setLink = () => {
    if (editor.isActive('link')) return editor.chain().focus().unsetLink().run()
    const url = window.prompt('Link URL (https://…)')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const addImageByUrl = () => {
    const url = window.prompt('Image URL')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
    addCredit()
  }

  const addImageByUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    try {
      const url = await uploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
      addCredit()
    } catch (err) {
      alert(err.message)
    }
  }

  const addCredit = () => {
    const credit = window.prompt('Photo credit / reference (optional — leave blank to skip)')
    if (credit) {
      editor
        .chain()
        .focus()
        .insertContent(`<p><em>Credits: ${credit}</em></p>`)
        .run()
    }
  }

  const currentFont = FONTS.find((f) => f.value && editor.isActive('textStyle', { fontFamily: f.value }))?.value ?? ''

  const blockValue = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : 'p'

  const setBlock = (v) => {
    const chain = editor.chain().focus()
    if (v === 'h2') chain.setHeading({ level: 2 }).run()
    else if (v === 'h3') chain.setHeading({ level: 3 }).run()
    else chain.setParagraph().run()
  }

  return (
    <div className="tt-toolbar">
      <div className="tt-group">
        <select className="tt-select" value={blockValue} onChange={(e) => setBlock(e.target.value)}>
          <option value="p">Paragraph</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
        </select>
        <select
          className="tt-select"
          value={currentFont}
          onChange={(e) => {
            const v = e.target.value
            if (v) editor.chain().focus().setFontFamily(v).run()
            else editor.chain().focus().unsetFontFamily().run()
          }}
        >
          {FONTS.map((f) => (
            <option key={f.label} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <div className="tt-group">
        <button type="button" className={`tt-btn ${editor.isActive('bold') ? 'on' : ''}`} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><b>B</b></button>
        <button type="button" className={`tt-btn ${editor.isActive('italic') ? 'on' : ''}`} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><i>I</i></button>
        <button type="button" className={`tt-btn ${editor.isActive('underline') ? 'on' : ''}`} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><u>U</u></button>
        <button type="button" className={`tt-btn ${editor.isActive('strike') ? 'on' : ''}`} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><s>S</s></button>
      </div>

      <div className="tt-group">
        {PALETTE.map((c) => (
          <button
            key={c.value}
            type="button"
            className="tt-swatch"
            style={{ background: c.value, outline: editor.isActive('textStyle', { color: c.value }) ? '2px solid var(--pink)' : 'none', outlineOffset: 2 }}
            title={`Text colour: ${c.name}`}
            onClick={() => editor.chain().focus().setColor(c.value).run()}
          />
        ))}
        <button
          type="button"
          className="tt-swatch clear-swatch"
          title="Clear text colour"
          onClick={() => editor.chain().focus().unsetColor().run()}
        />
      </div>

      <div className="tt-group">
        <button type="button" className={`tt-btn ${editor.isActive('blockquote') ? 'on' : ''}`} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Pull quote">❝</button>
        <button type="button" className={`tt-btn ${editor.isActive('bulletList') ? 'on' : ''}`} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">•≡</button>
        <button type="button" className={`tt-btn ${editor.isActive('orderedList') ? 'on' : ''}`} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1≡</button>
        <button type="button" className="tt-btn" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">—</button>
      </div>

      <div className="tt-group">
        <button type="button" className={`tt-btn ${editor.isActive({ textAlign: 'left' }) ? 'on' : ''}`} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left">⇤</button>
        <button type="button" className={`tt-btn ${editor.isActive({ textAlign: 'center' }) ? 'on' : ''}`} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align centre">↔</button>
        <button type="button" className={`tt-btn ${editor.isActive({ textAlign: 'right' }) ? 'on' : ''}`} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right">⇥</button>
      </div>

      <div className="tt-group">
        <button type="button" className={`tt-btn ${editor.isActive('link') ? 'on' : ''}`} onClick={setLink} title="Link / unlink">🔗</button>
        <button type="button" className="tt-btn" onClick={addImageByUrl} title="Insert image from URL">🖼</button>
        <button type="button" className="tt-btn" onClick={() => fileInputRef.current?.click()} title="Upload image">⇪🖼</button>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={addImageByUpload} />
      </div>

      <div className="tt-group">
        <button type="button" className="tt-btn" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">⌫</button>
        <button type="button" className="tt-btn" onClick={() => editor.chain().focus().undo().run()} title="Undo">↺</button>
        <button type="button" className="tt-btn" onClick={() => editor.chain().focus().redo().run()} title="Redo">↻</button>
      </div>
    </div>
  )
}

function EditorForm({ existing }) {
  const { user, articles, saveArticle, deleteArticle } = useStore()
  const navigate = useNavigate()
  const isNew = !existing

  const [title, setTitle] = useState(existing?.title || '')
  const [dek, setDek] = useState(existing?.dek || '')
  const [section, setSection] = useState(existing?.section || 'music')
  const [author, setAuthor] = useState(existing?.author || user.name)
  const [date, setDate] = useState(existing?.date || new Date().toISOString().slice(0, 10))
  const [readTime, setReadTime] = useState(existing?.readTime || 4)
  const [cover, setCover] = useState(existing?.cover || '')
  const [coverCredit, setCoverCredit] = useState(existing?.coverCredit || '')
  const [tags, setTags] = useState((existing?.tags || []).join(', '))
  const [featured, setFeatured] = useState(existing?.featured || false)
  const [status, setStatus] = useState(existing?.status || 'draft')
  const [savedFlash, setSavedFlash] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [busy, setBusy] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      LinkExt.configure({ openOnClick: false }),
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing the story…' }),
    ],
    content: existing?.body || '',
  })

  const onCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setBusy(true)
    try {
      setCover(await uploadImage(file))
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    if (!title.trim()) return alert('Give the article a title first.')
    if (!editor) return

    let slug = existing?.slug
    if (!slug) {
      const base = slugify(title) || 'untitled'
      slug = base
      let i = 2
      while (articles.some((a) => a.slug === slug)) slug = `${base}-${i++}`
    }

    const article = {
      id: existing?.id || null, // null → the database generates the id
      slug,
      title: title.trim(),
      dek: dek.trim(),
      section,
      author: author.trim() || user.name,
      date,
      readTime: Number(readTime) || 4,
      cover: cover.trim(),
      coverCredit: coverCredit.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: can(user, 'feature') ? featured : existing?.featured || false,
      status,
      credits: existing?.credits || { writer: author.trim() || user.name, editor: user.name, chief: '' },
      body: editor.getHTML(),
    }

    setBusy(true)
    setSaveError('')
    const res = await saveArticle(article)
    setBusy(false)

    if (!res.ok) {
      setSaveError(res.error)
      return
    }
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2500)
    if (isNew) navigate(`/studio/edit/${res.article.id}`, { replace: true })
  }

  const remove = async () => {
    if (!existing) return
    if (window.confirm(`Delete “${existing.title}”? This cannot be undone.`)) {
      const res = await deleteArticle(existing.id)
      if (!res.ok) return setSaveError(res.error)
      navigate('/studio')
    }
  }

  return (
    <div className="editor-page">
      <div className="editor-topbar">
        <Link className="back" to="/studio">← Back to Studio</Link>
        <span className="spacer" />
        {savedFlash && <span className="saved-flash">✓ Saved</span>}
        {existing && (
          <Link className="btn-ghost" to={`/article/${existing.slug}`}>View live</Link>
        )}
        <button className="btn-primary" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : status === 'published' ? 'Save & publish' : 'Save draft'}
        </button>
      </div>

      {saveError && <div className="login-error">{saveError}</div>}

      <div className="editor-grid">
        <div>
          <textarea
            className="title-input"
            rows={2}
            placeholder="ARTICLE TITLE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="dek-input"
            rows={2}
            placeholder="Dek — the one-sentence hook shown under the title and on cards…"
            value={dek}
            onChange={(e) => setDek(e.target.value)}
          />

          <Toolbar editor={editor} />
          <div className="editor-body">
            <EditorContent editor={editor} className="tiptap-wrap" />
          </div>
        </div>

        <aside className="meta-panel">
          <h3>Article settings</h3>

          <div className="cover-preview">
            {cover ? <img src={cover} alt="Cover preview" /> : <span>No cover yet</span>}
          </div>
          <div className="field">
            <label>Cover image URL</label>
            <input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" />
          </div>
          <div className="upload-row">
            <label className="btn-ghost">
              Upload cover
              <input type="file" accept="image/*" onChange={onCoverUpload} />
            </label>
          </div>
          <div className="field">
            <label>Cover credit</label>
            <input value={coverCredit} onChange={(e) => setCoverCredit(e.target.value)} placeholder="Photographer / source" />
          </div>

          <div className="field">
            <label>Section</label>
            <select value={section} onChange={(e) => setSection(e.target.value)}>
              {SECTIONS.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="field">
            <label>Publish date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Read time (minutes)</label>
            <input type="number" min="1" max="60" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
          </div>
          <div className="field">
            <label>Tags (comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Local Music, Interview" />
          </div>
          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft — hidden from readers</option>
              <option value="published">Published — live on the site</option>
            </select>
          </div>

          <label className="check-row" title={can(user, 'feature') ? '' : 'Only the Editor-in-Chief can feature articles'}>
            <input
              type="checkbox"
              checked={featured}
              disabled={!can(user, 'feature')}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Feature in the landing carousel
          </label>

          <div className="meta-actions">
            <button className="btn-primary" onClick={save} disabled={busy}>
              {busy ? 'Saving…' : status === 'published' ? 'Save & publish' : 'Save draft'}
            </button>
            {existing && can(user, 'delete', existing) && (
              <button className="btn-danger" onClick={remove}>Delete article</button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function Editor() {
  const { id } = useParams()
  const { getArticle } = useStore()
  const existing = id ? getArticle(id) : null
  if (id && !existing) return <NotFound />
  // key forces a clean remount when switching between articles
  return <EditorForm key={id || 'new'} existing={existing} />
}
