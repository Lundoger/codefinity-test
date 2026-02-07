import { ChatPage } from "../pages/ChatPage";
import { SocketProvider } from "./providers/SocketProvider";
import { StoreProvider } from "./providers/StoreProvider";

export const App = () => (
  <StoreProvider>
    <SocketProvider>
      <ChatPage />
    </SocketProvider>
  </StoreProvider>
);
