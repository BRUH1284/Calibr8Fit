import { useFriends, useUser } from "@/features/social";
import PressableCount from "@/features/social/components/PressableCount";
import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import TextButton from "@/shared/components/TextButton";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";

export default function MyProfile() {
  const theme = useTheme();

  const { currentUser, fetchCurrentUserProfile } = useUser();
  const { pendingFriendRequests } = useFriends();

  const { logout } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCurrentUserProfile();
    setRefreshing(false);
  }, [fetchCurrentUserProfile]);

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={{ paddingBottom: 32 }}
      ListHeaderComponentStyle={{
        flex: 1,
        backgroundColor: theme.surface,
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
      ListHeaderComponent={
        <>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <AppText
              type="title-large-bold"
              style={{ flex: 1 }}
            >{`@${currentUser?.username}`}</AppText>
            <IconButton
              icon={{
                name: "search",
                library: "MaterialIcons",
                size: 28,
              }}
              variant="icon"
              onPress={() => router.push("/profile/userSearch")}
            />
            <IconButton
              icon={{
                name: "settings",
                library: "MaterialIcons",
                size: 28,
              }}
              variant="icon"
              onPress={() => { }}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Image
              source={{ uri: currentUser?.profilePictureUrl }}
              placeholder={require("@/assets/images/avatar-placeholder.png")}
              style={{ width: 96, height: 96, borderRadius: 48 }}
            />
            <View style={{ marginLeft: 16, justifyContent: "center", gap: 8 }}>
              <AppText type="title-large">{`${currentUser?.firstName} ${currentUser?.lastName}`}</AppText>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <PressableCount
                  count={currentUser?.friendsCount || 0}
                  label="Friends"
                  onPress={() => router.push("/profile/myFriends")}
                  notificationCount={pendingFriendRequests.length}
                />
                <PressableCount
                  count={currentUser?.followersCount || 0}
                  label="Followers"
                  onPress={() =>
                    router.push(`/profile/${currentUser?.username}/followers`)
                  }
                />
                <PressableCount
                  count={currentUser?.followingCount || 0}
                  label="Following"
                  onPress={() =>
                    router.push(`/profile/${currentUser?.username}/following`)
                  }
                />
              </View>
            </View>
          </View>
          <TextButton label="logout" onPress={logout} />
        </>
      }
      data={undefined}
      renderItem={undefined}
    />
  );
}
