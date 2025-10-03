import { UserSummary } from "@/features/social/types/user";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { Typography } from "@/styles/typography";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import AppText from "./AppText";

type LoadPage = (
  query: string,
  page: number,
  pageSize: number,
) => Promise<UserSummary[]>;

type Props = {
  loadPage: LoadPage;
  pageSize?: number;
  onUserPress?: (username: string) => void;
};

export default function UserSearchScreen({
  loadPage,
  pageSize = 20,
  onUserPress,
}: Props) {
  const theme = useTheme();

  const [input, setInput] = useState("");
  const [items, setItems] = useState<UserSummary[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { debounced: onDebouncedQueryChange } = useDebouncedCallback(
    (text: string) => {
      // Reset pagination
      setPage(0);
      setHasMore(true);

      // Fetch first page
      fetchPage(text, 0);
    },
    350,
  );

  const fetchPage = useCallback(
    async (query: string, page: number) => {
      if (loading || !hasMore) return;
      setLoading(true);

      // Fetch data
      const data = await loadPage(query, page, pageSize);

      // Check if there are more results
      if (data.length < pageSize) setHasMore(false);

      // Append or set items
      if (page === 0) setItems(data);
      else setItems((prev) => [...prev, ...data]);

      setLoading(false);
    },
    [hasMore, loadPage, loading, pageSize],
  );

  const onEndReached = useCallback(() => {
    if (loading || !hasMore) return;
    setPage(page + 1);
    fetchPage(input, page + 1);
  }, [loading, hasMore, page, input, fetchPage]);

  const handleTextChange = useCallback(
    (text: string) => {
      setInput(text);
      onDebouncedQueryChange(text);
    },
    [onDebouncedQueryChange],
  );

  // Initial load
  useEffect(() => {
    fetchPage("", 0);
  }, [fetchPage]);

  const listFooter = useMemo(() => {
    if (loading) {
      return (
        <View style={{ paddingVertical: 16 }}>
          <ActivityIndicator />
        </View>
      );
    }
    if (!hasMore && items.length > 0) {
      return (
        <View style={{ paddingVertical: 16, alignItems: "center" }}>
          <AppText type="body-medium" style={{ color: theme.onSurfaceVariant }}>
            You have reached the end.
          </AppText>
        </View>
      );
    }
    return null;
  }, [loading, hasMore, items.length, theme.onSurfaceVariant]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16 }}>
        <IconButton
          icon={{
            name: "arrow-back",
            library: "MaterialIcons",
            size: 32,
          }}
          variant="icon"
          onPress={() => router.back()}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={theme.onSurfaceVariant}
          value={input}
          onChangeText={handleTextChange}
          style={[Typography["title-medium"], { flex: 1 }]}
        />
        {input !== "" && (
          <IconButton
            icon={{
              name: "close",
              library: "MaterialIcons",
              size: 24,
            }}
            variant="icon"
            onPress={() => {
              setInput("");
              fetchPage("", 0); //TODO: ??
            }}
          />
        )}
      </View>
      <FlatList
        contentContainerStyle={{ padding: 16, gap: 16 }}
        data={items}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => onUserPress?.(item.username)}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    marginRight: 8,
                  }}
                  source={item.profilePictureUrl}
                  placeholder={require("@/assets/images/avatar-placeholder.png")}
                />
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <AppText type="title-large">{`${item.firstName} ${item.lastName}`}</AppText>
                  <AppText type="title-medium">{`@${item.username}`}</AppText>
                </View>
              </View>
            </TouchableOpacity>
            <IconButton
              icon={{
                name: "chat-bubble-outline",
                library: "MaterialIcons",
                size: 48,
              }}
              variant="icon"
            />
          </View>
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={listFooter}
      />
    </View>
  );
}
