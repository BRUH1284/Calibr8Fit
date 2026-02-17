import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import PopupContentBase from "@/shared/components/PopupContentBase";
import TextField from "@/shared/components/TextField";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { useDailyBurn } from "../hooks/useDailyBurn";
import { ActivityItem } from "../types/activityRecord";

type Props = {
  activity: ActivityItem;
  onClose: () => void;
};

export default function DailyBurnPopupContent({ activity, onClose }: Props) {
  const { addDailyBurnTarget } = useDailyBurn();
  const { caloriesBurnedCalculator } = useRecommendations();

  // State for adding target
  const [duration, setDuration] = useState(0);

  const handleAddDailyBurnTarget = useCallback(() => {
    addDailyBurnTarget({
      duration: duration,
      activityId: activity.userActivityId ? undefined : activity.id,
      userActivityId: activity.userActivityId,
    });

    setDuration(0);

    onClose();
  }, [duration, activity]);

  const calories = useMemo(
    () => caloriesBurnedCalculator(activity.metValue, duration / 60),
    [duration, activity],
  );

  return (
    <PopupContentBase onBackPress={onClose} header={"Add Target"}>
      <>
        <AppText style={styles.textCenter} type="title-medium">
          {activity.description}
        </AppText>
        <TextField
          type="number"
          numberControls={true}
          label={"Minutes"}
          value={(duration / 60).toString()}
          onChangeText={(value) => setDuration(parseInt(value) * 60)}
          suffix="min"
          minValue={1}
        />
        <AppText type="title-medium">
          {`Estimated Calories Burned: ${calories} kcal`}
        </AppText>
        <IconButton
          onPress={handleAddDailyBurnTarget}
          style={styles.selfEnd}
          icon={{
            name: "check",
            size: 32,
            library: "MaterialIcons",
          }}
        />
      </>
    </PopupContentBase>
  );
}

const styles = StyleSheet.create({
  textCenter: {
    textAlign: "center",
  },
  selfEnd: {
    alignSelf: "flex-end",
  },
});
