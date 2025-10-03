import AppText from "@/shared/components/AppText";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback, useMemo } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

type Props = {
  count: number;
  label: string;
  onPress: () => void;
  notificationCount?: number;
};

export default function PressableCount({
  count,
  label,
  onPress,
  notificationCount }: Props) {
  const theme = useTheme();

  const isPressable = useMemo(() =>
    count > 0 || (notificationCount && notificationCount > 0),
    [count, notificationCount]);

  const handlePress = useCallback(() => {
    if (isPressable)
      onPress();
  }, [isPressable, onPress]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
          <AppText
            type='body-medium-bold'
          >{count}</AppText>
          {(notificationCount ?? 0) > 0 && (
            <AppText
              type='body-medium-bold'
              color='onPrimary'
              style={{ backgroundColor: theme.error, borderRadius: 100, paddingHorizontal: 2 }}
            >{`+${notificationCount}`}</AppText>
          )}
        </View>
        <AppText
          type='body-medium'
          style={{
            textDecorationLine: count > 0 ? 'underline' : 'none',
          }}
        >{label}</AppText>
      </View>
    </TouchableWithoutFeedback>
  );
}