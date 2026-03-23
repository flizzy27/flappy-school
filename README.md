# Flappy School

A modern Flappy Bird-style web game. Ball flies through pipes—tap or press Space to jump!

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (auth, database — to be integrated later)

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Deploy (no env vars needed for the core game)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── page.tsx       # Main menu
│   ├── play/          # Game screen
│   ├── login/         # Auth (later)
│   └── settings/      # Settings (later)
├── components/game/   # GameCanvas
└── lib/               # Supabase, auth (stubbed)
```

## Game Features

- Ball player (tap/Space to fly)
- Progressive difficulty (wider gaps at start, narrow over time)
- Score system
- Game over screen with Play Again
