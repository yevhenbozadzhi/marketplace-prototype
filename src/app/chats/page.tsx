import { ChatList } from "@/components/marketplace/ChatView";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";

export default function ChatsPage() {
  return (
    <MarketplaceShell title="Chats" eyebrow="Secure communication" showSummary={false}>
      <ChatList />
    </MarketplaceShell>
  );
}
