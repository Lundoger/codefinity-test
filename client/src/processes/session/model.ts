import { SESSION_STORAGE_KEY } from "../../shared/config/constants";
import type { User } from "../../entities/user/model";

export type StoredSession = {
  userId?: string;
  name: string;
  avatar: string;
};

const namePool = [
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

const createRandomName = (): string => {
  const tag = Math.floor(1000 + Math.random() * 9000);
  const base = namePool[Math.floor(Math.random() * namePool.length)];
  return `${base}-${tag}`;
};

const createAvatar = (seed: string): string =>
  `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}`;

export const getOrCreateSession = (): StoredSession => {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as StoredSession;
      if (parsed?.name && parsed?.avatar) {
        return parsed;
      }
    } catch {
      // ignore corrupted storage
    }
  }

  const name = createRandomName();
  const avatar = createAvatar(name);
  const session: StoredSession = { name, avatar };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
};

export const persistSession = (user: User): void => {
  const session: StoredSession = {
    userId: user.id,
    name: user.name,
    avatar: user.avatar,
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};
