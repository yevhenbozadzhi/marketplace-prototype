import type {
  AssetStatus,
  ParticipantStatus,
  Role,
} from "@/generated/prisma/client";

import { getPrisma } from "@/lib/prisma";

import { cloneSeedState } from "@/lib/seed";

import type {
  MarketplaceState,
  Participant,
  Asset,
} from "@/lib/types";

function toDbRole(role: Participant["role"]): Role {
  return role.toUpperCase() as Role;
}

function toDbParticipantStatus(status: Participant["status"]): ParticipantStatus {
  return status.toUpperCase() as ParticipantStatus;
}

function toDbAssetStatus(status: Asset["status"]): AssetStatus {
  return status.toUpperCase() as AssetStatus;
}

function fromDbRole(role: Role): Participant["role"] {
  return role.toLowerCase() as Participant["role"];
}

function fromDbParticipantStatus(status: ParticipantStatus): Participant["status"] {
  return status.toLowerCase() as Participant["status"];
}

function fromDbAssetStatus(status: AssetStatus): Asset["status"] {
  return status.toLowerCase() as Asset["status"];
}

export async function readMarketplaceState(): Promise<MarketplaceState> {
    const prisma = getPrisma();
  const [participants, buyerProfiles, assets, chats] = await Promise.all([
    prisma.participant.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.buyerProfile.findMany(),
    prisma.asset.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.chatThread.findMany({
      include: {
        messages: {
          include: { sender: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  if (!participants.length) {
    const seed = cloneSeedState();
    await writeMarketplaceState(seed);
    return seed;
  }

  return {
    participants: participants.map((participant) => ({
      id: participant.id,
      role: fromDbRole(participant.role),
      name: participant.name,
      company: participant.company,
      email: participant.email,
      location: participant.location,
      status: fromDbParticipantStatus(participant.status),
      tags: participant.tags,
      createdAt: participant.createdAt.toISOString(),
    })),
    buyerProfiles: buyerProfiles.map((profile) => ({
      participantId: profile.participantId,
      ticketMin: profile.ticketMin,
      ticketMax: profile.ticketMax,
      targetRegions: profile.targetRegions,
      targetSectors: profile.targetSectors,
      interestText: profile.interestText,
      mandateStage: profile.mandateStage,
    })),
    assets: assets.map((asset) => ({
      id: asset.id,
      sellerId: asset.sellerId,
      title: asset.title,
      type: asset.type,
      sector: asset.sector,
      region: asset.region,
      priceMin: asset.priceMin,
      priceMax: asset.priceMax,
      ebitda: asset.ebitda ?? undefined,
      description: asset.description,
      status: fromDbAssetStatus(asset.status),
      createdAt: asset.createdAt.toISOString(),
    })),
    contacts: chats.map((chat) => ({
      id: chat.id,
      fromId: chat.fromId,
      toId: chat.toId,
      assetId: chat.assetId ?? undefined,
      message: chat.messages.map((message) => `${message.sender.company}: ${message.body}`).join("\n\n"),
      createdAt: chat.createdAt.toISOString(),
    })),
  };
}

export async function writeMarketplaceState(state: MarketplaceState) {
    const prisma = getPrisma();
  const chatMessages = state.contacts.flatMap((contact) =>
    contact.message.split("\n\n").map((rawMessage, index) => {
      const [maybeCompany, ...bodyParts] = rawMessage.split(": ");
      const sender = state.participants.find((participant) => participant.company === maybeCompany);
      return {
        id: `${contact.id}-message-${index}`,
        threadId: contact.id,
        senderId: sender?.id ?? contact.fromId,
        body: bodyParts.length ? bodyParts.join(": ") : rawMessage,
        createdAt: new Date(new Date(contact.createdAt).getTime() + index),
      };
    }),
  );

  await prisma.$transaction([
    prisma.chatMessage.deleteMany(),
    prisma.chatThread.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.buyerProfile.deleteMany(),
    prisma.participant.deleteMany(),
    prisma.participant.createMany({
      data: state.participants.map((participant) => ({
        id: participant.id,
        role: toDbRole(participant.role),
        name: participant.name,
        company: participant.company,
        email: participant.email,
        location: participant.location,
        status: toDbParticipantStatus(participant.status),
        tags: participant.tags,
        createdAt: new Date(participant.createdAt),
      })),
    }),
    prisma.buyerProfile.createMany({
      data: state.buyerProfiles.map((profile) => ({
        participantId: profile.participantId,
        ticketMin: profile.ticketMin,
        ticketMax: profile.ticketMax,
        targetRegions: profile.targetRegions,
        targetSectors: profile.targetSectors,
        interestText: profile.interestText,
        mandateStage: profile.mandateStage,
      })),
    }),
    prisma.asset.createMany({
      data: state.assets.map((asset) => ({
        id: asset.id,
        sellerId: asset.sellerId,
        title: asset.title,
        type: asset.type,
        sector: asset.sector,
        region: asset.region,
        priceMin: asset.priceMin,
        priceMax: asset.priceMax,
        ebitda: asset.ebitda,
        description: asset.description,
        status: toDbAssetStatus(asset.status),
        createdAt: new Date(asset.createdAt),
      })),
    }),
    prisma.chatThread.createMany({
      data: state.contacts.map((contact) => ({
        id: contact.id,
        fromId: contact.fromId,
        toId: contact.toId,
        assetId: contact.assetId,
        createdAt: new Date(contact.createdAt),
      })),
    }),
    prisma.chatMessage.createMany({
      data: chatMessages,
    }),
  ]);
}
