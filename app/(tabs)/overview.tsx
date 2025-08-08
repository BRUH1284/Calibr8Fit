import { useActivity } from "@/features/activity/hooks/useActivity";
import { useUserActivity } from "@/features/activity/hooks/useUserActivity";
import AppText from "@/shared/components/AppText";
import { IconItem } from "@/shared/components/DynamicIcon";
import IconButton from "@/shared/components/IconButton";
import IconTile from "@/shared/components/IconTile";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useTheme } from "@/shared/hooks/useTheme";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function Overview() {
  const { activities, syncActivities } = useActivity();
  const { userActivities, syncUserActivities, addUserActivity } = useUserActivity();
  const theme = useTheme();


  // State for activity search query
  const [activityQuery, setActivityQuery] = useState('');

  // Memoized arranged activities based on the search query
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
  }, [activities, userActivities, activityQuery]);

  // State for creating a new user activity
  const [createdActivity, setCreatedActivity] = useState({
    description: '',
    metValue: undefined as number | undefined,
  });

  const handleCreateActivity = () => {
    addUserActivity({
      majorHeading: 'Custom',
      description: createdActivity.description,
      metValue: createdActivity.metValue ? createdActivity.metValue : 0,
    });

    // Reset the created activity state
    setCreatedActivity({
      description: '',
      metValue: undefined,
    });

    // Close the popup after creating the activity
    handleOpenActivityPopup();
  }

  // State for popup management
  const [popup, setPopup] = useState<'activity' | 'userActivity'>();
  const [onPopupBackPress, setOnPopupBackPress] = useState<() => void>(() => { });
  const [popupHeader, setPopupHeader] = useState<string>();
  const [popupHeaderRightIcon, setPopupHeaderRightIcon] =
    useState<{ iconName: IconItem['name'], iconLibrary: IconItem['library'] }>();
  const [onPopupRightButtonPress, setOnPopupRightButtonPress] = useState<() => void>(() => { });

  const handleOpenActivityPopup = () => {
    setPopup('activity');
    setOnPopupBackPress(() => () => setPopup(undefined));
    setPopupHeader('Activities');
    setPopupHeaderRightIcon({
      iconName: 'pencil-plus',
      iconLibrary: 'MaterialCommunityIcons'
    });
    setActivityQuery('');
    setOnPopupRightButtonPress(() => handleOpenUserActivityPopup);
  };

  const handleOpenUserActivityPopup = () => {
    setPopup('userActivity');
    setOnPopupBackPress(() => handleOpenActivityPopup);
    setPopupHeader('Create Activity');
    setPopupHeaderRightIcon(undefined);
  };

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncActivities();
    await syncUserActivities();
    setRefreshing(false);
  };

  return (
    <View
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          gap: 16,
          justifyContent: "center",
          backgroundColor: theme.surface,
        }}
      >
        <View style={{
          height: 144,
          backgroundColor: theme.surfaceContainer,
          marginHorizontal: 16,
          marginTop: 8,
          borderRadius: 16,
          flexDirection: 'row',
        }} >
          <View style={{ flex: 1 }} />
        </View>
        <View style={{
          gap: 8,
          paddingHorizontal: 16,
        }}>
          <View style={{
            flexDirection: 'row',
            gap: 8,
          }}>
            <IconTile
              style={{ flex: 1 }}
              text='Tile 1'
              supportingText='Tap'
              icon={{
                name: 'fastfood',
                library: 'MaterialIcons'
              }}
              onPress={() => {
                setPopup('activity');
                setOnPopupBackPress(() => setPopup(undefined));
                setPopupHeader('Activities');
                setPopupHeaderRightIcon({
                  iconName: 'pencil-plus',
                  iconLibrary: 'MaterialCommunityIcons'
                });
              }}
            />
            <IconTile
              style={{ flex: 1 }}
              text='Tile 2'
              supportingText='Tap'
              icon={{
                name: 'local-fire-department',
                library: 'MaterialIcons'
              }}
              onPress={handleOpenActivityPopup}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            gap: 8,
          }}>
            <IconTile
              text='Tile 3'
              supportingText='Tap'
              icon={{
                name: 'water-drop',
                library: 'MaterialIcons'
              }}
              onPress={() => setPopup('activity')}
            />
            <IconTile
              text='Tile 4'
              supportingText='Tap'
              icon={{
                name: 'monitor-weight',
                library: 'MaterialIcons'
              }}
              onPress={() => setPopup('activity')}
            />
          </View>
        </View>
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
                refreshing={refreshing}
                onRefresh={handleRefresh}
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
      <Popup
        isVisible={!!popup}
        onClose={() => setPopup(undefined)}
        onBackPress={onPopupBackPress}
        header={popupHeader}
        headerRightIcon={popupHeaderRightIcon}
        onHeaderRightIconPress={onPopupRightButtonPress}
      >
        {(popup === 'activity') && <>
          <TextField
            label={'Search'}
            onChangeText={setActivityQuery}
          />
          <FlatList
            initialNumToRender={10}
            contentContainerStyle={{ gap: 16 }}
            data={arrangedActivities}
            renderItem={({ item }) => (
              <TextRowAdd
                label={item.name}
                onPress={() => console.log(`Selected ${item.name}`)}
                iconText={item.metValue.toString()}
              />
            )}
          />
        </>}
        {(popup === 'userActivity') &&
          <>
            <TextField
              label={'Description'}
              value={createdActivity.description}
              onChangeText={(desc) => setCreatedActivity(({ ...createdActivity, description: desc }))}
              multiline={true}
              numberOfLines={8}
            />
            <TextField
              type='number'
              label={'MET Value'}
              value={createdActivity.metValue?.toString()}
              onChangeText={(value) => setCreatedActivity(({ ...createdActivity, metValue: parseFloat(value) }))}
              suffix='100 kcal/h' //TODO: Calculate based on user weight and MET value
              minValue={0}
            />
            <IconButton
              onPress={handleCreateActivity}
              style={{ alignSelf: 'flex-end' }}
              icon={{
                name: 'check',
                size: 32,
                library: "MaterialIcons",
              }}
            />
          </>
        }
      </Popup>
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