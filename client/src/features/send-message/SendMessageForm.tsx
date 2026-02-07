import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { useSocket } from "../../app/providers/SocketProvider";
import { useChatStore } from "../../processes/realtime/model";

export const SendMessageForm = () => {
  const socket = useSocket();
  const activeChatId = useChatStore((state) => state.activeChatId);
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !activeChatId) return;
    socket.emit("message:send", { toId: activeChatId, text: trimmed });
    socket.emit("typing:stop", { toId: activeChatId });
    isTypingRef.current = false;
    setText("");
  };

  useEffect(() => {
    if (!activeChatId) return;

    if (!text.trim()) {
      if (isTypingRef.current) {
        socket.emit("typing:stop", { toId: activeChatId });
        isTypingRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    if (!isTypingRef.current) {
      socket.emit("typing:start", { toId: activeChatId });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        socket.emit("typing:stop", { toId: activeChatId });
        isTypingRef.current = false;
      }
    }, 1200);
  }, [activeChatId, socket, text]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && activeChatId) {
        socket.emit("typing:stop", { toId: activeChatId });
        isTypingRef.current = false;
      }
    };
  }, [activeChatId, socket]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-slate-200 p-4"
    >
      <Input
        placeholder="Start chatting!"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Button
        className="whitespace-nowrap"
        type="submit"
        disabled={!text.trim() || !activeChatId}
      >
        Send message
      </Button>
    </form>
  );
};
