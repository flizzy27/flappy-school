"use client";

import type { SkinId } from "@/lib/skin/constants";
import { SKIN_DEFS } from "@/lib/skin/constants";

interface PlayerSkinProps {
  skinId: SkinId;
  size?: number;
  className?: string;
}

export function PlayerSkin({ skinId, size = 32, className = "" }: PlayerSkinProps) {
  const def = SKIN_DEFS[skinId] ?? SKIN_DEFS.default;

  if (def.type === "svg") {
    return (
      <div
        className={`flex items-center justify-center w-full h-full ${className}`}
      >
        <img
          src={`/skins/${def.id}.svg`}
          alt={def.name}
          width={size}
          height={size}
          className="object-contain"
          style={{ pointerEvents: "none" }}
        />
      </div>
    );
  }

  const fallback = def.fallback ?? SKIN_DEFS.default.fallback!;
  return (
    <div
      className={`rounded-full border-2 w-full h-full ${fallback.bg} ${fallback.border} ${className}`}
    />
  );
}
