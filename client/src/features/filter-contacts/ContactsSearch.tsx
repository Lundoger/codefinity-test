import { Input } from "../../shared/ui/Input";
import { useChatStore } from "../../processes/realtime/model";

export const ContactsSearch = () => {
  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);

  return (
    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
    />
  );
};
