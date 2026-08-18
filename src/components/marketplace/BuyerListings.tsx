"use client";

import { Eye, MessageSquare } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { calculateMatchScore } from "@/lib/matching";
import { Button } from "@/components/ui/Button";
import { useMarketplace } from "./MarketplaceProvider";

export function BuyerListings() {
  const { currentUser, filteredAssets, buyerProfile, sellers, openAsset, openChat, t } = useMarketplace();
  const canContact = currentUser?.status === "active";

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {filteredAssets.map((asset) => {
        const seller = sellers.find((item) => item.id === asset.sellerId);
        const match = calculateMatchScore(asset, buyerProfile);
        return (
          <article key={asset.id} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-[#17130f] px-2 py-1 text-xs font-semibold text-white">{t("topDeal")}</span>
                  <span className="rounded bg-[#ecf6ed] px-2 py-1 text-xs font-semibold text-[#276437]">{t("validated")}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold">{asset.title}</h2>
              </div>
              <span className="rounded-md bg-[#ecf6ed] px-3 py-1 text-sm font-semibold text-[#276437]">{match.score}% {t("fit")}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#67594d]">{asset.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <span><b>{t("country")}</b><br />{asset.region}</span>
              <span><b>{t("type")}</b><br />{asset.type}</span>
              <span><b>{t("business")}</b><br />{asset.sector}</span>
              <span><b>{t("askingPrice")}</b><br />{formatMoney(asset.priceMin, asset.priceMax)}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#7b6b5d]">{t("sellerLabel")}: {seller?.company} · {match.reasons.join(", ")}</p>
              {seller && (
                <div className="flex gap-2">
                  <Button onClick={() => openAsset(asset.id)} type="button">
                    <Eye className="h-4 w-4" />
                    {t("viewAsset")}
                  </Button>
                  <Button disabled={!canContact} onClick={() => openChat(seller, asset)} variant="primary" type="button">
                    <MessageSquare className="h-4 w-4" />
                    {t("chat")}
                  </Button>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
