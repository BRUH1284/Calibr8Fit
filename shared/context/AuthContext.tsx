import { profileService } from "@/features/profile/services/profileService";
import { ProfileSettings } from "@/features/profile/types/interfaces/profile";
import { createContext, useEffect, useState } from "react";
import { authManager } from "../services/authManager";
import { authService } from "../services/authService";
import { pushService } from "../services/pushService";

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

  // Initialize authentication state on mount
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await authManager.loadTokens();
    await checkAuth();
    authManager.setEvent({
      onUnauthorized: () => {
        console.warn("Unauthorized access, clearing tokens");
        setRegistrationComplete(false);
        setAuthenticated(false);
      },
    });
  };

  const checkAuth = async () => {
    setIsChecking(true);

    let authenticated = false;
    let registrationComplete = false;

    console.log("Checking authentication status...");

    // Check local storage for tokens
    if (authManager.getAccessToken() && authManager.getRefreshToken()) {
      try {
        // Ensure profile settings can be fetched to confirm auth status
        const profileSettings = await profileService.getSettings();

        // If we can fetch profile settings, user is authenticated
        authenticated = true;

        if (profileSettings.firstName !== '')
          registrationComplete = true;

        pushService.register();
      } catch (error) {
        // If fetching profile settings fails, assume not authenticated
        console.warn("Authentication check failed:", (error as any).status || error);

        // If not 401, check local storage for auth state
        if ((error as any).status !== 401) {
          // assume user is authenticated if tokens exist
          authenticated = true;
          // Check local storage for registration state
          if (!await authService.isRegistered())
            registrationComplete = true;
        } else {
          // If 401, clear tokens
          await authService.logout();
          setAuthenticated(false);
          setRegistrationComplete(false);
          setIsChecking(false);
          return;
        }
      }
    }
    // Update context state
    setAuthenticated(authenticated);
    setRegistrationComplete(registrationComplete);
    authService.setRegistered(registrationComplete);
    setIsChecking(false);
  };

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

  // TODO: logout only while connected to internet
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