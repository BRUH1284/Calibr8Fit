import AuthNavigationProvider from "@/shared/components/AuthNavigationProvider";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AuthNavigationProvider />
      </ThemeProvider>
    </AuthProvider>
  );
}
