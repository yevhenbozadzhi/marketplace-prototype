"use client";

import { createContext, FormEvent, useContext } from "react";
import type { Locale, TranslationKey } from "@/lib/i18n";
import type { MarketplaceDerivedData } from "@/lib/marketplace-selectors";
import type { Asset, ContactRequest, MarketplaceState, Participant, Role } from "@/lib/types";

export type MarketplaceContextValue = MarketplaceDerivedData & {
  state: MarketplaceState;
  role: Role;
  currentUserId: string;
  query: string;
  sector: string;
  region: string;
  locale: Locale;
  activity: string;
  isLoading: boolean;
  isSyncing: boolean;
  setQuery: (value: string) => void;
  setSector: (value: string) => void;
  setRegion: (value: string) => void;
  setLocale: (value: Locale) => void;
  t: (key: TranslationKey) => string;
  switchRole: (role: Role) => void;
  switchUser: (userId: string) => void;
  resetDemo: () => void;
  openAsset: (assetId: string) => void;
  openChat: (participant: Participant, asset?: Asset) => void;
  sendChatMessage: (chatId: string, event: FormEvent<HTMLFormElement>) => void;
  publishAsset: (event: FormEvent<HTMLFormElement>) => void;
  createParticipant: (event: FormEvent<HTMLFormElement>) => void;
  signUp: (event: FormEvent<HTMLFormElement>) => void;
  updateAsset: (assetId: string, event: FormEvent<HTMLFormElement>) => void;
  updateBuyerProfile: (event: FormEvent<HTMLFormElement>) => void;
  updateParticipantStatus: (id: string, status: Participant["status"]) => void;
  getCounterparty: (contact: ContactRequest) => Participant | undefined;
  getAsset: (assetId: string) => Asset | undefined;
  canUseChat: (contact: ContactRequest) => boolean;
};

export const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function useMarketplace() {
  const value = useContext(MarketplaceContext);
  if (!value) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return value;
}
