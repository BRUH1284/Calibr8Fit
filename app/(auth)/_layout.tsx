import { useTheme } from "@/shared/hooks/useTheme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const theme = useTheme();

  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="sign-up" options={{ title: 'Sign up' }} />
    <Stack.Screen 
      name="user-info" 
      options={{ 
        title: 'Personal info',
        // The back button behavior will be handled in the component itself
        headerBackVisible: true,
      }} 
    />
  </Stack>
}