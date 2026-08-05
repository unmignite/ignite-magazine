import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SECTIONS } from '../data/seedArticles'
import { useStore } from '../context/StoreContext'

// Sections shown in the top bar (the rest live in the footer + mobile menu)
const NAV_SECTIONS = ['music', 'film-tv', 'beauty-style', 'opinions', 'food-travel', 'news']

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { user } = useStore()
  const links = SECTIONS.filter((s) => NAV_SECTIONS.includes(s.slug))

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo" onClick={() => setOpen(false)}>
            IGNITE<em>.</em>
          </Link>
          <nav className="nav-links">
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
          {SECTIONS.map((s) => (
            <Link key={s.slug} to={`/section/${s.slug}`} style={{ '--accent': s.color }}>
              {s.name}
            </Link>
          ))}
          <Link to={user ? '/studio' : '/login'} style={{ '--accent': 'var(--yellow)' }}>
            {user ? 'Studio' : 'Log in'}
          </Link>
        </div>
      )}
    </>
  )
}
