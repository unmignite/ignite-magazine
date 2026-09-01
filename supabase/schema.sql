-- ============================================================================
-- IGNITE — database schema
-- ============================================================================
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: everything is written to be idempotent.
--
-- SECURITY MODEL (read this before changing anything)
-- The website's API key is public — it ships inside the browser bundle by
-- design. It is NOT what protects the data. These Row-Level Security policies
-- are. Every table below has RLS enabled and denies by default, so an
-- anonymous caller can do exactly one thing: read published articles.
--   anon (any visitor) ....... read published articles only
--   editor (logged in) ....... read everything, create + edit articles
--   admin  (logged in) ....... the above, plus delete and feature
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Tables
-- ----------------------------------------------------------------------------

-- One row per editor account. Mirrors auth.users, adding name + role.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null default '',
  role       text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- The articles. Column names match the fields the React app already uses.
create table if not exists public.articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  dek          text not null default '',
  section      text not null,
  author       text not null default '',
  date         date not null default current_date,
  read_time    integer not null default 4,
  cover        text not null default '',
  cover_credit text not null default '',
  tags         text[] not null default '{}',
  featured     boolean not null default false,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  credits      jsonb not null default '{}'::jsonb,
  body         text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Indexes for the queries the site actually makes.
create index if not exists articles_status_date_idx on public.articles (status, date desc);
create index if not exists articles_section_idx     on public.articles (section);
create index if not exists articles_featured_idx    on public.articles (featured) where featured;


-- ----------------------------------------------------------------------------
-- 2. Helper: what role is the current user?
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER lets this read profiles without tripping the policies on
-- profiles itself (which would otherwise recurse infinitely).

create or replace function public.user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;


-- ----------------------------------------------------------------------------
-- 3. Keep updated_at honest
-- ----------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();


-- ----------------------------------------------------------------------------
-- 4. Only admins may change `featured`
-- ----------------------------------------------------------------------------
-- RLS can't restrict a single column, so this trigger enforces it. Editors can
-- edit an article freely; flipping it onto the landing carousel is admin-only.

create or replace function public.guard_featured()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.featured is distinct from old.featured and coalesce(public.user_role(), '') <> 'admin' then
    raise exception 'Only an Editor-in-Chief can feature or unfeature an article';
  end if;
  return new;
end;
$$;

drop trigger if exists articles_guard_featured on public.articles;
create trigger articles_guard_featured
  before update on public.articles
  for each row execute function public.guard_featured();


-- ----------------------------------------------------------------------------
-- 5. Give every new auth user a profile row
-- ----------------------------------------------------------------------------
-- New accounts default to 'editor'. Promote to 'admin' deliberately, by hand:
--   update public.profiles set role = 'admin' where id = '<user-uuid>';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ----------------------------------------------------------------------------
-- 6. Row-Level Security
-- ----------------------------------------------------------------------------
-- With RLS enabled and no matching policy, an operation is DENIED. So the
-- policies below are an exhaustive list of what is possible.

alter table public.articles enable row level security;
alter table public.profiles enable row level security;

-- Clean slate so this script can be re-run safely.
drop policy if exists articles_read_published on public.articles;
drop policy if exists articles_read_all_staff on public.articles;
drop policy if exists articles_insert_staff   on public.articles;
drop policy if exists articles_update_staff   on public.articles;
drop policy if exists articles_delete_admin   on public.articles;
drop policy if exists profiles_read_staff     on public.profiles;

-- READ: anyone at all — including a stranger with the public key — sees
-- published articles and nothing else. Drafts stay invisible.
create policy articles_read_published on public.articles
  for select
  to anon, authenticated
  using (status = 'published');

-- READ: logged-in staff additionally see drafts.
create policy articles_read_all_staff on public.articles
  for select
  to authenticated
  using (public.user_role() in ('admin', 'editor'));

-- CREATE / EDIT: staff only.
create policy articles_insert_staff on public.articles
  for insert
  to authenticated
  with check (public.user_role() in ('admin', 'editor'));

create policy articles_update_staff on public.articles
  for update
  to authenticated
  using (public.user_role() in ('admin', 'editor'))
  with check (public.user_role() in ('admin', 'editor'));

-- DELETE: Editor-in-Chief only.
create policy articles_delete_admin on public.articles
  for delete
  to authenticated
  using (public.user_role() = 'admin');

-- Profiles are readable by logged-in staff (to show names); nobody can write
-- them from the browser. Roles are changed in the dashboard, on purpose.
create policy profiles_read_staff on public.profiles
  for select
  to authenticated
  using (true);


-- ----------------------------------------------------------------------------
-- 7. Data API grants
-- ----------------------------------------------------------------------------
-- The project is configured with "Automatically expose new tables" OFF, so a
-- table is only reachable through the API once it is granted here. These are
-- deliberately narrow. Note that grants and RLS are two separate gates: a grant
-- says "this role may attempt this operation", RLS then decides which rows.
-- Both must allow, so an over-broad grant is still contained by the policies.

grant usage on schema public to anon, authenticated;

grant select                         on public.articles to anon, authenticated;
grant insert, update, delete         on public.articles to authenticated;
grant select                         on public.profiles to authenticated;

grant execute on function public.user_role() to anon, authenticated;

-- service_role is the trusted server-side role behind a *secret* key. It
-- bypasses RLS, but with auto-expose off it still needs explicit grants —
-- without these, even admin tooling (backups, the one-time Wix migration)
-- gets "permission denied". It is never used by the website itself.
grant usage on schema public to service_role;
grant all privileges on public.articles to service_role;
grant all privileges on public.profiles to service_role;


-- ----------------------------------------------------------------------------
-- 8. Image storage
-- ----------------------------------------------------------------------------
-- Public bucket: article images must be readable by every visitor. Uploading
-- and deleting, however, is staff-only.

insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do update set public = true;

drop policy if exists article_images_read   on storage.objects;
drop policy if exists article_images_write  on storage.objects;
drop policy if exists article_images_update on storage.objects;
drop policy if exists article_images_delete on storage.objects;

create policy article_images_read on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'article-images');

create policy article_images_write on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'article-images' and public.user_role() in ('admin', 'editor'));

create policy article_images_update on storage.objects
  for update
  to authenticated
  using (bucket_id = 'article-images' and public.user_role() in ('admin', 'editor'));

create policy article_images_delete on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'article-images' and public.user_role() = 'admin');
