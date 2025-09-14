import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { compactFull } from "@/shared/utils/date";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useConsumptionRecord } from "../hooks/useConsumptionRecord";
import { calcCaloricValue } from "../types/consumptionRecord";
import RationItem from "./RationItem";

type Props = {
  onAddPress: () => void;
};

export default function RationListCard({ onAddPress }: Props) {
  const theme = useTheme();

  const {
    todayRecords,
    todayCaloriesConsumed,
    syncConsumptionRecords,
    deleteConsumptionRecord
  } = useConsumptionRecord();

  const minimalRecords = useMemo(() => todayRecords
    .map(r => ({
      id: r.id,
      name: r.food?.name || r.userFood?.name || r.userMeal?.name || 'Unknown Food',
      calories: calcCaloricValue(r),
      quantity: r.quantity,
      time: compactFull(new Date(r.time)),
    })), [todayRecords]);

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncConsumptionRecords();
    setRefreshing(false);
  };

  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <AppText
          type='title-large'
          style={{ flex: 1 }}
        >Ration</AppText>
        <AppText
          type='label-large'
        >{`${todayCaloriesConsumed} kcal`}</AppText>
        <IconButton
          icon={{
            name: 'add',
            size: 36,
            library: 'MaterialIcons',
            color: theme.onSurface,
          }}
          onPress={onAddPress}
          style={{ marginLeft: 16, backgroundColor: theme.primaryContainer }} />

      </View>
      <FlatList
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh} />}
        data={minimalRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RationItem item={item} onDelete={deleteConsumptionRecord} />
        )}
      >
      </FlatList>
    </View>
  );
}