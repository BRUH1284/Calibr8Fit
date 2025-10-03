import { useProfile } from "@/features/profile/hooks/useProfile";
import { useFriends } from "@/features/social";
import UserSearchScreen from "@/shared/components/UserSearchScreen";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export default function Friends({
  isCurrentUser,
}: {
  isCurrentUser?: boolean;
}) {
  const { profileSettings } = useProfile();
  const { searchUserFriends } = useFriends();

  const { username: usernameParam } = useLocalSearchParams();
  const username = isCurrentUser ? profileSettings?.username : usernameParam;

  const handleUserPress = useCallback(
    async (username: string) => {
      if (username === profileSettings?.username)
        router.push("/profile/myProfile");
      else router.push(`/profile/${username}`);
    },
    [profileSettings?.username],
  );

  return (
    <UserSearchScreen
      loadPage={(query, page, pageSize) =>
        searchUserFriends(username as string, query, page, pageSize)
      }
      pageSize={10}
      onUserPress={handleUserPress}
    />
  );
}
