-- ============================================================
-- GtaMods: featured videos
-- Run this in Supabase SQL Editor after the previous migrations.
--
-- Only the YouTube video ID and an optional title are stored — the
-- thumbnail image comes directly from YouTube's public CDN
-- (img.youtube.com), so there's no file upload or R2 involved here at all.
-- ============================================================

create table public.featured_videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title text,
  created_at timestamptz not null default now()
);

alter table public.featured_videos enable row level security;

create policy "Anyone can view featured videos" on public.featured_videos
  for select using (true);

create policy "Owners can manage featured videos" on public.featured_videos
  for all using (private.has_role(auth.uid(), 'owner'));
