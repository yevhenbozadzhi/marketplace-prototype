import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";
import { SignupForm } from "@/components/marketplace/SignupForm";

export default function SignupPage() {
  return (
    <MarketplaceShell title="Sign Up" eyebrow="Account">
      <SignupForm />
    </MarketplaceShell>
  );
}
