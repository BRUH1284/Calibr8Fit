import { useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  style?: StyleProp<ViewStyle>;
  textColor?: keyof Omit<ReturnType<typeof useTheme>, "isDark">;
  onMonthChange: (startMonth: Date, endMonth: Date) => void;
};

export default function MonthSelector({
  style,
  textColor,
  onMonthChange,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const theme = useTheme();

  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    setCurrentMonth(prevMonth);
    const endMonth = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth() + 1,
      1,
      0,
      0,
      0,
      -1,
    );
    onMonthChange(prevMonth, endMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    setCurrentMonth(nextMonth);
    const endMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth() + 1,
      1,
      0,
      0,
      0,
      -1,
    );
    onMonthChange(nextMonth, endMonth);
  };

  return (
    <View style={[styles.container, style]}>
      <IconButton
        variant="icon"
        icon={{
          name: "chevron-left",
          library: "MaterialIcons",
          size: 32,
          color: theme[textColor ?? "onSurface"],
        }}
        onPress={handlePrevMonth}
      />
      <AppText
        type="title-medium"
        style={{ color: theme[textColor ?? "onSurface"] }}
      >
        {currentMonth.toLocaleString("default", {
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
          color: theme[textColor ?? "onSurface"],
        }}
        onPress={handleNextMonth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
});
