import { useState } from 'react'
import { Link } from 'react-router-dom'
import { answeredGroups } from '../data/faqs'

export default function Faqs() {
  const groups = answeredGroups()
  const [active, setActive] = useState(groups[0]?.id)
  const [copied, setCopied] = useState(false)

  const group = groups.find((g) => g.id === active) || groups[0]

  return (
    <>
      <div className="section-hero" style={{ '--accent': 'var(--yellow)' }}>
        <h1 className="display">FAQs</h1>
        <p>Wondering about something? Your answer might be right here.</p>
      </div>

      <div className="faq-page">
        {groups.length === 0 ? (
          <p className="empty-note">
            No questions answered yet — check back shortly.
          </p>
        ) : (
          <>
            {groups.length > 1 && (
              <div className="faq-tabs" role="tablist">
                {groups.map((g) => (
                  <button
                    key={g.id}
                    role="tab"
                    aria-selected={g.id === active}
                    className={g.id === active ? 'on' : ''}
                    onClick={() => setActive(g.id)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            )}

            {group?.blurb && <p className="faq-blurb">{group.blurb}</p>}

            <div className="faq-list">
              {group?.items.map((item, i) => (
                // <details> is keyboard-accessible and works without JavaScript.
                <details className="faq-item" key={`${group.id}-${i}`}>
                  <summary>
                    <span>{item.q}</span>
                    <span className="faq-mark" aria-hidden="true" />
                  </summary>
                  <div
                    className="faq-answer"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                </details>
              ))}
            </div>
          </>
        )}

        <div className="faq-foot">
          <h2>Still wondering?</h2>
          <p>
            Message us on Instagram or drop us an email — we're happy to answer
            anything that isn't covered here.
          </p>
          <div className="faq-foot-actions">
            <a
              className="btn-primary"
              href="https://www.instagram.com/unm_ignite/"
              target="_blank"
              rel="noreferrer"
            >
              @unm_ignite
            </a>
            {/* `mailto:` silently does nothing for anyone without a desktop mail
                client (most webmail users), so copy the address as well. The
                default is NOT prevented — people who do have a client still get
                their compose window, and everyone else gets it on the clipboard. */}
            <a
              className="btn-ghost"
              href="mailto:unmignite@gmail.com"
              onClick={() => {
                navigator.clipboard?.writeText('unmignite@gmail.com').catch(() => {})
                setCopied(true)
                setTimeout(() => setCopied(false), 3000)
              }}
            >
              {copied ? 'Copied ✓' : 'unmignite@gmail.com'}
            </a>
            <Link className="btn-ghost" to="/articles">Browse all articles</Link>
          </div>
          {copied && (
            <p className="faq-copied" aria-live="polite">
              Address copied to your clipboard.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
