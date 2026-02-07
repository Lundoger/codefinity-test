import { ChatPage } from "../pages/ChatPage";
import { SocketProvider } from "./providers/SocketProvider";

export const App = () => (
  <SocketProvider>
    <ChatPage />
  </SocketProvider>
);
