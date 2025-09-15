import { db } from "@/db/db";
import migrations from '@/drizzle/migrations';
import AuthNavigationProvider from "@/shared/components/AuthNavigationProvider";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import * as FileSystem from 'expo-file-system';
import { useMemo } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {


  // Run DB migrations
  const { success, error } = useMigrations(db, migrations);

  useMemo(async () => {
    if (error) {
      console.error(`Failed to run migrations: ${error.message}`);

      const dbPath = `${FileSystem.documentDirectory}SQLite/db.db`;
      const fileExists = FileSystem.getInfoAsync(dbPath);
      if ((await fileExists).exists) {
        await FileSystem.deleteAsync(dbPath, { idempotent: true });
        console.warn('Database deleted');
      } else {
        console.error('Database file does not exist');
      }
    }

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
