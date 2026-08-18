import type { Metadata } from "next";
import { MarketplaceProvider } from "@/components/marketplace/MarketplaceProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "N5Deal Marketplace Prototype",
  description: "A working M&A marketplace prototype with buyer, seller and manager flows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <MarketplaceProvider>{children}</MarketplaceProvider>
      </body>
    </html>
  );
}
