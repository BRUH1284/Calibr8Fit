import { ProfileProvider } from "@/features/profile/context/ProfileContext";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <ProfileProvider>
      <Tabs>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="overview" />
        <Tabs.Screen name="statistics" />
        <Tabs.Screen name="messenger" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </ProfileProvider>
  );
}