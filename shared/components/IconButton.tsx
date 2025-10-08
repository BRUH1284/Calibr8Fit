import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import DynamicIcon, { IconItem } from "./DynamicIcon";

type Props = {
  style?: StyleProp<ViewStyle>;
  variant?: "filled" | "icon";
  enabeled?: boolean;
  onPress?: () => void;
  icon: IconItem;
};

export default function IconButton({
  variant = "filled",
  style,
  enabeled = true,
  onPress = () => {},
  icon,
}: Props) {
  const theme = useTheme();

  const backgroundColor = {
    filled: theme.primary,
    icon: undefined,
  }[variant];

  const iconColor = enabeled
    ? {
        filled: theme.onPrimary,
        icon: theme.onSurface,
      }[variant]
    : theme.onSurface;

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: backgroundColor,
          padding: variant !== "icon" ? 8 : 0,
          borderRadius: 32,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          opacity: enabeled ? 1 : 0.1,
        },
        style,
      ]}
      disabled={!enabeled}
      onPress={() => {
        if (enabeled) onPress();
      }}
    >
      <DynamicIcon
        name={icon.name}
        size={icon.size}
        library={icon.library}
        color={icon.color || iconColor}
        style={[{ textAlignVertical: "center" }, icon.style]}
      />
    </TouchableOpacity>
  );
}
