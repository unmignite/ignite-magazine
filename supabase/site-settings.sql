-- ============================================================================
-- Site settings — the editable design theme
-- ============================================================================
-- Run once in the Supabase SQL Editor (after schema.sql).
--
-- A single row holding the site's design tokens (palette, fonts, carousel
-- speed). Everyone can read it — the site needs the theme before anyone logs
-- in — but only the Web Manager or a Designer can change it.
-- ============================================================================

-- 1. Add the 'designer' role: can restyle the site, cannot touch articles.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'editor', 'designer'));

-- 2. The settings row. `id = 1` is enforced, so there can only ever be one.
create table if not exists public.site_settings (
  id         smallint primary key default 1 check (id = 1),
  theme      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

insert into public.site_settings (id, theme)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- 3. Security. Read by all, written only by design-capable staff.
alter table public.site_settings enable row level security;

drop policy if exists site_settings_read  on public.site_settings;
drop policy if exists site_settings_write on public.site_settings;

create policy site_settings_read on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy site_settings_write on public.site_settings
  for update
  to authenticated
  using (public.user_role() in ('admin', 'designer'))
  with check (public.user_role() in ('admin', 'designer'));

-- 4. Data API grants (this project has auto-expose off, so these are required).
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all privileges on public.site_settings to service_role;
