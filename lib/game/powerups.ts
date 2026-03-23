export const POWERUP_TYPES = ["speed", "slow", "multiplier"] as const;
export type PowerUpType = (typeof POWERUP_TYPES)[number];

export const POWERUP_CONFIG: Record<
  PowerUpType,
  { duration: number; speedMult: number; scoreMult: number; color: string; label: string }
> = {
  speed: { duration: 4000, speedMult: 1.5, scoreMult: 1, color: "bg-amber-400", label: "Speed" },
  slow: { duration: 4000, speedMult: 0.5, scoreMult: 1, color: "bg-blue-400", label: "Slow" },
  multiplier: { duration: 5000, speedMult: 1, scoreMult: 2, color: "bg-yellow-400", label: "2x" },
};
