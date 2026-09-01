import { useMemo, useState } from 'react'
import { SECTIONS } from '../data/sections'

// Reader-facing search and filtering over a list of articles.
//
// Split into a hook (the filtering logic) and a component (the controls) so the
// same behaviour can be dropped onto a section page, a tag page, or a global
// search later without duplicating anything.

// Fold case, strip punctuation and accents so "Galliano's" matches "gallianos".
const normalise = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// Titles often open with a quote mark ("‘Wicked’…"). Readers expect those filed
// under the first letter of the actual word, not bunched under punctuation.
const sortKey = (title) => (title || '').replace(/^[^\p{L}\p{N}]+/u, '').trim()

export function useArticleSearch(articles) {
  const [query, setQuery] = useState('')
  const [author, setAuthor] = useState('')
  const [tag, setTag] = useState('')
  const [section, setSection] = useState('')
  const [sort, setSort] = useState('newest')

  // Only offer authors and tags that actually appear in this list.
  const authors = useMemo(
    () => [...new Set(articles.map((a) => a.author).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [articles]
  )

  const tags = useMemo(
    () => [...new Set(articles.flatMap((a) => a.tags || []))].sort((a, b) => a.localeCompare(b)),
    [articles]
  )

  // Only worth offering when the list actually spans sections (i.e. All Articles).
  const sections = useMemo(() => {
    const present = new Set(articles.map((a) => a.section))
    return SECTIONS.filter((s) => present.has(s.slug))
  }, [articles])

  const filtered = useMemo(() => {
    const terms = normalise(query).split(' ').filter(Boolean)

    const matches = (a) => {
      if (section && a.section !== section) return false
      if (author && a.author !== author) return false
      if (tag && !(a.tags || []).includes(tag)) return false
      if (!terms.length) return true
      // Every word must appear somewhere in the article's searchable text.
      const haystack = normalise([a.title, a.dek, a.author, (a.tags || []).join(' ')].join(' '))
      return terms.every((t) => haystack.includes(t))
    }

    const out = articles.filter(matches)

    if (sort === 'oldest') return out.sort((a, b) => (a.date > b.date ? 1 : -1))
    if (sort === 'az')
      return out.sort((a, b) =>
        sortKey(a.title).localeCompare(sortKey(b.title), undefined, { sensitivity: 'base' })
      )
    return out.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [articles, query, author, tag, section, sort])

  const activeFilters =
    (author ? 1 : 0) + (tag ? 1 : 0) + (section ? 1 : 0) + (sort !== 'newest' ? 1 : 0)

  const clear = () => {
    setQuery('')
    setAuthor('')
    setTag('')
    setSection('')
    setSort('newest')
  }

  return {
    query, setQuery,
    author, setAuthor,
    tag, setTag,
    section, setSection,
    sort, setSort,
    authors, tags, sections,
    filtered, activeFilters, clear,
    isFiltering: Boolean(query || author || tag || section || sort !== 'newest'),
  }
}

export default function ArticleSearch({ search, total }) {
  const [showFilters, setShowFilters] = useState(false)
  const {
    query, setQuery, author, setAuthor, tag, setTag, section, setSection, sort, setSort,
    authors, tags, sections, filtered, activeFilters, clear, isFiltering,
  } = search

  return (
    <div className="article-search">
      <div className="search-row">
        <div className="search-input">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, writer or tag…"
            aria-label="Search articles"
          />
        </div>

        <button
          className={`filter-toggle ${showFilters ? 'on' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          Filters{activeFilters ? ` (${activeFilters})` : ''}
        </button>

        {isFiltering && (
          <button className="clear-filters" onClick={clear}>Clear</button>
        )}
      </div>

      {showFilters && (
        <div className="filter-panel">
          {sections.length > 1 && (
            <div className="field">
              <label htmlFor="f-section">Section</label>
              <select id="f-section" value={section} onChange={(e) => setSection(e.target.value)}>
                <option value="">All sections</option>
                {sections.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="field">
            <label htmlFor="f-author">Writer</label>
            <select id="f-author" value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="">All writers</option>
              {authors.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="f-tag">Tag</label>
            <select id="f-tag" value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">All tags</option>
              {tags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="f-sort">Sort by</label>
            <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Title A–Z</option>
            </select>
          </div>
        </div>
      )}

      {isFiltering && (
        <p className="search-count">
          {filtered.length === 0
            ? 'No articles match.'
            : `${filtered.length} of ${total} ${total === 1 ? 'article' : 'articles'}`}
        </p>
      )}
    </div>
  )
}
