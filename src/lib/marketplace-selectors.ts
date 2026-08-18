import { normalize } from "@/lib/format";
import { calculateMatchScore } from "@/lib/matching";
import type { MarketplaceState } from "@/lib/types";

export function deriveMarketplaceData(
  state: MarketplaceState,
  currentUserId: string,
  query: string,
  sector: string,
  region: string,
) {
  const currentUser = state.participants.find((participant) => participant.id === currentUserId);
  const buyerProfile = state.buyerProfiles.find((profile) => profile.participantId === currentUserId);
  const buyers = state.participants.filter(
    (participant) => participant.role === "buyer" && (currentUser?.role === "manager" || participant.status === "active"),
  );
  const sellers = state.participants.filter(
    (participant) => participant.role === "seller" && (currentUser?.role === "manager" || participant.status === "active"),
  );
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

export type MarketplaceDerivedData = ReturnType<typeof deriveMarketplaceData>;
