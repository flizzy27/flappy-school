"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { useSkin } from "@/lib/skin/useSkin";
import { THEMES, THEME_LABELS, type ThemeId } from "@/lib/theme/constants";
import { SKINS, SKIN_STYLES } from "@/lib/skin/constants";
import type { SkinId } from "@/lib/skin/constants";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { skin, setSkin } = useSkin();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-muted bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-foreground/70 mt-2">Customize your experience</p>
        </div>

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
          <h2 className="text-lg font-semibold text-foreground">Ball skin</h2>
          <div className="flex flex-wrap gap-2">
            {SKINS.map((s) => (
              <button
                key={s}
                onClick={() => setSkin(s)}
                className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${SKIN_STYLES[s].bg} ${SKIN_STYLES[s].border} ${
                  skin === s ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
                }`}
                title={SKIN_STYLES[s].name}
              />
            ))}
          </div>
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
