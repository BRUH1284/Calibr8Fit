import { Typography } from "@/styles/typography";
import { StyleProp, Text, TextStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Props = {
  type?: keyof typeof Typography;
  color?: keyof ReturnType<typeof useTheme>;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

export default function AppText({ type = 'headline-medum', color = 'onSurface', style, children, ...props }: Props) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[
        Typography[type],
        {
          color: theme[color],
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}