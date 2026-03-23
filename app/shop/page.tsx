"use client";

import { useState } from "react";
import Link from "next/link";
import { useSkin } from "@/lib/skin/useSkin";
import { SkinIcon } from "@/components/skins/SkinIcon";
import { SKINS, SKIN_DEFS } from "@/lib/skin/constants";
import type { SkinId } from "@/lib/skin/constants";

export default function ShopPage() {
  const { skin, setSkin, coins, purchaseSkin, isUnlocked } = useSkin();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  function handlePurchase(s: SkinId) {
    setPurchaseError(null);
    const result = purchaseSkin(s);
    if (!result.success && result.error) setPurchaseError(result.error);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Skin Shop
          </h1>
          <p className="text-foreground/70 mt-2 flex items-center justify-center gap-2">
            <span>🪙</span>
            <span className="font-bold text-amber-400">{coins} coins</span>
          </p>
          <p className="text-sm text-foreground/60 mt-1">Collect coins in-game to unlock skins!</p>
        </div>

        {purchaseError && (
          <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg text-center">
            {purchaseError}
          </p>
        )}

        <div className="grid gap-4">
          {SKINS.map((s) => {
            const def = SKIN_DEFS[s];
            const unlocked = isUnlocked(s);
            const isSelected = skin === s;
            const canAfford = coins >= def.cost;
            const isFree = def.cost === 0;

            return (
              <div
                key={s}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  isSelected ? "border-accent bg-accent/10" : "border-border bg-surface/50"
                }`}
              >
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-800">
                  <SkinIcon skinId={s} size={48} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{def.name}</p>
                  <p className="text-sm text-foreground/70">
                    {isFree ? "Free" : `${def.cost} coins`}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {unlocked ? (
                    <button
                      onClick={() => setSkin(s)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isSelected
                          ? "bg-accent text-slate-900"
                          : "bg-surface border border-border hover:border-accent/50"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(s)}
                      disabled={!canAfford}
                      className="px-4 py-2 rounded-lg font-medium bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

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
