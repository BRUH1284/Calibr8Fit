import { useFriends } from "@/features/social";
import AppText from "@/shared/components/AppText";
import TextButton from "@/shared/components/TextButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from "expo-image";
import { useCallback } from "react";
import { FlatList, View } from "react-native";

export default function FriendRequestsScreen() {
  const theme = useTheme();

  const { pendingFriendRequests, acceptFriendRequest, rejectFriendRequest } =
    useFriends();

  const handleAccept = useCallback(
    async (username: string) => {
      try {
        await acceptFriendRequest(username);
      } catch (error) {
        console.error("Failed to accept friend request:", error);
      }
    },
    [acceptFriendRequest],
  );

  const handleReject = useCallback(
    async (username: string) => {
      try {
        await rejectFriendRequest(username);
      } catch (error) {
        console.error("Failed to reject friend request:", error);
      }
    },
    [rejectFriendRequest],
  );

  return (
    <FlatList
      data={pendingFriendRequests}
      keyExtractor={(item) => item.requester.username}
      renderItem={({ item }) => (
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Image
            style={{ aspectRatio: 1, alignSelf: "stretch", borderRadius: 100 }}
            source={{ uri: item.requester.profilePictureUrl }}
            placeholder={require("@/assets/images/avatar-placeholder.png")}
            contentFit="cover"
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <AppText type="title-large">{`${item.requester.firstName} ${item.requester.lastName}`}</AppText>
            <AppText type="title-medium">{`@${item.requester.username}`}</AppText>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
              <TextButton
                label="Add friend"
                style={{
                  borderRadius: 8,
                  padding: 4,
                  flex: 1,
                  backgroundColor: theme.success,
                }}
                onPress={() => handleAccept(item.requester.username)}
              />
              <TextButton
                label="Decline"
                style={{
                  borderRadius: 8,
                  padding: 4,
                  flex: 1,
                  backgroundColor: theme.error,
                }}
                onPress={() => handleReject(item.requester.username)}
              />
            </View>
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <AppText type="body-medium" color="onSurfaceVariant">
            No pending friend requests
          </AppText>
        </View>
      )}
      style={{ flex: 1, backgroundColor: theme.surface }}
    />
  );
}
