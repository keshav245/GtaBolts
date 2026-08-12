-- ============================================================
-- GtaBolts: shopping cart
-- Run this in Supabase SQL Editor after the previous migrations.
-- ============================================================

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mod_id uuid not null references public.mods(id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (user_id, mod_id)
);

alter table public.cart_items enable row level security;

create policy "Users can view own cart" on public.cart_items
  for select using (auth.uid() = user_id);

create policy "Users can add to own cart" on public.cart_items
  for insert with check (auth.uid() = user_id);

create policy "Users can remove from own cart" on public.cart_items
  for delete using (auth.uid() = user_id);
