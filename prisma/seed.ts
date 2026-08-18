import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedState } from "../src/lib/seed";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://n5deal:n5deal@localhost:5432/n5deal_marketplace?schema=public",
});
const prisma = new PrismaClient({ adapter });

await prisma.$transaction([
  prisma.chatMessage.deleteMany(),
  prisma.chatThread.deleteMany(),
  prisma.asset.deleteMany(),
  prisma.buyerProfile.deleteMany(),
  prisma.participant.deleteMany(),
  prisma.participant.createMany({
    data: seedState.participants.map((participant) => ({
      ...participant,
      role: participant.role.toUpperCase() as "BUYER" | "SELLER" | "MANAGER",
      status: participant.status.toUpperCase() as "ACTIVE" | "SUSPENDED" | "REMOVED",
      createdAt: new Date(participant.createdAt),
    })),
  }),
  prisma.buyerProfile.createMany({ data: seedState.buyerProfiles }),
  prisma.asset.createMany({
    data: seedState.assets.map((asset) => ({
      ...asset,
      status: asset.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "SUSPENDED",
      createdAt: new Date(asset.createdAt),
    })),
  }),
  prisma.chatThread.createMany({
    data: seedState.contacts.map((contact) => ({
      id: contact.id,
      fromId: contact.fromId,
      toId: contact.toId,
      assetId: contact.assetId,
      createdAt: new Date(contact.createdAt),
    })),
  }),
  prisma.chatMessage.createMany({
    data: seedState.contacts.flatMap((contact) =>
      contact.message.split("\n\n").map((rawMessage, index) => {
        const [maybeCompany, ...bodyParts] = rawMessage.split(": ");
        const sender = seedState.participants.find((participant) => participant.company === maybeCompany);
        return {
          id: `${contact.id}-message-${index}`,
          threadId: contact.id,
          senderId: sender?.id ?? contact.fromId,
          body: bodyParts.length ? bodyParts.join(": ") : rawMessage,
          createdAt: new Date(new Date(contact.createdAt).getTime() + index),
        };
      }),
    ),
  }),
]);

await prisma.$disconnect();
console.log("Seeded N5Deal marketplace demo data.");
