import { useChatStore } from "../../processes/realtime/model";
import type { ConnectionStatus } from "../../processes/realtime/model";

const statusClassMap: Record<ConnectionStatus, string> = {
  connected: "text-emerald-600",
  connecting: "text-amber-500",
  disconnected: "text-rose-500",
};

export const ChatPageHeader = () => {
  const currentUser = useChatStore((state) => state.currentUser);
  const connectionStatus = useChatStore((state) => state.connectionStatus);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
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
        <span className={statusClassMap[connectionStatus]}>
          {connectionStatus}
        </span>
      </div>
    </div>
  );
};
