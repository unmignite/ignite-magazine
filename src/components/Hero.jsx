import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sectionOf } from './ArticleCard'
import { useTheme } from '../context/ThemeContext'

// Slide duration is themeable (Studio → Design); the progress bars stay in
// sync because the same value drives their CSS fill animation.

// A24-style landing hero: full-screen article covers that auto-advance on a
// timer, closing on the invitation to join. The reel is a list of slides rather
// than a list of articles, because the last one isn't a story.
export default function Hero({ articles, block = {} }) {
  const [index, setIndex] = useState(0)
  const { theme } = useTheme()
  const SLIDE_MS = theme.hero.intervalMs

  const showJoin = block.join !== false && !!(block.joinLine1 || block.joinLine2 || block.joinLine3)
  const slides = [
    ...articles.map((a) => ({ kind: 'article', key: a.id, article: a })),
    ...(showJoin ? [{ kind: 'join', key: 'join' }] : []),
  ]
  const n = slides.length

  // `index` in the deps restarts the timer after a manual jump,
  // so every slide gets its full time on screen
  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % n), SLIDE_MS)
    return () => clearInterval(t)
  }, [n, index, SLIDE_MS])

  if (!n) return null
  // A shorter reel after an edit shouldn't leave the index out past the end.
  const current = slides[Math.min(index, n - 1)]
  const sec = current.kind === 'article' ? sectionOf(current.article) : null

  return (
    <div className="hero">
      <div className="hero-stage">
        {slides.map((s, i) =>
          s.kind === 'article' ? (
            <div key={s.key} className={`hero-slide ${i === index ? 'active' : ''}`}>
              <img src={s.article.cover} alt={s.article.title} />
            </div>
          ) : (
            <div key={s.key} className={`hero-slide hero-join ${i === index ? 'active' : ''}`}>
              {/* Keyed on the index so the staggered reveal replays every time
                  the reel comes back round to it. */}
              <div className="hero-join-inner" key={`join-${index === i}`}>
                <p className="hero-join-lines">
                  {block.joinLine1 && <span className="y">{block.joinLine1}</span>}
                  {block.joinLine2 && <span className="p">{block.joinLine2}</span>}
                  {block.joinLine3 && <span className="g">{block.joinLine3}</span>}
                </p>
                {block.joinText && <p className="hero-join-text">{block.joinText}</p>}
                {block.joinLabel && (
                  <a
                    className="hero-join-btn"
                    href={block.joinUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {block.joinLabel}
                  </a>
                )}
              </div>
            </div>
          )
        )}

        <div className="hero-meta">
          <div className="hero-count">
            <b>{String(index + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}
          </div>
        </div>

        {current.kind === 'article' && (
          <div className="hero-copy" key={current.article.id}>
            <span className="hero-kicker">{sec.name}</span>
            <Link className="hero-title display" to={`/article/${current.article.slug}`}>
              {current.article.title}
            </Link>
            <p className="hero-dek">{current.article.dek}</p>
            <p className="hero-byline">
              By {current.article.author} · {current.article.readTime} min read — Read the story →
            </p>
          </div>
        )}

        <div className="hero-progress" style={{ '--slide-ms': `${SLIDE_MS}ms` }}>
          {slides.map((s, i) => (
            <button
              key={s.key}
              className={i === index ? 'current' : i < index ? 'done' : ''}
              aria-label={s.kind === 'article' ? s.article.title : 'Join Ignite'}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
