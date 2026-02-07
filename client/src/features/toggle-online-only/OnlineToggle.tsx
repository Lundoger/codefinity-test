import { useChatStore } from "../../processes/realtime/model";
import { cn } from "../../shared/lib/utils";

export const OnlineToggle = () => {
  const onlineOnly = useChatStore((state) => state.onlineOnly);
  const setOnlineOnly = useChatStore((state) => state.setOnlineOnly);

  return (
    <div className="flex rounded-md bg-slate-200 p-1 text-xs font-medium">
      <button
        type="button"
        onClick={() => setOnlineOnly(false)}
        className={cn(
          "flex-1 rounded-md px-2 py-1 text-slate-600",
          !onlineOnly && "bg-white text-slate-900 shadow"
        )}
      >
        All
      </button>
      <button
        type="button"
        onClick={() => setOnlineOnly(true)}
        className={cn(
          "flex-1 rounded-md px-2 py-1 text-slate-600",
          onlineOnly && "bg-white text-slate-900 shadow"
        )}
      >
        Online
      </button>
    </div>
  );
};
