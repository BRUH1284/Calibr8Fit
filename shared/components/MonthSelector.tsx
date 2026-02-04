import { useState } from "react";
import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  onMonthChange: (startMonth: Date, endMonth: Date) => void;
};

export default function MonthSelector({ onMonthChange }: Props) {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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
        }}
        onPress={handleNextMonth}
      />
    </View>
  );
}
