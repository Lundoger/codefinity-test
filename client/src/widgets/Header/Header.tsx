import { useChatStore } from "../../processes/realtime/model";

export const Header = () => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const contacts = useChatStore((state) => state.contacts);

  const activeContact = contacts.find((contact) => contact.id === activeChatId);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-400">
      {activeContact ? (
        <div className="flex w-full basis-full gap-3">
          <img
            src={activeContact.avatar}
            alt={activeContact.name}
            className="h-30 w-30 basis-[120px] border border-slate-200 bg-slate-100"
          />
          <div className="flex flex-1 basis-auto flex-col gap-2 py-2">
            <div className="text-xl font-semibold text-slate-900">
              {activeContact.name}
            </div>
            <div className="text-xs text-slate-900">
              {activeContact.isOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
};
