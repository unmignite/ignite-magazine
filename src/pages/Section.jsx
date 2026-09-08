import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { SECTIONS, accentVars } from '../data/sections'
import ArticleCard from '../components/ArticleCard'
import MustRead from '../components/MustRead'
import ArticleSearch, { useArticleSearch } from '../components/ArticleSearch'
import NotFound from './NotFound'

export default function Section() {
  const { slug } = useParams()
  const { articles, loading } = useStore()
  const section = SECTIONS.find((s) => s.slug === slug)

  const inSection = useMemo(
    () => articles.filter((a) => a.section === slug && a.status === 'published'),
    [articles, slug]
  )

  // Hooks must run before any early return, so this sits above the guard.
  const search = useArticleSearch(inSection)

  if (!section) return <NotFound />

  return (
    <>
      <div className="section-hero" style={accentVars(section)}>
        <h1 className="display">{section.name}</h1>
        <p>{section.blurb}</p>
      </div>

      {/* Above the search, so it reads as the section's own recommendation
          rather than a result of whatever you typed. */}
      <MustRead articles={inSection} />

      <div className="section-list" style={accentVars(section)}>
        {inSection.length > 0 && (
          <ArticleSearch search={search} total={inSection.length} />
        )}

        {loading && !articles.length ? (
          <p className="empty-note">Loading…</p>
        ) : search.filtered.length ? (
          <div className="grid-3">
            {search.filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : inSection.length ? (
          <p className="empty-note">
            Nothing matches that search.{' '}
            <button className="link-button" onClick={search.clear}>Clear filters</button>
          </p>
        ) : (
          <p className="empty-note">
            Nothing here yet — this section is waiting for its first story.
          </p>
        )}
      </div>
    </>
  )
}
