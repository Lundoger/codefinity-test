import { useEffect, useMemo, useRef } from "react";
import { Header } from "../Header/Header";
import { SendMessageForm } from "../../features/send-message/SendMessageForm";
import { useChatStore } from "../../processes/realtime/model";
import { buildChatKey } from "../../entities/chat/model";
import { cn, formatTime } from "../../shared/lib/utils";

export const ChatWindow = () => {
  const currentUser = useChatStore((state) => state.currentUser);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const messagesByChat = useChatStore((state) => state.messagesByChat);
  const contacts = useChatStore((state) => state.contacts);
  const typingByChat = useChatStore((state) => state.typingByChat);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => {
    if (!currentUser || !activeChatId) return [];
    const key = buildChatKey(currentUser.id, activeChatId);
    return messagesByChat[key] ?? [];
  }, [activeChatId, currentUser, messagesByChat]);

  const nameById = useMemo(() => {
    const map: Record<string, string> = {};
    if (currentUser) {
      map[currentUser.id] = currentUser.name;
    }
    contacts.forEach((contact) => {
      map[contact.id] = contact.name;
    });
    return map;
  }, [contacts, currentUser]);

  const typingNames = useMemo(() => {
    if (!currentUser || !activeChatId) return [];
    const key = buildChatKey(currentUser.id, activeChatId);
    const ids = typingByChat[key] ?? [];
    const names = ids
      .filter((id) => id !== currentUser.id)
      .map((id) => nameById[id] ?? "Unknown user");
    return Array.from(new Set(names));
  }, [activeChatId, currentUser, nameById, typingByChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-slate-100">
      <Header />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {!activeChatId ? (
          <div className="mt-20 text-center text-sm text-slate-400">
            Choose a contact on the right to start chatting.
          </div>
        ) : messages.length === 0 ? (
          <div className="mt-20 text-center text-sm text-slate-400">
            No messages yet
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isOutgoing = message.fromId === currentUser?.id;
              const senderName = nameById[message.fromId] ?? "Unknown user";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isOutgoing ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "flex max-w-[72%] flex-col",
                      isOutgoing ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "w-full overflow-hidden rounded-xl shadow",
                        isOutgoing ? "bg-white" : "bg-white"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-between px-3 py-1 text-[11px] font-semibold",
                          isOutgoing
                            ? "bg-orange-200 text-slate-700"
                            : "bg-slate-200 text-slate-600"
                        )}
                      >
                        <span className="truncate">{senderName}</span>
                        <span className="ml-3 shrink-0 font-medium text-slate-500">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                      <div className="relative bg-white px-3 py-2 text-sm text-slate-700">
                        <span
                          aria-hidden
                          className={cn(
                            "absolute top-3 h-3 w-3 rotate-45 bg-white",
                            isOutgoing ? "-right-1" : "-left-1"
                          )}
                        />
                        <div className="whitespace-pre-wrap">{message.text}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </div>
      {typingNames.length > 0 && (
        <div className="px-6 pb-2 text-xs text-slate-400">
          {typingNames.length === 1
            ? `${typingNames[0]} is typing...`
            : `${typingNames.join(", ")} are typing...`}
        </div>
      )}
      <SendMessageForm />
    </section>
  );
};
