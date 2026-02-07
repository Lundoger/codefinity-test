import { ContactsList } from "../widgets/ContactsList/ContactsList";
import { ChatWindow } from "../widgets/ChatWindow/ChatWindow";
import { useChatStore } from "../processes/realtime/model";

export const ChatPage = () => {
  const currentUser = useChatStore((state) => state.currentUser);
  const connectionStatus = useChatStore((state) => state.connectionStatus);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="flex h-[720px] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Reverse bot</span>
              <span className="text-xs text-slate-400">Chat UI MVP</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {currentUser && (
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-6 w-6 rounded-full border border-slate-200 bg-slate-100"
                  />
                  <span>{currentUser.name}</span>
                </div>
              )}
              <span
                className={
                  connectionStatus === "connected"
                    ? "text-emerald-600"
                    : connectionStatus === "connecting"
                      ? "text-amber-500"
                      : "text-rose-500"
                }
              >
                {connectionStatus}
              </span>
            </div>
          </div>
          <div className="flex min-h-0 flex-1">
            <ChatWindow />
            <div className="w-[320px]">
              <ContactsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
