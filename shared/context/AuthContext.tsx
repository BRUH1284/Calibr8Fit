import { profileService } from "@/features/profile/services/profileService";
import { ProfileSettings } from "@/features/profile/types/interfaces/profile";
import { createContext, useEffect, useState } from "react";
import { authManager } from "../services/authManager";
import { authService } from "../services/authService";

interface AuthContextProps {
  authenticated: boolean;
  registrationComplete: boolean;
  isChecking: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserInfo: (profileSettings: ProfileSettings) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const init = async () => {
    await authManager.loadTokens();
    checkAuth();
  };

  const checkAuth = async () => {
    setIsChecking(true);

    var authenticated = false;
    var registrationComplete = false;

    console.log("Checking authentication status...");

    // Check local storage for registration state
    if (await authService.isRegistered()) {
      authenticated = true;
      registrationComplete = true;
    } else {
      // Fetch profile settings to confirm authentication
      try {
        // Ensure profile settings can be fetched to confirm auth status
        const profileSettings = await profileService.getSettings();

        console.log("Profile settings fetched:", profileSettings);
        authenticated = true;

        if (profileSettings.firstName !== '')
          registrationComplete = true;
      } catch (error) {
        // If fetching profile settings fails, assume not authenticated
        console.log("Authentication check failed:", error);
      }
    }

    // Update context state
    setAuthenticated(authenticated);
    setRegistrationComplete(registrationComplete);
    authService.setRegistered(registrationComplete);
    setIsChecking(false);
  };

  useEffect(() => {
    init();
  }, []);

  const login = async (username: string, password: string) => {
    await authService.login(username, password);

    checkAuth();
    return;
  }

  const register = async (username: string, password: string) => {
    await authService.register(username, password);

    checkAuth();
    return;
  }

  const setUserInfo = async (profileSettings: ProfileSettings) => {
    await profileService.setSettings(profileSettings);
    checkAuth();
    return;
  }

  const logout = async () => {
    console.warn("Logging out...");
    await authService.logout();
    checkAuth();
    return;
  }

  return (
    <AuthContext.Provider value={{
      authenticated,
      isChecking,
      registrationComplete,
      login,
      register,
      logout,
      setUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
}