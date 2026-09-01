-- ============================================================================
-- Homepage layout — the editable arrangement of the landing page
-- ============================================================================
-- Run once in the Supabase SQL Editor (after site-settings.sql).
--
-- Stores the landing page as an ordered list of blocks. It lives on the same
-- row as the theme, so it inherits exactly the same permissions: everyone can
-- read it, only the Web Manager or a Designer can change it.
--
-- An empty array means "use the built-in layout" (see DEFAULT_HOMEPAGE in
-- src/lib/blocks.js), so this is safe to run before anyone edits anything.
-- ============================================================================

alter table public.site_settings
  add column if not exists homepage jsonb not null default '[]'::jsonb;
