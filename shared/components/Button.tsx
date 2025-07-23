import { Typography } from "@/styles/typography";
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";

type Props = {
  label?: string;
  labelType?: keyof typeof Typography;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  variant?: 'filled' | 'tonal' | 'text';
  onPress?: () => void;
};

export default function Button({
  variant = 'filled',
  label = "Button",
  labelType = 'title-medium',
  labelStyle,
  style,
  onPress = () => { }
}: Props) {
  const theme = useTheme();

  const backgroundColor = {
    filled: theme.primary,
    tonal: theme.secondaryContainer,
    text: 'transparent',
  }[variant] || theme.primary;

  const textColor = {
    filled: theme.onPrimary,
    tonal: theme.primary,
    text: theme.primary,
  }[variant] || theme.onPrimary;

  return (
    <TouchableOpacity
      style={[{
        backgroundColor: backgroundColor,
        padding: variant !== 'text' ? 16 : 6,
        borderRadius: 100,
      },
        style
      ]}
      onPress={onPress}
    >
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