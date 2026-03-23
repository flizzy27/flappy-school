const STORAGE_KEY = "flappy-school-highscore";

export function getHighscore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  const num = parseInt(stored ?? "0", 10);
  return Number.isNaN(num) ? 0 : num;
}

export function setHighscore(score: number): void {
  if (typeof window === "undefined") return;
  const current = getHighscore();
  if (score > current) {
    localStorage.setItem(STORAGE_KEY, String(score));
  }
}
