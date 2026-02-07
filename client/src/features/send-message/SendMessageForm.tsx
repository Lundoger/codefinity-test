import { useState, type FormEvent } from "react";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { useSocket } from "../../app/providers/SocketProvider";
import { useChatStore } from "../../processes/realtime/model";

export const SendMessageForm = () => {
  const socket = useSocket();
  const activeChatId = useChatStore((state) => state.activeChatId);
  const [text, setText] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !activeChatId) return;
    socket.emit("message:send", { toId: activeChatId, text: trimmed });
    setText("");
  };

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
      <Button type="submit" disabled={!text.trim() || !activeChatId}>
        Send message
      </Button>
    </form>
  );
};
