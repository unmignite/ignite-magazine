import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <h1 className="display">404</h1>
      <p>This page burned out before it could ignite.</p>
      <Link className="btn-ghost" to="/">Back to the front page</Link>
    </div>
  )
}
