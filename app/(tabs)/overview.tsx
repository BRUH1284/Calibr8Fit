import ActivitiesListCard from "@/features/activity/components/ActivitiesListCard";
import ActivitiesPopup from "@/features/activity/components/ActivitiesPopup";
import { useActivityRecord } from "@/features/activity/hooks/useActivityRecord";
import WaterIntakeRecordPopup from "@/features/hydration/components/WaterIntakeRecordPopup";
import { useWaterIntake } from "@/features/hydration/hooks/useWaterIntake";
import ConsumptionListCard from "@/features/nutrition/components/ConsumptionListCard";
import FoodPopup from "@/features/nutrition/components/FoodPopup";
import { useConsumptionRecord } from "@/features/nutrition/hooks/useConsumptionRecord";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import WeightRecordPopup from "@/features/weight/components/WeightRecordPopup";
import { useWeightRecord } from "@/features/weight/hooks/useWeightRecord";
import IconTile from "@/shared/components/IconTile";
import ProgressCarousel from "@/shared/components/ProgressCarousel";
import { useTheme } from "@/shared/hooks/useTheme";
import { AppTheme } from "@/styles/themes";
import React, { useCallback, useState } from "react";
import { Animated, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { interpolateColor, SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

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

  const [showActivities, setShowActivities] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showWaterIntake, setShowWaterIntake] = useState(false);
  const [showWeightRecord, setShowWeightRecord] = useState(false);

  const { profileSettings } = useProfile();
  const { waterIntake, burnTarget, consumptionTarget } = useRecommendations();
  const { todayWaterIntakeInMl } = useWaterIntake();
  const { weight } = useWeightRecord();
  const { todayCaloriesConsumed } = useConsumptionRecord();

  const { todayCaloriesBurned } = useActivityRecord();

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
        justifyContent: 'center',
      }} >
        <ProgressCarousel />
      </View>
      <View style={{
        flexDirection: 'row',
        gap: 8,
      }}>
        <IconTile
          style={{ flex: 1 }}
          text={`${todayCaloriesConsumed} kcal`}
          supportingText={`${consumptionTarget} kcal`}
          icon={{
            name: 'fastfood',
            library: 'MaterialIcons'
          }}
          onPress={() => setShowFood(true)}
        />
        <IconTile
          style={{ flex: 1 }}
          text={`${todayCaloriesBurned} kcal`}
          supportingText={`${burnTarget} kcal`}
          icon={{
            name: 'local-fire-department',
            library: 'MaterialIcons'
          }}
          onPress={() => setShowActivities(true)}
        />
      </View>
      <View style={{
        flexDirection: 'row',
        gap: 8,
      }}>
        <IconTile
          style={{ flex: 1 }}
          text={`${(todayWaterIntakeInMl / 1000).toFixed(2)} l`}
          supportingText={`${waterIntake} l`}
          icon={{
            name: 'water-drop',
            library: 'MaterialIcons'
          }}
          onPress={() => setShowWaterIntake(true)}
        />
        <IconTile
          style={{ flex: 1 }}
          text={`${weight} kg`}
          supportingText={`${profileSettings?.targetWeight} kg`}
          icon={{
            name: 'monitor-weight',
            library: 'MaterialIcons'
          }}
          onPress={() => setShowWeightRecord(true)}
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
          <View key="1" style={styles.cardPage}>
            <ActivitiesListCard
              onAddActivityPress={() => setShowActivities(true)}
            />
          </View>
          <View key="2" style={styles.cardPage}>
            <ConsumptionListCard
              onAddPress={() => setShowFood(true)}
            />
          </View>
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
      <FoodPopup
        visible={showFood}
        onClose={() => setShowFood(false)}
      />
      <ActivitiesPopup
        visible={showActivities}
        onClose={() => setShowActivities(false)}
      />
      <WaterIntakeRecordPopup
        visible={showWaterIntake}
        onClose={() => setShowWaterIntake(false)}
      />
      <WeightRecordPopup
        visible={showWeightRecord}
        onClose={() => setShowWeightRecord(false)}
      />
    </View>
  );
}