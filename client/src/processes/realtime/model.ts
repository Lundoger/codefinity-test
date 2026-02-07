import { create } from "zustand";
import type { MessagesByChat, Message } from "../../entities/message/model";
import type { User, UserId } from "../../entities/user/model";

export type ConnectionStatus = "connected" | "connecting" | "disconnected";

type ChatState = {
  currentUser: User | null;
  contacts: User[];
  activeChatId: UserId | null;
  messagesByChat: MessagesByChat;
  typingByChat: Record<string, UserId[]>;
  onlineOnly: boolean;
  searchQuery: string;
  connectionStatus: ConnectionStatus;
  setCurrentUser: (user: User) => void;
  setContacts: (contacts: User[]) => void;
  setActiveChatId: (chatId: UserId | null) => void;
  setMessagesForChat: (chatKey: string, messages: Message[]) => void;
  appendMessage: (chatKey: string, message: Message) => void;
  setTypingStatus: (chatKey: string, userId: UserId, isTyping: boolean) => void;
  setOnlineOnly: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setConnectionStatus: (value: ConnectionStatus) => void;
  updatePresence: (userId: UserId, online: boolean) => void;
};

export const useChatStore = create<ChatState>()((set) => ({
  currentUser: null,
  contacts: [],
  activeChatId: null,
  messagesByChat: {},
  typingByChat: {},
  onlineOnly: false,
  searchQuery: "",
  connectionStatus: "disconnected",
  setCurrentUser: (user) => set({ currentUser: user }),
  setContacts: (contacts) => set({ contacts }),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
  setMessagesForChat: (chatKey, messages) =>
    set((state) => ({
      messagesByChat: { ...state.messagesByChat, [chatKey]: messages },
    })),
  appendMessage: (chatKey, message) =>
    set((state) => {
      const list = state.messagesByChat[chatKey] ?? [];
      if (list.some((item) => item.id === message.id)) {
        return state;
      }
      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatKey]: [...list, message],
        },
      };
    }),
  setTypingStatus: (chatKey, userId, isTyping) =>
    set((state) => {
      const current = state.typingByChat[chatKey] ?? [];
      if (isTyping) {
        if (current.includes(userId)) return state;
        return {
          typingByChat: {
            ...state.typingByChat,
            [chatKey]: [...current, userId],
          },
        };
      }
      if (!current.includes(userId)) return state;
      const next = current.filter((id) => id !== userId);
      const nextMap = { ...state.typingByChat };
      if (next.length === 0) {
        delete nextMap[chatKey];
        return { typingByChat: nextMap };
      }
      nextMap[chatKey] = next;
      return { typingByChat: nextMap };
    }),
  setOnlineOnly: (value) => set({ onlineOnly: value }),
  setSearchQuery: (value) => set({ searchQuery: value }),
  setConnectionStatus: (value) => set({ connectionStatus: value }),
  updatePresence: (userId, online) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === userId ? { ...contact, isOnline: online } : contact
      ),
    })),
}));
