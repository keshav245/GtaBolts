-- ============================================================
-- GtaMods: download logs
-- Run this in Supabase SQL Editor after the previous migrations.
--
-- Needed so /library can show a real download history instead of the
-- earlier UI mockup's fabricated log. Each successful presigned-URL request
-- in app/api/library/download/route.ts inserts one row here.
-- ============================================================

create table public.download_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mod_id uuid not null references public.mods(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

alter table public.download_logs enable row level security;

create policy "Users can view own download logs" on public.download_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own download logs" on public.download_logs
  for insert with check (auth.uid() = user_id);
