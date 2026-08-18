"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/format";
import { translateStatus } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { SelectInput, TextArea, TextInput } from "@/components/ui/Field";
import { ListingCardSkeleton } from "@/components/ui/Skeleton";
import { useMarketplace } from "./MarketplaceProvider";

export function AssetDetail({ assetId }: { assetId: string }) {
  const router = useRouter();
  const { currentUser, isLoading, role, locale, sellers, getAsset, openChat, updateAsset, t } = useMarketplace();
  const asset = getAsset(assetId);

  if (isLoading) return <ListingCardSkeleton />;

  if (!asset) {
    return (
      <section className="rounded-md border border-[#ded6cc] bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold">{t("assetNotFound")}</h2>
        <button onClick={() => router.push("/assets")} className="mt-4 rounded-md bg-[#17130f] px-4 py-2 text-sm font-semibold text-white" type="button">
          {t("backToListings")}
        </button>
      </section>
    );
  }

  const seller = sellers.find((item) => item.id === asset.sellerId);
  const canEdit = currentUser?.role === "seller" && currentUser.id === asset.sellerId;
  const canBuyerContact = role === "buyer" && currentUser?.status === "active" && seller?.status === "active";

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
        <button onClick={() => router.push("/assets")} className="mb-4 text-sm font-semibold text-[#9b6a2e]" type="button">
          {t("backToListings")}
        </button>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-[#17130f] px-2 py-1 text-xs font-semibold text-white">{t("topDeal")}</span>
              <span className="rounded bg-[#ecf6ed] px-2 py-1 text-xs font-semibold text-[#276437]">{t("validated")}</span>
              <span className="rounded bg-[#fff1d8] px-2 py-1 text-xs font-semibold text-[#8f5f28]">{translateStatus(locale, asset.status)}</span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold">{asset.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#67594d]">{asset.description}</p>
          </div>
          <div className="rounded-md border border-[#ded6cc] bg-[#fffaf3] p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{t("askingPrice")}</p>
            <p className="mt-1 text-xl font-semibold">{formatMoney(asset.priceMin, asset.priceMax)}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-sm md:grid-cols-4">
          <span className="rounded-md bg-[#f3eee7] p-3"><b>{t("country")}</b><br />{asset.region}</span>
          <span className="rounded-md bg-[#f3eee7] p-3"><b>{t("type")}</b><br />{asset.type}</span>
          <span className="rounded-md bg-[#f3eee7] p-3"><b>{t("business")}</b><br />{asset.sector}</span>
          <span className="rounded-md bg-[#f3eee7] p-3"><b>{t("ebitda")}</b><br />{asset.ebitda ?? "N/A"}M</span>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee5da] pt-4">
          <p className="text-sm text-[#67594d]">{t("sellerLabel")}: {seller?.company ?? t("unknownSeller")}</p>
          {role === "buyer" && seller && (
            <Button disabled={!canBuyerContact} onClick={() => openChat(seller, asset)} variant="primary" type="button">
              <MessageSquare className="h-4 w-4" />
              {t("chatWithSeller")}
            </Button>
          )}
        </div>
      </section>

      {canEdit && (
        <form onSubmit={(event) => updateAsset(asset.id, event)} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{t("sellerControls")}</p>
          <h2 className="mt-1 text-xl font-semibold">{t("editAsset")}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <TextInput name="title" required defaultValue={asset.title} className="mt-0" />
            <TextInput name="type" required defaultValue={asset.type} className="mt-0" />
            <TextInput name="sector" required defaultValue={asset.sector} className="mt-0" />
            <TextInput name="region" required defaultValue={asset.region} className="mt-0" />
            <TextInput name="priceMin" required type="number" min="0" defaultValue={asset.priceMin} className="mt-0" />
            <TextInput name="priceMax" required type="number" min="0" defaultValue={asset.priceMax} className="mt-0" />
            <TextInput name="ebitda" type="number" min="0" defaultValue={asset.ebitda} className="mt-0" />
            <SelectInput name="status" defaultValue={asset.status} className="mt-0">
            <option value="draft">{translateStatus(locale, "draft")}</option>
            <option value="published">{translateStatus(locale, "published")}</option>
            <option value="suspended">{translateStatus(locale, "suspended")}</option>
            </SelectInput>
            <TextArea name="description" required defaultValue={asset.description} className="mt-0 md:col-span-2" />
          </div>
          <Button className="mt-4" variant="primary" type="submit">
            {t("saveChanges")}
          </Button>
        </form>
      )}
    </div>
  );
}
