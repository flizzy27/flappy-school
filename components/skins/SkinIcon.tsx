"use client";

import type { SkinId } from "@/lib/skin/constants";
import { SKIN_DEFS } from "@/lib/skin/constants";

interface SkinIconProps {
  skinId: SkinId;
  size?: number;
  className?: string;
}

export function SkinIcon({ skinId, size = 32, className = "" }: SkinIconProps) {
  const def = SKIN_DEFS[skinId];
  if (!def) return null;

  if (def.type === "svg") {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={`/skins/${def.id}.svg`}
          alt={def.name}
          width={size}
          height={size}
          className="object-contain"
        />
      </div>
    );
  }

  const fallback = def.fallback ?? SKIN_DEFS.default.fallback!;
  return (
    <div
      className={`rounded-full border-2 ${fallback.bg} ${fallback.border} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
