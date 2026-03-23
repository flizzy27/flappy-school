-- Flappy School - Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor

-- Profiles: extended user data (linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Highscores
create table if not exists public.highscores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  score integer not null,
  created_at timestamptz default now()
);

-- User settings (theme, sound, skin)
create table if not exists public.settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  theme text default 'dark' check (theme in ('dark', 'light')),
  sound_enabled boolean default true,
  skin text default 'default',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists highscores_user_id_idx on public.highscores(user_id);
create index if not exists highscores_score_idx on public.highscores(score desc);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.highscores enable row level security;
alter table public.settings enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Highscores: anyone can read top scores, users can insert their own
create policy "Anyone can read highscores" on public.highscores
  for select using (true);

create policy "Users can insert own highscore" on public.highscores
  for insert with check (auth.uid() = user_id);

-- Settings: users can only access their own
create policy "Users can view own settings" on public.settings
  for select using (auth.uid() = user_id);

create policy "Users can update own settings" on public.settings
  for update using (auth.uid() = user_id);

create policy "Users can insert own settings" on public.settings
  for insert with check (auth.uid() = user_id);

-- Function: create profile + settings on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  
  insert into public.settings (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: run on new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
