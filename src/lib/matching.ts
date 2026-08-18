import type { Asset, BuyerProfile } from "./types";

export function calculateMatchScore(asset: Asset, profile?: BuyerProfile) {
  if (!profile) {
    return {
      score: 0,
      reasons: ["no buyer profile"],
    };
  }

  let score = 0;
  const reasons: string[] = [];
  const sectorHit = profile.targetSectors.some(
    (sector) => sector.toLowerCase() === asset.sector.toLowerCase(),
  );
  const regionHit = profile.targetRegions.some(
    (region) => region.toLowerCase() === asset.region.toLowerCase(),
  );
  const ticketOverlap = profile.ticketMin <= asset.priceMax && profile.ticketMax >= asset.priceMin;

  if (sectorHit) {
    score += 45;
    reasons.push("sector fit");
  }
  if (regionHit) {
    score += 30;
    reasons.push("region fit");
  }
  if (ticketOverlap) {
    score += 25;
    reasons.push("ticket range");
  }

  return {
    score,
    reasons: reasons.length ? reasons : ["outside stated mandate"],
  };
}
