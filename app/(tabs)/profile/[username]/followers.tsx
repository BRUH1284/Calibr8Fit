import { useProfile } from "@/features/profile/hooks/useProfile";
import { useFollowers } from "@/features/social";
import UserSearchScreen from "@/shared/components/UserSearchScreen";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export default function Followers() {
  const { username } = useLocalSearchParams();

  const { profileSettings } = useProfile();
  const { searchFollowers } = useFollowers();

  const handleUserPress = useCallback(async (username: string) => {
    if (username === profileSettings?.username)
      router.push('/profile/myProfile');
    else
      router.push(`/profile/${username}`);
  }, [router]);

  return (
    <UserSearchScreen
      loadPage={(query, page, pageSize) => searchFollowers(username as string, query, page, pageSize)}
      pageSize={10}
      onUserPress={handleUserPress}
    />
  );
}