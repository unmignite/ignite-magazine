import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from './Hero'
import ArticleCard from './ArticleCard'
import { articlesFor, resolveSlots } from '../lib/blocks'
import { sectionBySlug, accentVars } from '../data/sections'

// Renders one homepage block. Every block type in src/lib/blocks.js has a case
// here; anything unknown renders nothing rather than crashing the page.
export default function HomeBlock({ block, articles }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} articles={articles} />
    case 'latest':
      return <LatestBlock block={block} articles={articles} />
    case 'section-row':
      return <SectionRowBlock block={block} articles={articles} />
    case 'carousel':
      return <CarouselBlock block={block} articles={articles} />
    case 'image':
      return <ImageBlock block={block} />
    case 'banner':
      return <BannerBlock block={block} />
    default:
      return null
  }
}

// A heading that takes the accent colour of whichever section it points at.
function BlockHead({ block, fallback }) {
  const sec = sectionBySlug(block.source)
  const title = block.heading?.trim() || sec?.name || fallback
  return (
    <div className="block-head">
      <h2>
        {title}
        <span className="accent-dot">.</span>
      </h2>
      {sec && (
        <Link className="see-all" to={`/section/${sec.slug}`}>
          All {sec.name} →
        </Link>
      )}
    </div>
  )
}

// A block sourced from "all articles" has no section, so accentVars falls back
// to the brand accent.
const accentFor = (source) => accentVars(sectionBySlug(source))

function HeroBlock({ block, articles }) {
  const items = articlesFor(block.source, articles, block.count)
  return <Hero articles={items} />
}

// One big story flanked by a column either side. Columns that come back empty
// (a very small site, or a section with three articles in it) are dropped
// rather than left as a gap, and the grid is sized from what actually renders.
function LatestBlock({ block, articles }) {
  const filled = resolveSlots(block, articles).filter((s) => s.article)
  if (!filled.length) return null

  const left = filled.filter((s) => s.side === 'left')
  const right = filled.filter((s) => s.side === 'right')
  const centre = filled.find((s) => s.side === 'center')

  // Passed as a custom property, not grid-template-columns itself, so the
  // mobile breakpoint can still collapse it to one column. The right column is
  // wider than the left because its rows carry a thumbnail beside the text.
  const cols = [left.length && '1fr', centre && '1.8fr', right.length && '1.2fr']
    .filter(Boolean)
    .join(' ')

  // The two sides are deliberately different weights: large cards on the left,
  // a compact list on the right.
  const column = (slots, side) =>
    slots.length > 0 && (
      <div className={`showcase-col side ${side}`}>
        {slots.map((s) => (
          <ArticleCard
            key={s.article.id}
            article={s.article}
            variant={side === 'left' ? 'stack' : 'row'}
          />
        ))}
      </div>
    )

  return (
    <section className="section-block showcase" style={{ ...accentFor(block.source), '--cols': cols }}>
      <BlockHead block={block} fallback="The Latest" />
      <div className="showcase-grid">
        {column(left, 'left')}
        {centre && (
          <div className="showcase-col centre">
            <ArticleCard article={centre.article} variant="lead" />
          </div>
        )}
        {column(right, 'right')}
      </div>
    </section>
  )
}

function SectionRowBlock({ block, articles }) {
  const items = articlesFor(block.source, articles, block.count)
  if (!items.length) return null
  return (
    <section
      className="section-block home-section-block"
      style={accentFor(block.source)}
    >
      <BlockHead block={block} fallback="Stories" />
      <div className="grid-3">
        {items.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  )
}

function CarouselBlock({ block, articles }) {
  const items = articlesFor(block.source, articles, block.count)
  const trackRef = useRef(null)
  if (!items.length) return null

  const nudge = (dir) => {
    const track = trackRef.current
    if (track) track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section
      className="section-block home-section-block"
      style={accentFor(block.source)}
    >
      <div className="carousel-head">
        <BlockHead block={block} fallback="Stories" />
        <div className="carousel-arrows">
          <button onClick={() => nudge(-1)} aria-label="Scroll left">←</button>
          <button onClick={() => nudge(1)} aria-label="Scroll right">→</button>
        </div>
      </div>
      <div className="carousel-track" ref={trackRef}>
        {items.map((a) => (
          <div className="carousel-item" key={a.id}>
            <ArticleCard article={a} />
          </div>
        ))}
      </div>
    </section>
  )
}

function ImageBlock({ block }) {
  if (!block.src) return null
  return (
    <figure className="image-block" style={{ height: `${block.height || 55}vh` }}>
      <img src={block.src} alt={block.caption || ''} />
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  )
}

function BannerBlock({ block }) {
  return (
    <section className="join">
      <h2>
        {block.line1 && <><span className="y">{block.line1}</span><br /></>}
        {block.line2 && <><span className="p">{block.line2}</span><br /></>}
        {block.line3 && <span className="g">{block.line3}</span>}
      </h2>
      {block.text && <p>{block.text}</p>}
      {block.buttonLabel && (
        <a
          className="btn-loud"
          href={block.buttonUrl || '#'}
          target="_blank"
          rel="noreferrer"
        >
          {block.buttonLabel}
        </a>
      )}
    </section>
  )
}
