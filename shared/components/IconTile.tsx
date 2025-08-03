import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
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
}

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
      style={[{
        flexGrow: 1,
        padding: 16,
        borderRadius: 16,
        backgroundColor: backgroundColor || theme.surfaceContainer,
        alignItems: 'center',
        flexDirection: 'row',
      }, style]}
      onPress={onPress}
    >
      <DynamicIcon
        name={icon.name}
        library={icon.library}
        size={icon.size || 32}
        color={icon.color || theme.onSurface}
      />
      <View style={{ flexGrow: 1 }}>
        <AppText
          type='label-large'
          style={{
            textAlign: 'right'
          }}
        >{text}</AppText>
        {supportingText && <AppText
          type='label-small'
          style={{
            textAlign: 'right',
            color: theme.onSurfaceVariant
          }}
        >{supportingText}</AppText>}
      </View>
    </TouchableOpacity>
  );
}