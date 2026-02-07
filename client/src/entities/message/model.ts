import type { UserId } from "../user/model";

export type Message = {
  id: string;
  chatKey: string;
  fromId: UserId;
  toId: UserId;
  text: string;
  createdAt: number;
  status?: "sent" | "delivered" | "read";
};

export type MessagesByChat = Record<string, Message[]>;
