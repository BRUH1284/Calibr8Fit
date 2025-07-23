import AuthNavigationProvider from "@/shared/components/AuthNavigationProvider";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
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
