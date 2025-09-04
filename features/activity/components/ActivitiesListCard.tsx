import AppText from "@/shared/components/AppText";
import Divider from "@/shared/components/Divider";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useActivityRecord } from "../hooks/useActivityRecord";

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

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncActivityRecords();
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
        >Activities</AppText>
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
          onPress={onAddActivityPress}
          style={{ marginLeft: 16, backgroundColor: theme.primaryContainer }} />

      </View>
      <FlatList
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh} />}
        data={todayRecords}
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
            >{item.activity?.description || item.userActivity?.description}</AppText>
            <Divider
              orientation='vertical' />
            <View style={{ width: 48 }}>
              <AppText
                style={{ textAlign: 'center' }}
                type='title-medium'
              >{item.duration / 60}</AppText>
              <AppText
                style={{ textAlign: 'center' }}
                color='onSurfaceVariant'
                type='label-small'
              >Minutes</AppText>
            </View>
            <View style={{ width: 48 }}>
              <AppText
                style={{ textAlign: 'center' }}
                type='title-medium'
              >{item.caloriesBurned}</AppText>
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
                // Delete the activity record
                deleteActivityRecord(item.id);
              }} />
          </View>
        )}
      >
      </FlatList>
    </View>
  );
}