import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Props = {
  visible?: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export default function Popup({
  visible: isVisible = true,
  onClose,
  children,
}: Props) {
  const theme = useTheme();

  return (
    <Modal
      statusBarTranslucent={true}
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <Pressable
        onPress={onClose}
        style={[styles.backdrop, { backgroundColor: theme.dialogBackground }]}
      />
      <View style={[styles.content, { backgroundColor: theme.surface }]}>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    margin: 32,
    maxHeight: "66%",
    marginTop: "66%",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
});
