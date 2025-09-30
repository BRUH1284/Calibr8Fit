import { useFollowers, useFriends, useUser } from "@/features/social";
import { FriendshipStatus, UserProfile } from "@/features/social/types/user";
import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import TextButton from "@/shared/components/TextButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, View } from "react-native";

export default function UserProfileScreen() {
  const theme = useTheme();
  const { username } = useLocalSearchParams();

  const { getUserProfileByUsername } = useUser();

  const {
    removeFriend,
    cancelFriendRequest,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriends();

  const {
    follow,
    unfollow,
  } = useFollowers();

  const [user, setUser] = useState<UserProfile | null>(null);

  const updateUserProfile = useCallback(async () => {
    setUser(await getUserProfileByUsername(username as string));
  }, [username, getUserProfileByUsername]);

  useEffect(() => {
    updateUserProfile();
  }, [updateUserProfile]);

  const handleFriendInteraction = useCallback(async () => {
    switch (user?.friendshipStatus) {
      case FriendshipStatus.Friends:
        await removeFriend(username as string);
        break;
      case FriendshipStatus.PendingSent:
        await cancelFriendRequest(username as string);
        break;
      case FriendshipStatus.None:
        await sendFriendRequest(username as string);
        break;
      default:
        break;
    }
    updateUserProfile();
  }, [
    user?.friendshipStatus,
    username,
    removeFriend,
    cancelFriendRequest,
    sendFriendRequest,
    updateUserProfile
  ]);

  const handleAcceptFriendRequest = useCallback(async () => {
    await acceptFriendRequest(username as string);
    updateUserProfile();
  }, [username, acceptFriendRequest, updateUserProfile]);

  const handleRejectFriendRequest = useCallback(async () => {
    await rejectFriendRequest(username as string);
    updateUserProfile();
  }, [username, rejectFriendRequest, updateUserProfile]);

  const handleFollow = useCallback(async () => {
    await follow(username as string);
    updateUserProfile();
  }, [username, follow, updateUserProfile]);

  const handleUnfollow = useCallback(async () => {
    await unfollow(username as string);
    updateUserProfile();
  }, [username, unfollow, updateUserProfile]);

  const friendButtons = useMemo(() => {
    switch (user?.friendshipStatus) {
      case FriendshipStatus.Friends:
      case FriendshipStatus.PendingSent:
      case FriendshipStatus.None:
        return (
          <TextButton
            label={
              user?.friendshipStatus === FriendshipStatus.Friends ? "Unfriend" :
                user?.friendshipStatus === FriendshipStatus.PendingSent ? "Cancel Request" :
                  "Add Friend"}
            style={{
              borderRadius: 8,
              padding: 4,
              flex: 1,
              backgroundColor: user?.friendshipStatus === FriendshipStatus.None ? theme.primary : theme.error
            }}
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
    user?.friendshipStatus,
    handleFriendInteraction,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    theme
  ]);

  const followButton = useMemo(() => {
    if (user?.followedByMe) {
      return (
        <TextButton
          label="Unfollow"
          style={{ borderRadius: 8, padding: 4, flex: 1, backgroundColor: theme.error }}
          onPress={() => handleUnfollow()} />
      );
    }
    return (
      <TextButton
        label="Follow"
        style={{ borderRadius: 8, padding: 4, flex: 1 }}
        onPress={() => handleFollow()} />
    );
  }, [
    user?.followedByMe,
    handleFollow,
    handleUnfollow,
    theme
  ]);

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
        >{`@${user?.username}`}</AppText>
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
              source={user?.profilePictureUrl
                ? { uri: user.profilePictureUrl }
                : require('@/assets/images/avatar-placeholder.png')}
              style={{ width: 96, height: 96, borderRadius: 48 }} />
            <View style={{ marginLeft: 16, justifyContent: 'center', gap: 8 }}>
              <AppText
                type="title-large"
              >{`${user?.firstName} ${user?.lastName}`}</AppText>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View>
                  <AppText
                    type='body-medium-bold'
                  >{user?.friendsCount}</AppText>
                  <AppText
                    type='body-medium'
                    style={{ textDecorationLine: 'underline' }}
                  >Friends</AppText>
                </View>
                <View>
                  <AppText
                    type='body-medium-bold'
                  >{user?.followersCount}</AppText>
                  <AppText
                    type='body-medium'
                    style={{ textDecorationLine: 'underline' }}
                  >Followers</AppText>
                </View>
                <View>
                  <AppText
                    type='body-medium-bold'
                  >{user?.followingCount}</AppText>
                  <AppText
                    type='body-medium'
                    style={{ textDecorationLine: 'underline' }}
                  >Following</AppText>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{ paddingTop: 8, flexDirection: 'row', gap: 16 }}
          >
            {friendButtons}
            {followButton}
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