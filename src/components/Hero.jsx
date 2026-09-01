import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sectionOf } from './ArticleCard'
import { useTheme } from '../context/ThemeContext'

// Slide duration is themeable (Studio → Design); the progress bars stay in
// sync because the same value drives their CSS fill animation.

// A24-style landing hero: full-screen article covers that auto-advance on a timer.
export default function Hero({ articles }) {
  const [index, setIndex] = useState(0)
  const { theme } = useTheme()
  const SLIDE_MS = theme.hero.intervalMs
  const n = articles.length

  // `index` in the deps restarts the timer after a manual jump,
  // so every slide gets its full time on screen
  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % n), SLIDE_MS)
    return () => clearInterval(t)
  }, [n, index, SLIDE_MS])

  if (!n) return null
  const active = articles[index]
  const sec = sectionOf(active)

  return (
    <div className="hero">
      <div className="hero-stage">
        {articles.map((a, i) => (
          <div key={a.id} className={`hero-slide ${i === index ? 'active' : ''}`}>
            <img src={a.cover} alt={a.title} />
          </div>
        ))}

        <div className="hero-meta">
          <div className="hero-count">
            <b>{String(index + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}
          </div>
        </div>

        <div className="hero-copy" key={active.id}>
          <span className="chip" style={{ background: sec.color, color: sec.slug === 'the-review' ? '#fff' : '#000' }}>
            {sec.name}
          </span>
          <Link className="hero-title display" to={`/article/${active.slug}`}>
            {active.title}
          </Link>
          <p className="hero-dek">{active.dek}</p>
          <p className="hero-byline">
            By {active.author} · {active.readTime} min read — Read the story →
          </p>
        </div>

        <div className="hero-progress" style={{ '--slide-ms': `${SLIDE_MS}ms` }}>
          {articles.map((a, i) => (
            <button
              key={a.id}
              className={i === index ? 'current' : i < index ? 'done' : ''}
              aria-label={a.title}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
