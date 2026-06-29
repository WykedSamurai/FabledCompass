-- Fabled Compass: profiles + evidence tables
-- Run this in the Supabase SQL Editor after chatrooms.sql and community_upgrade.sql

-- ──────────────────────────────────────────────────────────────
-- 1. Profiles table
-- ──────────────────────────────────────────────────────────────
create table if not exists profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  display_name   text,
  title          text    not null default 'Compass Bearer',
  archetype      text    not null default 'traveler',
  motto          text,
  personal_legend text,
  level          integer not null default 1,
  career_path    text    not null default 'Wayfinder',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Auto-update updated_at on row change
create or replace function update_profiles_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute procedure update_profiles_updated_at();

-- Auto-create a default profile row when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_new_user_profile on auth.users;
create trigger trg_new_user_profile
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ──────────────────────────────────────────────────────────────
-- 2. Evidence table
-- ──────────────────────────────────────────────────────────────
create table if not exists evidence (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  type           text        not null,
  title          text        not null,
  description    text,
  competency_ids text[]      not null default '{}',
  score          integer     not null default 0 check (score >= 0 and score <= 100),
  quality        text        not null default 'starter',
  verification   text        not null default 'self_reported',
  source         text,
  metadata       jsonb,
  created_at     timestamptz not null default now()
);

alter table evidence enable row level security;

create policy "evidence_select_own" on evidence
  for select using (auth.uid() = user_id);

create policy "evidence_insert_own" on evidence
  for insert with check (auth.uid() = user_id);

create policy "evidence_update_own" on evidence
  for update using (auth.uid() = user_id);

create policy "evidence_delete_own" on evidence
  for delete using (auth.uid() = user_id);

create index if not exists evidence_user_id_idx on evidence(user_id);
