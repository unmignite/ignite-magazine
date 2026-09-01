import { useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import ArticleCard from '../components/ArticleCard'
import ArticleSearch, { useArticleSearch } from '../components/ArticleSearch'

// The whole archive in one place — the fastest route to any story when the
// reader doesn't know (or care) which section it lives in.
export default function AllArticles() {
  const { articles, loading } = useStore()

  const published = useMemo(
    () => articles.filter((a) => a.status === 'published'),
    [articles]
  )

  const search = useArticleSearch(published)

  return (
    <>
      <div className="section-hero" style={{ '--accent': 'var(--yellow)' }}>
        <h1 className="display">All Articles</h1>
        <p>
          Everything Ignite has published — {published.length} stories and counting.
          Search by title, writer or tag.
        </p>
      </div>

      <div className="section-list" style={{ '--accent': 'var(--yellow)' }}>
        {published.length > 0 && (
          <ArticleSearch search={search} total={published.length} />
        )}

        {loading && !articles.length ? (
          <p className="empty-note">Loading the archive…</p>
        ) : search.filtered.length ? (
          <div className="grid-3">
            {search.filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : published.length ? (
          <p className="empty-note">
            Nothing matches that search.{' '}
            <button className="link-button" onClick={search.clear}>Clear filters</button>
          </p>
        ) : (
          <p className="empty-note">No articles published yet.</p>
        )}
      </div>
    </>
  )
}
