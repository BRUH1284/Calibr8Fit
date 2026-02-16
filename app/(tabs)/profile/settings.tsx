import AppText from "@/shared/components/AppText";
import Header from "@/shared/components/Header";
import SettingsItem from "@/shared/components/SettingsItem";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback, useState } from "react";
import { Appearance, useColorScheme, View } from "react-native";

export default function ProfileSettingsScreen() {
  const theme = useTheme();

  // Dark mode state management
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const handleDarkModeToggle = useCallback(() => {
    const newColorScheme = colorScheme === "dark" ? "light" : "dark";
    Appearance.setColorScheme(newColorScheme);
    setIsDarkMode(newColorScheme === "dark");
  }, [colorScheme]);

  const [rationTarget, setRationTarget] = useState<number | null>(null);
  const [burnTarget, setBurnTarget] = useState<number | null>(null);
  const [hydrationTarget, setHydrationTarget] = useState<number | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <Header title="Settings" />
      <View
        style={{
          flex: 1,
          padding: 16,
          paddingTop: 0,
        }}
      >
        <AppText type="title-large">General</AppText>

        <SettingsItem
          type="boolean"
          icon={{ name: "dark-mode", library: "MaterialIcons", size: 24 }}
          label="Dark Mode"
          value={isDarkMode}
          onValueChange={handleDarkModeToggle}
        />

        <SettingsItem
          type="boolean"
          icon={{ name: "notifications", library: "MaterialIcons", size: 24 }}
          label="Notifications"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />

        <AppText type="title-large" style={{ marginTop: 16 }}>
          Goals
        </AppText>

        <SettingsItem
          type="number"
          icon={{ name: "fastfood", library: "MaterialIcons", size: 24 }}
          label="Ration calories target"
          value={rationTarget}
          onValueChange={setRationTarget}
          unit="kcal"
          integer={true}
          minValue={0}
          maxValue={50000}
        />

        <SettingsItem
          type="number"
          icon={{
            name: "local-fire-department",
            library: "MaterialIcons",
            size: 24,
          }}
          label="Burn calories target"
          value={burnTarget}
          onValueChange={setBurnTarget}
          unit="kcal"
          integer={true}
          minValue={0}
          maxValue={50000}
        />

        <SettingsItem
          type="number"
          icon={{ name: "water-drop", library: "MaterialIcons", size: 24 }}
          label="Hydration target"
          value={hydrationTarget}
          onValueChange={setHydrationTarget}
          unit="ml"
          integer={true}
          minValue={0}
          maxValue={10000}
        />
      </View>
    </View>
  );
}
