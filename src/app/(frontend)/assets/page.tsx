import { MarketplaceHome } from "@/components/marketplace/MarketplaceHome";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";

export default function AssetsPage() {
  return (
    <MarketplaceShell title="All Listings" eyebrow="Marketplace">
      <MarketplaceHome />
    </MarketplaceShell>
  );
}
