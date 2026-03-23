export const THEMES = ["dark", "light", "cyan", "purple", "green"] as const;
export type ThemeId = (typeof THEMES)[number];

export const THEME_LABELS: Record<ThemeId, string> = {
  dark: "Dark",
  light: "Light",
  cyan: "Cyan",
  purple: "Purple",
  green: "Green",
};
