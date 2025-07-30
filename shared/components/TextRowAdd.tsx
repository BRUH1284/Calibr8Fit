import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  label: string;
  iconText?: string;
  onPress: () => void;
}

export default function TextRowAdd({
  label,
  iconText,
  onPress,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        gap: 8
      }}>
      <AppText
        type='title-small'
        style={{
          flex: 1,
        }}
      >{label}</AppText>
      <AppText type='label-medium'>{iconText}</AppText>
      <IconButton
        onPress={onPress}
        icon={{
          name: 'add',
          library: 'MaterialIcons',
          size: 24,
          color: theme.onSurface
        }}
        style={{ backgroundColor: theme.primaryContainer }} />
    </View>
  );
}