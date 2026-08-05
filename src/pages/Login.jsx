import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Login() {
  const { login, user } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = login(email, password)
    if (!res.ok) return setError(res.error)
    navigate('/studio')
  }

  const fill = (mail) => {
    setEmail(mail)
    setPassword('ignite2026')
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="display">
          The <span className="y">Studio</span>.
        </h1>
        <p>
          Everything about Ignite is edited from inside Ignite — write, style and publish
          without ever leaving the site. No Wix, no fuss.
        </p>
      </div>
      <div className="login-right">
        <h2>Editor login</h2>
        {user && <p className="field hint" style={{ marginBottom: '1rem' }}>You are already logged in as {user.name}.</p>}
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit">Log in →</button>
        </form>

        <div className="demo-creds">
          <b>Demo accounts</b>
          <br />
          Editor-in-Chief (full access):{' '}
          <button type="button" onClick={() => fill('chief@unmignite.com')}>chief@unmignite.com</button>
          <br />
          Section Editor (write &amp; edit, no delete/feature):{' '}
          <button type="button" onClick={() => fill('editor@unmignite.com')}>editor@unmignite.com</button>
          <br />
          Password for both: <code>ignite2026</code>
        </div>
      </div>
    </div>
  )
}
