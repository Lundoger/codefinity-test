export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL?.toString() ?? "http://localhost:3000";

export const SESSION_STORAGE_KEY = "chat-session";
