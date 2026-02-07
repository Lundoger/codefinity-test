import { ChatPageHeader } from "../widgets/ChatPageHeader/ChatPageHeader";
import { ContactsSidebar } from "../widgets/ContactsSidebar/ContactsSidebar";
import { ChatWindow } from "../widgets/ChatWindow/ChatWindow";

export const ChatPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex h-screen w-full max-w-6xl overflow-hidden bg-white">
        <div className="flex w-full flex-col">
          <ChatPageHeader />
          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <ChatWindow />
            <ContactsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};
