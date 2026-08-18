import { isLocale, type Locale } from "@/lib/i18n";
import { cloneSeedState } from "@/lib/seed";
import type { MarketplaceState, Role } from "@/lib/types";

const storageKey = "n5deal-marketplace-state-v1";
const prefsKey = "n5deal-marketplace-prefs-v1";

export type MarketplacePrefs = Partial<{
  role: Role;
  currentUserId: string;
  query: string;
  sector: string;
  region: string;
  locale: Locale;
}>;

export function loadMarketplaceState(): MarketplaceState {
  if (typeof window === "undefined") return cloneSeedState();
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return cloneSeedState();
  try {
    return JSON.parse(raw) as MarketplaceState;
  } catch {
    return cloneSeedState();
  }
}

export function saveMarketplaceState(state: MarketplaceState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function loadMarketplacePrefs(): MarketplacePrefs {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(prefsKey);
  if (!raw) return {};
  try {
    const prefs = JSON.parse(raw) as MarketplacePrefs;
    return prefs.locale && !isLocale(prefs.locale) ? { ...prefs, locale: undefined } : prefs;
  } catch {
    return {};
  }
}

export function saveMarketplacePrefs(prefs: MarketplacePrefs) {
  window.localStorage.setItem(prefsKey, JSON.stringify(prefs));
}
