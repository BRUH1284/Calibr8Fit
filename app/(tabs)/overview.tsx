import { useActivity } from "@/features/activity/hooks/useActivity";
import { useUserActivity } from "@/features/activity/hooks/useUserActivity";
import AppText from "@/shared/components/AppText";
import DynamicIcon, { IconItem } from "@/shared/components/DynamicIcon";
import SearchPopup from "@/shared/components/SearchPopup";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Overview() {
  const { activities, fetchActivities } = useActivity();
  const { userActivities, syncUserActivities } = useUserActivity();
  const theme = useTheme();


  const [topRefreshing, setTopRefreshing] = useState(false);
  const [listRefreshing, setListRefreshing] = useState(false);

  const [activityQuery, setActivityQuery] = useState('');

  const arrangedActivities = useMemo(() => {
    const combinedActivities = [...activities, ...userActivities];

    let result = combinedActivities
      .filter((activity) =>
        activity.description.toLowerCase().includes(activityQuery.toLowerCase())
      )
      .map((activity) => ({
        id: 'id' in activity ? activity.id : undefined,
        code: 'code' in activity ? activity.code : undefined,
        name: activity.description,
        metValue: activity.metValue,
      }));

    console.log('Filtered activities:', result);

    result.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [activities, activityQuery]);

  const [popup, setPopup] = useState<'none' | 'activity'>('none');

  const tiles: {
    iconName: string;
    iconLibrary: IconItem['library'];
    mainText: string;
    supportingText: string;
    onPress?: () => void;
  }[] = [
      {
        iconName: 'fastfood',
        iconLibrary: 'MaterialIcons',
        mainText: 'Tile 1',
        supportingText: 'Supporting text 1',

      },
      {
        iconName: 'local-fire-department',
        iconLibrary: 'MaterialIcons',
        mainText: 'Tile 2',
        supportingText: 'Supporting text 1',
        onPress() {
          setPopup('activity');
          console.log(activities);
        },
      },
      { iconName: 'water-drop', iconLibrary: 'MaterialIcons', mainText: 'Tile 3', supportingText: 'Supporting text 1' },
      { iconName: 'monitor-weight', iconLibrary: 'MaterialIcons', mainText: '80 kg', supportingText: '75 kg' },
    ];

  const onRefresh = useCallback(async (stateAction: (value: boolean) => void) => {
    stateAction(true);
    await fetchActivities();
    await syncUserActivities();
    stateAction(false);
  }, [fetchActivities]);

  return (
    <View
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: theme.surface,
        }}
      >
        <FlatList
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, padding: 16, paddingTop: 8 }}
          columnWrapperStyle={{ gap: 8 }}
          scrollEnabled={false}
          numColumns={2}
          data={tiles}
          refreshControl={
            <RefreshControl
              refreshing={topRefreshing}
              onRefresh={() => onRefresh(setTopRefreshing)}
            />
          }
          ListHeaderComponent={
            <View style={{
              height: 144,
              backgroundColor: theme.surfaceContainer,
              marginBottom: 8,
              borderRadius: 16,
              flexDirection: 'row',
            }} >
              <View style={{ flex: 1 }} />
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: theme.surfaceContainer,
                padding: 16,
                borderRadius: 16,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={item.onPress}
            >
              <DynamicIcon
                name={item.iconName}
                size={32}
                library={item.iconLibrary}
                color={theme.onSurface} />

              <View style={{ flex: 1 }}>
                <AppText type='label-large' style={{ textAlign: 'right' }}>{item.mainText}</AppText>
                <AppText type='label-small' style={{ textAlign: 'right', color: theme.onSurfaceVariant }}>{item.supportingText}</AppText>
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={{
          flex: 1,
          marginHorizontal: 16,
        }} >
          <ScrollView
            style={{
              height: 200,
              backgroundColor: theme.surfaceContainer,
              borderRadius: 16,
            }}
            refreshControl={
              <RefreshControl
                refreshing={listRefreshing}
                onRefresh={() => onRefresh(setListRefreshing)}
              />
            }>
            <AppText>asdf</AppText>
            <AppText>asdf</AppText>
            <AppText>asdf</AppText>
            <AppText>asdf</AppText>
            <AppText>asdf</AppText>
            <AppText>asdf</AppText>
            <AppText>asdf</AppText>
          </ScrollView>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            padding: 4,
          }}>
            <View style={[styles.circleIndicator, { backgroundColor: theme.onSurfaceVariant }]} />
            <View style={[styles.circleIndicator, { backgroundColor: theme.surfaceContainer }]} />
            <View style={[styles.circleIndicator, { backgroundColor: theme.surfaceContainer }]} />
          </View>
        </View>
      </View >

      <SearchPopup
        isVisible={popup === 'activity'}
        onClose={() => setPopup('none')}
        onChangeText={setActivityQuery}
        header='Add activity'
        headerRightIcon={{ iconName: 'pencil-plus', iconLibrary: 'MaterialCommunityIcons' }}
        flatListData={arrangedActivities}
        flatListDataKeyExtractor={(item) => item.id || item.code}
        flatListRenderItem={({ name, metValue }) => (
          <TextRowAdd
            label={name}
            onPress={() => console.log(`Selected ${name}`)}
            iconText={metValue} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circleIndicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
  }
});