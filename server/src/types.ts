export type UserId = string;

export type User = {
  id: UserId;
  name: string;
  avatar: string;
  isBot: boolean;
  isOnline: boolean;
  socketId?: string;
};

export type Message = {
  id: string;
  chatKey: string;
  fromId: UserId;
  toId: UserId;
  text: string;
  createdAt: number;
  status?: "sent" | "delivered" | "read";
};

export type SessionInitPayload = {
  userId?: string;
  name?: string;
  avatar?: string;
};

export type Contact = Omit<User, "socketId">;

export type ClientToServerEvents = {
  "session:init": (payload: SessionInitPayload, ack: (user: User) => void) => void;
  "chat:open": (payload: { peerId: UserId }, ack: (messages: Message[]) => void) => void;
  "message:send": (payload: { toId: UserId; text: string }) => void;
  "typing:start": (payload: { toId: UserId }) => void;
  "typing:stop": (payload: { toId: UserId }) => void;
};

export type ServerToClientEvents = {
  "contacts:list": (contacts: Contact[]) => void;
  "contacts:update": (contacts: Contact[]) => void;
  "chat:history": (messages: Message[]) => void;
  "message:new": (message: Message) => void;
  "presence:update": (payload: { userId: UserId; online: boolean }) => void;
  "typing:start": (payload: { fromId: UserId; toId: UserId }) => void;
  "typing:stop": (payload: { fromId: UserId; toId: UserId }) => void;
};

export type InterServerEvents = Record<string, never>;
export type SocketData = { userId?: UserId };
