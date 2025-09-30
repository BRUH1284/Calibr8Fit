import { SocialProvider } from "@/features/social";
import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <SocialProvider>
      <Stack>
        <Stack.Screen name="myProfile" options={{ headerShown: false }} />
        <Stack.Screen name="userSearch" options={{ headerShown: false }} />
        <Stack.Screen name="[username]" options={{ headerShown: false }} />
      </Stack>
    </SocialProvider>
  );
}