import { useFriends } from "@/features/social/hooks/useFriends";
import AppText from "@/shared/components/AppText";
import { useTheme } from "@/shared/hooks/useTheme";
import { Typography } from "@/styles/typography";
import { Image } from "expo-image";
import { router } from "expo-router";
import { TouchableNativeFeedback, View } from "react-native";
import Friends from "./[username]/friends";

export default function MyFriends() {
  const theme = useTheme();

  const { pendingFriendRequests } = useFriends();

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface, gap: 8 }}>
      <Friends isCurrentUser />
      {pendingFriendRequests.length > 0 && (
        <TouchableNativeFeedback
          onPress={() => router.push('/profile/friendRequests')}
        >
          <View style={{ flexDirection: 'row', padding: 16, gap: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: theme.outline }}>
            <Image
              source={{ uri: pendingFriendRequests[0].requester.profilePictureUrl }}
              placeholder={require('@/assets/images/avatar-placeholder.png')}
              style={{ width: 64, height: 64, borderRadius: 32 }}
            />
            <AppText
              type='title-large'
              style={{ flex: 1 }}
            >Friend Requests</AppText>
            <AppText
              type='title-large'
              color='surface'
              style={{
                minWidth: Typography["title-large"].lineHeight,
                textAlign: 'center',
                backgroundColor: theme.onSurfaceVariant,
                borderRadius: 100,
                paddingHorizontal: 2
              }}
            >{pendingFriendRequests.length}</AppText>
          </View>
        </TouchableNativeFeedback>)}
    </View>
  );
}