"use client";

import clsx from "clsx";
import { CheckCircle2, Eye, MessageSquare, Plus } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { TextArea, TextInput } from "@/components/ui/Field";
import { useMarketplace } from "./MarketplaceProvider";

export function SellerDashboard() {
  const { currentUser, filteredBuyers, state, openAsset, openChat, publishAsset } = useMarketplace();
  const ownAssets = currentUser ? state.assets.filter((asset) => asset.sellerId === currentUser.id) : [];
  const canSell = currentUser?.status === "active";

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-2">
        {ownAssets.map((asset) => (
          <article key={asset.id} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">My Asset</p>
                <h2 className="mt-1 text-xl font-semibold">{asset.title}</h2>
              </div>
              <span className="rounded-md bg-[#f3eee7] px-3 py-1 text-sm font-semibold">{asset.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <span><b>Country</b><br />{asset.region}</span>
              <span><b>Type</b><br />{asset.type}</span>
              <span><b>Business</b><br />{asset.sector}</span>
              <span><b>Asking Price</b><br />{formatMoney(asset.priceMin, asset.priceMax)}</span>
            </div>
            <Button onClick={() => openAsset(asset.id)} className="mt-4" type="button">
              <Eye className="h-4 w-4" />
              View / edit
            </Button>
          </article>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {filteredBuyers.map((buyer) => {
            const profile = state.buyerProfiles.find((item) => item.participantId === buyer.id);
            return (
              <article key={buyer.id} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{buyer.company}</h2>
                    <p className="mt-1 text-sm text-[#67594d]">{buyer.name} · {buyer.location}</p>
                  </div>
                  <span className={clsx("rounded-md px-3 py-1 text-sm font-semibold", buyer.status === "active" ? "bg-[#ecf6ed] text-[#276437]" : "bg-[#fff1d8] text-[#8f5f28]")}>
                    {buyer.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#67594d]">{profile?.interestText}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile?.targetSectors.map((item) => (
                    <span key={item} className="rounded-md bg-[#f3eee7] px-2 py-1 text-xs font-semibold">{item}</span>
                  ))}
                  <span className="rounded-md bg-[#f3eee7] px-2 py-1 text-xs font-semibold">{profile && formatMoney(profile.ticketMin, profile.ticketMax)}</span>
                </div>
                <Button disabled={!canSell} onClick={() => openChat(buyer)} className="mt-4" variant="primary" type="button">
                  <MessageSquare className="h-4 w-4" />
                  Open chat
                </Button>
              </article>
            );
          })}
        </div>

      <form onSubmit={publishAsset} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4 text-[#a76721]" />
          Publish asset
        </div>
        {!canSell && <p className="mt-3 rounded-md bg-[#fff1d8] p-3 text-sm font-semibold text-[#8f5f28]">Publishing is disabled while this seller is not active.</p>}
        {["title", "type", "sector", "region"].map((name) => (
          <TextInput disabled={!canSell} key={name} name={name} required placeholder={name} />
        ))}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <TextInput disabled={!canSell} name="priceMin" required type="number" min="0" placeholder="Min EUR M" className="mt-0" />
          <TextInput disabled={!canSell} name="priceMax" required type="number" min="0" placeholder="Max EUR M" className="mt-0" />
          <TextInput disabled={!canSell} name="ebitda" type="number" min="0" placeholder="EBITDA" className="mt-0" />
        </div>
        <TextArea disabled={!canSell} name="description" required placeholder="Short investment teaser" className="mt-3" />
        <Button disabled={!canSell} className="mt-3 w-full" variant="primary" type="submit">
          <CheckCircle2 className="h-4 w-4" />
          Publish
        </Button>
      </form>
      </div>
    </div>
  );
}
