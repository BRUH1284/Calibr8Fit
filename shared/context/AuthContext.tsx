import { profileService } from "@/features/profile/services/profileService";
import { ProfileSettings } from "@/features/profile/types/interfaces/profile";
import { createContext, useEffect, useState } from "react";
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

  const checkAuth = async () => {
    console.log("Checking authentication status...");
    // Check local storage for registration state
    if (await authService.isRegistered()) {
      setAuthenticated(true);
      setRegistrationComplete(true);
      setIsChecking(false);
      return;
    }

    // Fetch profile settings to confirm authentication
    try {
      const profileSettings = await profileService.getSettings(); // Ensure profile settings can be fetched to confirm auth status

      console.log("Profile settings fetched:", profileSettings);
      setAuthenticated(true)

      if (profileSettings.firstName !== '')
        setRegistrationComplete(true);

      setIsChecking(false);
    } catch (error) {
      console.log("Authentication check failed:", error);
      setAuthenticated(false);
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuth();
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