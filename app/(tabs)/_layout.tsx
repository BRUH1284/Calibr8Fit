import { ActivityProvider } from "@/features/activity/context/ActivityContext";
import { ActivityRecordProvider } from "@/features/activity/context/ActivityRecordContext";
import { UserActivityProvider } from "@/features/activity/context/UserActivityContext";
import { WaterIntakeProvider } from "@/features/hydration/context/WaterIntakeContext";
import { FoodProvider } from "@/features/nutrition/context/FoodContext";
import { MealProvider } from "@/features/nutrition/context/MealContext";
import { UserFoodProvider } from "@/features/nutrition/context/UserFoodContext";
import { ProfileProvider } from "@/features/profile/context/ProfileContext";
import { RecommendationsProvider } from "@/features/profile/context/RecommendationsContext";
import { WeightRecordProvider } from "@/features/weight/context/WeightRecordContext";
import DynamicIcon, { IconItem } from "@/shared/components/DynamicIcon";
import { useTheme } from "@/shared/hooks/useTheme";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <RecommendationsProvider>
        <ActivityProvider>
          <UserActivityProvider>
            <ActivityRecordProvider>
              <FoodProvider>
                <UserFoodProvider>
                  <MealProvider>
                    <WaterIntakeProvider>
                      <WeightRecordProvider>
                        <SafeAreaView
                          edges={['top']}
                          style={{ backgroundColor: theme.surface }} />
                        <Tabs
                          screenOptions={({ route }) => {
                            const config = screenConfigs[route.name];
                            return {
                              headerShown: false,
                              tabBarShowLabel: false,
                              tabBarActiveTintColor: theme.primary,
                              tabBarInactiveTintColor: theme.onSurface,
                              tabBarStyle: {
                                backgroundColor: theme.surfaceContainer,
                                borderTopWidth: 0,
                                height: 64 + 24, // 64 for tab bar height + 24 for safe area
                              },
                              tabBarIconStyle: {
                                height: '100%',
                                alignContent: 'center',
                                justifyContent: 'center',
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
                      </WeightRecordProvider>
                    </WaterIntakeProvider>
                  </MealProvider>
                </UserFoodProvider>
              </FoodProvider>
            </ActivityRecordProvider>
          </UserActivityProvider>
        </ActivityProvider>
      </RecommendationsProvider>
    </ProfileProvider>
  );
}