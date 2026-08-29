import { ChatView } from "@/components/marketplace/ChatView";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";

export default async function ChatPage({ params }: PageProps<"/chats/[id]">) {
  const { id } = await params;

  return (
    <MarketplaceShell title="Chats" eyebrow="Secure communication" showSummary={false}>
      <ChatView chatId={id} />
    </MarketplaceShell>
  );
}
