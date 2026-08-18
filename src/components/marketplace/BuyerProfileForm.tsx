"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectInput, TextArea, TextInput } from "@/components/ui/Field";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { useMarketplace } from "./MarketplaceProvider";

export function BuyerProfileForm() {
  const { currentUser, buyerProfile, isLoading, role, updateBuyerProfile, t } = useMarketplace();

  if (isLoading) return <FormSkeleton />;

  if (role !== "buyer") {
    return (
      <section className="rounded-md border border-[#ded6cc] bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold">{t("buyerProfileUnavailable")}</h2>
        <p className="mt-2 text-sm text-[#67594d]">{t("buyerProfileUnavailableText")}</p>
      </section>
    );
  }

  return (
    <form onSubmit={updateBuyerProfile} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{t("buyerMandate")}</p>
        <h2 className="mt-1 text-2xl font-semibold">{currentUser?.company}</h2>
        <p className="mt-2 text-sm text-[#67594d]">{t("buyerProfileHelp")}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">
          {t("ticketMin")}
          <TextInput
            name="ticketMin"
            type="number"
            min="0"
            defaultValue={buyerProfile?.ticketMin ?? 1}
            required
          />
        </label>
        <label className="text-sm font-semibold">
          {t("ticketMax")}
          <TextInput
            name="ticketMax"
            type="number"
            min="0"
            defaultValue={buyerProfile?.ticketMax ?? 25}
            required
          />
        </label>
        <label className="text-sm font-semibold">
          {t("targetSectors")}
          <TextInput
            name="targetSectors"
            defaultValue={buyerProfile?.targetSectors.join(", ") ?? ""}
            placeholder="SaaS, Healthcare, Energy"
            required
          />
        </label>
        <label className="text-sm font-semibold">
          {t("targetRegions")}
          <TextInput
            name="targetRegions"
            defaultValue={buyerProfile?.targetRegions.join(", ") ?? ""}
            placeholder="Western Europe, CEE"
            required
          />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          {t("mandateStage")}
          <SelectInput
            name="mandateStage"
            defaultValue={buyerProfile?.mandateStage ?? "Active mandate"}
            required
          >
            <option>Active mandate</option>
            <option>Screening</option>
            <option>Paused</option>
            <option>Exploratory</option>
          </SelectInput>
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          {t("investmentInterests")}
          <TextArea
            name="interestText"
            defaultValue={buyerProfile?.interestText ?? ""}
            required
          />
        </label>
      </div>

      <Button className="mt-5 h-11" variant="primary" type="submit">
        <Save className="h-4 w-4" />
        {t("saveProfile")}
      </Button>
    </form>
  );
}
