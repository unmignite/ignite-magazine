import { Link } from 'react-router-dom'
import { sectionOf } from './ArticleCard'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// The strip that sits between a section's banner and its archive: the pieces
// that section's editor wants read first, however old they are.
//
// Curated, not calculated — an editor ticks "Must Read" in the Studio. Nothing
// shows until someone does, which is deliberate: a strip headed MUST READ that
// quietly filled itself with the newest articles would be claiming an
// editorial judgement nobody made, and those are already listed below it.
// Four across the band at desktop width. The Studio enforces the same number
// when marking, so what an editor ticks is exactly what appears — a fifth would
// silently never show up.
export const MUST_READ_MAX = 4

export default function MustRead({ articles, limit = MUST_READ_MAX }) {
  const picks = articles.filter((a) => a.mustRead && a.status === 'published').slice(0, limit)
  if (!picks.length) return null

  return (
    <aside className="must-read" aria-label="Must read">
      {/* The space matters: narrow screens hide the break, and without it the
          label runs together as "MUSTREAD". */}
      <h2 className="must-read-label">Must <br />Read</h2>
      <div className="must-read-items">
        {picks.map((a) => {
          const sec = sectionOf(a)
          return (
            <Link key={a.id} to={`/article/${a.slug}`} className="must-read-item">
              <div className="must-read-img">
                <img src={a.cover} alt={a.title} loading="lazy" />
              </div>
              <div className="must-read-body">
                <span className="must-read-kicker">{sec.name}</span>
                <h3>{a.title}</h3>
                <p>By {a.author} · {fmtDate(a.date)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
