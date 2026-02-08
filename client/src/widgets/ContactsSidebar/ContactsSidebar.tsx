import { useState } from "react";
import { ContactsList } from "../ContactsList/ContactsList";

export const ContactsSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full md:w-[320px]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 md:hidden"
        aria-expanded={isOpen}
        aria-controls="contacts-sidebar-panel"
      >
        <span>Contacts</span>
        <span className="text-xs text-slate-400">
          {isOpen ? "Hide" : "Show"}
        </span>
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close contacts"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setIsOpen(false)}
          />
          <div
            id="contacts-sidebar-panel"
            className="absolute right-0 bottom-0 flex h-[70vh] w-full flex-col rounded-t-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-semibold text-slate-700">
                Contacts
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-500"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <ContactsList />
            </div>
          </div>
        </div>
      )}
      <div className="hidden h-full md:block">
        <ContactsList />
      </div>
    </div>
  );
};
