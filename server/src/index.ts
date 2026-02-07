import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { BOT_IDS, botUsers } from "./bots.js";
import type {
  ClientToServerEvents,
  Contact,
  Message,
  ServerToClientEvents,
  SocketData,
  User,
  UserId,
} from "./types.js";

const PORT = Number(process.env.PORT ?? 3000);
const CHAT_HISTORY_LIMIT = 50;

const app = express();
app.use(cors());
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
  httpServer,
  {
    cors: { origin: "*" },
  }
);

const users = new Map<UserId, User>();
const socketIdToUserId = new Map<string, UserId>();
const messages = new Map<string, Message[]>();
const spamActivatedUserIds = new Set<UserId>();

const botById = new Map<UserId, User>(botUsers.map((bot) => [bot.id, bot]));
botUsers.forEach((bot) => users.set(bot.id, bot));

const randomNamePool = [
  "Nova",
  "Pixel",
  "Echo",
  "Comet",
  "Luna",
  "Orbit",
  "Frost",
  "Blaze",
  "Drift",
  "Zen",
];

const randomAvatar = (seed: string): string =>
  `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}`;

const createRandomName = (): string => {
  const tag = Math.floor(1000 + Math.random() * 9000);
  const base = randomNamePool[Math.floor(Math.random() * randomNamePool.length)];
  return `${base}-${tag}`;
};

const chatKey = (a: UserId, b: UserId): string => [a, b].sort().join("__");

const contactsSnapshot = (): Contact[] =>
  Array.from(users.values()).map(({ socketId: _socketId, ...rest }) => rest);

const emitContactsUpdate = (): void => {
  io.emit("contacts:update", contactsSnapshot());
};

const emitPresence = (userId: UserId, online: boolean): void => {
  io.emit("presence:update", { userId, online });
};

const storeMessage = (message: Message): void => {
  const list = messages.get(message.chatKey);
  if (list) {
    list.push(message);
  } else {
    messages.set(message.chatKey, [message]);
  }
};

const getHistory = (key: string): Message[] => {
  const list = messages.get(key) ?? [];
  return list.slice(-CHAT_HISTORY_LIMIT);
};

const createMessage = (fromId: UserId, toId: UserId, text: string): Message => ({
  id: randomUUID(),
  chatKey: chatKey(fromId, toId),
  fromId,
  toId,
  text,
  createdAt: Date.now(),
});

const sendToUser = (userId: UserId, message: Message): void => {
  const user = users.get(userId);
  if (!user?.socketId) return;
  io.to(user.socketId).emit("message:new", message);
};

const emitTyping = (toId: UserId, fromId: UserId, isTyping: boolean): void => {
  const user = users.get(toId);
  if (!user?.socketId) return;
  io.to(user.socketId).emit(isTyping ? "typing:start" : "typing:stop", {
    fromId,
    toId,
  });
};

const handleBotReply = (botId: UserId, fromUserId: UserId, text: string): void => {
  if (botId === BOT_IDS.ignore) return;
  if (botId === BOT_IDS.spam) return;

  const respond = (reply: string): void => {
    const botMessage = createMessage(botId, fromUserId, reply);
    storeMessage(botMessage);
    sendToUser(fromUserId, botMessage);
  };

  if (botId === BOT_IDS.echo) {
    respond(text);
    return;
  }

  if (botId === BOT_IDS.reverse) {
    emitTyping(fromUserId, botId, true);
    setTimeout(() => {
      respond(text.split("").reverse().join(""));
      emitTyping(fromUserId, botId, false);
    }, 3000);
  }
};

const activateSpamForUser = (userId: UserId): void => {
  if (spamActivatedUserIds.has(userId)) return;
  spamActivatedUserIds.add(userId);
  const spamText = `Spam message ${Math.floor(Math.random() * 900 + 100)}`;
  const spamMessage = createMessage(BOT_IDS.spam, userId, spamText);
  storeMessage(spamMessage);
  sendToUser(userId, spamMessage);
};

const scheduleSpam = (): void => {
  const nextDelay = Math.floor(10000 + Math.random() * 110000);
  setTimeout(() => {
    spamActivatedUserIds.forEach((userId) => {
      const spamText = `Spam message ${Math.floor(Math.random() * 900 + 100)}`;
      const spamMessage = createMessage(BOT_IDS.spam, userId, spamText);
      storeMessage(spamMessage);
      sendToUser(userId, spamMessage);
    });
    scheduleSpam();
  }, nextDelay);
};

scheduleSpam();

io.on("connection", (socket) => {
  socket.on("session:init", (payload, ack) => {
    const existing =
      payload.userId && users.has(payload.userId) ? users.get(payload.userId) : undefined;
    const userId = existing?.id ?? randomUUID();
    const user: User = {
      id: userId,
      name: payload.name?.trim() || existing?.name || createRandomName(),
      avatar: payload.avatar || existing?.avatar || randomAvatar(userId),
      isBot: false,
      isOnline: true,
      socketId: socket.id,
    };

    users.set(userId, user);
    socketIdToUserId.set(socket.id, userId);
    socket.data.userId = userId;

    ack(user);
    socket.emit("contacts:list", contactsSnapshot());
    emitPresence(userId, true);
    emitContactsUpdate();
  });

  socket.on("chat:open", ({ peerId }, ack) => {
    const currentUserId = socket.data.userId;
    if (!currentUserId) {
      ack([]);
      return;
    }
    if (peerId === BOT_IDS.spam) {
      activateSpamForUser(currentUserId);
    }
    const history = getHistory(chatKey(currentUserId, peerId));
    socket.emit("chat:history", history);
    ack(history);
  });

  socket.on("message:send", ({ toId, text }) => {
    const currentUserId = socket.data.userId;
    if (!currentUserId) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!users.has(toId)) return;

    const message = createMessage(currentUserId, toId, trimmed);
    storeMessage(message);
    sendToUser(currentUserId, message);
    sendToUser(toId, message);
    emitTyping(toId, currentUserId, false);

    if (toId === BOT_IDS.spam) {
      activateSpamForUser(currentUserId);
    }

    if (botById.has(toId)) {
      handleBotReply(toId, currentUserId, trimmed);
    }
  });

  socket.on("typing:start", ({ toId }) => {
    const currentUserId = socket.data.userId;
    if (!currentUserId) return;
    if (!users.has(toId)) return;
    emitTyping(toId, currentUserId, true);
  });

  socket.on("typing:stop", ({ toId }) => {
    const currentUserId = socket.data.userId;
    if (!currentUserId) return;
    if (!users.has(toId)) return;
    emitTyping(toId, currentUserId, false);
  });

  socket.on("disconnect", () => {
    const userId = socketIdToUserId.get(socket.id);
    if (!userId) return;
    const user = users.get(userId);
    if (!user) return;

    users.set(userId, { ...user, isOnline: false, socketId: undefined });
    socketIdToUserId.delete(socket.id);
    emitPresence(userId, false);
    emitContactsUpdate();
  });
});

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
