-- ============================================================
-- GtaMods: mod ratings
-- Run this in Supabase SQL Editor after the previous migrations.
--
-- Ratings are gated to verified purchasers only — you can't rate a mod you
-- haven't bought. One rating per user per mod (re-rating updates their
-- existing row via upsert rather than adding a new one).
-- ============================================================

create table public.mod_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mod_id uuid not null references public.mods(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mod_id)
);

alter table public.mod_ratings enable row level security;

create policy "Anyone can view ratings of published mods" on public.mod_ratings
  for select using (
    exists (select 1 from public.mods where mods.id = mod_ratings.mod_id and mods.status = 'published')
  );

create policy "Purchasers can rate a mod they bought" on public.mod_ratings
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.purchases
      where purchases.mod_id = mod_ratings.mod_id
      and purchases.user_id = auth.uid()
      and purchases.status = 'completed'
    )
  );

create policy "Purchasers can update own rating" on public.mod_ratings
  for update using (
    auth.uid() = user_id
    and exists (
      select 1 from public.purchases
      where purchases.mod_id = mod_ratings.mod_id
      and purchases.user_id = auth.uid()
      and purchases.status = 'completed'
    )
  );

create policy "Users can delete own rating" on public.mod_ratings
  for delete using (auth.uid() = user_id);
