import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useActivityRecord } from "../hooks/useActivityRecord";
import { useDailyBurn } from "../hooks/useDailyBurn";
import ActivityItem from "./ActivityItem";

type Props = {
  onAddTargetPress: () => void;
};

export default function DailyBurnListCard({ onAddTargetPress }: Props) {
  const theme = useTheme();

  const { targets, todayCaloriesBurned, deleteDailyBurnTarget, syncDailyBurnTargets } = useDailyBurn();
  const { todayActivityCaloriesBurned, todayRecords } = useActivityRecord();

  const minimalTargets = useMemo(() =>
    targets.map(t => ({
      id: t.id,
      description: t.activity?.description || t.userActivity?.description || 'Unknown Activity',
      duration: t.duration,
      calories: todayActivityCaloriesBurned(t.activityId ?? t.userActivityId!),
    })), [targets, todayActivityCaloriesBurned, todayRecords]);

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await syncDailyBurnTargets();
    setRefreshing(false);
  }, [syncDailyBurnTargets]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText
          type='title-large'
          style={{ flex: 1 }}
        >Daily Burn</AppText>
        <AppText
          type='label-large'
        >{`${todayCaloriesBurned} kcal`}</AppText>
        <IconButton
          icon={{
            name: 'add',
            size: 36,
            library: 'MaterialIcons',
            color: theme.onSurface,
          }}
          onPress={onAddTargetPress}
          style={{ marginLeft: 16, backgroundColor: theme.primaryContainer }} />
      </View>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh} />
        }
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
        data={minimalTargets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityItem item={item} onDelete={deleteDailyBurnTarget} />
        )}

      >
      </FlatList>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 16,
  },
  column: {
    width: 48,
  },
  centerText: {
    textAlign: "center",
  },
});