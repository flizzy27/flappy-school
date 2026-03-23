-- Flappy School - Supabase Schema
-- Global leaderboard, usernames only, top 50
-- Run in Supabase Dashboard → SQL Editor

-- ============================================
-- 1. PROFILES (linked to auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- 2. HIGHSCORES
-- ============================================
create table if not exists public.highscores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  score integer not null check (score >= 0),
  created_at timestamptz default now() not null
);

-- Indexes for leaderboard queries
create index if not exists highscores_score_desc_idx on public.highscores(score desc);
create index if not exists highscores_user_id_idx on public.highscores(user_id);
create index if not exists highscores_created_at_idx on public.highscores(created_at desc);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.highscores enable row level security;

-- Profiles policies (drop legacy names from previous schema if present)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Profiles: anyone can read" on public.profiles;
create policy "Profiles: anyone can read" on public.profiles
  for select using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Profiles: users can insert own" on public.profiles;
create policy "Profiles: users can insert own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Profiles: users can update own" on public.profiles;
create policy "Profiles: users can update own" on public.profiles
  for update using (auth.uid() = id);

-- Highscores policies (drop legacy if present)
drop policy if exists "Anyone can read highscores" on public.highscores;
drop policy if exists "Highscores: anyone can read" on public.highscores;
create policy "Highscores: anyone can read" on public.highscores
  for select using (true);

drop policy if exists "Users can insert own highscore" on public.highscores;
drop policy if exists "Highscores: users can insert own" on public.highscores;
create policy "Highscores: users can insert own" on public.highscores
  for insert with check (auth.uid() = user_id);

-- ============================================
-- 4. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
