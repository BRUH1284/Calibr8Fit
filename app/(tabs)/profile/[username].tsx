import { useUserRepository } from "@/features/social/hooks/useUserRepository";
import { FriendshipStatus } from "@/features/social/types/user";
import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import TextButton from "@/shared/components/TextButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, Image, View } from "react-native";

export default function UserProfileScreen() {
  const theme = useTheme();

  const { username } = useLocalSearchParams();
  const { selectedUser } = useUserRepository();
  const repo = useUserRepository();

  const handleFriendInteraction = useCallback(() => {
    switch (selectedUser?.friendshipStatus) {
      case FriendshipStatus.Friends:
        repo.removeFriend(username as string);
        break;
      case FriendshipStatus.PendingSent:
        repo.cancelFriendRequest(username as string);
        break;
      case FriendshipStatus.None:
        repo.sendFriendRequest(username as string);
        break;
      default:
        break;
    }
  }, [selectedUser?.friendshipStatus]);

  const handleAcceptFriendRequest = useCallback(() => {
    repo.acceptFriendRequest(username as string);
  }, [repo, username]);

  const handleRejectFriendRequest = useCallback(() => {
    repo.rejectFriendRequest(username as string);
  }, [repo, username]);

  const handleFollow = useCallback(() => {
    // Implement follow logic here
  }, []);

  const friendButtons = useMemo(() => {
    switch (selectedUser?.friendshipStatus) {
      case FriendshipStatus.Friends:
      case FriendshipStatus.PendingSent:
      case FriendshipStatus.None:
        return (
          <TextButton
            label={
              selectedUser?.friendshipStatus === FriendshipStatus.Friends ? "Unfriend" :
                selectedUser?.friendshipStatus === FriendshipStatus.PendingSent ? "Cancel Request" :
                  "Add Friend"}
            style={{ borderRadius: 8, padding: 4, flex: 1 }}
            onPress={() => handleFriendInteraction()}
          />);
      case FriendshipStatus.PendingReceived:
        return (
          <>
            <TextButton
              label="Reject"
              labelStyle={{ color: theme.onError }}
              style={{ borderRadius: 8, padding: 4, flex: 1, backgroundColor: theme.error }}
              onPress={() => handleRejectFriendRequest()}
            />
            <TextButton
              label="Accept"
              labelStyle={{ color: theme.onSuccess }}
              style={{ borderRadius: 8, padding: 4, flex: 1, backgroundColor: theme.success }}
              onPress={() => handleAcceptFriendRequest()}
            />
          </>
        );
      default:
        return null;
    }
  }, [
    selectedUser?.friendshipStatus,
    handleFriendInteraction,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    theme]);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          paddingHorizontal: 16,
          gap: 16,
          backgroundColor: theme.surface,
        }}>
        <IconButton
          icon={{
            name: 'arrow-back',
            library: 'MaterialIcons',
            size: 32,
          }}
          variant="icon"
          onPress={() => router.back()}
        />
        <AppText
          type="title-large-bold"
        >{`@${selectedUser?.username}`}</AppText>
      </View>
      <FlatList
        style={{
          flex: 1,
          backgroundColor: theme.surface,
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={<>
          <View
            style={{ flexDirection: 'row', marginTop: 8 }}
          >
            <Image
              source={selectedUser?.profilePictureUrl
                ? { uri: selectedUser.profilePictureUrl }
                : require('@/assets/images/avatar-placeholder.png')}
              style={{ width: 96, height: 96, borderRadius: 48 }} />
            <View style={{ marginLeft: 16, justifyContent: 'center', gap: 8 }}>
              <AppText
                type="title-large"
              >{`${selectedUser?.firstName} ${selectedUser?.lastName}`}</AppText>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View>
                  <AppText
                    type='body-medium-bold'
                  >{selectedUser?.friendsCount}</AppText>
                  <AppText
                    type='body-medium'
                    style={{ textDecorationLine: 'underline' }}
                  >Friends</AppText>
                </View>
                <View>
                  <AppText
                    type='body-medium-bold'
                  >{selectedUser?.followersCount}</AppText>
                  <AppText
                    type='body-medium'
                    style={{ textDecorationLine: 'underline' }}
                  >Followers</AppText>
                </View>
                <View>
                  <AppText
                    type='body-medium-bold'
                  >{selectedUser?.followingCount}</AppText>
                  <AppText
                    type='body-medium'
                    style={{ textDecorationLine: 'underline' }}
                  >Following</AppText>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', gap: 16 }}
          >
            {friendButtons}
            <TextButton
              label="Follow"
              style={{ borderRadius: 8, padding: 4, flex: 1 }}
              onPress={() => handleFollow()} />
          </View>
        </>}
        data={undefined}
        renderItem={undefined}
      />
      <IconButton
        icon={{
          name: 'chat-bubble-outline',
          library: 'MaterialIcons',
          size: 24,
          color: theme.onPrimaryVariant,
        }}
        style={{
          position: 'absolute',
          height: 56,
          width: 56,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          bottom: 16,
          right: 16,
          backgroundColor: theme.primaryVariant,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => { }}
      />
    </>
  );
} 