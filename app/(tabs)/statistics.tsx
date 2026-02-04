import { useActivityRecord } from "@/features/activity/hooks/useActivityRecord";
import { useWaterIntake } from "@/features/hydration/hooks/useWaterIntake";
import { useConsumptionRecord } from "@/features/nutrition/hooks/useConsumptionRecord";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import { useWeightRecord } from "@/features/weight/hooks/useWeightRecord";
import MonthLineChartCard from "@/shared/components/MonthLineChartCard";
import MonthSelector from "@/shared/components/MonthSelector";
import { useTheme } from "@/shared/hooks/useTheme";
import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

export default function Statistics() {
  const theme = useTheme();

  const { waterIntakeTarget, burnTarget, consumptionTarget } =
    useRecommendations();

  const { loadDailyTotalInNumberRange: waterTotalInRange } = useWaterIntake();
  const { loadDailyTotalInNumberRange: activityTotalInRange } =
    useActivityRecord();
  const { loadDailyTotalInNumberRange: consumptionTotalInRange } =
    useConsumptionRecord();
  const { loadDailyTotalInNumberRange: weightTotalInRange } = useWeightRecord();
  const { profileSettings } = useProfile();

  const [waterIntageData, setWaterIntakeData] = useState<
    { date: Date; value: number }[]
  >([]);
  const [activityData, setActivityData] = useState<
    { date: Date; value: number }[]
  >([]);
  const [consumptionData, setConsumptionData] = useState<
    { date: Date; value: number }[]
  >([]);
  const [weightData, setWeightData] = useState<{ date: Date; value: number }[]>(
    [],
  );

  const [refreshing, setRefreshing] = useState(false);

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
      0,
      0,
      0,
      -1,
    ),
  });

  const fetchData = async (range = dateRange) => {
    setRefreshing(true);
    try {
      await Promise.all([
        waterTotalInRange(range.start, range.end).then(setWaterIntakeData),
        activityTotalInRange(range.start, range.end).then(setActivityData),
        consumptionTotalInRange(range.start, range.end).then(
          setConsumptionData,
        ),
        weightTotalInRange(range.start, range.end).then(setWeightData),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.surface,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
    >
      <MonthSelector
        onMonthChange={(start, end) => {
          setDateRange({ start, end });
          fetchData({ start, end });
        }}
      />
      <MonthLineChartCard
        headline="Water intake"
        color={theme.blue}
        yAxisLabelSuffix=" ml"
        referenceLine1Position={waterIntakeTarget * 1000}
        data={waterIntageData}
      />
      <MonthLineChartCard
        headline="Calories consumed"
        color={theme.yellow}
        yAxisLabelSuffix=" kcal"
        referenceLine1Position={consumptionTarget}
        data={consumptionData}
      />
      <MonthLineChartCard
        headline="Calories burned"
        color={theme.orange}
        yAxisLabelSuffix=" kcal"
        referenceLine1Position={burnTarget}
        data={activityData}
      />
      <MonthLineChartCard
        headline="Weight"
        color={theme.errorVariant}
        yAxisLabelSuffix=" kg"
        referenceLine1Position={profileSettings?.targetWeight ?? 0}
        data={weightData}
      />
    </ScrollView>
  );
}
