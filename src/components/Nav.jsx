import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SECTIONS } from '../data/sections'
import { useStore } from '../context/StoreContext'

// Every section appears in the top bar — nothing should be reachable only from
// the footer. If the list ever grows too wide for one line, drop sections into
// NAV_HIDDEN rather than silently truncating.
const NAV_HIDDEN = []

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { user } = useStore()
  const links = SECTIONS.filter((s) => !NAV_HIDDEN.includes(s.slug))

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo" onClick={() => setOpen(false)}>
            IGNITE<em>.</em>
          </Link>
          <nav className="nav-links">
            <NavLink to="/articles" className="nav-all">All</NavLink>
            {links.map((s) => (
              <NavLink key={s.slug} to={`/section/${s.slug}`} style={{ '--accent': s.color }}>
                {s.name}
              </NavLink>
            ))}
          </nav>
          {user ? (
            <Link to="/studio" className="nav-login">Studio</Link>
          ) : (
            <Link to="/login" className="nav-login">Log in</Link>
          )}
          <button
            className={`burger ${open ? 'open' : ''}`}
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu" onClick={() => setOpen(false)}>
          <Link to="/articles" style={{ '--accent': 'var(--yellow)' }}>All articles</Link>
          {SECTIONS.map((s) => (
            <Link key={s.slug} to={`/section/${s.slug}`} style={{ '--accent': s.color }}>
              {s.name}
            </Link>
          ))}
          <Link to="/faqs" style={{ '--accent': 'var(--yellow)' }}>FAQs</Link>
          <Link to={user ? '/studio' : '/login'} style={{ '--accent': 'var(--yellow)' }}>
            {user ? 'Studio' : 'Log in'}
          </Link>
        </div>
      )}
    </>
  )
}
