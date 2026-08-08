-- ============================================================
-- GtaMods: categories table
-- Run this in Supabase SQL Editor after the previous migrations.
--
-- Categories move from a hardcoded list in the codebase to a real table the
-- owner can manage from /admin/categories — add new ones with a photo,
-- delete unused ones. mods.category stays a plain text column (matching a
-- category's `name`) rather than a foreign key, to avoid a bigger migration
-- of existing mod rows — deleting a category is blocked in application code
-- if any mods still use it, so this can't create orphaned data in practice.
-- ============================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text unique not null,
  image_key text, -- R2 object key for the category photo, nullable
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Anyone can view categories" on public.categories
  for select using (true);

create policy "Owners can manage categories" on public.categories
  for all using (private.has_role(auth.uid(), 'owner'));

-- Seed with the 4 categories that already exist in mod data, so nothing
-- breaks for mods already using these names.
insert into public.categories (slug, name) values
  ('gta-v', 'GTA V'),
  ('gta-online', 'GTA Online'),
  ('vice-city', 'Vice City'),
  ('san-andreas', 'San Andreas');
