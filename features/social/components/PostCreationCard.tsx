import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { Typography } from "@/styles/typography";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { usePosts } from "../hooks";
import { PostImage } from "../types/post";

type Props = {
  onPostCreated?: () => void;
};

const MAX_IMAGES = 16;

export default function PostCreationCard({ onPostCreated }: Props) {
  const theme = useTheme();
  const { createPost } = usePosts();
  const [input, setInput] = useState("");

  // Image handling
  const [images, setImages] = useState<PostImage[]>([]);

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.75,
      selectionLimit: MAX_IMAGES - images.length,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageData = result.assets.map((image) => {
        const uri = image.uri;
        const fileName = uri.split("/").pop() || "photo.jpg";
        const fileType = image.mimeType || `image/${fileName.split(".").pop()}`;
        return { uri, type: fileType, name: fileName };
      });

      setImages((prevImages) => [...prevImages, ...imageData]);
    } else {
      alert("You did not select any image.");
    }
  };

  const handleRemoveImage = (uri: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.uri !== uri));
  };

  const handleCreatePost = async () => {
    await createPost(input, images);
    setInput("");
    setImages([]);

    if (onPostCreated) onPostCreated();
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <AppText type="title-large">Create a new post</AppText>
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="What's on your mind?"
          style={[
            styles.textInput,
            { borderColor: theme.outline, color: theme.onSurface },
            Typography["body-medium"],
          ]}
          multiline
        />
        <View style={styles.buttonColumn}>
          <IconButton
            icon={{
              name: "image-plus",
              library: "MaterialCommunityIcons",
              size: 32,
            }}
            style={styles.squareButton}
            onPress={handleAddImage}
          />
          <IconButton
            icon={{
              name: "post-add",
              library: "MaterialIcons",
              size: 32,
            }}
            style={styles.squareButton}
            onPress={handleCreatePost}
          />
        </View>
      </View>
      <FlatList
        data={images}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <IconButton
              icon={{
                name: "close",
                library: "MaterialIcons",
                size: 24,
                color: theme.onError,
              }}
              style={[styles.removeButton, { backgroundColor: theme.error }]}
              onPress={() => handleRemoveImage(item.uri)}
            />
          </>
        )}
        contentContainerStyle={styles.imageListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    gap: 8,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: "top",
  },
  buttonColumn: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  squareButton: {
    aspectRatio: 1,
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 4,
  },
  imageListContent: {
    gap: 8,
  },
});
