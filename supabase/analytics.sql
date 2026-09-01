-- ============================================================================
-- Analytics — privacy-preserving readership stats
-- ============================================================================
-- Run once in the Supabase SQL Editor (after schema.sql).
--
-- PRIVACY BY DESIGN. We record that *an article was read*, not *who read it*:
-- no IP address, no user agent, no cookies, no identifiers of any kind. Nothing
-- here can be traced back to a person, which is why the site needs no cookie
-- banner and why this is safe under GDPR/PDPA as anonymous aggregate data.
-- Keep it that way — adding an IP column would change the site's legal footing.
--
-- Readers can only INSERT (a page view). Only staff can read the aggregates,
-- and only through the functions below.
-- ============================================================================

create table if not exists public.article_views (
  id            bigserial primary key,
  article_id    uuid not null references public.articles (id) on delete cascade,
  viewed_at     timestamptz not null default now(),
  referrer_host text,                                   -- e.g. 'instagram.com'; never a full URL
  device        text check (device in ('mobile', 'desktop'))
);

create index if not exists article_views_viewed_at_idx on public.article_views (viewed_at desc);
create index if not exists article_views_article_idx   on public.article_views (article_id);

alter table public.article_views enable row level security;

drop policy if exists article_views_insert on public.article_views;
drop policy if exists article_views_read   on public.article_views;

-- Anyone may record a view...
create policy article_views_insert on public.article_views
  for insert
  to anon, authenticated
  with check (true);

-- ...but only staff may read them.
create policy article_views_read on public.article_views
  for select
  to authenticated
  using (public.user_role() in ('admin', 'editor', 'designer'));

grant usage  on schema public to anon, authenticated;
grant insert on public.article_views to anon, authenticated;
grant select on public.article_views to authenticated;
grant usage, select on sequence public.article_views_id_seq to anon, authenticated;
grant all privileges on public.article_views to service_role;
grant all privileges on sequence public.article_views_id_seq to service_role;


-- ----------------------------------------------------------------------------
-- One call returns everything the dashboard needs.
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER so it can aggregate across all rows, with an explicit role
-- check inside — the function is the only way staff read this data.

create or replace function public.analytics_overview(days integer default 30)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result json;
  since  timestamptz := now() - make_interval(days => days);
begin
  if coalesce(public.user_role(), '') not in ('admin', 'editor', 'designer') then
    raise exception 'Not authorised to read analytics';
  end if;

  select json_build_object(

    'total_views', (select count(*) from article_views),

    'window_views', (select count(*) from article_views where viewed_at >= since),

    'tracked_articles', (select count(distinct article_id) from article_views),

    -- Daily counts with gaps filled, so quiet days show as zero rather than
    -- vanishing and distorting the shape of the trend.
    'daily', (
      select coalesce(json_agg(row_to_json(d) order by d.day), '[]'::json)
      from (
        select
          g.day::date as day,
          (select count(*) from article_views v
            where v.viewed_at >= g.day and v.viewed_at < g.day + interval '1 day') as views
        from generate_series(date_trunc('day', since), date_trunc('day', now()), interval '1 day') as g(day)
      ) d
    ),

    'top_articles', (
      select coalesce(json_agg(row_to_json(t) order by t.views desc), '[]'::json)
      from (
        select a.title, a.slug, a.section, count(*) as views
        from article_views v
        join articles a on a.id = v.article_id
        where v.viewed_at >= since
        group by a.title, a.slug, a.section
        order by count(*) desc
        limit 10
      ) t
    ),

    'by_section', (
      select coalesce(json_agg(row_to_json(s) order by s.views desc), '[]'::json)
      from (
        select a.section, count(*) as views
        from article_views v
        join articles a on a.id = v.article_id
        where v.viewed_at >= since
        group by a.section
      ) s
    ),

    'referrers', (
      select coalesce(json_agg(row_to_json(r) order by r.views desc), '[]'::json)
      from (
        select coalesce(nullif(referrer_host, ''), 'direct') as source, count(*) as views
        from article_views
        where viewed_at >= since
        group by 1
        order by count(*) desc
        limit 8
      ) r
    )

  ) into result;

  return result;
end;
$$;

grant execute on function public.analytics_overview(integer) to authenticated;
