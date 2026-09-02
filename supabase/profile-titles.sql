-- ============================================================================
-- Display titles for editor accounts
-- ============================================================================
-- Run once in the Supabase SQL Editor.
--
-- `role` decides what someone can DO ('admin' / 'editor' / 'designer') and is
-- enforced by the policies in schema.sql. `title` is purely what the admin bar
-- SHOWS, so two people with identical permissions can carry different job
-- titles — e.g. a Web Manager and a Creative Director who are both admins.
-- Leave it null and the role's generic label is used instead.
-- ============================================================================

alter table public.profiles add column if not exists title text;

update public.profiles set title = 'Web Manager' where name = 'Dhiren';
update public.profiles set title = 'Designer'    where name = 'Fasya';

select name, role, title from public.profiles;
