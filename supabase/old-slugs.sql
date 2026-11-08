-- ---------------------------------------------------------------------------
-- Old URLs
-- ---------------------------------------------------------------------------
-- Run this once in Supabase → SQL Editor. Safe to run again.
--
-- An article's URL (its slug) is made from its title when it is first saved.
-- Retitle it later and the URL still spells the old title, so the Studio now
-- lets an editor change the slug. Links to the old one are already out there —
-- on Instagram, in group chats, in search results — so the slugs an article
-- has had are kept here, and /article/<old-slug> redirects to the current one.
--
-- Until this has been run the Studio still lets the URL be changed, but warns
-- that the old link will stop working.
--
-- No new grants or policies are needed: grants on public.articles are
-- table-level, so this column is already covered.

alter table public.articles
  add column if not exists old_slugs text[] not null default '{}';

-- Check it applied:
--   select slug, old_slugs from public.articles where old_slugs <> '{}';
