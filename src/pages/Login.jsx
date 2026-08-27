import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Login() {
  const { login, user } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = await login(email, password)
    setBusy(false)
    if (!res.ok) {
      setError(res.error || 'Could not sign in.')
      return
    }
    navigate('/studio')
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="display">
          The <span className="y">Studio</span>.
        </h1>
        <p>
          Everything about Ignite is edited from inside Ignite — write, style and publish
          without ever leaving the site.
        </p>
      </div>
      <div className="login-right">
        <h2>Editor login</h2>
        {user && (
          <p className="field hint" style={{ marginBottom: '1rem' }}>
            You are already logged in as {user.name}.
          </p>
        )}
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
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Log in →'}
          </button>
        </form>

        <p className="login-foot">
          Accounts are created by the Editor-in-Chief in the Supabase dashboard.
          Lost your password? Ask them to reset it for you.
        </p>
      </div>
    </div>
  )
}
