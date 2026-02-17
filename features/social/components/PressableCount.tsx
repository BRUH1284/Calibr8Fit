import AppText from "@/shared/components/AppText";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback, useMemo } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

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
  notificationCount,
}: Props) {
  const theme = useTheme();

  const isPressable = useMemo(
    () => count > 0 || (notificationCount && notificationCount > 0),
    [count, notificationCount],
  );

  const handlePress = useCallback(() => {
    if (isPressable) onPress();
  }, [isPressable, onPress]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <View style={styles.countRow}>
          <AppText type="body-medium-bold">{count}</AppText>
          {(notificationCount ?? 0) > 0 && (
            <AppText
              type="body-medium-bold"
              color="onPrimary"
              style={[styles.badge, { backgroundColor: theme.error }]}
            >{`+${notificationCount}`}</AppText>
          )}
        </View>
        <AppText
          type="body-medium"
          style={{
            textDecorationLine: count > 0 ? "underline" : "none",
          }}
        >
          {label}
        </AppText>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    borderRadius: 100,
    paddingHorizontal: 2,
  },
});
