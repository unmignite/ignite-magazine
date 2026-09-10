import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'
import { SECTIONS, accentVars } from '../data/sections'
import ArticleCard from '../components/ArticleCard'
import LeadRow, { LEAD_COUNT } from '../components/LeadRow'
import MustRead from '../components/MustRead'
import ArticleSearch, { useArticleSearch } from '../components/ArticleSearch'
import NotFound from './NotFound'

export default function Section() {
  const { slug } = useParams()
  const { articles, loading } = useStore()
  const { theme } = useTheme()
  const section = SECTIONS.find((s) => s.slug === slug)
  // Whatever the Design panel holds, falling back to the copy shipped in
  // src/data/sections.js. Cleared to nothing, the line simply doesn't print.
  const blurb = (theme.blurbs?.[slug] ?? section?.blurb ?? '').trim()

  const inSection = useMemo(
    () => articles.filter((a) => a.section === slug && a.status === 'published'),
    [articles, slug]
  )

  // Hooks must run before any early return, so this sits above the guard.
  const search = useArticleSearch(inSection)

  // The first three lead the page; everything after them is the grid. The split
  // is taken from the filtered list rather than the section, so narrowing to one
  // writer promotes a new three instead of leaving a stale trio at the top.
  // Under three there is nothing to lead with, so it all stays a grid.
  const rest = search.filtered.length >= LEAD_COUNT
    ? search.filtered.slice(LEAD_COUNT)
    : search.filtered

  if (!section) return <NotFound />

  return (
    <>
      <div className="section-hero" style={accentVars(section)}>
        <h1 className="display">{section.name}</h1>
        {blurb && <p>{blurb}</p>}
      </div>

      {/* Above the search, so it reads as the section's own recommendation
          rather than a result of whatever you typed. */}
      <MustRead articles={inSection} />

      <div className="section-list" style={accentVars(section)}>
        {/* No search box — the magnifier in the header covers searching, and
            covers the whole magazine rather than just this section. The filters
            stay: writer, tag and sort aren't up there. */}
        {inSection.length > 0 && (
          <ArticleSearch search={search} total={inSection.length} showQuery={false} />
        )}

        {loading && !articles.length ? (
          <p className="empty-note">Loading…</p>
        ) : search.filtered.length ? (
          <>
            <LeadRow articles={search.filtered} />
            {rest.length > 0 && (
              <div className="grid-3">
                {rest.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        ) : inSection.length ? (
          <p className="empty-note">
            Nothing matches those filters.{' '}
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
