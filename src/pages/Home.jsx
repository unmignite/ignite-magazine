import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { SECTIONS } from '../data/seedArticles'
import Hero from '../components/Hero'
import ArticleCard from '../components/ArticleCard'

export default function Home() {
  const { articles } = useStore()
  const published = articles.filter((a) => a.status === 'published')
  const featured = published.filter((a) => a.featured).slice(0, 6)
  const byDate = [...published].sort((a, b) => (a.date < b.date ? 1 : -1))
  const latest = byDate.slice(0, 5)
  const lead = latest[0]
  const stack = latest.slice(1)

  // section rows: first two sections that have enough articles
  const sectionRows = SECTIONS
    .map((s) => ({ ...s, items: byDate.filter((a) => a.section === s.slug).slice(0, 3) }))
    .filter((s) => s.items.length >= 2)
    .slice(0, 3)

  return (
    <>
      <Hero articles={featured.length ? featured : byDate.slice(0, 5)} />

      <section className="section-block">
        <div className="block-head" style={{ '--accent': 'var(--pink)' }}>
          <h2>The Latest<span className="accent-dot">.</span></h2>
        </div>
        {lead && (
          <div className="latest-grid">
            <ArticleCard article={lead} variant="lead" />
            <div className="latest-stack">
              {stack.map((a) => (
                <ArticleCard key={a.id} article={a} variant="row" />
              ))}
            </div>
          </div>
        )}
      </section>

      {sectionRows.map((s) => (
        <section className="section-block home-section-block" key={s.slug} style={{ '--accent': s.color }}>
          <div className="block-head">
            <h2>
              {s.name}
              <span className="accent-dot">.</span>
            </h2>
            <Link className="see-all" to={`/section/${s.slug}`}>
              All {s.name} →
            </Link>
          </div>
          <div className="grid-3">
            {s.items.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      ))}

      <section className="join">
        <h2>
          Embrace the <span className="y">unknown</span>.<br />
          Explore the <span className="p">unseen</span>.<br />
          Discover the <span className="g">unheard</span>.
        </h2>
        <p>
          Ignite is written, shot, edited and designed by students of the University of
          Nottingham Malaysia. Writers, photographers, designers — we want you.
        </p>
        <a
          className="btn-loud"
          href="https://www.instagram.com/unmignite/"
          target="_blank"
          rel="noreferrer"
        >
          Join Ignite
        </a>
      </section>
    </>
  )
}
