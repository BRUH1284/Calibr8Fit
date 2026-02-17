import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import DynamicIcon, { IconItem } from "./DynamicIcon";

type Props = {
  text: string;
  supportingText?: string;
  icon: IconItem;
  onPress?: () => void;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function IconTile({
  text,
  supportingText,
  icon,
  onPress,
  backgroundColor,
  style,
}: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || theme.surface,
          borderColor: theme.outline,
        },
        style,
      ]}
      onPress={onPress}
    >
      <DynamicIcon
        name={icon.name}
        library={icon.library}
        size={icon.size || 32}
        color={icon.color || theme.onSurface}
      />
      <View style={styles.content}>
        <AppText type="label-large" style={styles.textRight}>
          {text}
        </AppText>
        {supportingText && (
          <AppText
            type="label-small"
            style={[styles.textRight, { color: theme.onSurfaceVariant }]}
          >
            {supportingText}
          </AppText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
  },
  content: {
    flexGrow: 1,
  },
  textRight: {
    textAlign: "right",
  },
});
