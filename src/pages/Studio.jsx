import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { can } from '../lib/roles'
import { SECTIONS, accentVars } from '../data/sections'
import { useArticleSearch } from '../components/ArticleSearch'
import { mustReadReady } from '../lib/supabase'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Studio() {
  const { articles, user, loading, error, deleteArticle, toggleFeatured, toggleMustRead } = useStore()
  const [status, setStatus] = useState('all')
  const [marked, setMarked] = useState('all')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState(null)

  const canMark = mustReadReady()

  // The same search the readers get — title, writer, tag, section, sort — fed
  // the whole list so the dropdowns stay complete whatever else is filtered.
  const search = useArticleSearch(articles)

  // Status and Must Read are staff-only, so they sit on top rather than inside
  // the shared hook.
  const shown = useMemo(
    () =>
      search.filtered
        .filter((a) => status === 'all' || a.status === status)
        .filter((a) =>
          marked === 'all' ? true : marked === 'yes' ? a.mustRead : !a.mustRead
        ),
    [search.filtered, status, marked]
  )

  const handleDelete = async (a) => {
    if (!window.confirm(`Delete “${a.title}”? This cannot be undone.`)) return
    const res = await deleteArticle(a.id)
    if (!res.ok) setNotice(res.error)
  }

  const handleFeature = async (a) => {
    const res = await toggleFeatured(a.id)
    if (!res.ok) setNotice(res.error)
  }

  // Marking is a round trip, so lock the one box being changed rather than
  // letting a fast run of clicks race each other.
  const handleMustRead = async (a) => {
    setBusyId(a.id)
    const res = await toggleMustRead(a.id)
    setBusyId(null)
    if (!res.ok) setNotice(res.error)
  }

  const reset = () => {
    search.clear()
    setStatus('all')
    setMarked('all')
  }
  const filtering = search.isFiltering || status !== 'all' || marked !== 'all'

  return (
    <div className="studio">
      <div className="studio-head">
        <h1>
          The Studio<em>.</em>
        </h1>
        <div className="studio-tools">
          <Link to="/studio/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            + New article
          </Link>
        </div>
      </div>

      <div className="studio-filters">
        <input
          className="studio-search"
          type="search"
          placeholder="Search title, writer or tag…"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          aria-label="Search articles"
        />

        <label className="studio-filter">
          <span>Section</span>
          <select value={search.section} onChange={(e) => search.setSection(e.target.value)}>
            <option value="">All sections</option>
            {SECTIONS.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </label>

        <label className="studio-filter">
          <span>Writer</span>
          <select value={search.author} onChange={(e) => search.setAuthor(e.target.value)}>
            <option value="">All writers</option>
            {search.authors.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <label className="studio-filter">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </label>

        {canMark && (
          <label className="studio-filter">
            <span>Must Read</span>
            <select value={marked} onChange={(e) => setMarked(e.target.value)}>
              <option value="all">All</option>
              <option value="yes">Marked</option>
              <option value="no">Not marked</option>
            </select>
          </label>
        )}

        <label className="studio-filter">
          <span>Sort</span>
          <select value={search.sort} onChange={(e) => search.setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Title A–Z</option>
          </select>
        </label>

        {filtering && (
          <button className="clear-filters" onClick={reset}>Clear</button>
        )}
      </div>

      {filtering && !loading && (
        <p className="studio-count">
          {shown.length} of {articles.length} articles
        </p>
      )}

      {(notice || error) && (
        <div className="login-error" style={{ marginBottom: '1.2rem' }}>
          {notice || error}
        </div>
      )}

      <table className="studio-table">
        <thead>
          <tr>
            <th className="hide-sm"></th>
            <th>Title</th>
            <th className="hide-sm">Section</th>
            <th className="hide-sm">Author</th>
            <th className="hide-sm">Date</th>
            <th>Status</th>
            <th title="Featured in the landing carousel">★</th>
            {canMark && <th title="Shown in this section's Must Read strip">Must&nbsp;read</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {shown.map((a) => {
            const sec = SECTIONS.find((s) => s.slug === a.section)
            return (
              <tr key={a.id}>
                <td className="hide-sm">
                  <img className="studio-thumb" src={a.cover} alt="" />
                </td>
                <td className="studio-title-cell">
                  <Link to={`/article/${a.slug}`}>{a.title}</Link>
                </td>
                <td className="hide-sm">
                  <span className="chip" style={accentVars(sec)}>{sec?.name}</span>
                </td>
                <td className="hide-sm">{a.author}</td>
                <td className="hide-sm">{fmtDate(a.date)}</td>
                <td>
                  <span className={`status-chip ${a.status}`}>{a.status}</span>
                </td>
                <td>
                  <button
                    className={`star-btn ${a.featured ? 'on' : ''}`}
                    disabled={!can(user, 'feature', a)}
                    title={can(user, 'feature', a) ? 'Toggle landing-page carousel' : 'Only the Web Manager can feature articles'}
                    onClick={() => handleFeature(a)}
                  >
                    ★
                  </button>
                </td>
                {canMark && (
                  <td>
                    <input
                      type="checkbox"
                      className="must-read-check"
                      checked={a.mustRead}
                      disabled={busyId === a.id}
                      onChange={() => handleMustRead(a)}
                      aria-label={`Must Read in ${sec?.name || 'its section'}`}
                      title={`Show in the ${sec?.name || 'section'} Must Read strip`}
                    />
                  </td>
                )}
                <td>
                  <div className="row-actions">
                    <Link to={`/studio/edit/${a.id}`}>Edit</Link>
                    {can(user, 'delete', a) && (
                      <button className="del" onClick={() => handleDelete(a)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {loading && <p className="studio-note">Loading articles…</p>}
      {!loading && shown.length === 0 && (
        <p className="studio-note">No articles match this filter.</p>
      )}
    </div>
  )
}
