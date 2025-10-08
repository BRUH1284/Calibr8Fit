import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import PaginatedFlatList from "@/shared/components/PaginatedFlatList";
import { useTheme } from "@/shared/hooks/useTheme";
import { Typography } from "@/styles/typography";
import { useCallback, useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePosts } from "../hooks";
import PostCommentCard from "./PostComment";

type Props = {
  postId?: string;
  onClose?: () => void;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
};

export default function PostCommentsModal({
  postId,
  onClose = () => {},
  onCommentAdded,
  onCommentDeleted,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { getPostComments, addComment } = usePosts();
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const [input, setInput] = useState("");

  const handleCommentAdd = useCallback(
    async (content: string) => {
      await addComment(postId!, content);
      onCommentAdded?.();
      refresh();
    },
    [addComment, postId, onCommentAdded, refresh]
  );

  const handleCommentDelete = useCallback(() => {
    onCommentDeleted?.();
    refresh();
  }, [onCommentDeleted, refresh]);

  const loadPostComments = useCallback(
    (page: number, pageSize: number) => {
      return getPostComments(postId!, page, pageSize);
    },
    [getPostComments, postId]
  );

  return (
    <Modal
      animationType="slide"
      visible={!!postId}
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable style={{ height: "20%" }} onPress={onClose} />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          overflow: "visible",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          elevation: 8,
          backgroundColor: theme.surface,
          justifyContent: "flex-end",
        }}
        behavior="padding"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            gap: 16,
            borderBottomWidth: 1,
            borderColor: theme.outline,
          }}
        >
          <IconButton
            variant="icon"
            icon={{
              name: "close",
              library: "MaterialIcons",
              size: 32,
              color: theme.onSurface,
            }}
            onPress={onClose}
          />
          <AppText type="title-large">Comments</AppText>
        </View>
        <PaginatedFlatList
          loadPage={loadPostComments}
          args={refreshKey}
          pageSize={10}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 8, padding: 16 }}
          renderItem={({ item }) => (
            <PostCommentCard comment={item} onDelete={handleCommentDelete} />
          )}
          ListEmptyComponent={
            <AppText
              style={{
                textAlign: "center",
                padding: 16,
              }}
              type="body-large"
            >
              No comments yet.
            </AppText>
          }
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            padding: 8,
            gap: 8,
            backgroundColor: theme.surfaceContainer,
          }}
        >
          <TextInput
            style={[
              {
                flex: 1,
                minHeight: 48,
                backgroundColor: theme.surface,
                borderRadius: 24,
                paddingHorizontal: 8,
              },
              Typography["body-medium"],
            ]}
            multiline
            placeholder="Add a comment"
            value={input}
            onChangeText={setInput}
          />
          <IconButton
            variant="icon"
            style={{ marginVertical: 8 }}
            icon={{
              name: "send",
              library: "MaterialIcons",
              size: 32,
              color: theme.primary,
            }}
            onPress={() => {
              handleCommentAdd(input);
              setInput("");
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          height: insets.bottom,
          backgroundColor: theme.surfaceContainer,
        }}
      />
    </Modal>
  );
}
