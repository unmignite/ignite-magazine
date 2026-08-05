import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { can } from '../data/users'
import { SECTIONS } from '../data/seedArticles'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Studio() {
  const { articles, user, deleteArticle, toggleFeatured, resetToSeed } = useStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const shown = articles
    .filter((a) => (filter === 'all' ? true : a.status === filter))
    .filter((a) => {
      const q = query.toLowerCase()
      return !q || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q)
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  const handleDelete = (a) => {
    if (window.confirm(`Delete “${a.title}”? This cannot be undone.`)) {
      deleteArticle(a.id)
    }
  }

  return (
    <div className="studio">
      <div className="studio-head">
        <h1>
          The Studio<em>.</em>
        </h1>
        <div className="studio-tools">
          <input
            type="search"
            placeholder="Search title or author…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="filter">
            {['all', 'published', 'draft'].map((f) => (
              <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <Link to="/studio/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            + New article
          </Link>
        </div>
      </div>

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
                  <span
                    className="chip"
                    style={{ background: sec?.color, color: sec?.slug === 'the-review' ? '#fff' : '#000' }}
                  >
                    {sec?.name}
                  </span>
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
                    title={can(user, 'feature', a) ? 'Toggle landing-page carousel' : 'Only the Editor-in-Chief can feature articles'}
                    onClick={() => toggleFeatured(a.id)}
                  >
                    ★
                  </button>
                </td>
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

      <p className="studio-note">
        Changes are stored in your browser (localStorage) for this demo — a real deployment
        would plug the same interface into a database.{' '}
        <button
          onClick={() => {
            if (window.confirm('Reset all articles back to the original seed content?')) resetToSeed()
          }}
        >
          Reset demo content
        </button>
      </p>
    </div>
  )
}
