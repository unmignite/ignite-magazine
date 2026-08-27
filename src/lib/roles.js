// Role labels and UI permission checks.
//
// These control what the interface OFFERS. They are not the security boundary —
// the database enforces the same rules via Row-Level Security (see
// supabase/schema.sql), so hiding a button and blocking the action are separate
// layers, and the database one is the one that actually counts.

export const ROLE_LABELS = {
  admin: 'Editor-in-Chief',
  editor: 'Section Editor',
}

const EDITOR_ACTIONS = ['create', 'edit', 'publish']

export const can = (user, action) => {
  if (!user) return false
  if (user.role === 'admin') return true // includes 'delete' and 'feature'
  if (user.role === 'editor') return EDITOR_ACTIONS.includes(action)
  return false
}
