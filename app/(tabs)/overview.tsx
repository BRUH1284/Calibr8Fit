import { useActivity } from "@/features/activity/hooks/useActivity";
import { useActivityRecord } from "@/features/activity/hooks/useActivityRecord";
import { useUserActivity } from "@/features/activity/hooks/useUserActivity";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import AppText from "@/shared/components/AppText";
import Divider from "@/shared/components/Divider";
import { IconItem } from "@/shared/components/DynamicIcon";
import IconButton from "@/shared/components/IconButton";
import IconTile from "@/shared/components/IconTile";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useTheme } from "@/shared/hooks/useTheme";
import { AppTheme } from "@/styles/themes";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, NativeSyntheticEvent, RefreshControl, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, { interpolateColor, SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

interface ActivityItem {
  id: string;
  userActivityId?: string;
  majorHeading: string;
  description: string;
  metValue: number;
}

const PAGE_COUNT = 3;

const PageIndicator = ({
  progress,
  activeColor,
  inactiveColor
}: {
  progress: SharedValue<number>,
  activeColor: string,
  inactiveColor: string
}) => {
  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor]
    )
  }));

  return <Animated.View style={[{
    height: 8,
    width: 8,
    borderRadius: 4,
  }, style]} />;
}

const usePagerProgress = (pageCount: number) =>
  Array.from({ length: pageCount }, (_, i) => useSharedValue(i === 0 ? 1 : 0));

const useStyles = (theme: AppTheme) => React.useMemo(() => StyleSheet.create({
  cardPage: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: theme.surfaceContainer,
  },
  circleIndicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
}), [theme]);

export default function Overview() {
  const theme = useTheme();
  const styles = useStyles(theme);

  const { profileSettings } = useProfile();
  const { caloriesBurnedCalculator, waterIntake, rmr } = useRecommendations();

  // Hooks to access activities, user activities, and activity records
  const { activities, syncActivities } = useActivity();
  const { userActivities, syncUserActivities, addUserActivity } = useUserActivity();
  const {
    todayRecords,
    todayCaloriesBurned,
    syncActivityRecords,
    addActivityRecord,
    deleteActivityRecord
  } = useActivityRecord();

  // State for activity search query
  const [activityQuery, setActivityQuery] = useState('');

  // Memoized arranged activities based on the search query
  const arrangedActivities = useMemo(() => {
    const combined = [
      ...activities,
      ...userActivities.map((ua) => ({
        ...ua,
        userActivityId: ua.id
      }))
    ] as ActivityItem[];

    return combined
      .filter(({ description }) =>
        description.toLowerCase().includes(activityQuery.toLowerCase())
      )
      .sort((a, b) => a.description.localeCompare(b.description));
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

  // State for adding activity record
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | undefined>(undefined);
  const [createdActivityRecord, setCreatedActivityRecord] = useState({
    duration: 0,
    caloriesBurned: 0
  });

  // State for popup management
  const [popup, setPopup] = useState<'activity' | 'userActivity' | 'activityRecord'>();
  const [onPopupBackPress, setOnPopupBackPress] = useState<() => void>(() => { });
  const [popupHeader, setPopupHeader] = useState<string>();
  const [popupHeaderRightIcon, setPopupHeaderRightIcon] =
    useState<{ iconName: IconItem['name'], iconLibrary: IconItem['library'] }>();
  const [onPopupRightButtonPress, setOnPopupRightButtonPress] = useState<() => void>(() => { });

  // Function to open popup
  const openPopup = useCallback((
    type: typeof popup,
    options: {
      header?: string;
      headerRightIcon?: { iconName: IconItem['name'], iconLibrary: IconItem['library'] };
      onBackPress?: () => void;
      onRightButtonPress?: () => void;
    }
  ) => {
    setPopup(type);
    setPopupHeader(options.header || '');
    setPopupHeaderRightIcon(options.headerRightIcon);
    setOnPopupBackPress(() => options.onBackPress || (() => setPopup(undefined)));
    setOnPopupRightButtonPress(() => options.onRightButtonPress || (() => { }));
  }, []);

  // Function to handle opening activity popup
  const handleOpenActivityPopup = useCallback(() => {
    openPopup('activity', {
      header: 'Activities',
      headerRightIcon: {
        iconName: 'pencil-plus',
        iconLibrary: 'MaterialCommunityIcons',
      },
      onBackPress: () => setPopup(undefined),
      onRightButtonPress: handleOpenUserActivityPopup,
    });
    setActivityQuery('');
  }, []);

  // Function to handle opening user activity popup
  const handleOpenUserActivityPopup = useCallback(() => {
    openPopup('userActivity', {
      header: 'Create Activity',
      onBackPress: handleOpenActivityPopup,
    });
  }, []);

  // Function to handle opening activity record popup
  const handleOpenActivityRecordPopup = useCallback((activity: ActivityItem) => {
    setSelectedActivity(activity);
    openPopup('activityRecord', {
      header: 'Add Activity Record',
      onBackPress: handleOpenActivityPopup,
    });
  }, []);

  const handleAddActivityRecord = () => {
    addActivityRecord({
      time: Math.floor(Date.now() / 1000),
      duration: createdActivityRecord.duration,
      caloriesBurned: createdActivityRecord.caloriesBurned,
      activityId: selectedActivity!.id,
      userActivityId: selectedActivity!.userActivityId,
    });

    // Reset the activity record state
    setCreatedActivityRecord({
      duration: 0,
      caloriesBurned: 0,
    });

    setPopup(undefined);
  }

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncActivities();
    await syncUserActivities();
    await syncActivityRecords();
    setRefreshing(false);
  };

  const progressArray = usePagerProgress(PAGE_COUNT);

  const HandlePageScroll = useCallback((e: NativeSyntheticEvent<Readonly<{
    position: number;
    offset: number;
  }>>) => {
    const { offset, position } = e.nativeEvent;
    for (let i = 0; i < PAGE_COUNT; i++)
      progressArray[i].value = i === position ? 1 - offset : i === position + 1 ? offset : 0;
  }, [progressArray]);

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        paddingHorizontal: 16,
        backgroundColor: theme.surface
      }}
    >
      <View style={{
        height: 144,
        backgroundColor: theme.surfaceContainer,
        marginVertical: 8,
        borderRadius: 16,
        flexDirection: 'row',
      }} >
        <View style={{ flex: 1 }} />
      </View>
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
          text={`${todayCaloriesBurned} kcal`}
          supportingText={`${rmr} kcal`}
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
          supportingText={`${waterIntake} l`}
          icon={{
            name: 'water-drop',
            library: 'MaterialIcons'
          }}
          onPress={() => setPopup('activity')}
        />
        <IconTile
          text={`${profileSettings?.weight} kg`}
          supportingText={`${profileSettings?.targetWeight} kg`}
          icon={{
            name: 'monitor-weight',
            library: 'MaterialIcons'
          }}
          onPress={() => setPopup('activity')}
        />
      </View>
      <View
        style={{
          flex: 1,
          paddingTop: 8,
          marginHorizontal: -16,
        }}>
        <PagerView
          style={{ flex: 1 }}
          onPageScroll={(e) => { HandlePageScroll(e) }}
        >
          <View key="1" style={[styles.cardPage, { gap: 16 }]}>
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
                onPress={handleOpenActivityPopup}
                style={{ marginLeft: 16, backgroundColor: theme.primaryContainer }}
              />

            </View>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
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
                    orientation='vertical'
                  />
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
                    }}
                  />
                </View>
              )}
            >
            </FlatList>
          </View>
          <View key="2" style={styles.cardPage}></View>
          <View key="3" style={styles.cardPage}></View>
        </PagerView>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          padding: 4,
        }} >
          {progressArray.map((progress, index) => (
            <PageIndicator
              key={index}
              progress={progress}
              activeColor={theme.onSurfaceVariant}
              inactiveColor={theme.surfaceContainer}
            />
          ))}
        </View>
      </View>
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TextRowAdd
                label={item.description}
                onPress={() => handleOpenActivityRecordPopup(item)}
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
              onChangeText={(desc) => setCreatedActivity(({
                ...createdActivity,
                description: desc
              }))}
              multiline={true}
              numberOfLines={8}
            />
            <TextField
              type='number'
              label={'MET Value'}
              value={createdActivity.metValue?.toString()}
              onChangeText={(value) => setCreatedActivity(({
                ...createdActivity,
                metValue: parseFloat(value)
              }))}
              suffix={`${caloriesBurnedCalculator(createdActivity.metValue || 0, 60)} kcal/h`}
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
        {(popup === 'activityRecord') &&
          <>
            <AppText
              style={{
                textAlign: 'center',
              }}
              type='title-medium'
            >{selectedActivity!.description}</AppText>
            <TextField
              type='number'
              numberControls={true}
              label={'Minutes'}
              value={(createdActivityRecord?.duration / 60).toString()}
              onChangeText={(value) => setCreatedActivityRecord({
                duration: parseFloat(value) * 60, // Convert minutes to seconds
                caloriesBurned: caloriesBurnedCalculator(selectedActivity!.metValue, parseFloat(value))
              })}
              suffix='min'
              minValue={0}
            />
            <TextField
              type='number'
              numberControls={true}
              label={'Calories Burned'}
              value={createdActivityRecord?.caloriesBurned.toString()}
              onChangeText={(value) => setCreatedActivityRecord({
                ...createdActivityRecord!,
                caloriesBurned: parseFloat(value)
              })}
              suffix='kcal'
              minValue={0}
            />
            <IconButton
              onPress={handleAddActivityRecord}
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