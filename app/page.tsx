"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSkin } from "@/lib/skin/useSkin";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/auth/utils";
import { SkinIcon } from "@/components/skins/SkinIcon";
import { SKINS, SKIN_DEFS } from "@/lib/skin/constants";
import { getHighscore } from "@/lib/storage/highscore";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/supabase/highscores";

export default function Home() {
  const router = useRouter();
  const { skin, setSkin, coins, isUnlocked } = useSkin();
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
          <div className="flex items-center justify-center gap-4">
            {highscore > 0 && (
              <p className="text-accent font-semibold">Best: {highscore}</p>
            )}
            <p className="text-amber-400 font-semibold flex items-center gap-1">
              <span>🪙</span> {coins}
            </p>
          </div>
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
          <Link
            href="/shop"
            className="px-12 py-3 rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 text-amber-400 font-semibold hover:bg-amber-500/20 transition-all"
          >
            Skin Shop
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
          <h2 className="text-sm font-semibold text-foreground/80">Current skin</h2>
          <div className="flex items-center justify-center gap-4">
            <SkinIcon skinId={skin} size={48} />
            <span className="text-foreground/80">{SKIN_DEFS[skin].name}</span>
          </div>
          <Link href="/shop" className="text-accent text-sm hover:underline">
            Change in Skin Shop →
          </Link>
        </section>
      </div>
    </main>
  );
}
