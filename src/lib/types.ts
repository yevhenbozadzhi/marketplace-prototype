export type Role = "buyer" | "seller" | "manager";

export type ParticipantStatus = "active" | "suspended" | "removed";

export type AssetStatus = "draft" | "published" | "suspended";

export type Participant = {
  id: string;
  role: Role;
  name: string;
  company: string;
  email: string;
  location: string;
  status: ParticipantStatus;
  tags: string[];
  createdAt: string;
};

export type BuyerProfile = {
  participantId: string;
  ticketMin: number;
  ticketMax: number;
  targetRegions: string[];
  targetSectors: string[];
  interestText: string;
  mandateStage: string;
};

export type Asset = {
  id: string;
  sellerId: string;
  title: string;
  type: string;
  sector: string;
  region: string;
  priceMin: number;
  priceMax: number;
  ebitda?: number;
  description: string;
  status: AssetStatus;
  createdAt: string;
};

export type ContactRequest = {
  id: string;
  fromId: string;
  toId: string;
  assetId?: string;
  message: string;
  createdAt: string;
};

export type MarketplaceState = {
  participants: Participant[];
  buyerProfiles: BuyerProfile[];
  assets: Asset[];
  contacts: ContactRequest[];
};
