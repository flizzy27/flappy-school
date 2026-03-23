"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { useSkin } from "@/lib/skin/useSkin";
import { useAuth } from "@/components/providers/AuthProvider";
import { THEMES, THEME_LABELS, type ThemeId } from "@/lib/theme/constants";
import { getProfile, updateUsername } from "@/lib/supabase/profiles";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { skin, coins } = useSkin();
  const { user, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [usernameSaved, setUsernameSaved] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      getProfile(user.id).then(({ data }) => {
        if (data?.username) setUsername(data.username);
      });
    }
  }, [isAuthenticated, user?.id]);

  async function handleSaveUsername() {
    if (!username.trim()) return;
    const result = await updateUsername(username);
    if (result.success) setUsernameSaved(true);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-muted bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-foreground/70 mt-2">Customize your experience</p>
        </div>

        {isAuthenticated && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Username</h2>
            <p className="text-sm text-foreground/70">Displayed on the leaderboard</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameSaved(false); }}
                placeholder={user?.email?.split("@")[0] ?? "Username"}
                className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-foreground"
              />
              <button
                onClick={handleSaveUsername}
                disabled={!username.trim()}
                className="px-4 py-3 rounded-xl bg-accent text-slate-900 font-semibold disabled:opacity-50"
              >
                Save
              </button>
            </div>
            {usernameSaved && <p className="text-sm text-green-400">Saved!</p>}
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as ThemeId)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  theme === t
                    ? "bg-accent text-slate-900 ring-2 ring-accent-muted"
                    : "bg-surface border border-border hover:border-accent/50"
                }`}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Skin & coins</h2>
          <p className="text-sm text-foreground/70 flex items-center gap-2">
            <span>🪙</span> {coins} coins · Current: {skin}
          </p>
          <Link
            href="/shop"
            className="block w-full py-3 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 text-amber-400 font-semibold text-center hover:bg-amber-500/20"
          >
            Open Skin Shop
          </Link>
        </section>

        <Link
          href="/"
          className="block text-center py-3 text-foreground/70 hover:text-foreground text-sm transition-colors"
        >
          ← Back to menu
        </Link>
      </div>
    </main>
  );
}
