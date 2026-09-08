import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { sectionOf } from './ArticleCard'
import { useArticleSearch } from './ArticleSearch'

const MAX_RESULTS = 8

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// Site-wide search, opened from the magnifier in the header.
//
// Runs the same matcher the section pages use — title, dek, writer and tags,
// case-, accent- and punctuation-insensitive — over every published article, so
// a reader gets the same behaviour wherever they search from.
export default function SearchOverlay({ onClose }) {
  const { articles } = useStore()
  const inputRef = useRef(null)

  // Published only. Staff are handed drafts by the store, and this is the
  // reader's search — drafts belong in the Studio, where they're labelled.
  const search = useArticleSearch(articles.filter((a) => a.status === 'published'))
  const { query, setQuery, filtered } = search

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = query.trim() ? filtered.slice(0, MAX_RESULTS) : []
  const total = query.trim() ? filtered.length : 0

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search articles">
      <div className="search-overlay-inner" onClick={(e) => e.stopPropagation()}>
        <div className="search-field">
          <span className="search-field-icon" aria-hidden="true">
            <MagnifierIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
          />
        </div>

        {query.trim() === '' ? (
          <p className="search-overlay-hint">
            Search every article by title, writer or tag.
          </p>
        ) : results.length === 0 ? (
          <p className="search-overlay-hint">
            Nothing matches “{query.trim()}”.
          </p>
        ) : (
          <>
            <p className="search-overlay-hint">
              {total} {total === 1 ? 'article' : 'articles'}
              {total > results.length && ` — showing the first ${results.length}`}
            </p>
            <ul className="search-results">
              {results.map((a) => (
                <li key={a.id}>
                  <Link to={`/article/${a.slug}`} onClick={onClose}>
                    <img src={a.cover} alt="" loading="lazy" />
                    <span className="search-result-body">
                      <span className="search-result-kicker">{sectionOf(a).name}</span>
                      <span className="search-result-title">{a.title}</span>
                      <span className="search-result-meta">
                        By {a.author} · {fmtDate(a.date)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {total > results.length && (
              <Link className="search-overlay-all" to="/articles" onClick={onClose}>
                Browse all {articles.filter((a) => a.status === 'published').length} articles →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export function MagnifierIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.2" />
      <line x1="15.4" y1="15.4" x2="21" y2="21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
