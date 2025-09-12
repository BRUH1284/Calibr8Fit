import AppText from "@/shared/components/AppText";
import Divider from "@/shared/components/Divider";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useConsumptionRecord } from "../hooks/useConsumptionRecord";
import { calcCaloricValue } from "../types/consumptionRecord";

type Props = {
  onAddPress: () => void;
};

export default function ConsumptionListCard({ onAddPress }: Props) {
  const theme = useTheme();

  const {
    todayRecords,
    todayCaloriesConsumed,
    syncConsumptionRecords,
    deleteConsumptionRecord
  } = useConsumptionRecord();

  const items = useMemo(() => todayRecords
    .map(r => ({
      id: r.id,
      name: r.food?.name || r.userFood?.name || r.userMeal?.name,
      calories: calcCaloricValue(r),
      quantity: r.quantity,
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
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 8,
              gap: 16
            }}
          >
            <AppText
              style={{ flex: 1 }}
              type='title-medium'
            >{item.name}</AppText>
            <Divider
              orientation='vertical' />
            <View style={{ width: 48 }}>
              <AppText
                style={{ textAlign: 'center' }}
                type='title-medium'
              >{item.quantity}</AppText>
              <AppText
                style={{ textAlign: 'center' }}
                color='onSurfaceVariant'
                type='label-small'
              >Grams</AppText>
            </View>
            <View style={{ width: 48 }}>
              <AppText
                style={{ textAlign: 'center' }}
                type='title-medium'
              >{item.calories}</AppText>
              <AppText
                style={{ textAlign: 'center' }}
                color='onSurfaceVariant'
                type='label-small'
              >Kcal</AppText>
            </View>
            <IconButton icon={{
              name: 'delete-outline',
              library: "MaterialIcons",
              size: 32,
              color: theme.onSurface,
            }}
              style={{ backgroundColor: theme.tertiaryContainer }}
              onPress={() => {
                // Delete the record
                deleteConsumptionRecord(item.id);
              }} />
          </View>
        )}
      >
      </FlatList>
    </View>
  );
}