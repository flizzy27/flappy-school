const STORAGE_KEY = "flappy-school-coins";

export function getCoins(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  const num = parseInt(stored ?? "0", 10);
  return Number.isNaN(num) ? 0 : Math.max(0, num);
}

export function addCoins(amount: number): number {
  if (typeof window === "undefined") return 0;
  const current = getCoins();
  const next = Math.max(0, current + amount);
  localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}
