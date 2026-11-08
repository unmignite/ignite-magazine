// Article titles can strike words through: "Watching for ~~love~~ the thrill".
//
// The title is a single text column used as plain text in a dozen places — the
// slug, the share text, image alt text, search, the Studio's lists — so the
// strike is written into it with the same ~~ markers Markdown uses, rather than
// turning the title into HTML. Where it is shown as a heading, <TitleText>
// draws the struck words; everywhere else, plainTitle() drops the markers and
// keeps the words, so a struck word still reads and still searches.

const STRIKE = /~~(.+?)~~/g

export const plainTitle = (title) => (title || '').replace(STRIKE, '$1')

export function TitleText({ title }) {
  // split() with a capture group alternates plain text and struck text.
  return (title || '').split(/~~(.+?)~~/).map((part, i) =>
    i % 2 ? <s key={i} className="title-strike">{part}</s> : part
  )
}

// Wraps the textarea's selection in ~~, or unwraps it if it is already struck,
// and returns the new title with the selection to restore.
export function toggleStrike(title, start, end) {
  const before = title.slice(0, start)
  const picked = title.slice(start, end)
  const after = title.slice(end)

  if (picked.startsWith('~~') && picked.endsWith('~~') && picked.length >= 4) {
    const inner = picked.slice(2, -2)
    return { title: before + inner + after, start, end: start + inner.length }
  }
  if (before.endsWith('~~') && after.startsWith('~~')) {
    return { title: before.slice(0, -2) + picked + after.slice(2), start: start - 2, end: end - 2 }
  }
  if (!picked.trim()) return null
  return { title: `${before}~~${picked}~~${after}`, start: start + 2, end: end + 2 }
}
