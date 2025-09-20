import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { compactFull } from "@/shared/utils/date";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useActivityRecord } from "../hooks/useActivityRecord";
import ActivityItem from "./ActivityItem";

type Props = {
  onAddActivityPress: () => void;
};

export default function ActivitiesListCard({ onAddActivityPress }: Props) {
  const theme = useTheme();

  const {
    todayRecords,
    todayCaloriesBurned,
    syncActivityRecords,
    deleteActivityRecord
  } = useActivityRecord();

  const minimalRecords = useMemo(() =>
    todayRecords.map(r => ({
      id: r.id,
      description: r.activity?.description || r.userActivity?.description || 'Unknown Activity',
      duration: r.duration,
      calories: r.caloriesBurned,
      time: compactFull(new Date(r.time)),
    })), [todayRecords]);

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await syncActivityRecords();
    setRefreshing(false);
  }, [syncActivityRecords]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText
          type='title-large'
          style={{ flex: 1 }}
        >Activities</AppText>
        <AppText
          type='label-large'
        >{`${todayCaloriesBurned} kcal`}</AppText>
        <IconButton
          icon={{
            name: 'add',
            size: 36,
            library: 'MaterialIcons',
            color: theme.onPrimaryVariant,
          }}
          onPress={onAddActivityPress}
          style={{ marginLeft: 16, backgroundColor: theme.primaryVariant }} />
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
        data={minimalRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityItem item={item} onDelete={deleteActivityRecord} />
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
});