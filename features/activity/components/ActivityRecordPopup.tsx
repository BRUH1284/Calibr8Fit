import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import { useCallback, useState } from "react";
import { useActivityRecord } from "../hooks/useActivityRecord";
import { ActivityItem } from "../types/activityRecord";

type Props = {
  activity: ActivityItem;
  visible: boolean;
  onClose: () => void;
  onBackPress: () => void;
};

export default function ActivityRecordPopup({ activity, visible, onClose, onBackPress }: Props) {
  const { addActivityRecord } = useActivityRecord();
  const { caloriesBurnedCalculator } = useRecommendations();

  // State for adding activity record
  const [createdActivityRecord, setCreatedActivityRecord] = useState({
    duration: 0,
    caloriesBurned: 0
  });

  const handleAddActivityRecord = useCallback(() => {
    addActivityRecord({
      time: Date.now(),
      duration: createdActivityRecord.duration,
      caloriesBurned: createdActivityRecord.caloriesBurned,
      activityId: activity.userActivityId ? undefined : activity.id,
      userActivityId: activity.userActivityId,
    });

    // Reset the activity record state
    setCreatedActivityRecord({
      duration: 0,
      caloriesBurned: 0,
    });

    onClose();
  }, [createdActivityRecord]);

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      onBackPress={onBackPress}
      header={'Add Activity Record'}
    >
      <>
        <AppText
          style={{
            textAlign: 'center',
          }}
          type='title-medium'
        >{activity.description}</AppText>
        <TextField
          type='number'
          numberControls={true}
          label={'Minutes'}
          value={(createdActivityRecord?.duration / 60).toString()}
          onChangeText={(value) => setCreatedActivityRecord({
            duration: parseFloat(value) * 60, // Convert minutes to seconds
            caloriesBurned: caloriesBurnedCalculator(activity.metValue, parseFloat(value))
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
    </Popup>
  );
}