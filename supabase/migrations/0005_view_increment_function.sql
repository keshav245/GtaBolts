-- ============================================================
-- GtaMods: view counter
-- Run this in Supabase SQL Editor after the previous migrations.
--
-- Visitors (including anonymous ones) have no UPDATE permission on mods at
-- all — this function is the one narrow, safe exception: it can ONLY
-- increment the views column on a published mod, nothing else. That's why
-- it's security definer with execute granted to anon/authenticated, rather
-- than opening up a general-purpose update policy.
-- ============================================================

create or replace function public.increment_mod_views(mod_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mods set views = views + 1 where slug = mod_slug and status = 'published';
end;
$$;

grant execute on function public.increment_mod_views(text) to anon, authenticated;
