import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import AppText from "@/shared/components/AppText";
import CircularProgress from "@/shared/components/CircularProgress";
import Divider from "@/shared/components/Divider";
import ProgressIndicator from "@/shared/components/ProgressIndicator";
import { useTheme } from "@/shared/hooks/useTheme";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useActivityRecord } from "../hooks/useActivityRecord";
import { useDailyBurn } from "../hooks/useDailyBurn";

export default function DailyBurnProgressList() {
  const theme = useTheme();

  const { targets, todayCaloriesTarget, todayCaloriesBurned } = useDailyBurn();
  const { todayActivityCaloriesBurned, todayRecords } = useActivityRecord();
  const { caloriesBurnedCalculator } = useRecommendations();

  const minimalTargets = useMemo(
    () =>
      targets.map((t) => ({
        id: t.id,
        description:
          t.activity?.description ||
          t.userActivity?.description ||
          "Unknown Activity",
        duration: t.duration,
        calories: todayActivityCaloriesBurned(
          t.activityId ?? t.userActivityId!
        ),
        progress: Math.min(
          todayActivityCaloriesBurned(t.activityId ?? t.userActivityId!) /
            caloriesBurnedCalculator(
              (t.activity ?? t.userActivity!).metValue,
              t.duration / 60
            ),
          1
        ),
      })),
    [targets, todayActivityCaloriesBurned, todayRecords]
  );

  const progress = useMemo(() => {
    if (todayCaloriesTarget === 0) return 1;
    return Math.min(todayCaloriesBurned / todayCaloriesTarget, 1);
  }, [todayCaloriesBurned, todayCaloriesTarget]);

  return (
    <View style={styles.container}>
      <AppText type="title-large" style={{ paddingBottom: 8 }}>
        Daily Burn
      </AppText>
      <View style={styles.headerContainer}>
        <AppText type="title-medium" style={{ flex: 1 }}>
          Progress
        </AppText>
        <AppText type="title-small">{`${todayCaloriesBurned}/${todayCaloriesTarget} Kcal`}</AppText>
      </View>
      <ProgressIndicator
        color={theme.primary}
        backgroundColor={theme.surfaceContainer}
        progress={progress}
      />
      <View style={styles.list}>
        {minimalTargets.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View style={{ flex: 1 }}>
              <AppText
                type="title-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.description}
              </AppText>
            </View>

            <Divider orientation="vertical" />

            <View style={styles.column}>
              <AppText style={styles.centerText} type="title-medium">
                {item.duration / 60}
              </AppText>
              <AppText
                style={styles.centerText}
                color="onSurfaceVariant"
                type="label-small"
              >
                Minutes
              </AppText>
            </View>

            <View style={styles.column}>
              <AppText style={styles.centerText} type="title-medium">
                {item.calories}
              </AppText>
              <AppText
                style={styles.centerText}
                color="onSurfaceVariant"
                type="label-small"
              >
                Kcal
              </AppText>
            </View>

            <CircularProgress
              size={64}
              strokeWidth={4}
              rings={[
                {
                  color: theme.primary,
                  backgroundColor: theme.surfaceContainer,
                  progress: item.progress,
                },
              ]}
              icons={[
                {
                  name: item.progress === 1 ? "check" : "local-fire-department",
                  library: "MaterialIcons",
                  color: theme.onSurface,
                },
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItem: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  column: {
    width: 48,
  },
  centerText: {
    textAlign: "center",
  },
  list: {
    gap: 8,
    paddingTop: 8,
  },
});
