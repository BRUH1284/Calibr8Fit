import { TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";

type Props = {
  value?: string;
  supportingText?: string;
  placeholder?: string;
  focused?: boolean;
  onPress?: () => void;
}

export default function FrameDisplay({
  value,
  supportingText,
  placeholder,
  focused,
  onPress
}: Props) {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{ alignSelf: 'stretch', gap: 4 }}>
        <View
          style={{
            borderWidth: focused ? 3 : 1,
            paddingHorizontal: focused ? 13 : 15,
            paddingVertical: focused ? 9 : 11,
            borderColor: focused ? theme.primary : theme.outline,
            borderRadius: 4
          }}
        >
          {value && <AppText
            type='body-small'
            style={{
              position: 'absolute',
              left: focused ? 10 : 12,
              top: focused ? -10 : -8,
              color: focused ? theme.primary : theme.onSurfaceVariant,
              backgroundColor: theme.background,
              paddingHorizontal: 4,
            }}>{placeholder}</AppText>}
          <View style={{ flexDirection: 'row' }}>
            <AppText
              type='body-large'
              style={{
                padding: 0,
                minHeight: 24,
                flex: 1,
                color: theme.onSurfaceVariant
              }}
            >{value || placeholder}</AppText>
          </View>
        </View>
        {supportingText !== undefined && <AppText
          type='body-small'
          style={{
            paddingHorizontal: 16,
            color: theme.onSurfaceVariant
          }}
        >{supportingText}</AppText>}
      </View >
    </TouchableWithoutFeedback>
  );
}