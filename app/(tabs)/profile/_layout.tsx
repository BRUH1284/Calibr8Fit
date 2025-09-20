import { UserRepositoryProvider } from "@/features/social/context/UserRepositoryContext";
import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <UserRepositoryProvider>
      <Stack>
        <Stack.Screen name="myProfile" options={{ headerShown: false }} />
        <Stack.Screen name="userSearch" options={{ headerShown: false }} />
        <Stack.Screen name="[username]" options={{ headerShown: false }} />
      </Stack>
    </UserRepositoryProvider>
  );
}