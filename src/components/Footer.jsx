import { Link } from 'react-router-dom'
import { SECTIONS } from '../data/sections'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="tagline">
            “Embrace the unknown, explore the unseen, and discover the unheard.”
            <br />— the student media magazine of the University of Nottingham Malaysia.
          </p>
        </div>
        <div>
          <h4>Sections</h4>
          <ul>
            {SECTIONS.slice(0, 5).map((s) => (
              <li key={s.slug}><Link to={`/section/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>More</h4>
          <ul>
            {SECTIONS.slice(5).map((s) => (
              <li key={s.slug}><Link to={`/section/${s.slug}`}>{s.name}</Link></li>
            ))}
            <li><Link to="/articles">All articles</Link></li>
            <li><Link to="/login">Editor login</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-mark">IGNITE</div>
      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Ignite — UNM Student Media</span>
        <span>Demo build · React redesign concept</span>
      </div>
    </footer>
  )
}
