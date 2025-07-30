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
  enabeled?: boolean;
  onPress?: () => void;
  icon?: IconItem;
};

export default function TextButton({
  variant = 'filled',
  label,
  labelType = 'title-medium',
  labelStyle,
  style,
  enabeled = true,
  onPress = () => { },
  icon,
}: Props) {
  const theme = useTheme();

  const backgroundColor = {
    filled: theme.primary,
    tonal: theme.secondaryContainer,
    toggle: theme.surfaceContainer,
    text: 'transparent',
  }[variant] || theme.primary;

  const textColor = enabeled ? {
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
        opacity: enabeled ? 1 : 0.1,
      },
        style
      ]}
      disabled={!enabeled}
      onPress={() => {
        if (enabeled)
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