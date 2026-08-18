"use client";

import clsx from "clsx";
import { MessageSquare, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChatSkeleton, ListingGridSkeleton } from "@/components/ui/Skeleton";
import { useMarketplace } from "./MarketplaceProvider";

export function ChatList() {
  const router = useRouter();
  const { isLoading, role, visibleContacts, getCounterparty, getAsset, t } = useMarketplace();

  if (isLoading) return <ListingGridSkeleton />;

  if (!visibleContacts.length) {
    return (
      <section className="rounded-md border border-[#ded6cc] bg-white p-8 text-center shadow-sm">
        <MessageSquare className="mx-auto h-8 w-8 text-[#a76721]" />
        <h2 className="mt-3 text-xl font-semibold">{t("noChats")}</h2>
        <p className="mt-2 text-sm text-[#67594d]">
          {role === "manager" ? t("noChatsManager") : t("noChatsUser")}
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {visibleContacts.map((contact) => {
        const other = getCounterparty(contact);
        const asset = contact.assetId ? getAsset(contact.assetId) : undefined;
        return (
          <button
            key={contact.id}
            onClick={() => router.push(`/chats/${contact.id}`)}
            className="rounded-md border border-[#ded6cc] bg-white p-5 text-left shadow-sm hover:bg-[#fffaf3]"
            type="button"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{t("secureChat")}</p>
            <h2 className="mt-2 text-xl font-semibold">{other?.company ?? t("marketplaceParticipant")}</h2>
            <p className="mt-2 text-sm text-[#67594d]">{asset?.title ?? t("generalConversation")}</p>
          </button>
        );
      })}
    </div>
  );
}

export function ChatView({ chatId }: { chatId: string }) {
  const { currentUser, isLoading, visibleContacts, getCounterparty, sendChatMessage, canUseChat, t } = useMarketplace();
  const chat = visibleContacts.find((contact) => contact.id === chatId);
  const isWritable = chat ? canUseChat(chat) : false;
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [chat?.message]);

  if (isLoading) return <ChatSkeleton />;

  if (!chat) {
    return (
      <section className="rounded-md border border-[#ded6cc] bg-white p-8 text-center shadow-sm">
        <MessageSquare className="mx-auto h-8 w-8 text-[#a76721]" />
        <h2 className="mt-3 text-xl font-semibold">{t("chatUnavailable")}</h2>
        <p className="mt-2 text-sm text-[#67594d]">{t("chatUnavailableText")}</p>
      </section>
    );
  }

  return (
    <section className="flex h-[620px] max-h-[calc(100vh-260px)] min-h-[460px] flex-col rounded-md border border-[#ded6cc] bg-white shadow-sm">
      <div className="shrink-0 flex items-center justify-between border-b border-[#ded6cc] p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{t("secureChat")}</p>
          <h2 className="mt-1 text-lg font-semibold">{getCounterparty(chat)?.company ?? t("marketplaceParticipant")}</h2>
        </div>
        <MessageSquare className="h-5 w-5 text-[#a76721]" />
      </div>
      <div ref={messagesRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {chat.message.split("\n\n").map((message, index) => (
          <div
            key={`${chat.id}-${index}`}
            className={clsx(
              "max-w-[85%] rounded-md px-3 py-2 text-sm leading-6",
              message.startsWith(currentUser?.company ?? "") ? "ml-auto bg-[#17130f] text-white" : "bg-[#f3eee7] text-[#17130f]",
            )}
          >
            {message}
          </div>
        ))}
      </div>
      {!isWritable && (
        <p className="border-t border-[#ded6cc] bg-[#fff1d8] px-4 py-3 text-sm font-semibold text-[#8f5f28]">
          {t("chatReadonly")}
        </p>
      )}
      <form onSubmit={(event) => sendChatMessage(chat.id, event)} className="shrink-0 flex gap-2 border-t border-[#ded6cc] p-4">
        <input disabled={!isWritable} name="message" placeholder={t("writeMessage")} className="h-11 flex-1 rounded-md border border-[#d8c7b4] px-3 text-sm outline-none focus:border-[#17130f] disabled:bg-[#f3eee7]" />
        <button disabled={!isWritable} className="inline-flex h-11 items-center gap-2 rounded-md bg-[#17130f] px-4 text-sm font-semibold text-white disabled:bg-[#8d8177]" type="submit">
          <Send className="h-4 w-4" />
          {t("send")}
        </button>
      </form>
    </section>
  );
}
