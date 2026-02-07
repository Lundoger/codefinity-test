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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => {
    if (!currentUser || !activeChatId) return [];
    const key = buildChatKey(currentUser.id, activeChatId);
    return messagesByChat[key] ?? [];
  }, [activeChatId, currentUser, messagesByChat]);

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
                      "max-w-[70%] rounded-lg px-4 py-2 text-sm shadow",
                      isOutgoing
                        ? "bg-slate-600 text-white"
                        : "bg-white text-slate-700"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div
                      className={cn(
                        "mt-1 text-[10px]",
                        isOutgoing ? "text-slate-200" : "text-slate-400"
                      )}
                    >
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </div>
      <SendMessageForm />
    </section>
  );
};
