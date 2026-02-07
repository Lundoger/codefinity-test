import type { UserId } from "../user/model";

export type ChatKey = string;

export const buildChatKey = (a: UserId, b: UserId): ChatKey =>
  [a, b].sort().join("__");
