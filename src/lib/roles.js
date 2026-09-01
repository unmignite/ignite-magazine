// Role labels and UI permission checks.
//
// These control what the interface OFFERS. They are not the security boundary —
// the database enforces the same rules via Row-Level Security (see
// supabase/schema.sql), so hiding a button and blocking the action are separate
// layers, and the database one is the one that actually counts.

// Shown in the admin bar. `admin` is the full-access role held by the Web
// Manager; rename these freely, they are display text only — the permission
// rules below (and the database policies) key off 'admin' / 'editor'.
export const ROLE_LABELS = {
  admin: 'Web Manager',
  editor: 'Section Editor',
}

const EDITOR_ACTIONS = ['create', 'edit', 'publish']

export const can = (user, action) => {
  if (!user) return false
  if (user.role === 'admin') return true // includes 'delete' and 'feature'
  if (user.role === 'editor') return EDITOR_ACTIONS.includes(action)
  return false
}
