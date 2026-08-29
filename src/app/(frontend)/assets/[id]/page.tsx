import { AssetDetail } from "@/components/marketplace/AssetDetail";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";

export default async function AssetPage({ params }: PageProps<"/assets/[id]">) {
  const { id } = await params;

  return (
    <MarketplaceShell title="Asset Details" eyebrow="Listing">
      <AssetDetail assetId={id} />
    </MarketplaceShell>
  );
}
