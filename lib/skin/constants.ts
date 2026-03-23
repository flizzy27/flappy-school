export const SKINS = [
  "default",
  "sunset",
  "purple",
  "emerald",
  "gold",
  "coral",
  "ice",
  "rainbow",
] as const;
export type SkinId = (typeof SKINS)[number];

export const SKIN_STYLES: Record<
  SkinId,
  { bg: string; border: string; name: string }
> = {
  default: {
    bg: "bg-gradient-to-br from-cyan-400 to-blue-500",
    border: "border-cyan-300",
    name: "Cyan",
  },
  sunset: {
    bg: "bg-gradient-to-br from-orange-400 to-red-500",
    border: "border-orange-300",
    name: "Sunset",
  },
  purple: {
    bg: "bg-gradient-to-br from-violet-400 to-purple-600",
    border: "border-violet-300",
    name: "Purple",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-400 to-green-600",
    border: "border-emerald-300",
    name: "Emerald",
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-300 to-amber-500",
    border: "border-yellow-200",
    name: "Gold",
  },
  coral: {
    bg: "bg-gradient-to-br from-rose-400 to-pink-500",
    border: "border-rose-300",
    name: "Coral",
  },
  ice: {
    bg: "bg-gradient-to-br from-sky-200 to-blue-300",
    border: "border-sky-100",
    name: "Ice",
  },
  rainbow: {
    bg: "bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-500",
    border: "border-white/80",
    name: "Rainbow",
  },
};
