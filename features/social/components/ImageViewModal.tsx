import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";

type Props = {
  visible: boolean;
  imageUrls: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function ImageViewModal({
  visible,
  imageUrls,
  initialIndex,
  onClose,
}: Props) {
  const theme = useTheme();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleBackPress = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);

  const handleForwardPress = useCallback(() => {
    if (currentIndex < imageUrls.length - 1) setCurrentIndex(currentIndex + 1);
  }, [currentIndex, imageUrls.length]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => onClose()}
    >
      <Pressable
        onPress={() => onClose()}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: theme.dialogBackground,
        }}
      >
        <Image
          source={{ uri: imageUrls[currentIndex] }}
          style={{
            width: "100%",
            height: "100%",
            alignSelf: "center",
          }}
          contentFit="contain"
        />
        <View
          style={{
            position: "absolute",
            bottom: 40,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingHorizontal: 20,
          }}
        >
          <IconButton
            variant="icon"
            icon={{
              name: "chevron-left",
              library: "MaterialIcons",
              color: theme.surface,
              size: 48,
            }}
            onPress={() => handleBackPress()}
          />
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 32,
              paddingHorizontal: 15,
              paddingVertical: 4,
            }}
          >
            <AppText color="surface">
              {currentIndex + 1} / {imageUrls.length}
            </AppText>
          </View>

          <IconButton
            variant="icon"
            icon={{
              name: "chevron-right",
              library: "MaterialIcons",
              color: theme.surface,
              size: 48,
            }}
            onPress={() => handleForwardPress()}
          />
        </View>
      </Pressable>
    </Modal>
  );
}
