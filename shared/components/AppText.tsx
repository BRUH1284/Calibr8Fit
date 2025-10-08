import { Typography } from "@/styles/typography";
import { StyleProp, Text, TextStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Props = {
  type?: keyof typeof Typography;
  color?: keyof Omit<ReturnType<typeof useTheme>, "isDark">;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
  children: React.ReactNode;
};

export default function AppText({
  type = "headline-medium",
  color = "onSurface",
  style,
  children,
  ...props
}: Props) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[
        Typography[type],
        {
          color: theme[color],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
