import { db } from "@/db/db";
import migrations from '@/drizzle/migrations';
import AuthNavigationProvider from "@/shared/components/AuthNavigationProvider";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useMemo } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  // Run DB migrations
  const { success, error } = useMigrations(db, migrations);

  useMemo(() => {
    if (error)
      throw new Error(`Failed to run migrations: ${error.message}`);

    if (success)
      console.log('Migrations completed successfully');
  }, [success, error]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <KeyboardProvider>
          <AuthNavigationProvider />
        </KeyboardProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
