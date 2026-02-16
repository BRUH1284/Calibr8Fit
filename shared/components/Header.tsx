import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <View style={styles.container}>
      <IconButton
        icon={{
          name: "arrow-back",
          library: "MaterialIcons",
          size: 32,
        }}
        variant="icon"
        onPress={router.back}
      />
      <AppText type="title-large">{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
