export type Rarity = "C" | "R" | "SR" | "SSR";

export interface GachaItem {
  id: string;
  rarity: Rarity;
  text: string;
  image?: string;
}

export interface GachaState {
  lastPullDate: string | null;
  pityCount: number;
  collectedIds: string[];
  totalPulls: number;
}

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bgGradient: string; rate: number }> = {
  C:   { label: "Common",     color: "#A0A0B0", bgGradient: "from-slate-700 to-slate-800",       rate: 0.60 },
  R:   { label: "Rare",       color: "#60B4FF", bgGradient: "from-sky-800 to-blue-900",          rate: 0.25 },
  SR:  { label: "Super Rare", color: "#D87FFF", bgGradient: "from-purple-800 to-violet-900",     rate: 0.12 },
  SSR: { label: "Legendary",  color: "#FFD700", bgGradient: "from-yellow-800 to-amber-900",      rate: 0.03 },
};

export const PITY_THRESHOLD = 10;

export function pullGacha(
  cItems: GachaItem[],
  rItems: GachaItem[],
  srItems: GachaItem[],
  ssrItems: GachaItem[],
  pityCount: number
): GachaItem {
  const forcedSSR = pityCount >= PITY_THRESHOLD;

  let pool: GachaItem[];
  if (forcedSSR) {
    pool = ssrItems;
  } else {
    const roll = Math.random();
    if (roll < 0.03) pool = ssrItems;
    else if (roll < 0.15) pool = srItems;
    else if (roll < 0.40) pool = rItems;
    else pool = cItems;
  }

  if (pool.length === 0) pool = cItems;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getTodayString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

export function canPullToday(lastPullDate: string | null): boolean {
  if (!lastPullDate) return true;
  return lastPullDate !== getTodayString();
}
