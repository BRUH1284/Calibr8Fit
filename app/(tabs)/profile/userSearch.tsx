import { useUserRepository } from "@/features/social/hooks/useUserRepository";
import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { Typography } from "@/styles/typography";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";

export default function UserSearch() {
  const theme = useTheme();
  const repo = useUserRepository();

  const [query, setQuery] = useState('');

  useEffect(() => {
    repo.searchUsers(query);
  }, [query]);

  const handleUserPress = useCallback(async (username: string) => {
    router.push(`/profile/${username}`);
    repo.setSelectedUser(await repo.getUserProfileByUsername(username));
  }, [router, repo]);

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.surface }}
    >
      <View
        style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16 }}
      >
        <IconButton
          icon={{
            name: 'arrow-back',
            library: 'MaterialIcons',
            size: 32,
          }}
          variant="icon"
          onPress={() => router.back()}
        />
        <TextInput
          placeholder="Search"
          value={query}
          onChangeText={(text) => setQuery(text)}
          style={[Typography['title-medium'], { flex: 1 }]}
        />
        {query !== '' && (
          <IconButton
            icon={{
              name: 'close',
              library: 'MaterialIcons',
              size: 24,
            }}
            variant="icon"
            onPress={() => setQuery('')}
          />
        )}
      </View>
      <FlatList
        contentContainerStyle={{ padding: 16, gap: 16 }}
        data={repo.searchResults}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View
            style={{ flexDirection: 'row' }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => handleUserPress(item.username)}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  style={{ width: 64, height: 64, borderRadius: 32, marginRight: 8 }}
                  source={item.profilePictureUrl}
                  placeholder={require('@/assets/images/avatar-placeholder.png')}
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <AppText
                    type='title-large'
                  >{`${item.firstName} ${item.lastName}`}</AppText>
                  <AppText
                    type='title-medium'
                  >{`@${item.username}`}</AppText>
                </View>
              </View>
            </TouchableOpacity>
            <IconButton
              icon={{
                name: 'chat-bubble-outline',
                library: 'MaterialIcons',
                size: 48,
              }}
              variant='icon'
            />
          </View >
        )}
      />
    </View>
  );
}