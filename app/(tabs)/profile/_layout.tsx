import { SocialProvider } from "@/features/social";
import { Stack } from "expo-router";

export default function ProfileStack() {
  // FIXME: header is too wide, because of the safe area insets
  return (
    <SocialProvider>
      <Stack>
        <Stack.Screen name="myProfile" options={{ headerShown: false }} />
        <Stack.Screen name="myFriends" options={{ headerShown: false }} />
        <Stack.Screen name="friendRequests" options={{ title: "Friend Requests" }} />
        <Stack.Screen name="userSearch" options={{ headerShown: false }} />
        <Stack.Screen name="[username]" options={{ headerShown: false }} />
      </Stack>
    </SocialProvider>
  );
}