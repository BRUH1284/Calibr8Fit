import { Typography } from "@/styles/typography";
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import DynamicIcon, { IconItem } from "./DynamicIcon";

type Props = {
  label?: string;
  labelType?: keyof typeof Typography;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  variant?: 'filled' | 'tonal' | 'text' | 'toggle';
  enabled?: boolean;
  onPress?: () => void;
  icon?: IconItem;
};

export default function TextButton({
  variant = 'filled',
  label,
  labelType = 'title-medium',
  labelStyle,
  style,
  enabled: enabled = true,
  onPress = () => { },
  icon,
}: Props) {
  const theme = useTheme();

  const backgroundColor = {
    filled: theme.primary,
    tonal: theme.primaryVariant,
    toggle: theme.surfaceContainer,
    text: 'transparent',
  }[variant] || theme.primary;

  const textColor = enabled ? {
    filled: theme.onPrimary,
    tonal: theme.primary,
    toggle: theme.onSurfaceVariant,
    text: theme.primary,
  }[variant] || theme.onPrimary : theme.onSurface;

  return (
    <TouchableOpacity
      style={[{
        backgroundColor: backgroundColor,
        padding: variant !== 'text' ? 16 : 6,
        borderRadius: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        opacity: enabled ? 1 : 0.1,
      },
        style
      ]}
      disabled={!enabled}
      onPress={() => {
        if (enabled)
          onPress();
      }}
    >
      {icon && <DynamicIcon
        name={icon.name}
        size={icon.size}
        library={icon.library}
        color={icon.color || textColor}
        style={[{ textAlignVertical: 'center' }, icon.style]}
      />}
      <AppText
        type={labelType}
        style={[
          {
            color: textColor,
            textAlign: 'center'
          },
          labelStyle
        ]}>{label}</AppText>
    </TouchableOpacity>
  );
}