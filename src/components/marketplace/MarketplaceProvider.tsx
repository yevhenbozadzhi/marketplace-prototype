"use client";

import { useRouter } from "next/navigation";
import { createContext, FormEvent, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { calculateMatchScore } from "@/lib/matching";
import { cloneSeedState } from "@/lib/seed";
import type { Asset, ContactRequest, MarketplaceState, Participant, Role } from "@/lib/types";
import { normalize } from "@/lib/format";
import { ToastMessage, ToastViewport } from "@/components/ui/Toast";

const storageKey = "n5deal-marketplace-state-v1";
const prefsKey = "n5deal-marketplace-prefs-v1";

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadState(): MarketplaceState {
  if (typeof window === "undefined") return cloneSeedState();
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return cloneSeedState();
  try {
    return JSON.parse(raw) as MarketplaceState;
  } catch {
    return cloneSeedState();
  }
}

function loadPrefs() {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(prefsKey);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<{
      role: Role;
      currentUserId: string;
      query: string;
      sector: string;
      region: string;
    }>;
  } catch {
    return {};
  }
}

type MarketplaceContextValue = {
  state: MarketplaceState;
  role: Role;
  currentUserId: string;
  currentUser?: Participant;
  buyerProfile: ReturnType<typeof deriveMarketplaceData>["buyerProfile"];
  buyers: Participant[];
  sellers: Participant[];
  sectors: string[];
  regions: string[];
  query: string;
  sector: string;
  region: string;
  activity: string;
  isLoading: boolean;
  isSyncing: boolean;
  filteredAssets: Asset[];
  filteredBuyers: Participant[];
  visibleContacts: ContactRequest[];
  currentAssetCount: number;
  setQuery: (value: string) => void;
  setSector: (value: string) => void;
  setRegion: (value: string) => void;
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

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function deriveMarketplaceData(
  state: MarketplaceState,
  currentUserId: string,
  query: string,
  sector: string,
  region: string,
) {
  const currentUser = state.participants.find((participant) => participant.id === currentUserId);
  const buyerProfile = state.buyerProfiles.find((profile) => profile.participantId === currentUserId);
  const buyers = state.participants.filter((participant) => participant.role === "buyer" && (currentUser?.role === "manager" || participant.status === "active"));
  const sellers = state.participants.filter((participant) => participant.role === "seller" && (currentUser?.role === "manager" || participant.status === "active"));
  const sectors = Array.from(new Set(state.assets.map((asset) => asset.sector)));
  const regions = Array.from(new Set(state.assets.map((asset) => asset.region)));

  const filteredAssets = state.assets
    .filter((asset) => asset.status === "published")
    .filter((asset) => currentUser?.role === "manager" || state.participants.find((participant) => participant.id === asset.sellerId)?.status === "active")
    .filter((asset) => sector === "all" || asset.sector === sector)
    .filter((asset) => region === "all" || asset.region === region)
    .filter((asset) =>
      [asset.title, asset.description, asset.sector, asset.region, asset.type]
        .join(" ")
        .toLowerCase()
        .includes(normalize(query)),
    )
    .sort((a, b) => calculateMatchScore(b, buyerProfile).score - calculateMatchScore(a, buyerProfile).score);

  const filteredBuyers = buyers.filter((buyer) => {
    const profile = state.buyerProfiles.find((item) => item.participantId === buyer.id);
    return [buyer.name, buyer.company, buyer.location, buyer.tags.join(" "), profile?.interestText, profile?.targetSectors.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(normalize(query));
  });

  const visibleContacts = currentUser
    ? state.contacts.filter((contact) => contact.fromId === currentUser.id || contact.toId === currentUser.id)
    : [];

  const currentAssetCount =
    currentUser?.role === "seller"
      ? state.assets.filter((asset) => asset.sellerId === currentUser.id).length
      : filteredAssets.length;

  return {
    currentUser,
    buyerProfile,
    buyers,
    sellers,
    sectors,
    regions,
    filteredAssets,
    filteredBuyers,
    visibleContacts,
    currentAssetCount,
  };
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<MarketplaceState>(() => cloneSeedState());
  const [role, setRole] = useState<Role>("buyer");
  const [currentUserId, setCurrentUserId] = useState("buyer-1");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [region, setRegion] = useState("all");
  const [activity, setActivity] = useState("Marketplace is ready.");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [canSyncDatabase, setCanSyncDatabase] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function showToast(message: string, tone: ToastMessage["tone"] = "info") {
    const toast = { id: makeId("toast"), message, tone };
    setToasts((current) => [toast, ...current].slice(0, 3));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id));
    }, 3200);
  }

  useEffect(() => {
    queueMicrotask(() => {
      const prefs = loadPrefs();
      setState(loadState());
      if (prefs.role) setRole(prefs.role);
      if (prefs.currentUserId) setCurrentUserId(prefs.currentUserId);
      if (prefs.query !== undefined) setQuery(prefs.query);
      if (prefs.sector) setSector(prefs.sector);
      if (prefs.region) setRegion(prefs.region);
      setPrefsLoaded(true);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setIsSyncing(true);
    });
    fetch("/api/marketplace")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Database unavailable"))))
      .then((nextState: MarketplaceState) => {
        if (!cancelled) {
          setState(nextState);
          window.localStorage.setItem(storageKey, JSON.stringify(nextState));
          setCanSyncDatabase(true);
          showToast("Marketplace data synced with PostgreSQL.", "success");
        }
      })
      .catch(() => {
        setCanSyncDatabase(false);
        setActivity("Using browser persistence. Start PostgreSQL to sync shared demo data.");
        showToast("Using browser persistence. PostgreSQL is unavailable.", "warning");
      })
      .finally(() => {
        if (!cancelled) setIsSyncing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!prefsLoaded) return;
    window.localStorage.setItem(prefsKey, JSON.stringify({ role, currentUserId, query, sector, region }));
  }, [currentUserId, prefsLoaded, query, region, role, sector]);

  const data = useMemo(
    () => deriveMarketplaceData(state, currentUserId, query, sector, region),
    [currentUserId, query, region, sector, state],
  );

  function persist(next: MarketplaceState) {
    setState(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    if (!canSyncDatabase) {
      setActivity("Saved locally. PostgreSQL sync is unavailable.");
      return;
    }
    setIsSyncing(true);
    fetch("/api/marketplace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    })
      .then((response) => {
        if (!response.ok) throw new Error("PostgreSQL sync failed");
        showToast("Saved and synced.", "success");
      })
      .catch(() => {
        setActivity("Saved locally. PostgreSQL sync is unavailable.");
        showToast("Saved locally. PostgreSQL sync is unavailable.", "warning");
      })
      .finally(() => setIsSyncing(false));
  }

  function switchRole(nextRole: Role) {
    setRole(nextRole);
    const fallback = state.participants.find(
      (participant) => participant.role === nextRole && (nextRole === "manager" || participant.status !== "removed"),
    );
    if (fallback) setCurrentUserId(fallback.id);
    setQuery("");
    router.push("/assets");
  }

  function switchUser(userId: string) {
    setCurrentUserId(userId);
    router.push("/assets");
  }

  function getCounterparty(contact: ContactRequest) {
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    if (!currentUser) return state.participants.find((participant) => participant.id === contact.toId);
    const otherId = contact.fromId === currentUser.id ? contact.toId : contact.fromId;
    return state.participants.find((participant) => participant.id === otherId);
  }

  function canUseChat(contact: ContactRequest) {
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    const counterparty = getCounterparty(contact);
    return Boolean(currentUser && counterparty && currentUser.status === "active" && counterparty.status === "active");
  }

  function getAsset(assetId: string) {
    return state.assets.find((asset) => asset.id === assetId);
  }

  function openAsset(assetId: string) {
    router.push(`/assets/${assetId}`);
  }

  function openChat(to: Participant, asset?: Asset) {
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    if (!currentUser) return;
    if (currentUser.status !== "active" || to.status !== "active") {
      setActivity("Chat is disabled for suspended or removed participants.");
      showToast("Chat is disabled for suspended or removed participants.", "warning");
      return;
    }

    const existing = state.contacts.find(
      (contact) =>
        ((contact.fromId === currentUser.id && contact.toId === to.id) ||
          (contact.fromId === to.id && contact.toId === currentUser.id)) &&
        contact.assetId === asset?.id,
    );

    if (existing) {
      setActivity(`Chat opened with ${to.company}.`);
      router.push(`/chats/${existing.id}`);
      return;
    }

    const nextContact: ContactRequest = {
      id: makeId("contact"),
      fromId: currentUser.id,
      toId: to.id,
      assetId: asset?.id,
      message: asset
        ? `${currentUser.company}: Interested in ${asset.title}. Please share the teaser and next steps.`
        : `${currentUser.company}: Would like to discuss a potential mandate fit with ${to.company}.`,
      createdAt: new Date().toISOString(),
    };
    persist({ ...state, contacts: [nextContact, ...state.contacts] });
    setActivity(`Chat opened between ${currentUser.company} and ${to.company}.`);
    router.push(`/chats/${nextContact.id}`);
  }

  function sendChatMessage(chatId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    if (!currentUser) return;
    const contact = state.contacts.find((item) => item.id === chatId);
    if (!contact || !canUseChat(contact)) {
      setActivity("This chat is read-only because one participant is not active.");
      showToast("This chat is read-only.", "warning");
      return;
    }
    const form = new FormData(event.currentTarget);
    const message = String(form.get("message")).trim();
    if (!message) return;

    persist({
      ...state,
      contacts: state.contacts.map((contact) =>
        contact.id === chatId
          ? { ...contact, message: `${contact.message}\n\n${currentUser.company}: ${message}`, createdAt: new Date().toISOString() }
          : contact,
      ),
    });
    event.currentTarget.reset();
    setActivity("Message sent.");
    showToast("Message sent.", "success");
  }

  function resetDemo() {
    const next = cloneSeedState();
    persist(next);
    setRole("buyer");
    setCurrentUserId("buyer-1");
    setActivity("Demo data restored.");
    showToast("Demo data restored.", "success");
    router.push("/assets");
  }

  function updateParticipantStatus(id: string, status: Participant["status"]) {
    persist({
      ...state,
      participants: state.participants.map((participant) =>
        participant.id === id ? { ...participant, status } : participant,
      ),
    });
    if (id === currentUserId && status === "removed") {
      const fallback = state.participants.find((participant) => participant.role === role && participant.id !== id && participant.status !== "removed");
      if (fallback) setCurrentUserId(fallback.id);
    }
    showToast("Participant status updated.", "success");
  }

  function publishAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    if (!currentUser) return;
    if (currentUser.status !== "active") {
      setActivity("Suspended or removed sellers cannot publish assets.");
      showToast("Publishing is disabled for this seller.", "warning");
      return;
    }
    const form = new FormData(event.currentTarget);
    const asset: Asset = {
      id: makeId("asset"),
      sellerId: currentUser.id,
      title: String(form.get("title")),
      type: String(form.get("type")),
      sector: String(form.get("sector")),
      region: String(form.get("region")),
      priceMin: Number(form.get("priceMin")),
      priceMax: Number(form.get("priceMax")),
      ebitda: Number(form.get("ebitda")) || undefined,
      description: String(form.get("description")),
      status: "published",
      createdAt: new Date().toISOString(),
    };
    persist({ ...state, assets: [asset, ...state.assets] });
    event.currentTarget.reset();
    setActivity(`${asset.title} published to the marketplace.`);
    showToast("Asset published.", "success");
    router.push(`/assets/${asset.id}`);
  }

  function buildParticipantFromForm(form: FormData): Participant {
    const role = String(form.get("role")) as "buyer" | "seller";
    const company = String(form.get("company")).trim();
    const email = String(form.get("email")).trim();
    const name = String(form.get("name")).trim();
    const location = String(form.get("location")).trim();
    const tags = String(form.get("tags"))
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return {
      id: `${role}-${makeId("account")}`,
      role,
      name,
      company,
      email,
      location,
      status: "active",
      tags,
      createdAt: new Date().toISOString(),
    };
  }

  function createStateWithParticipant(participant: Participant): MarketplaceState {
    return {
      ...state,
      participants: [participant, ...state.participants],
      buyerProfiles:
        participant.role === "buyer"
          ? [
              {
                participantId: participant.id,
                ticketMin: 1,
                ticketMax: 25,
                targetRegions: ["Western Europe"],
                targetSectors: ["SaaS"],
                interestText: "New buyer mandate. Update this profile with specific acquisition interests.",
                mandateStage: "Exploratory",
              },
              ...state.buyerProfiles,
            ]
          : state.buyerProfiles,
    };
  }

  function createParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    if (currentUser?.role !== "manager") {
      showToast("Only platform managers can create accounts.", "warning");
      return;
    }

    const participant = buildParticipantFromForm(new FormData(event.currentTarget));
    if (state.participants.some((item) => item.email.toLowerCase() === participant.email.toLowerCase())) {
      showToast("An account with this email already exists.", "error");
      return;
    }

    persist(createStateWithParticipant(participant));
    event.currentTarget.reset();
    setActivity(`${participant.company} account created.`);
    showToast(`${participant.company} account created.`, "success");
  }

  function signUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const participant = buildParticipantFromForm(new FormData(event.currentTarget));
    if (state.participants.some((item) => item.email.toLowerCase() === participant.email.toLowerCase())) {
      showToast("An account with this email already exists.", "error");
      return;
    }

    persist(createStateWithParticipant(participant));
    setRole(participant.role);
    setCurrentUserId(participant.id);
    event.currentTarget.reset();
    setActivity(`Welcome, ${participant.company}.`);
    showToast("Account created.", "success");
    router.push(participant.role === "buyer" ? "/profile" : "/assets");
  }

  function updateAsset(assetId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    const existing = state.assets.find((asset) => asset.id === assetId);
    if (!currentUser || !existing || currentUser.role !== "seller" || existing.sellerId !== currentUser.id) return;
    if (currentUser.status !== "active") {
      setActivity("Suspended or removed sellers cannot edit assets.");
      showToast("Editing is disabled for this seller.", "warning");
      return;
    }

    const form = new FormData(event.currentTarget);
    const nextAsset: Asset = {
      ...existing,
      title: String(form.get("title")),
      type: String(form.get("type")),
      sector: String(form.get("sector")),
      region: String(form.get("region")),
      priceMin: Number(form.get("priceMin")),
      priceMax: Number(form.get("priceMax")),
      ebitda: Number(form.get("ebitda")) || undefined,
      description: String(form.get("description")),
      status: String(form.get("status")) as Asset["status"],
    };

    persist({
      ...state,
      assets: state.assets.map((asset) => (asset.id === assetId ? nextAsset : asset)),
    });
    setActivity(`${nextAsset.title} updated.`);
    showToast("Asset updated.", "success");
  }

  function updateBuyerProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUser = state.participants.find((participant) => participant.id === currentUserId);
    if (!currentUser || currentUser.role !== "buyer") return;
    if (currentUser.status !== "active") {
      setActivity("Suspended or removed buyers cannot edit their profile.");
      showToast("Profile editing is disabled for this buyer.", "warning");
      return;
    }

    const form = new FormData(event.currentTarget);
    const targetSectors = String(form.get("targetSectors"))
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const targetRegions = String(form.get("targetRegions"))
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const nextProfile = {
      participantId: currentUser.id,
      ticketMin: Number(form.get("ticketMin")),
      ticketMax: Number(form.get("ticketMax")),
      targetRegions,
      targetSectors,
      interestText: String(form.get("interestText")),
      mandateStage: String(form.get("mandateStage")),
    };
    const exists = state.buyerProfiles.some((profile) => profile.participantId === currentUser.id);

    persist({
      ...state,
      buyerProfiles: exists
        ? state.buyerProfiles.map((profile) =>
            profile.participantId === currentUser.id ? nextProfile : profile,
          )
        : [nextProfile, ...state.buyerProfiles],
    });
    setActivity(`${currentUser.company} profile updated.`);
    showToast("Buyer profile saved.", "success");
  }

  return (
    <MarketplaceContext.Provider
      value={{
        state,
        role,
        currentUserId,
        query,
        sector,
        region,
        activity,
        isLoading,
        isSyncing,
        setQuery,
        setSector,
        setRegion,
        switchRole,
        switchUser,
        resetDemo,
        openAsset,
        openChat,
        sendChatMessage,
        publishAsset,
        createParticipant,
        signUp,
        updateAsset,
        updateBuyerProfile,
        updateParticipantStatus,
        getCounterparty,
        getAsset,
        canUseChat,
        ...data,
      }}
    >
      {children}
      <ToastViewport toasts={toasts} />
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const value = useContext(MarketplaceContext);
  if (!value) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return value;
}
