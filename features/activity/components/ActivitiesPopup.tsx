import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import { IconItem } from "@/shared/components/DynamicIcon";
import IconButton from "@/shared/components/IconButton";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useActivity } from "../hooks/useActivity";
import { useUserActivity } from "../hooks/useUserActivity";
import { ActivityItem } from "../types/activityRecord";

type Props = {
  visible: boolean;
  onClose: () => void;
  onActivityAdd: (activity: ActivityItem) => void;
};

export default function ActivitiesPopup({ visible, onClose, onActivityAdd }: Props) {
  const [mode, setMode] = useState<'activity' | 'createActivity'>('activity');
  const [header, setHeader] = useState<string>();
  const [headerRightIcon, setHeaderRightIcon] =
    useState<{ iconName: IconItem['name'], iconLibrary: IconItem['library'] }>();
  const [onRightButtonPress, setOnRightButtonPress] = useState<() => void>(() => { });

  const { activities, syncActivities } = useActivity();
  const { userActivities, syncUserActivities, addUserActivity } = useUserActivity();
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
                onPress={() => onActivityAdd(item)}
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
    </Popup>
  );
}