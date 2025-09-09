import Checkbox from 'expo-checkbox';
import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  label: string;
  iconText?: string;
  onPress: () => void;
  checkbox?: boolean;
  checked?: boolean;
  onCheck?: (value: boolean) => void;
}

export default function TextRowAdd({
  label,
  iconText,
  onPress,
  checkbox = false,
  checked = false,
  onCheck
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
      {!checkbox &&
        <IconButton
          onPress={onPress}
          icon={{
            name: 'add',
            library: 'MaterialIcons',
            size: 24,
            color: theme.onSurface
          }}
          style={{ backgroundColor: theme.primaryContainer }} />
      }
      {checkbox &&
        <Checkbox
          value={checked}
          onValueChange={onCheck}
          color={theme.primary}
          style={{ width: 24, height: 24, borderRadius: 4, borderColor: theme.outline, borderWidth: 1 }}
        />
      }
    </View>
  );
}