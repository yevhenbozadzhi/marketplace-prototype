import { BuyerProfileForm } from "@/components/marketplace/BuyerProfileForm";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";

export default function ProfilePage() {
  return (
    <MarketplaceShell title="Buyer Profile" eyebrow="Mandate">
      <BuyerProfileForm />
    </MarketplaceShell>
  );
}
