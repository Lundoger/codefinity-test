import { useCallback } from "react";
import { useSocket } from "../../app/providers/SocketProvider";
import { buildChatKey } from "../../entities/chat/model";
import { useChatStore } from "../../processes/realtime/model";

export const useSwitchChat = () => {
  const socket = useSocket();
  const currentUser = useChatStore((state) => state.currentUser);
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const setMessagesForChat = useChatStore((state) => state.setMessagesForChat);

  return useCallback(
    (peerId: string) => {
      setActiveChatId(peerId);
      if (!currentUser) return;

      const key = buildChatKey(currentUser.id, peerId);
      setMessagesForChat(key, []);

      socket.emit("chat:open", { peerId }, (history) => {
        setMessagesForChat(key, history);
      });
    },
    [currentUser, setActiveChatId, setMessagesForChat, socket]
  );
};
