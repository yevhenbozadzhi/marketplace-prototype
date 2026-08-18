"use client";

import { BuyerListings } from "./BuyerListings";
import { ManagerDashboard } from "./ManagerDashboard";
import { SellerDashboard } from "./SellerDashboard";
import { useMarketplace } from "./MarketplaceProvider";
import { ListingGridSkeleton, ManagerTableSkeleton } from "@/components/ui/Skeleton";

export function MarketplaceHome() {
  const { isLoading, role } = useMarketplace();

  if (isLoading && role === "manager") return <ManagerTableSkeleton />;
  if (isLoading) return <ListingGridSkeleton />;

  if (role === "seller") return <SellerDashboard />;
  if (role === "manager") return <ManagerDashboard />;
  return <BuyerListings />;
}
