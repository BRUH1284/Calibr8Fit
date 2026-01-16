import { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  loadRange: (
    start: Date,
    end: Date
  ) => Promise<{ date: Date; value: number }[]>;
};

export default function MonthLineChartCard({ loadRange }: Props) {
  const theme = useTheme();

  const yAxisLabelWidth = 56;
  const [chartSpacing, setChartSpacing] = useState(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    const spacing = (width - yAxisLabelWidth - 33) / 30;
    setChartSpacing(spacing);
  }, []);

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  });

  const handlePrevMonth = useCallback(() => {
    setDateRange((prev) => {
      const start = new Date(prev.start);
      start.setMonth(start.getMonth() - 1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      return { end, start };
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setDateRange((prev) => {
      const start = new Date(prev.start);
      start.setMonth(start.getMonth() + 1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      return { end, start };
    });
  }, []);

  const [data, setData] = useState<
    {
      value: number;
      label?: string;
      pointerLabel: string;
    }[]
  >([]);

  const loadData = useCallback(
    async (start: Date, end: Date) => {
      const result = await loadRange(start, end);
      return result.map((r) => ({
        value: r.value,
        label: "sd",
        pointerLabel: "sd",
        // label:
        //   r.date.getDate() === 1
        //     ? r.date.toLocaleString("default", { day: "numeric", month: "short" })
        //     : undefined,
        // pointerLabel: `${r.date.getDate()} ${r.date.toLocaleString("default", {
        //   month: "short",
        // })}`,
      }));
    },
    [loadRange]
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadData(dateRange.start, dateRange.end);
      setData(result);
    };
    fetchData();
  }, [loadData, dateRange]);

  // const data = useMemo(async () => {
  //   const result = await loadRange(dateRange.start, dateRange.end);
  //   return result.map((r) => ({
  //     value: r.value,
  //     label: 1,
  //     pointerLabel: 2,
  //     // label:
  //     //   r.date.getDate() === 1
  //     //     ? r.date.toLocaleString("default", { day: "numeric", month: "short" })
  //     //     : undefined,
  //     // pointerLabel: `${r.date.getDate()} ${r.date.toLocaleString("default", {
  //     //   month: "short",
  //     // })}`,
  //   }));
  //   // Temporary random data for UI testing
  //   // const result = new Array(30) as {
  //   //   value: number;
  //   //   label?: string;
  //   //   pointerLabel: string;
  //   // }[];
  //   // for (let i = 0; i < 30; i++) {
  //   //   result[i] = {
  //   //     value: Math.random() * 5000,
  //   //     label: i % 8 === 0 ? `${i + 1} Nov` : undefined,
  //   //     pointerLabel: `${i + 1} Nov`,
  //   //   };
  //   // }
  //   // return result;
  // }, [dateRange]);

  return (
    <View
      style={{
        paddingLeft: 2,
        paddingVertical: 8,
        overflowX: "hidden",
        gap: 8,
      }}
      onLayout={handleLayout}
    >
      <AppText type="headline-small">Water intake</AppText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 64,
          gap: 8,
        }}
      >
        <IconButton
          variant="icon"
          icon={{
            name: "chevron-left",
            library: "MaterialIcons",
            size: 32,
          }}
          onPress={handlePrevMonth}
        />
        <AppText type="title-medium">
          {dateRange.start.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </AppText>
        <IconButton
          variant="icon"
          icon={{
            name: "chevron-right",
            library: "MaterialIcons",
            size: 32,
          }}
          onPress={handleNextMonth}
        />
      </View>
      <LineChart
        areaChart
        curved
        disableScroll
        hideDataPoints
        noOfSections={5}
        yAxisLabelWidth={yAxisLabelWidth}
        yAxisTextStyle={{
          color: theme.onSurfaceVariant,
          flex: 1,
          paddingRight: 4,
          textAlign: "right",
        }}
        initialSpacing={0}
        spacing={chartSpacing}
        data={data}
        startFillColor={theme.blue}
        startOpacity={1}
        endFillColor={theme.surface}
        endOpacity={0}
        xAxisLabelTextStyle={{
          width: 50,
          color: theme.onSurfaceVariant,
        }}
        yAxisLabelSuffix=" ml"
        thickness={2}
        color={theme.blue}
        hideOrigin
        xAxisColor={theme.onSurfaceVariant}
        yAxisColor={theme.onSurfaceVariant}
        hideRules
        pointerConfig={{
          pointerStripColor: theme.onSurfaceVariant,
          pointerStripUptoDataPoint: true,
          pointerColor: theme.onSurfaceVariant,
          pointerLabelHeight: 40,
          pointerLabelWidth: 64,
          autoAdjustPointerLabelPosition: true,
          strokeDashArray: [4, 8],
          pointerLabelComponent: (item: (typeof data)[number][]) => {
            return (
              <View
                style={{
                  flex: 1,
                  height: 32,
                  width: 64,
                  borderRadius: 8,
                  backgroundColor: theme.surface,
                  borderColor: theme.outline,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText
                  type="label-medium"
                  style={{ color: theme.onSurfaceVariant }}
                >
                  {item[0].value.toFixed(0)} ml
                </AppText>
                <AppText
                  type="label-small"
                  style={{ color: theme.onSurfaceVariant }}
                >
                  {item[0].pointerLabel}
                </AppText>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
