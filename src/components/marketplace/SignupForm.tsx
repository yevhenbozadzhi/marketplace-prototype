"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectInput, TextInput } from "@/components/ui/Field";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { useMarketplace } from "./MarketplaceProvider";

export function SignupForm() {
  const { isLoading, signUp } = useMarketplace();

  if (isLoading) return <FormSkeleton />;

  return (
    <form onSubmit={signUp} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">Self-service onboarding</p>
        <h2 className="mt-1 text-2xl font-semibold">Create marketplace account</h2>
        <p className="mt-2 text-sm text-[#67594d]">Create a buyer or seller demo account and continue in that role.</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SelectInput label="Account type" name="role" required>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </SelectInput>
        <TextInput label="Company" name="company" placeholder="Company name" required />
        <TextInput label="Contact name" name="name" placeholder="Full name" required />
        <TextInput label="Email" name="email" type="email" placeholder="name@company.com" required />
        <TextInput label="Location" name="location" placeholder="City, country" required />
        <TextInput label="Tags" name="tags" placeholder="SaaS, CEE, buyout" />
      </div>

      <Button className="mt-5 h-11" variant="primary" type="submit">
        <UserPlus className="h-4 w-4" />
        Create account
      </Button>
    </form>
  );
}
