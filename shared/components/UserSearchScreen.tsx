import { UserSummary } from "@/features/social/types/user";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { Typography } from "@/styles/typography";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import AppText from "./AppText";

type Props = {
  onQueryChange: (text: string) => void;
  listData: UserSummary[];
  onUserPress?: (username: string) => void;
};

export default function UserSearchScreen({ onQueryChange, listData, onUserPress }: Props) {
  const theme = useTheme();

  const [input, setInput] = useState('');

  const { debounced: onDebouncedQueryChange } =
    useDebouncedCallback(onQueryChange, 350);

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
          placeholderTextColor={theme.onSurfaceVariant}
          value={input}
          onChangeText={(text) => {
            setInput(text);
            onDebouncedQueryChange(text);
          }}
          style={[Typography['title-medium'], { flex: 1 }]}
        />
        {input !== '' && (
          <IconButton
            icon={{
              name: 'close',
              library: 'MaterialIcons',
              size: 24,
            }}
            variant="icon"
            onPress={() => onQueryChange('')}
          />
        )}
      </View>
      <FlatList
        contentContainerStyle={{ padding: 16, gap: 16 }}
        data={listData}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View
            style={{ flexDirection: 'row' }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => onUserPress?.(item.username)}
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