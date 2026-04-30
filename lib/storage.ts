import type { GachaState, GachaItem } from "./gacha";
import {
  DEFAULT_C_ITEMS,
  DEFAULT_R_ITEMS,
  DEFAULT_SR_ITEMS,
  DEFAULT_SSR_ITEMS,
} from "./defaultItems";

const KEYS = {
  STATE:    "love_gacha_state",
  C_ITEMS:  "love_gacha_c",
  R_ITEMS:  "love_gacha_r",
  SR_ITEMS: "love_gacha_sr",
  SSR_ITEMS:"love_gacha_ssr",
  ADMIN_PW: "love_gacha_admin_pw",
};

const DEFAULT_STATE: GachaState = {
  lastPullDate: null,
  pityCount: 0,
  collectedIds: [],
  totalPulls: 0,
};

export function getState(): GachaState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEYS.STATE);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch { return DEFAULT_STATE; }
}

export function saveState(state: GachaState): void {
  localStorage.setItem(KEYS.STATE, JSON.stringify(state));
}

function mergeWithDefaults(defaults: GachaItem[], storageKey: string): GachaItem[] {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaults;
    const extra: GachaItem[] = JSON.parse(raw);
    const ids = new Set(defaults.map((i) => i.id));
    return [...defaults, ...extra.filter((i) => !ids.has(i.id))];
  } catch { return defaults; }
}

export function getCItems():  GachaItem[] { return mergeWithDefaults(DEFAULT_C_ITEMS,  KEYS.C_ITEMS);  }
export function getRItems():  GachaItem[] { return mergeWithDefaults(DEFAULT_R_ITEMS,  KEYS.R_ITEMS);  }
export function getSRItems(): GachaItem[] { return mergeWithDefaults(DEFAULT_SR_ITEMS, KEYS.SR_ITEMS); }
export function getSSRItems():GachaItem[] { return mergeWithDefaults(DEFAULT_SSR_ITEMS,KEYS.SSR_ITEMS);}

export function getAllItems(): GachaItem[] {
  return [...getSSRItems(), ...getSRItems(), ...getRItems(), ...getCItems()];
}

function addCustomItem(rarity: "C"|"R"|"SR"|"SSR", text: string, image: string): void {
  const keyMap = { C: KEYS.C_ITEMS, R: KEYS.R_ITEMS, SR: KEYS.SR_ITEMS, SSR: KEYS.SSR_ITEMS };
  const key = keyMap[rarity];
  const existing: GachaItem[] = JSON.parse(localStorage.getItem(key) || "[]");
  const newItem: GachaItem = { id: `custom_${rarity.toLowerCase()}_${Date.now()}`, rarity, text, image: image || undefined };
  localStorage.setItem(key, JSON.stringify([...existing, newItem]));
}

export function addCustomCItem(text: string):   void { addCustomItem("C",   text, "/Im/acadc7.png"); }
export function addCustomRItem(text: string):   void { addCustomItem("R",   text, "/Im/love_2839131.png"); }
export function addCustomSRItem(text: string):  void { addCustomItem("SR",  text, "/Im/teddy-bear_1746403.png"); }
export function addCustomSSRItem(text: string): void { addCustomItem("SSR", text, "/Im/12121212.png"); }

const DEFAULT_IDS_SET = new Set([
  ...DEFAULT_C_ITEMS, ...DEFAULT_R_ITEMS,
  ...DEFAULT_SR_ITEMS, ...DEFAULT_SSR_ITEMS,
].map((i) => i.id));

export function isDefaultItem(id: string): boolean { return DEFAULT_IDS_SET.has(id); }

export function deleteCustomItem(id: string, rarity: "C"|"R"|"SR"|"SSR"): void {
  const keyMap = { C: KEYS.C_ITEMS, R: KEYS.R_ITEMS, SR: KEYS.SR_ITEMS, SSR: KEYS.SSR_ITEMS };
  const key = keyMap[rarity];
  const existing: GachaItem[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(existing.filter((i) => i.id !== id)));
}

export function getAdminPassword(): string {
  if (typeof window === "undefined") return "iloveyou";
  return localStorage.getItem(KEYS.ADMIN_PW) || "iloveyou";
}
export function setAdminPassword(pw: string): void { localStorage.setItem(KEYS.ADMIN_PW, pw); }

export function resetAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

export function resetPullDate(): void {
  const current = getState();
  saveState({ ...current, lastPullDate: null });
}
