import { useWaterIntake } from "@/features/hydration/hooks/useWaterIntake";
import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import MonthLineChartCard from "@/shared/components/MonthLineChartCard";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback } from "react";
import { View } from "react-native";

type RangePoint = {
  date: Date;
  value: number;
};

export default function Statistics() {
  const theme = useTheme();

  const { waterIntakeTarget, burnTarget, consumptionTarget } =
    useRecommendations();

  const { getDailyTotalInRange } = useWaterIntake();

  // local random data generator
  const loadRandomRange = useCallback(
    async (start: Date, end: Date): Promise<RangePoint[]> => {
      const result: RangePoint[] = [];

      const current = new Date(start);
      current.setHours(0, 0, 0, 0);

      console.log("Generating random data from", current, "to", end);

      const last = new Date(end);
      last.setHours(0, 0, 0, 0);

      while (current <= last) {
        result.push({
          date: new Date(current),
          value: Math.floor(Math.random() * 3000),
        });

        current.setDate(current.getDate() + 1);
      }

      return result;
    },
    []
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
        paddingHorizontal: 16,
      }}
    >
      {/* swap between real and mock data here */}
      <MonthLineChartCard
        yAxisLabelSuffix=" ml"
        referenceLine1Position={waterIntakeTarget * 1000}
        loadRange={getDailyTotalInRange}
      />
      {/* <MonthLineChartCard loadRange={getDailyTotalInRange} /> */}
    </View>
  );
}
