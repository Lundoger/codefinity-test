import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { Socket } from "socket.io-client";
import { createSocket } from "../../shared/api/socket";
import {
  getOrCreateSession,
  persistSession,
} from "../../processes/session/model";
import { useChatStore } from "../../processes/realtime/model";
import { buildChatKey } from "../../entities/chat/model";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../shared/api/socket";

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SocketContext = createContext<TypedSocket | null>(null);

export const useSocket = (): TypedSocket => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("SocketProvider is missing");
  }
  return socket;
};

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const socket = useMemo(() => createSocket(), []);
  const setCurrentUser = useChatStore((state) => state.setCurrentUser);
  const setContacts = useChatStore((state) => state.setContacts);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const setMessagesForChat = useChatStore((state) => state.setMessagesForChat);
  const updatePresence = useChatStore((state) => state.updatePresence);
  const setTypingStatus = useChatStore((state) => state.setTypingStatus);
  const setConnectionStatus = useChatStore(
    (state) => state.setConnectionStatus
  );

  useEffect(() => {
    const session = getOrCreateSession();
    setConnectionStatus("connecting");
    socket.connect();

    const onConnect = () => {
      setConnectionStatus("connected");
      socket.emit("session:init", session, (user) => {
        setCurrentUser(user);
        persistSession(user);
      });
    };

    const onDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    const onContacts = (
      contacts: Parameters<ServerToClientEvents["contacts:list"]>[0]
    ) => {
      setContacts(contacts);
    };

    const onPresenceUpdate = (
      payload: Parameters<ServerToClientEvents["presence:update"]>[0]
    ) => {
      updatePresence(payload.userId, payload.online);
    };

    const onMessageNew = (
      message: Parameters<ServerToClientEvents["message:new"]>[0]
    ) => {
      const key = buildChatKey(message.fromId, message.toId);
      appendMessage(key, message);
      setTypingStatus(key, message.fromId, false);
    };

    const onChatHistory = (
      history: Parameters<ServerToClientEvents["chat:history"]>[0]
    ) => {
      const { currentUser, activeChatId } = useChatStore.getState();
      if (!currentUser || !activeChatId) return;
      const key = buildChatKey(currentUser.id, activeChatId);
      setMessagesForChat(key, history);
    };

    const onTypingStart = (
      payload: Parameters<ServerToClientEvents["typing:start"]>[0]
    ) => {
      const key = buildChatKey(payload.fromId, payload.toId);
      setTypingStatus(key, payload.fromId, true);
    };

    const onTypingStop = (
      payload: Parameters<ServerToClientEvents["typing:stop"]>[0]
    ) => {
      const key = buildChatKey(payload.fromId, payload.toId);
      setTypingStatus(key, payload.fromId, false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("contacts:list", onContacts);
    socket.on("contacts:update", onContacts);
    socket.on("presence:update", onPresenceUpdate);
    socket.on("message:new", onMessageNew);
    socket.on("chat:history", onChatHistory);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("contacts:list", onContacts);
      socket.off("contacts:update", onContacts);
      socket.off("presence:update", onPresenceUpdate);
      socket.off("message:new", onMessageNew);
      socket.off("chat:history", onChatHistory);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      socket.disconnect();
    };
  }, [
    appendMessage,
    setConnectionStatus,
    setContacts,
    setCurrentUser,
    setMessagesForChat,
    setTypingStatus,
    socket,
    updatePresence,
  ]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
