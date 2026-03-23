"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import GameCanvas from "@/components/game/GameCanvas";
import { useSkin } from "@/lib/skin/useSkin";
import { useAuth } from "@/components/providers/AuthProvider";
import { getHighscore, setHighscore } from "@/lib/storage/highscore";
import { saveHighscore } from "@/lib/supabase/highscores";

export default function PlayPage() {
  const { skin } = useSkin();
  const { isAuthenticated } = useAuth();
  const [gameOverScore, setGameOverScore] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleGameOver = useCallback(async (score: number) => {
    setGameOverScore(score);
    setHighscore(score);
    setSaveError(null);
    if (isAuthenticated) {
      const result = await saveHighscore(score);
      if (!result.success && result.error) {
        setSaveError(result.error);
      }
    }
  }, [isAuthenticated]);

  const handlePlayAgain = useCallback(() => {
    setGameOverScore(null);
    setGameKey((k: number) => k + 1);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="flex flex-col items-center gap-6">
        <GameCanvas key={gameKey} onGameOver={handleGameOver} skin={skin} />

        {gameOverScore !== null && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-slate-300">
              Score: <span className="font-bold text-cyan-400">{gameOverScore}</span>
            </p>
            {getHighscore() === gameOverScore && gameOverScore > 0 && (
              <p className="text-accent font-semibold">New high score!</p>
            )}
            {saveError && (
              <p className="text-sm text-red-400">Could not save to leaderboard: {saveError}</p>
            )}
            <div className="flex gap-4">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition-colors"
              >
                Play Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl border border-slate-600 hover:border-slate-500 text-slate-200 font-medium transition-colors"
              >
                Menu
              </Link>
            </div>
          </div>
        )}

        {gameOverScore === null && (
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 text-sm"
          >
            ← Back to menu
          </Link>
        )}
      </div>
    </main>
  );
}
