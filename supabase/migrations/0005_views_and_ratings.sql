-- ============================================================
-- GtaMods: view counter + ratings
-- Run this in Supabase SQL Editor after the previous migrations.
-- ============================================================

-- View counter: a narrow security-definer function rather than a broad
-- UPDATE policy on mods, so visitors can only ever increment this one
-- column on published mods — nothing else about the row is exposed to writes.
create or replace function public.increment_mod_views(mod_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mods
  set views = views + 1
  where slug = mod_slug and status = 'published';
end;
$$;

grant execute on function public.increment_mod_views(text) to anon, authenticated;

-- ------------------------------------------------------------
-- mod_ratings: a real ratings table, 1-5 stars, one per user per mod.
-- Only people who actually bought the mod can rate it (verified-purchase
-- pattern) — this is enforced in the insert policy below.
-- ------------------------------------------------------------
create table public.mod_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mod_id uuid not null references public.mods(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  unique (user_id, mod_id)
);

alter table public.mod_ratings enable row level security;

create policy "Anyone can view ratings" on public.mod_ratings
  for select using (true);

create policy "Purchasers can rate a mod they bought" on public.mod_ratings
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.purchases
      where purchases.user_id = auth.uid()
      and purchases.mod_id = mod_ratings.mod_id
      and purchases.status = 'completed'
    )
  );

create policy "Users can update own rating" on public.mod_ratings
  for update using (auth.uid() = user_id);
