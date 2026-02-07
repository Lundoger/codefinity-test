import { ContactsSearch } from "../../features/filter-contacts/ContactsSearch";
import { OnlineToggle } from "../../features/toggle-online-only/OnlineToggle";
import { useSwitchChat } from "../../features/switch-chat/useSwitchChat";
import { useChatStore } from "../../processes/realtime/model";
import { cn } from "../../shared/lib/utils";

export const ContactsList = () => {
  const switchChat = useSwitchChat();
  const currentUser = useChatStore((state) => state.currentUser);
  const contacts = useChatStore((state) => state.contacts);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const onlineOnly = useChatStore((state) => state.onlineOnly);

  const filtered = contacts
    .filter((contact) => contact.id !== currentUser?.id)
    .filter((contact) => {
      if (onlineOnly && !contact.isOnline) return false;
      if (!searchQuery.trim()) return true;
      return contact.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
    });

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-t border-slate-200 bg-white md:border-t-0 md:border-l">
      <div className="p-4">
        <div className="mt-3 flex flex-col gap-3">
          <ContactsSearch />
          <OnlineToggle />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-400">
            No contacts found
          </div>
        ) : (
          <ul className="space-y-1 px-2 pb-4">
            {filtered.map((contact) => (
              <li key={contact.id}>
                <button
                  type="button"
                  onClick={() => switchChat(contact.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition",
                    activeChatId === contact.id
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100"
                    />
                    <span
                      className={cn(
                        "absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white",
                        contact.isOnline ? "bg-emerald-500" : "bg-slate-300"
                      )}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-xs text-slate-400">
                      {contact.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
