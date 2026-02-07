import { useChatStore } from "../../processes/realtime/model";

export const Header = () => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const contacts = useChatStore((state) => state.contacts);

  const activeContact = contacts.find((contact) => contact.id === activeChatId);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      {activeContact ? (
        <div className="flex items-center gap-3">
          <img
            src={activeContact.avatar}
            alt={activeContact.name}
            className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100"
          />
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {activeContact.name}
            </div>
            <div className="text-xs text-slate-400">
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
