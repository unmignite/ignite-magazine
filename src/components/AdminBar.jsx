import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { ROLE_LABELS, can } from '../lib/roles'

export default function AdminBar() {
  const { user, logout } = useStore()
  const navigate = useNavigate()
  if (!user) return null

  return (
    <div className="adminbar">
      <span className="dot" />
      <span className="who">
        {user.name} · {ROLE_LABELS[user.role] || user.role}
      </span>
      <span className="spacer" />
      <Link to="/studio">Studio</Link>
      <Link to="/studio/new">+ New article</Link>
      {can(user, 'design') && <Link to="/studio/design">Design</Link>}
      <button
        onClick={() => {
          logout()
          navigate('/')
        }}
      >
        Log out
      </button>
    </div>
  )
}
