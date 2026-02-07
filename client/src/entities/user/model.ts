export type UserId = string;

export type User = {
  id: UserId;
  name: string;
  avatar: string;
  isBot: boolean;
  isOnline: boolean;
};
