import { useWaterIntake } from "@/features/hydration/hooks/useWaterIntake";
import MonthLineChartCard from "@/shared/components/MonthLineChartCard";
import { useTheme } from "@/shared/hooks/useTheme";
import { useMemo } from "react";
import { View } from "react-native";

export default function Statistics() {
  const theme = useTheme();

  const { getDailyTotalInRange } = useWaterIntake();

  const data = useMemo(() => {
    const result = new Array(30) as {
      value: number;
      label?: string;
    }[];
    for (let i = 0; i < 30; i++) {
      result[i] = {
        value: Math.random() * 100,
        label: i % 5 === 0 ? `${i + 1} Nov` : undefined,
      };
    }
    return result;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
        paddingHorizontal: 16,
      }}
    >
      <MonthLineChartCard loadRange={getDailyTotalInRange} />
    </View>
  );
}
