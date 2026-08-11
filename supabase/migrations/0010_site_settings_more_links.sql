-- ============================================================
-- GtaBolts: add Telegram + Instagram to site settings
-- Run this in Supabase SQL Editor after the previous migrations.
-- ============================================================

alter table public.site_settings add column telegram_url text;
alter table public.site_settings add column instagram_url text;
