// Skins with tiered pricing: cheap (5-15), premium (50-100)
// SVG skins use /skins/[id].svg; fallback uses ball styling

export const SKINS = ["default", "paper-plane", "golden", "diamond", "legend"] as const;
export type SkinId = (typeof SKINS)[number];

export interface SkinDef {
  id: SkinId;
  name: string;
  cost: number; // 0 = free
  type: "svg" | "fallback";
  fallback?: { bg: string; border: string };
}

export const SKIN_DEFS: Record<SkinId, SkinDef> = {
  default: {
    id: "default",
    name: "Default",
    cost: 0,
    type: "fallback",
    fallback: { bg: "bg-gradient-to-br from-cyan-400 to-blue-500", border: "border-cyan-300" },
  },
  "paper-plane": {
    id: "paper-plane",
    name: "Paper Plane",
    cost: 5,
    type: "svg",
  },
  golden: {
    id: "golden",
    name: "Golden",
    cost: 15,
    type: "fallback",
    fallback: { bg: "bg-gradient-to-br from-yellow-300 to-amber-500", border: "border-yellow-200" },
  },
  diamond: {
    id: "diamond",
    name: "Diamond",
    cost: 50,
    type: "fallback",
    fallback: { bg: "bg-gradient-to-br from-sky-200 to-indigo-400", border: "border-sky-100" },
  },
  legend: {
    id: "legend",
    name: "Legend",
    cost: 100,
    type: "fallback",
    fallback: {
      bg: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
      border: "border-purple-300",
    },
  },
};
