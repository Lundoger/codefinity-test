import type { User } from "./types.js";

export const BOT_IDS = {
  echo: "bot-echo",
  reverse: "bot-reverse",
  spam: "bot-spam",
  ignore: "bot-ignore",
} as const;

export type BotId = (typeof BOT_IDS)[keyof typeof BOT_IDS];

export const botUsers: User[] = [
  {
    id: BOT_IDS.echo,
    name: "Echo bot",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=echo-bot",
    isBot: true,
    isOnline: true,
  },
  {
    id: BOT_IDS.reverse,
    name: "Reverse bot",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=reverse-bot",
    isBot: true,
    isOnline: true,
  },
  {
    id: BOT_IDS.spam,
    name: "Spam bot",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=spam-bot",
    isBot: true,
    isOnline: true,
  },
  {
    id: BOT_IDS.ignore,
    name: "Ignore bot",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=ignore-bot",
    isBot: true,
    isOnline: true,
  },
];
