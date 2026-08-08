-- ============================================================
-- GtaMods: initial schema
-- Run this once in Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================

-- Roles as an enum: default role is 'user'
create type public.app_role as enum ('user', 'employee', 'owner');

-- Private schema so has_role() can't be called directly by clients via PostgREST
create schema if not exists private;

-- ------------------------------------------------------------
-- user_roles: NEVER store roles on profiles. This table is the
-- single source of truth, checked only through has_role() below.
-- ------------------------------------------------------------
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  granted_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- security-definer function: bypasses RLS internally, used INSIDE policies.
-- Lives in `private` so it can't be queried directly over the API.
create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- ------------------------------------------------------------
-- profiles: public-safe user info, auto-created on signup
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- On every new auth.users row: create a profile + grant the default 'user' role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- mods
-- ------------------------------------------------------------
create table public.mods (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text not null,
  price_in_paise integer not null,
  version text not null default '1.0.0',
  screenshots text[] not null default '{}',
  file_key text, -- R2 object key, never exposed directly to clients
  status text not null default 'draft' check (status in ('draft','pending','published','unpublished')),
  uploader_id uuid not null references auth.users(id),
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mods enable row level security;

-- ------------------------------------------------------------
-- purchases
-- ------------------------------------------------------------
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  mod_id uuid not null references public.mods(id),
  razorpay_order_id text,
  razorpay_payment_id text,
  amount_in_paise integer not null,
  status text not null default 'pending' check (status in ('pending','completed','failed')),
  created_at timestamptz not null default now(),
  unique (user_id, mod_id)
);

alter table public.purchases enable row level security;

-- ============================================================
-- RLS Policies
-- ============================================================

-- profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Owners can view all profiles" on public.profiles
  for select using (private.has_role(auth.uid(), 'owner'));

-- user_roles
create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Owners can view all roles" on public.user_roles
  for select using (private.has_role(auth.uid(), 'owner'));
create policy "Owners can manage roles" on public.user_roles
  for all using (private.has_role(auth.uid(), 'owner'));

-- mods
create policy "Anyone can view published mods" on public.mods
  for select using (status = 'published');
create policy "Employees can view own mods" on public.mods
  for select using (auth.uid() = uploader_id);
create policy "Owners can view all mods" on public.mods
  for select using (private.has_role(auth.uid(), 'owner'));
create policy "Employees can insert mods" on public.mods
  for insert with check (
    private.has_role(auth.uid(), 'employee') or private.has_role(auth.uid(), 'owner')
  );
create policy "Employees can update own mods" on public.mods
  for update using (auth.uid() = uploader_id);
create policy "Owners can update any mod" on public.mods
  for update using (private.has_role(auth.uid(), 'owner'));
create policy "Owners can delete any mod" on public.mods
  for delete using (private.has_role(auth.uid(), 'owner'));

-- purchases
create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);
create policy "Owners can view all purchases" on public.purchases
  for select using (private.has_role(auth.uid(), 'owner'));
create policy "Users can insert own purchase" on public.purchases
  for insert with check (auth.uid() = user_id);

-- ============================================================
-- Make yourself the first owner.
-- Run this AFTER you've signed up once through /auth on your deployed site,
-- so auth.users has your row. Replace the email below.
-- ============================================================
-- insert into public.user_roles (user_id, role)
-- select id, 'owner' from auth.users where email = 'keshavshukla223@gmail.com'
-- on conflict (user_id, role) do nothing;
