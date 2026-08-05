import { useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { SECTIONS } from '../data/seedArticles'
import ArticleCard from '../components/ArticleCard'
import NotFound from './NotFound'

export default function Section() {
  const { slug } = useParams()
  const { articles } = useStore()
  const section = SECTIONS.find((s) => s.slug === slug)
  if (!section) return <NotFound />

  const items = articles
    .filter((a) => a.section === slug && a.status === 'published')
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <>
      <div className="section-hero" style={{ '--accent': section.color }}>
        <h1 className="display">{section.name}</h1>
        <p>{section.blurb}</p>
      </div>
      <div className="section-list">
        {items.length ? (
          <div className="grid-3">
            {items.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="empty-note">
            Nothing here yet — this section is waiting for its first story.
          </p>
        )}
      </div>
    </>
  )
}
