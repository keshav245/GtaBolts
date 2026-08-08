-- ============================================================
-- GtaMods: site settings (contact info)
-- Run this in Supabase SQL Editor after the previous migrations.
--
-- Single-row table (id is always 1) holding editable contact details, so
-- the owner can update them from /admin/settings without a code change.
-- ============================================================

create table public.site_settings (
  id integer primary key default 1,
  contact_email text,
  discord_url text,
  twitter_url text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1);

alter table public.site_settings enable row level security;

create policy "Anyone can view site settings" on public.site_settings
  for select using (true);

create policy "Owners can update site settings" on public.site_settings
  for update using (private.has_role(auth.uid(), 'owner'));
