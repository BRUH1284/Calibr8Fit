import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileSettings } from "@/features/profile/types/interfaces/profile";
import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import TextButton from "@/shared/components/TextButton";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function MyProfile() {
  const theme = useTheme();
  const { fetchProfileSettings } = useProfile();
  const { logout } = useAuth();

  const [profileSettings, setProfileSettings] = useState<ProfileSettings | undefined>(undefined);

  // Fetch profile settings asynchronously when the component mounts
  useEffect(() => {
    fetchProfileSettings().then(setProfileSettings);
  }, []);


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <AppText
          type="title-large-bold"
          style={{ flex: 1 }}
        >{`@${profileSettings?.username}`}</AppText>
        <IconButton
          icon={{
            name: 'search',
            library: 'MaterialIcons',
            size: 28,
          }}
          variant='icon'
          onPress={() => router.push('/profile/userSearch')}
        />
        <IconButton
          icon={{
            name: 'settings',
            library: 'MaterialIcons',
            size: 28,
          }}
          variant="icon"
          onPress={() => { }}
        />
      </View>
      <View
        style={{ flexDirection: 'row', marginTop: 8 }}
      >
        <Image
          source={{ uri: profileSettings?.profilePictureUrl }}
          placeholder={require('@/assets/images/avatar-placeholder.png')}
          style={{ width: 96, height: 96, borderRadius: 48 }}
        />
        <View style={{ marginLeft: 16, justifyContent: 'center', gap: 8 }}>
          <AppText
            type="title-large"
          >{`${profileSettings?.firstName} ${profileSettings?.lastName}`}</AppText>
          <View style={{ flexDirection: 'row', gap: 16 }} >
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                <AppText
                  type='body-medium-bold'
                >{'23'}</AppText>
                <AppText
                  type='body-medium-bold'
                  color='onPrimary'
                  style={{ backgroundColor: theme.error, borderRadius: 100, paddingHorizontal: 2 }}
                >+2</AppText>
              </View>
              <AppText
                type='body-medium'
                style={{ textDecorationLine: 'underline' }}
              >Friends</AppText>
            </View>
            <View>
              <AppText
                type='body-medium-bold'
              >{'132'}</AppText>
              <AppText
                type='body-medium'
                style={{ textDecorationLine: 'underline' }}
              >Followers</AppText>
            </View>
            <View>
              <AppText
                type='body-medium-bold'
              >{'30'}</AppText>
              <AppText
                type='body-medium'
                style={{ textDecorationLine: 'underline' }}
              >Following</AppText>
            </View>
          </View>
        </View>
      </View>
      <TextButton label="logout" onPress={logout} />
    </View>
  );
}