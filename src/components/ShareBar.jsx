import { useEffect, useRef, useState } from 'react'

// Share bar for article pages.
// Instagram has no web share URL — the native share sheet (mobile) is the only
// direct route, so the Instagram chip copies the link with a paste hint instead.
export default function ShareBar({ title }) {
  const [note, setNote] = useState('')
  const noteTimer = useRef(null)
  useEffect(() => () => clearTimeout(noteTimer.current), [])

  const url = window.location.href
  const text = `${title} — IGNITE`

  const flash = (msg) => {
    clearTimeout(noteTimer.current)
    setNote(msg)
    noteTimer.current = setTimeout(() => setNote(''), 3500)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title: text, url })
    } catch {
      /* user closed the sheet — nothing to do */
    }
  }

  const openPopup = (shareUrl) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=640,height=560')
  }

  return (
    <div className="share-bar">
      <span className="share-label">Share</span>

      {typeof navigator.share === 'function' && (
        <button className="share-chip primary" onClick={nativeShare}>
          Share…
        </button>
      )}

      <button
        className="share-chip"
        onClick={async () => {
          await copyLink()
          flash('Link copied — paste it into your Instagram Story, bio or DM.')
        }}
      >
        Instagram
      </button>

      <button
        className="share-chip"
        onClick={() => openPopup(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`)}
      >
        WhatsApp
      </button>

      <button
        className="share-chip"
        onClick={() => openPopup(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)}
      >
        X
      </button>

      <button
        className="share-chip"
        onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
      >
        Facebook
      </button>

      <button
        className="share-chip"
        onClick={async () => {
          await copyLink()
          flash('Link copied ✓')
        }}
      >
        Copy link
      </button>

      {note && <p className="share-note">{note}</p>}
    </div>
  )
}
