import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SECTIONS } from '../data/sections'
import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'
import SearchOverlay, { MagnifierIcon } from './SearchOverlay'

// Every section lives behind the menu rather than in the bar. Nine links across
// the top left no room to breathe and pushed the type down to 11px; one button
// keeps the header quiet and lets the sections have a page of their own.
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
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

  // Close both overlays on navigation, and hold the page still while either is
  // over it.
  useEffect(() => {
    setOpen(false)
    setSearching(false)
  }, [pathname])

  const covered = open || searching
  useEffect(() => {
    document.body.style.overflow = covered ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [covered])

  // Only one panel at a time — they occupy the same screen.
  const openMenu = (next) => { setOpen(next); if (next) setSearching(false) }
  const openSearch = (next) => { setSearching(next); if (next) setOpen(false) }

  // Light treatment: over the opening image, and over an open panel — both are
  // dark, so the header needs white type either way.
  const light = covered || (overHero && !scrolled)

  return (
    <>
      <header className={`nav${overHero ? ' overlay' : ''}${light ? ' light' : ''}`}>
        <div className="nav-inner">
          <button
            className={`burger ${open ? 'open' : ''}`}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => openMenu(!open)}
          >
            <span className="burger-bars"><i /><i /><i /></span>
            <span className="burger-text">{open ? 'Close' : 'Menu'}</span>
          </button>

          <Link to="/" className="logo" onClick={() => openMenu(false)}>
            IGNITE<em>.</em>
          </Link>

          <div className="nav-right">
            <button
              className={`nav-search ${searching ? 'on' : ''}`}
              aria-expanded={searching}
              aria-label={searching ? 'Close search' : 'Search articles'}
              onClick={() => openSearch(!searching)}
            >
              {searching ? <span aria-hidden="true">✕</span> : <MagnifierIcon />}
            </button>
            <Link to={user ? '/studio' : '/login'} className="nav-login">
              {user ? 'Studio' : 'Log in'}
            </Link>
          </div>
        </div>
      </header>

      {searching && <SearchOverlay onClose={() => setSearching(false)} />}

      {open && (
        <div className="nav-menu" onClick={() => setOpen(false)}>
          {/* No per-section accent here any more: the menu marks the hovered and
              current items by weight, not colour, so passing one would be dead. */}
          <nav className="nav-menu-list">
            <NavLink to="/articles">All articles</NavLink>
            {SECTIONS.map((s) => (
              <NavLink key={s.slug} to={`/section/${s.slug}`}>{s.name}</NavLink>
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
