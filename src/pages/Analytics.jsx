import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { fetchOverview } from '../lib/analytics'
import { DailyChart, BarList, StatTile } from '../components/Charts'
import { sectionBySlug } from '../data/sections'

const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
  { days: 365, label: '1 year' },
]

export default function Analytics() {
  const { user } = useStore()
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      const res = await fetchOverview(days)
      if (!active) return
      if (res.ok) { setData(res.data); setError('') } else setError(res.error)
      setLoading(false)
    })()
    return () => { active = false }
  }, [days])

  if (!user) return null

  const range = RANGES.find((r) => r.days === days)?.label ?? `${days} days`

  return (
    <div className="studio analytics-page">
      <div className="studio-head">
        <h1>Analytics<em>.</em></h1>
        <div className="studio-tools">
          <Link to="/studio" className="btn-ghost" style={{ textDecoration: 'none' }}>← Studio</Link>
          {/* One filter row, scoping every chart below it. */}
          <div className="filter">
            {RANGES.map((r) => (
              <button key={r.days} className={days === r.days ? 'on' : ''} onClick={() => setDays(r.days)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {!error && (
        // Hold the previous render at reduced opacity rather than flashing a skeleton.
        <div style={{ opacity: loading && data ? 0.5 : 1, transition: 'opacity 0.15s' }}>
          {!data && loading ? (
            <p className="studio-note">Loading readership…</p>
          ) : data ? (
            <>
              <div className="stat-row">
                <StatTile label={`Views · last ${range}`} value={data.window_views} />
                <StatTile label="Views · all time" value={data.total_views} />
                <StatTile
                  label="Most read"
                  value={data.top_articles?.[0]?.views ?? 0}
                  note={data.top_articles?.[0]?.title?.slice(0, 46) || '—'}
                />
                <StatTile label="Articles read" value={data.tracked_articles} note={`in the last ${range}`} />
              </div>

              <DailyChart data={data.daily} label={`Views per day · last ${range}`} />

              <div className="analytics-grid">
                <BarList
                  title={`Most read · last ${range}`}
                  rows={data.top_articles}
                  labelKey="title"
                  linkFor={(r) => `${import.meta.env.BASE_URL}article/${r.slug}`}
                />
                <BarList
                  title="By section"
                  rows={(data.by_section || []).map((s) => ({
                    ...s,
                    name: sectionBySlug(s.section)?.name || s.section,
                  }))}
                  labelKey="name"
                />
                <BarList title="Where readers came from" rows={data.referrers} labelKey="source" />
              </div>
            </>
          ) : null}
        </div>
      )}

      <p className="studio-note">
        Views are counted once per reader per browser session, and editors' own visits
        aren't counted. Nothing personal is stored — no IP addresses, no cookies, no
        identifiers — only that an article was read, which is why the site needs no
        cookie banner.
      </p>
    </div>
  )
}
