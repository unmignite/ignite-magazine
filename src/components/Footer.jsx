import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTIONS } from '../data/sections'
import { useTheme } from '../context/ThemeContext'
import { JOIN_URL } from '../lib/blocks'

const EMAIL = 'unmignite@gmail.com'

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const { homepage } = useTheme()

  // Read the link off the closing slide rather than keeping a second copy, so
  // editing it in Studio → Layout moves both buttons. Falls back to the default
  // if the hero block is ever removed from the homepage.
  const joinUrl = homepage.find((b) => b.type === 'hero')?.joinUrl || JOIN_URL

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* The footer is on every page, so this doubles as the contact page —
            the "Contact" links in the menu and below just scroll here. */}
        <div className="footer-contact" id="contact">
          <h4>Contact</h4>
          <address>
            The University of Nottingham,<br />
            Malaysia Campus,<br />
            Jalan Broga, 43500, Semenyih
          </address>
          {/* mailto: silently does nothing for anyone without a desktop mail
              client, so copy the address too. The default is NOT prevented —
              people who do have one still get their compose window. */}
          <a
            className="footer-email"
            href={`mailto:${EMAIL}`}
            onClick={() => {
              // Only claim it was copied once the write actually resolves —
              // clipboard access can be refused, and saying "Copied" when
              // nothing was is worse than saying nothing.
              navigator.clipboard?.writeText(EMAIL)
                .then(() => {
                  setCopied(true)
                  setTimeout(() => setCopied(false), 3000)
                })
                .catch(() => {})
            }}
          >
            {copied ? 'Copied to your clipboard ✓' : EMAIL}
          </a>
          <a
            className="footer-social"
            href="https://www.instagram.com/unm_ignite/"
            target="_blank"
            rel="noreferrer"
          >
            @unm_ignite on Instagram
          </a>
        </div>

        <div>
          <h4>Sections</h4>
          {/* Every section, however many there are — the list splits into two
              columns rather than spilling half of them under another heading. */}
          <ul className="footer-sections">
            {SECTIONS.map((s) => (
              <li key={s.slug}><Link to={`/section/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>More</h4>
          <ul>
            <li><Link to="/articles">All articles</Link></li>
            {/* Also in the menu — a page reachable from only one of the two
                places people look for it is a page half the readers miss. */}
            <li><Link to="/meet-the-team">Meet the team</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/login">Editor login</Link></li>
          </ul>
          {/* The closing slide only reaches people who sit through the reel;
              the footer is on every page. Same form, second way in. */}
          <a className="footer-join" href={joinUrl} target="_blank" rel="noreferrer">
            Join Ignite
          </a>
        </div>
      </div>

      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Ignite — UNM Student Media</span>
        <a href="https://www.instagram.com/unm_ignite/" target="_blank" rel="noreferrer">
          @unm_ignite
        </a>
      </div>
    </footer>
  )
}
