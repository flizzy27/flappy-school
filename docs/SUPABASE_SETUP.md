# Supabase Setup Guide

## Step 1: Run the SQL schema

1. Open your Supabase project: https://supabase.com/dashboard
2. In the left sidebar, click **SQL Editor**
3. Click **New query**
4. Open the file `supabase/schema.sql` in this project
5. Copy **all** its contents
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

You should see: "Success. No rows returned"

---

## Step 2: Environment variables (already done)

You have `.env.local` in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For Vercel deployment, add these in **Project Settings → Environment Variables**.

---

## Step 3: Verify

1. In Supabase, go to **Table Editor**
2. You should see `profiles` and `highscores`
3. Go to **Authentication → Providers** — ensure **Email** is enabled

---

## What the schema does

| Table     | Purpose                                      |
|----------|-----------------------------------------------|
| profiles | Username, linked to auth.users via `id`       |
| highscores | user_id, score, created_at                 |

**RLS:**
- Anyone can read profiles (for leaderboard usernames)
- Anyone can read highscores (global leaderboard)
- Users can insert their own highscores
- Users can update their own profile (username)

**Trigger:** Creates a profile row when a new user signs up.
