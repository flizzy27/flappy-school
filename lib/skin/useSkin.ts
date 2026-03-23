"use client";

import { useState, useEffect } from "react";
import type { SkinId } from "./constants";
import { SKINS } from "./constants";

const STORAGE_KEY = "flappy-school-skin";

function getStoredSkin(): SkinId {
  if (typeof window === "undefined") return "default";
  const stored = localStorage.getItem(STORAGE_KEY) as SkinId | null;
  return stored && SKINS.includes(stored) ? stored : "default";
}

export function useSkin() {
  const [skin, setSkinState] = useState<SkinId>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSkinState(getStoredSkin());
    setMounted(true);
  }, []);

  const setSkin = (s: SkinId) => {
    setSkinState(s);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, s);
  };

  return { skin, setSkin, mounted };
}
