import { useState } from 'react'

// Charts for the analytics dashboard.
//
// Design notes (deliberate, not arbitrary):
// • ONE colour for every bar. These charts compare magnitude, not identity, so
//   bar length already carries the value — colouring bars differently would
//   double-encode it. The site's section colours are also unusable here: they
//   repeat (News and Film & TV are both red) and yellow/green fail contrast on
//   white at 1.18:1 and 1.89:1.
// • Solid hairline gridlines, one shade off the surface. Never dashed.
// • Values are always readable without hovering — direct labels on horizontal
//   bars, and a table view on the time series where 30 labels would be chaos.

const ACCENT = 'var(--pink)'
const GRID = 'var(--grey-light)'

const fmt = (n) => n.toLocaleString('en-GB')

/* ---------------------------------------------------------------- time series */

export function DailyChart({ data, label = 'Views per day' }) {
  const [showTable, setShowTable] = useState(false)
  const [hover, setHover] = useState(null)

  if (!data?.length) return <p className="chart-empty">No views recorded yet.</p>

  const max = Math.max(...data.map((d) => d.views), 1)
  const W = 720
  const H = 200
  const PAD_L = 34
  const PAD_B = 22
  const plotW = W - PAD_L
  const plotH = H - PAD_B
  const slot = plotW / data.length
  const barW = Math.max(2, slot - 2) // 2px surface gap between bars

  // Three ticks is enough to read magnitude without turning into a ladder.
  const ticks = [0, Math.round(max / 2), max]

  return (
    <div className="chart">
      <div className="chart-head">
        <h3>{label}</h3>
        <button className="chart-toggle" onClick={() => setShowTable(!showTable)}>
          {showTable ? 'Chart' : 'Table'}
        </button>
      </div>

      {showTable ? (
        <div className="chart-table-wrap">
          <table className="chart-table">
            <thead><tr><th>Date</th><th>Views</th></tr></thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.day}><td>{d.day}</td><td>{fmt(d.views)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-plot">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}. Peak ${max} views.`}>
            {ticks.map((t) => {
              const y = plotH - (t / max) * plotH
              return (
                <g key={t}>
                  <line x1={PAD_L} x2={W} y1={y} y2={y} stroke={GRID} strokeWidth="1" />
                  <text x={PAD_L - 8} y={y + 4} textAnchor="end" className="tick">{t}</text>
                </g>
              )
            })}

            {data.map((d, i) => {
              const h = (d.views / max) * plotH
              const x = PAD_L + i * slot + (slot - barW) / 2
              return (
                <rect
                  key={d.day}
                  x={x}
                  y={plotH - h}
                  width={barW}
                  height={Math.max(h, d.views > 0 ? 2 : 0)}
                  rx={Math.min(4, barW / 2)}
                  fill={ACCENT}
                  opacity={hover && hover.day !== d.day ? 0.45 : 1}
                  onMouseEnter={() => setHover(d)}
                  onMouseLeave={() => setHover(null)}
                />
              )
            })}

            {/* first and last date only — a label per bar would be unreadable */}
            <text x={PAD_L} y={H - 6} className="tick">{data[0]?.day?.slice(5)}</text>
            <text x={W} y={H - 6} textAnchor="end" className="tick">
              {data[data.length - 1]?.day?.slice(5)}
            </text>
          </svg>

          <p className="chart-hover" aria-live="polite">
            {hover ? `${hover.day} — ${fmt(hover.views)} views` : ' '}
          </p>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------ horizontal bars */

export function BarList({ title, rows, labelKey, valueKey = 'views', linkFor }) {
  if (!rows?.length) return (
    <div className="chart">
      <div className="chart-head"><h3>{title}</h3></div>
      <p className="chart-empty">Nothing yet.</p>
    </div>
  )

  const max = Math.max(...rows.map((r) => r[valueKey]), 1)

  return (
    <div className="chart">
      <div className="chart-head"><h3>{title}</h3></div>
      <ul className="bar-list">
        {rows.map((r, i) => {
          const label = r[labelKey]
          const value = r[valueKey]
          const href = linkFor?.(r)
          return (
            <li key={`${label}-${i}`}>
              <div className="bar-label">
                {href ? <a href={href}>{label}</a> : label}
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.max((value / max) * 100, 1.5)}%` }}
                />
                {/* direct label: the value never depends on a hover */}
                <span className="bar-value">{fmt(value)}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ stat tile */

export function StatTile({ label, value, note }) {
  return (
    <div className="stat-tile">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{typeof value === 'number' ? fmt(value) : value}</span>
      {note && <span className="stat-note">{note}</span>}
    </div>
  )
}
