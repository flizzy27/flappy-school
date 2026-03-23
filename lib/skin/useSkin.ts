"use client";

import { useState, useEffect } from "react";
import type { SkinId } from "./constants";
import { SKINS, SKIN_DEFS } from "./constants";
import { getCoins, addCoins } from "@/lib/coins/storage";

const SKIN_STORAGE_KEY = "flappy-school-skin";
const UNLOCKED_STORAGE_KEY = "flappy-school-unlocked-skins";

function getStoredSkin(): SkinId {
  if (typeof window === "undefined") return "default";
  const stored = localStorage.getItem(SKIN_STORAGE_KEY) as SkinId | null;
  return stored && SKINS.includes(stored) ? stored : "default";
}

function getUnlockedSkins(): Set<SkinId> {
  if (typeof window === "undefined") return new Set<SkinId>(["default"]);
  try {
    const stored = localStorage.getItem(UNLOCKED_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const arr = Array.isArray(parsed) ? parsed : [];
    const valid = arr.filter((s: string) => SKINS.includes(s as SkinId)) as SkinId[];
    return new Set<SkinId>(["default", ...valid]);
  } catch {
    return new Set<SkinId>(["default"]);
  }
}

function saveUnlocked(skins: Set<SkinId>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify([...skins]));
}

export function useSkin() {
  const [skin, setSkinState] = useState<SkinId>("default");
  const [unlocked, setUnlockedState] = useState<Set<SkinId>>(new Set(["default"]));
  const [coins, setCoinsState] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSkinState(getStoredSkin());
    setUnlockedState(getUnlockedSkins());
    setCoinsState(getCoins());
    setMounted(true);
  }, []);

  const setSkin = (s: SkinId) => {
    const unlockedSet = getUnlockedSkins();
    if (!unlockedSet.has(s)) return;
    setSkinState(s);
    if (typeof window !== "undefined") localStorage.setItem(SKIN_STORAGE_KEY, s);
  };

  const purchaseSkin = (s: SkinId): { success: boolean; error?: string } => {
    const def = SKIN_DEFS[s];
    if (!def || def.cost === 0) return { success: false, error: "Invalid skin" };
    const unlockedSet = getUnlockedSkins();
    if (unlockedSet.has(s)) return { success: false, error: "Already owned" };
    const currentCoins = getCoins();
    if (currentCoins < def.cost) return { success: false, error: "Not enough coins" };
    addCoins(-def.cost);
    unlockedSet.add(s);
    saveUnlocked(unlockedSet);
    setUnlockedState(new Set(unlockedSet));
    setCoinsState(getCoins());
    setSkinState(s);
    localStorage.setItem(SKIN_STORAGE_KEY, s);
    return { success: true };
  };

  const refreshCoins = () => setCoinsState(getCoins());

  return {
    skin,
    setSkin,
    unlocked,
    coins,
    refreshCoins,
    purchaseSkin,
    isUnlocked: (s: SkinId) => unlocked.has(s),
    mounted,
  };
}
