import { Link } from 'react-router-dom'
import { SECTIONS, accentVars } from '../data/sections'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function sectionOf(article) {
  return SECTIONS.find((s) => s.slug === article.section) || SECTIONS[0]
}

export default function ArticleCard({ article, variant = 'grid' }) {
  const sec = sectionOf(article)
  const cls = variant === 'lead' ? 'card lead' : variant === 'row' ? 'card card-row' : 'card'

  return (
    <Link to={`/article/${article.slug}`} className={cls} style={accentVars(sec)}>
      <div className="card-img">
        <img src={article.cover} alt={article.title} loading="lazy" />
      </div>
      <div className="card-body">
        {variant !== 'row' && <span className="chip">{sec.name}</span>}
        <h3 className="card-title">{article.title}</h3>
        {(variant === 'lead' || variant === 'grid') && article.dek && (
          <p className="card-dek">{article.dek}</p>
        )}
        <p className="card-meta">
          {article.author}
          <span className="sep">✦</span>
          {fmtDate(article.date)}
        </p>
        {variant !== 'row' && <span className="read-now">Read now →</span>}
      </div>
    </Link>
  )
}
