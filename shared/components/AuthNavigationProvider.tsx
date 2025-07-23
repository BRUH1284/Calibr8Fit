import { router, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AuthNavigationProvider() {
  const { authenticated, isChecking } = useAuth();

  // Prevent splash screen from hiding while checking authentication
  useEffect(() => {
    if (isChecking) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [isChecking]);

  // Redirect based on authentication status
  useEffect(() => {
    if (!isChecking) {
      if (authenticated) {
        console.log("Root layout - Navigating to tabs");
        router.replace("/(tabs)");
      } else {
        console.log("Root layout - Navigating to auth");
        router.replace("/(auth)/user-info");
      }
    }
  }, [authenticated, isChecking]);

  return <Slot />;
}