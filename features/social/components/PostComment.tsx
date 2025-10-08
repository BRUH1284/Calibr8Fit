import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { compact } from "@/shared/utils/date";
import { Image } from "expo-image";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { useUser } from "../context";
import { usePosts } from "../hooks";
import { PostComment } from "../types/post";

type Props = {
  comment: PostComment;
  onDelete?: (commentId: string) => void;
};

export default function PostCommentCard({
  comment: { id, content, author, createdAt },
  onDelete,
}: Props) {
  const { currentUser } = useUser();
  const { deleteComment } = usePosts();

  const handleCommentDelete = useCallback(async () => {
    await deleteComment(id);
    if (onDelete) {
      onDelete(id);
    }
  }, [deleteComment, id, onDelete]);

  const deleteButton = useMemo(() => {
    if (currentUser?.username !== author.username) return null;
    return (
      <IconButton
        icon={{ name: "delete", library: "MaterialIcons", size: 16 }}
        variant="icon"
        onPress={() => handleCommentDelete()}
      />
    );
  }, [handleCommentDelete, author.username, currentUser?.username]);

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
      }}
    >
      <Image
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
        }}
        source={{ uri: author.profilePictureUrl }}
        placeholder={require("@/assets/images/avatar-placeholder.png")}
      />
      <View style={{ flex: 1, gap: 4 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AppText
            type="title-medium"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flex: 1 }}
          >
            {author.firstName} {author.lastName}
          </AppText>
          <AppText type="body-small">{compact(createdAt)}</AppText>
          {deleteButton}
        </View>
        <AppText type="body-medium" style={{ flexShrink: 1 }}>
          {content}
        </AppText>
      </View>
    </View>
  );
}
