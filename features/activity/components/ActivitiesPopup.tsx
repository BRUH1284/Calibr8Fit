import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import AppText from "@/shared/components/AppText";
import { IconItem } from "@/shared/components/DynamicIcon";
import IconButton from "@/shared/components/IconButton";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useActivity } from "../hooks/useActivity";
import { useActivityRecord } from "../hooks/useActivityRecord";
import { useUserActivity } from "../hooks/useUserActivity";

interface ActivityItem {
  id: string;
  userActivityId?: string;
  majorHeading: string;
  description: string;
  metValue: number;
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ActivitiesPopup({ visible, onClose }: Props) {
  const [mode, setMode] = useState<'activity' | 'createActivity' | 'activityRecord'>('activity');
  const [header, setHeader] = useState<string>();
  const [headerRightIcon, setHeaderRightIcon] =
    useState<{ iconName: IconItem['name'], iconLibrary: IconItem['library'] }>();
  const [onRightButtonPress, setOnRightButtonPress] = useState<() => void>(() => { });

  const { activities, syncActivities } = useActivity();
  const { userActivities, syncUserActivities, addUserActivity } = useUserActivity();
  const { addActivityRecord } = useActivityRecord();
  const { caloriesBurnedCalculator } = useRecommendations();

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncActivities();
    await syncUserActivities();
    setRefreshing(false);
  };

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

  // State for adding user activity
  const [createdActivity, setCreatedActivity] = useState({
    description: '',
    metValue: 0,
  });

  // State for adding activity record
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | undefined>(undefined);
  const [createdActivityRecord, setCreatedActivityRecord] = useState({
    duration: 0,
    caloriesBurned: 0
  });

  const setActivityMode = useCallback(() => {
    setMode('activity');
    setHeader('Activities');
    setHeaderRightIcon({
      iconName: 'pencil-plus',
      iconLibrary: 'MaterialCommunityIcons'
    });
    setOnRightButtonPress(() => setActivityCreationMode);
  }, []);

  const setActivityCreationMode = useCallback(() => {
    setMode('createActivity');
    setHeader('Create Activity');
    setHeaderRightIcon(undefined);
  }, []);

  const setActivityRecordMode = useCallback((activity: ActivityItem) => {
    setSelectedActivity(activity);

    setMode('activityRecord');
    setHeader('Add Activity Record');
    setHeaderRightIcon(undefined);
  }, []);

  const handleCreateActivity = useCallback(() => {
    addUserActivity({
      majorHeading: 'Custom',
      description: createdActivity.description,
      metValue: createdActivity.metValue ? createdActivity.metValue : 0,
    });

    // Reset the created activity state
    setCreatedActivity({
      description: '',
      metValue: 0,
    });

    setActivityMode();
  }, [createdActivity]);

  const handleAddActivityRecord = useCallback(() => {
    addActivityRecord({
      time: Date.now(),
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

    onClose();
  }, [createdActivityRecord]);


  useEffect(() => {
    if (visible) {
      setActivityMode();
    }
  }, [visible]);

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      onBackPress={mode === 'activity' ? onClose : setActivityMode}
      header={header}
      headerRightIcon={headerRightIcon}
      onHeaderRightIconPress={onRightButtonPress}
    >
      {(mode === 'activity') &&
        <>
          <TextField
            label={'Search'}
            value={activityQuery}
            onChangeText={setActivityQuery}
          />
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            initialNumToRender={10}
            contentContainerStyle={{ gap: 16 }}
            data={arrangedActivities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TextRowAdd
                label={item.description}
                onPress={() => setActivityRecordMode(item)}
                iconText={item.metValue.toString()}
              />
            )}
          />
        </>
      }
      {(mode === 'createActivity') &&
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
      {(mode === 'activityRecord') &&
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
  );
}