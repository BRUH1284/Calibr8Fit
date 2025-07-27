import { ProfileProvider } from "@/features/profile/context/ProfileContext";
import DynamicIcon, { IconItem } from "@/shared/components/DynamicIcon";
import { useTheme } from "@/shared/hooks/useTheme";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";

const screenConfigs: Record<string, IconItem> = {
  home: { name: 'home', library: 'MaterialIcons' },
  overview: { name: 'calendar-month', library: 'MaterialCommunityIcons' },
  statistics: { name: 'stats-chart', library: 'Ionicons' },
  messenger: { name: 'message-outline', library: 'MaterialCommunityIcons' },
  profile: { name: 'person', library: 'MaterialIcons' },
};

export default function TabLayout() {
  const theme = useTheme();

  return (
    <ProfileProvider>
      <Tabs
        screenOptions={({ route }) => {
          const config = screenConfigs[route.name];
          return {
            tabBarShowLabel: false,
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.onSurface,
            tabBarStyle: {
              backgroundColor: theme.surfaceContainer,
              borderTopWidth: 0,
              height: 88,
            },
            tabBarIconStyle: {
              height: '100%',
            },
            tabBarButton: (props) =>
              <PlatformPressable
                {...props}
                android_ripple={{ color: 'transparent' }}
              />,
            tabBarIcon: (props) =>
              <DynamicIcon
                name={config.name}
                size={32}
                library={config.library}
                color={props.color}
              />,
          };
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="overview" />
        <Tabs.Screen name="statistics" />
        <Tabs.Screen name="messenger" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </ProfileProvider>
  );
}