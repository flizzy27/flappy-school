"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSkin } from "@/lib/skin/useSkin";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/auth/utils";
import { SKINS, SKIN_STYLES } from "@/lib/skin/constants";
import { getHighscore } from "@/lib/storage/highscore";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/supabase/highscores";

export default function Home() {
  const router = useRouter();
  const { skin, setSkin } = useSkin();
  const { user, isAuthenticated } = useAuth();
  const [highscore, setHighscore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setHighscore(getHighscore());
  }, []);

  useEffect(() => {
    fetchLeaderboard().then(setLeaderboard);
  }, []);

  async function handleLogout() {
    await signOut();
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors">
      <div className="text-center space-y-10 max-w-md w-full">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Flappy School
          </h1>
          <p className="text-foreground/80 text-lg">
            Tap or press Space to fly. Avoid the pipes!
          </p>
          {highscore > 0 && (
            <p className="text-accent font-semibold">Best: {highscore}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/play"
            className="px-12 py-4 rounded-2xl bg-accent hover:bg-accent-muted text-slate-900 font-bold text-lg shadow-lg shadow-accent/25 transition-all hover:scale-105 hover:shadow-accent/40 active:scale-95"
          >
            Start Game
          </Link>
          <Link
            href="/settings"
            className="px-12 py-4 rounded-2xl border-2 border-border bg-surface/50 hover:bg-surface text-foreground font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Settings
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-12 py-3 rounded-2xl text-foreground/70 hover:text-foreground text-sm"
            >
              Logout {user?.email}
            </button>
          ) : (
            <Link
              href="/login"
              className="px-12 py-3 rounded-2xl text-foreground/70 hover:text-foreground text-sm"
            >
              Login to save scores
            </Link>
          )}
        </div>

        {leaderboard.length > 0 && (
          <section className="space-y-2 pt-4 border-t border-border w-full max-w-xs mx-auto">
            <h2 className="text-sm font-semibold text-foreground/80">Leaderboard</h2>
            <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
              {leaderboard.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex justify-between">
                  <span>#{entry.rank} {entry.username || "Anonymous"}</span>
                  <span className="font-medium">{entry.score}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-sm font-semibold text-foreground/80">
            Choose your ball
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {SKINS.map((s) => (
              <button
                key={s}
                onClick={() => setSkin(s)}
                className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                  SKIN_STYLES[s].bg
                } ${SKIN_STYLES[s].border} ${
                  skin === s ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
                }`}
                title={SKIN_STYLES[s].name}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
