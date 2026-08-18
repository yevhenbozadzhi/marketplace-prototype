"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectInput, TextInput } from "@/components/ui/Field";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { useMarketplace } from "./MarketplaceProvider";

export function SignupForm() {
  const { isLoading, signUp, t } = useMarketplace();

  if (isLoading) return <FormSkeleton />;

  return (
    <form onSubmit={signUp} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{t("selfServiceOnboarding")}</p>
        <h2 className="mt-1 text-2xl font-semibold">{t("createMarketplaceAccount")}</h2>
        <p className="mt-2 text-sm text-[#67594d]">{t("signupHelp")}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SelectInput label={t("accountType")} name="role" required>
          <option value="buyer">{t("buyer")}</option>
          <option value="seller">{t("seller")}</option>
        </SelectInput>
        <TextInput label={t("company")} name="company" placeholder={t("companyName")} required />
        <TextInput label={t("contactName")} name="name" placeholder={t("fullName")} required />
        <TextInput label={t("email")} name="email" type="email" placeholder="name@company.com" required />
        <TextInput label={t("location")} name="location" placeholder={t("cityCountry")} required />
        <TextInput label={t("tagsComma")} name="tags" placeholder={t("tagsExample")} />
      </div>

      <Button className="mt-5 h-11" variant="primary" type="submit">
        <UserPlus className="h-4 w-4" />
        {t("createAccount")}
      </Button>
    </form>
  );
}
