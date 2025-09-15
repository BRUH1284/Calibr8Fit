import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import { IconItem } from "@/shared/components/DynamicIcon";
import IconButton from "@/shared/components/IconButton";
import PopupContentBase from "@/shared/components/PopupContentBase";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useActivity } from "../hooks/useActivity";
import { useUserActivity } from "../hooks/useUserActivity";
import { ActivityItem } from "../types/activityRecord";

type Props = {
  onClose: () => void;
  onActivitySelect: (activity: ActivityItem) => void;
  bannedIdList?: Set<string>;
};

export default function ActivitiesListPopupContent({ onClose, onActivitySelect, bannedIdList }: Props) {
  const { activities, syncActivities } = useActivity();
  const { userActivities, syncUserActivities, addUserActivity } = useUserActivity();
  const { caloriesBurnedCalculator } = useRecommendations();

  const [isCreationMode, setIsCreationMode] = useState(false);
  const [header, setHeader] = useState<string>();
  const [headerRightIcon, setHeaderRightIcon] =
    useState<{ iconName: IconItem['name'], iconLibrary: IconItem['library'] }>();
  const [onRightButtonPress, setOnRightButtonPress] = useState<() => void>(() => { });
  const [onBackPress, setOnBackPress] = useState<() => void>(() => onClose);

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
      .filter(({ description, id }) =>
        !(bannedIdList?.has(id)) &&
        description.toLowerCase().includes(activityQuery.toLowerCase())
      )
      .sort((a, b) => a.description.localeCompare(b.description));
  }, [activities, userActivities, activityQuery]);

  // State for adding user activity
  const [createdActivity, setCreatedActivity] = useState({
    description: '',
    metValue: 0,
  });

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

    disableCreationMode();
  }, [createdActivity]);

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncActivities();
    await syncUserActivities();
    setRefreshing(false);
  };

  const disableCreationMode = useCallback(() => {
    setHeader('Activities');
    setHeaderRightIcon({
      iconName: 'pencil-plus',
      iconLibrary: 'MaterialCommunityIcons'
    });
    setOnRightButtonPress(() => enableCreationMode);
    setOnBackPress(() => onClose);
    setIsCreationMode(false);
  }, []);

  const enableCreationMode = useCallback(() => {
    setHeader('Create Activity');
    setHeaderRightIcon(undefined);
    setOnRightButtonPress(() => { });
    setOnBackPress(() => disableCreationMode);
    setIsCreationMode(true);
  }, []);

  useEffect(() => {
    disableCreationMode();
  }, []);

  return (
    <PopupContentBase
      header={header}
      onBackPress={onBackPress}
      headerRightIcon={headerRightIcon}
      onHeaderRightIconPress={onRightButtonPress}
      children={
        isCreationMode ? (
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
        ) : (
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
                  onPress={() => onActivitySelect(item)}
                  iconText={`${item.metValue.toString()} MET`}
                />
              )}
            />
          </>
        )
      }
    />
  );
}