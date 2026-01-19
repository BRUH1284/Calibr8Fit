import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  yAxisLabelSuffix?: string;
  referenceLine1Position?: number;
  loadRange: (
    start: Date,
    end: Date
  ) => Promise<{ date: Date; value: number }[]>;
};

export default function MonthLineChartCard({
  yAxisLabelSuffix,
  referenceLine1Position,
  loadRange,
}: Props) {
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
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
      0,
      0,
      0,
      -1
    ),
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
  const maxDataValue = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((d) => d.value));
  }, [data]);

  const loadData = useCallback(
    async (start: Date, end: Date) => {
      const result = await loadRange(start, end);
      return result.map((r) => ({
        value: r.value,
        label:
          (r.date.getDate() + 1) % 5 === 1
            ? r.date.toLocaleString("default", {
                day: "numeric",
              })
            : undefined,
        pointerLabel: `${r.date.getDate()} ${r.date.toLocaleString("default", {
          month: "short",
        })}`,
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
        adjustToWidth
        spacing={chartSpacing}
        data={data}
        startFillColor={theme.blue}
        startOpacity={1}
        endFillColor={theme.surface}
        endOpacity={0}
        xAxisLabelTextStyle={{ width: 20, marginLeft: 5 }}
        yAxisLabelSuffix={yAxisLabelSuffix}
        thickness={2}
        color={theme.blue}
        hideOrigin
        xAxisColor={theme.onSurfaceVariant}
        yAxisColor={theme.onSurfaceVariant}
        rulesColor={theme.surfaceContainer}
        rulesType="solid"
        showReferenceLine1={!!referenceLine1Position}
        maxValue={
          maxDataValue < (referenceLine1Position ?? 0)
            ? referenceLine1Position
            : maxDataValue
        }
        referenceLine1Position={referenceLine1Position}
        referenceLine1Config={{ color: theme.onSurfaceVariant }}
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
