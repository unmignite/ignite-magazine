import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTIONS } from '../data/sections'

const EMAIL = 'unmignite@gmail.com'

export default function Footer() {
  const [copied, setCopied] = useState(false)

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
            <li><Link to="/faqs">FAQs</Link></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/login">Editor login</Link></li>
          </ul>
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
