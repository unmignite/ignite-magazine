import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { can } from '../lib/roles'
import ArticleCard, { sectionOf } from '../components/ArticleCard'
import { accentVars } from '../data/sections'
import ShareBar from '../components/ShareBar'
import { recordView } from '../lib/analytics'
import NotFound from './NotFound'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// Photographer credits live in each image's alt attribute, and the visible
// caption is built from it here rather than stored in the body.
//
// That split is deliberate. Running <figure><figcaption> markup through the
// Studio's editor returns `<img><p>Photo Credits: …</p>` — the caption survives
// only as a stray body paragraph — while alt comes back untouched. Keeping the
// credit in alt means an editor can open and save a migrated article without
// destroying it, and the markup it renders as stays our business.
// Most credits carried over from the old site already begin "Photo Credits:",
// so only add the label when the text doesn't introduce itself.
const creditLine = (s) => {
  const t = (s || '').trim()
  return /^(photo\s+)?credits?\s*[:—-]/i.test(t) ? t : `Credits: ${t}`
}

const captionImages = (html) =>
  html.replace(/<img\b[^>]*>/g, (tag) => {
    const alt = tag.match(/alt="([^"]*)"/)?.[1]
    if (!alt || !alt.trim()) return tag
    return `<figure>${tag}<figcaption>${alt}</figcaption></figure>`
  })

export default function Article() {
  const { slug } = useParams()
  const { articles, user, getArticle } = useStore()
  const article = getArticle(slug)

  // Count the read. Staff visits are excluded so editing doesn't skew the data.
  useEffect(() => {
    if (article?.id && article.status === 'published') {
      recordView(article.id, { isStaff: Boolean(user) })
    }
  }, [article?.id, article?.status, user])

  if (!article || (article.status !== 'published' && !user)) return <NotFound />

  const sec = sectionOf(article)
  const related = articles
    .filter((a) => a.section === article.section && a.id !== article.id && a.status === 'published')
    .slice(0, 3)

  return (
    <article style={accentVars(sec)}>
      <div className="article-cover">
        <img src={article.cover} alt={article.title} />
        {article.coverCredit && <span className="credit">{creditLine(article.coverCredit)}</span>}
      </div>

      <header className="article-head">
        <Link to={`/section/${sec.slug}`} className="chip">{sec.name}</Link>
        <h1 className="display">{article.title}</h1>
        {article.dek && <p className="dek">{article.dek}</p>}
        <div className="article-byline">
          <span>By {article.author}</span>
          <span className="accent">✦</span>
          <span>{fmtDate(article.date)}</span>
          <span className="accent">✦</span>
          <span>{article.readTime} min read</span>
          {article.status === 'draft' && (
            <>
              <span className="accent">✦</span>
              <span style={{ color: 'var(--draft)' }}>Draft — only visible to editors</span>
            </>
          )}
        </div>
        <ShareBar title={article.title} />
      </header>

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: captionImages(article.body) }}
      />

      {article.credits && (
        <div className="article-credits">
          {article.credits.writer && (<div><b>Writer / Journalist:</b> {article.credits.writer}</div>)}
          {article.credits.editor && (<div><b>Editor:</b> {article.credits.editor}</div>)}
          {article.credits.chief && (<div><b>Co-Editor-in-Chief:</b> {article.credits.chief}</div>)}
        </div>
      )}

      {article.tags?.length > 0 && (
        <div className="article-tags">
          {article.tags.map((t) => (
            <span className="chip" key={t}>{t}</span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="section-block related">
          <div className="block-head" style={accentVars(sec)}>
            <h2>More {sec.name}<span className="accent-dot">.</span></h2>
            <Link className="see-all" to={`/section/${sec.slug}`}>See all →</Link>
          </div>
          <div className="grid-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {can(user, 'edit', article) && (
        <Link className="edit-fab" to={`/studio/edit/${article.id}`}>
          ✎ Edit article
        </Link>
      )}
    </article>
  )
}
