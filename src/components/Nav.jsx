import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SECTIONS, accentVars } from '../data/sections'
import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'

// Every section lives behind the menu rather than in the bar. Nine links across
// the top left no room to breathe and pushed the type down to 11px; one button
// keeps the header quiet and lets the sections have a page of their own.
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useStore()
  const { homepage } = useTheme()
  const { pathname } = useLocation()

  // The header sits *on* the opening image rather than above it — but only when
  // the homepage actually opens with one. Reorder the blocks in Studio → Layout
  // so something else comes first and it goes back to a solid bar, rather than
  // white text over a white page.
  const overHero = pathname === '/' && homepage[0]?.type === 'hero'

  useEffect(() => {
    if (!overHero) {
      setScrolled(false)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    onScroll() // a reload part-way down the page shouldn't start out transparent
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overHero])

  // Close on navigation, and hold the page still while the menu is over it.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Light treatment: over the opening image, and over the open menu — both are
  // dark, so the header needs white type either way.
  const light = open || (overHero && !scrolled)

  return (
    <>
      <header className={`nav${overHero ? ' overlay' : ''}${light ? ' light' : ''}`}>
        <div className="nav-inner">
          <button
            className={`burger ${open ? 'open' : ''}`}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span className="burger-bars"><i /><i /><i /></span>
            <span className="burger-text">{open ? 'Close' : 'Menu'}</span>
          </button>

          <Link to="/" className="logo" onClick={() => setOpen(false)}>
            IGNITE<em>.</em>
          </Link>

          <Link to={user ? '/studio' : '/login'} className="nav-login">
            {user ? 'Studio' : 'Log in'}
          </Link>
        </div>
      </header>

      {open && (
        <div className="nav-menu" onClick={() => setOpen(false)}>
          <nav className="nav-menu-list">
            <NavLink to="/articles" style={{ '--accent': 'var(--yellow)' }}>All articles</NavLink>
            {SECTIONS.map((s) => (
              <NavLink key={s.slug} to={`/section/${s.slug}`} style={accentVars(s)}>
                {s.name}
              </NavLink>
            ))}
          </nav>
          <nav className="nav-menu-minor">
            <NavLink to="/faqs">FAQs</NavLink>
            {/* Contact is the footer, on whatever page you're already on — a
                plain hash link rather than a route, so there's nothing to load. */}
            <a href="#contact">Contact</a>
            <NavLink to={user ? '/studio' : '/login'}>{user ? 'Studio' : 'Log in'}</NavLink>
          </nav>
        </div>
      )}
    </>
  )
}
