"use client";

import { ReactNode } from "react";
import { Filter, RotateCcw, Search, ShieldCheck, Sparkles } from "lucide-react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { roleLabel } from "@/lib/format";
import type { Role } from "@/lib/types";
import { SelectInput, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { useMarketplace } from "./MarketplaceProvider";

export function MarketplaceShell({
  title,
  eyebrow,
  children,
  showSummary = true,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  showSummary?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    state,
    role,
    currentUser,
    currentUserId,
    currentAssetCount,
    visibleContacts,
    query,
    sector,
    region,
    sectors,
    regions,
    isLoading,
    isSyncing,
    switchRole,
    switchUser,
    resetDemo,
    setQuery,
    setSector,
    setRegion,
  } = useMarketplace();

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-[#17130f]">
      <header className="border-b border-[#e3ddd4] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#9b6a2e]">
                <ShieldCheck className="h-4 w-4" />
                N5Deal
              </div>
              <h1 className="mt-2 text-3xl font-semibold lg:text-4xl">{title}</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex h-11 items-center gap-2 rounded-md border border-[#d8c7b4] bg-[#fffaf3] px-3 text-sm font-semibold">
                Role
                <select value={role} onChange={(event) => switchRole(event.target.value as Role)} className="bg-transparent outline-none">
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="manager">Platform Manager</option>
                </select>
              </label>
              <select
                value={currentUserId}
                onChange={(event) => switchUser(event.target.value)}
                className="h-11 rounded-md border border-[#d8c7b4] bg-white px-3 text-sm font-semibold"
              >
                {state.participants
                  .filter((participant) => participant.role === role && (role === "manager" || participant.status !== "removed"))
                  .map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.company}
                    </option>
                  ))}
              </select>
              <Button
                className="h-11"
                onClick={resetDemo}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                Reset demo
              </Button>
              <Button className="h-11" onClick={() => router.push("/signup")} variant={pathname === "/signup" ? "primary" : "secondary"} type="button">
                Sign up
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-[#67594d]">
            {isLoading ? (
              <>
                <SkeletonBlock className="h-10 w-36" />
                <SkeletonBlock className="h-10 w-60" />
                <SkeletonBlock className="h-10 w-28" />
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/assets")}
                  className={clsx("rounded-md px-3 py-2", pathname === "/assets" || pathname === "/" ? "bg-[#17130f] text-white" : "bg-[#f3eee7]")}
                  type="button"
                >
                  {roleLabel(role)}
                </button>
                <span className="rounded-md bg-[#f3eee7] px-3 py-2">
                  {currentUser?.name} · {currentUser?.location}
                </span>
              </>
            )}
            {!isLoading && role === "buyer" && (
              <button
                onClick={() => router.push("/profile")}
                className={clsx("rounded-md px-3 py-2", pathname === "/profile" ? "bg-[#17130f] text-white" : "bg-[#f3eee7]")}
                type="button"
              >
                Profile
              </button>
            )}
            <button
              onClick={() => router.push("/assets")}
              className={clsx("rounded-md px-3 py-2", pathname.startsWith("/assets/") ? "bg-[#17130f] text-white" : "bg-[#f3eee7]")}
              type="button"
            >
              {currentAssetCount} assets
            </button>
            <button
              onClick={() => router.push("/chats")}
              className={clsx("rounded-md px-3 py-2", pathname.startsWith("/chats") ? "bg-[#17130f] text-white" : "bg-[#f3eee7]")}
              type="button"
            >
              {visibleContacts.length} chats
            </button>
            {isSyncing && <span className="rounded-md bg-[#fff1d8] px-3 py-2 text-[#8f5f28]">Syncing...</span>}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-md border border-[#ded6cc] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-[#a76721]" />
              Filters
            </div>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#8d8177]" />
              <TextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={role === "seller" ? "Find buyers..." : "Find assets..."}
                className="mt-0 pl-9"
              />
            </div>
            {role !== "seller" && (
              <div className="mt-3 grid gap-3">
                <SelectInput value={sector} onChange={(event) => setSector(event.target.value)} className="mt-0">
                  <option value="all">All sectors</option>
                  {sectors.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </SelectInput>
                <SelectInput value={region} onChange={(event) => setRegion(event.target.value)} className="mt-0">
                  <option value="all">All regions</option>
                  {regions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </SelectInput>
              </div>
            )}
          </div>

          <div className="rounded-md border border-[#ded6cc] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-[#a76721]" />
              Smart signal
            </div>
            <p className="mt-2 text-sm leading-6 text-[#67594d]">
              {role === "buyer"
                ? "Listings are ranked by sector, region and ticket fit."
                : role === "seller"
                  ? "Buyer cards expose mandate fit for focused outreach."
                  : "Manager view keeps participant compliance visible."}
            </p>
          </div>
        </aside>

        <div className="space-y-5">
          {showSummary && (
            <div className="rounded-md border border-[#ded6cc] bg-white p-4">
              {isLoading ? (
                <>
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="mt-3 h-8 w-64" />
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{eyebrow}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
                </>
              )}
            </div>
          )}
          {children}
        </div>
      </section>
    </main>
  );
}
