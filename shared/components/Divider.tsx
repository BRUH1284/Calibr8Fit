import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Props = {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  margin?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Divider({
  orientation = 'horizontal',
  thickness = 1,
  margin = 8,
  style,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.outline,
          maxHeight: orientation === 'vertical' ? '100%' : thickness,
          height: orientation === 'vertical' ? '100%' : thickness,
          maxWidth: orientation === 'vertical' ? thickness : undefined,
          width: orientation === 'vertical' ? thickness : undefined,
          alignSelf: orientation === 'vertical' ? 'center' : 'stretch',
          flexGrow: orientation === 'horizontal' ? 1 : 0,
          marginHorizontal: orientation === 'horizontal' ? margin : 0,
          marginVertical: orientation === 'vertical' ? margin : 0,
        },
        style,
      ]}
    />
  );
}
