import { StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  label: string;
  iconText?: string;
  onPress: () => void;
};

export default function TextRowAdd({ label, iconText, onPress }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppText type="title-small" style={styles.label}>
        {label}
      </AppText>
      <AppText type="label-medium">{iconText}</AppText>
      <IconButton
        onPress={onPress}
        icon={{
          name: "add",
          library: "MaterialIcons",
          size: 24,
          color: theme.onSurface,
        }}
        style={{ backgroundColor: theme.primaryVariant }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  label: {
    flex: 1,
  },
});
