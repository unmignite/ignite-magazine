// Demo accounts. In production this would live behind a real auth service
// (e.g. Supabase/Firebase auth + a database), but the roles model stays the same.

export const USERS = [
  {
    email: 'chief@unmignite.com',
    password: 'ignite2026',
    name: 'Dhiren',
    role: 'admin',
    title: 'Web Manager · Editor-in-Chief',
  },
  {
    email: 'editor@unmignite.com',
    password: 'ignite2026',
    name: 'Fasya',
    role: 'editor',
    title: 'Creative Director',
  },
]

export const ROLE_LABELS = {
  admin: 'Editor-in-Chief',
  editor: 'Section Editor',
}

// What each role is allowed to do.
export const can = (user, action, article) => {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role === 'editor') {
    if (action === 'create' || action === 'edit' || action === 'publish') return true
    return false // delete + feature are admin-only
  }
  return false
}
