import { useUser } from "@/features/social";
import { UserSummary } from "@/features/social/types/user";
import UserSearchScreen from "@/shared/components/UserSearchScreen";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export default function UserSearch() {
  const { searchUsers } = useUser();

  const [foundUsers, setFoundUsers] = useState<UserSummary[]>([]);

  const handleQueryChange = useCallback(async (text: string) => {
    setFoundUsers(await searchUsers(text));
  }, [searchUsers]);

  const handleUserPress = useCallback(async (username: string) => {
    router.push(`/profile/${username}`);
  }, [router]);

  return (
    <UserSearchScreen
      onQueryChange={handleQueryChange}
      listData={foundUsers}
      onUserPress={handleUserPress}
    />
  );
}