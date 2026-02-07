import { io, Socket } from "socket.io-client";
import type { Message } from "../../entities/message/model";
import type { User, UserId } from "../../entities/user/model";
import { SOCKET_URL } from "../config/constants";

export type SessionInitPayload = {
  userId?: string;
  name?: string;
  avatar?: string;
};

export type ClientToServerEvents = {
  "session:init": (
    payload: SessionInitPayload,
    ack: (user: User) => void
  ) => void;
  "chat:open": (
    payload: { peerId: string },
    ack: (messages: Message[]) => void
  ) => void;
  "message:send": (payload: { toId: string; text: string }) => void;
  "typing:start": (payload: { toId: UserId }) => void;
  "typing:stop": (payload: { toId: UserId }) => void;
};

export type ServerToClientEvents = {
  "contacts:list": (contacts: User[]) => void;
  "contacts:update": (contacts: User[]) => void;
  "chat:history": (messages: Message[]) => void;
  "message:new": (message: Message) => void;
  "presence:update": (payload: { userId: string; online: boolean }) => void;
  "typing:start": (payload: { fromId: UserId; toId: UserId }) => void;
  "typing:stop": (payload: { fromId: UserId; toId: UserId }) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const createSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false, transports: ["websocket"] });
  }
  return socket;
};

export const getSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};
