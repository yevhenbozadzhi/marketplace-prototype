import { NextResponse } from "next/server";
import { z } from "zod";
import { readMarketplaceState, writeMarketplaceState } from "@/lib/marketplace-db";

const participantSchema = z.object({
  id: z.string(),
  role: z.enum(["buyer", "seller", "manager"]),
  name: z.string(),
  company: z.string(),
  email: z.string(),
  location: z.string(),
  status: z.enum(["active", "suspended", "removed"]),
  tags: z.array(z.string()),
  createdAt: z.string(),
});

const marketplaceStateSchema = z.object({
  participants: z.array(participantSchema),
  buyerProfiles: z.array(
    z.object({
      participantId: z.string(),
      ticketMin: z.number(),
      ticketMax: z.number(),
      targetRegions: z.array(z.string()),
      targetSectors: z.array(z.string()),
      interestText: z.string(),
      mandateStage: z.string(),
    }),
  ),
  assets: z.array(
    z.object({
      id: z.string(),
      sellerId: z.string(),
      title: z.string(),
      type: z.string(),
      sector: z.string(),
      region: z.string(),
      priceMin: z.number(),
      priceMax: z.number(),
      ebitda: z.number().optional(),
      description: z.string(),
      status: z.enum(["draft", "published", "suspended"]),
      createdAt: z.string(),
    }),
  ),
  contacts: z.array(
    z.object({
      id: z.string(),
      fromId: z.string(),
      toId: z.string(),
      assetId: z.string().optional(),
      message: z.string(),
      createdAt: z.string(),
    }),
  ),
});

export async function GET() {
  try {
    return NextResponse.json(await readMarketplaceState());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read marketplace state" },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const parsed = marketplaceStateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await writeMarketplaceState(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to persist marketplace state" },
      { status: 503 },
    );
  }
}
