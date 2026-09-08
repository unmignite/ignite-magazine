-- ---------------------------------------------------------------------------
-- Must Read
-- ---------------------------------------------------------------------------
-- Run this once in Supabase → SQL Editor. Safe to run again.
--
-- Adds a per-article "must read" flag. Each section page shows the articles
-- from that section marked with it, in a strip above the archive.
--
-- Deliberately NOT the same thing as `featured`:
--
--   featured   admin-only, drives the landing carousel. Six across the whole
--              magazine, chosen by the Web Manager.
--   must_read  any editor, drives their own section's strip. A section editor
--              curating their own patch shouldn't need to put an article on
--              the front page to do it, and shouldn't need an admin.
--
-- No new grants or policies are needed: grants on public.articles are
-- table-level, so this column is already covered, and articles_update_staff
-- already lets editors write. Only `featured` carries an admin-only trigger.

alter table public.articles
  add column if not exists must_read boolean not null default false;

-- The section pages ask "which articles in this section are marked?", so index
-- that pair — partial, because the marked rows are a small slice of the table.
create index if not exists articles_must_read_idx
  on public.articles (section)
  where must_read;

-- Check it applied:
--   select section, count(*) filter (where must_read) as must_read, count(*) as total
--   from public.articles where status = 'published' group by section order by section;
