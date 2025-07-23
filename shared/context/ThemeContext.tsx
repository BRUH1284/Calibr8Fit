import { AppTheme, DarkTheme, LightTheme } from "@/styles/themes";
import { createContext } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext<AppTheme | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}