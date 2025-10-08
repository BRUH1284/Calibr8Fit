import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { usePosts } from "../hooks";
import { Post } from "../types/post";
import ImageViewModal from "./ImageViewModal";
import PostCommentsModal from "./PostCommentsModal";

type Props = {
  post: Post;
};

export default function PostCard({
  post: { id, imageUrls, content, likeCount, likedByMe, commentCount },
}: Props) {
  const theme = useTheme();

  // Like handling
  const { likePost, unlikePost } = usePosts();
  const [likedByMeState, setLikedByMeState] = useState(likedByMe);
  const [likeCountState, setLikeCountState] = useState(likeCount);

  const handleLikePress = useCallback(async () => {
    if (!likedByMeState) {
      await likePost(id);
      setLikedByMeState(true);
      setLikeCountState((prev) => prev + 1);
    } else {
      await unlikePost(id);
      setLikedByMeState(false);
      setLikeCountState((prev) => prev - 1);
    }
  }, [id, likePost, unlikePost, likedByMeState]);

  // Comment handling
  const [selectedPostId, setSelectedPostId] = useState<string>();
  const [commentCountState, setCommentCountState] = useState(commentCount);

  const onCommentAdded = useCallback(() => {
    setCommentCountState((count) => count + 1);
  }, []);

  const onCommentDeleted = useCallback(() => {
    setCommentCountState((count) => count - 1);
  }, []);

  // Image handling
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImagePress = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  }, []);

  const Images = useMemo(() => {
    const mainImage = imageUrls[0];
    const otherImages = imageUrls.slice(1, 5);

    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          aspectRatio: 16 / 9,
          gap: 4,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 4,
          }}
          onPress={() => handleImagePress(0)}
        >
          <Image
            style={{ flex: 1, borderRadius: 4 }}
            source={{ uri: mainImage }}
            contentFit="cover"
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1 / otherImages.length,
            gap: 4,
          }}
        >
          {otherImages.map((uri, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flex: 1,
                borderRadius: 4,
              }}
              onPress={() => handleImagePress(index + 1)}
            >
              <Image
                style={{
                  flex: 1,
                  borderRadius: 4,
                }}
                source={{ uri: uri }}
                contentFit="cover"
              />
              {index === 3 && otherImages.length > 3 && (
                <View
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: theme.dialogBackground,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                    zIndex: 1,
                  }}
                >
                  <AppText type="title-large" color="onPrimary">
                    +{otherImages.length - 3}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }, [imageUrls, theme.dialogBackground, handleImagePress]);

  return (
    <>
      <View
        style={{
          width: "100%",
          elevation: 4,
          padding: 16,
          borderRadius: 16,
          backgroundColor: theme.surface,
          gap: 8,
        }}
      >
        <AppText type="body-medium">{content}</AppText>
        {Images}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IconButton
            variant="icon"
            icon={{
              name: likedByMeState ? "cards-heart" : "cards-heart-outline",
              library: "MaterialCommunityIcons",
              size: 24,
            }}
            onPress={handleLikePress}
          />
          <AppText style={{ marginRight: 12 }} type="body-medium">
            {likeCountState}
          </AppText>
          <IconButton
            variant="icon"
            icon={{
              name: "chat-bubble-outline",
              library: "MaterialIcons",
              size: 24,
            }}
            onPress={() => {
              setSelectedPostId(id);
            }}
          />
          <AppText type="body-medium">{commentCountState}</AppText>
        </View>
      </View>
      <ImageViewModal
        visible={modalOpen}
        imageUrls={imageUrls}
        initialIndex={selectedImageIndex}
        onClose={() => setModalOpen(false)}
      />
      <PostCommentsModal
        postId={selectedPostId}
        onClose={() => setSelectedPostId(undefined)}
        onCommentAdded={onCommentAdded}
        onCommentDeleted={onCommentDeleted}
      />
    </>
  );
}
