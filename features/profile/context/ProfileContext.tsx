import { createContext, useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import { ProfileSettings } from "../types/interfaces/profile";

interface ProfileContextProps {
  profileSettings?: ProfileSettings;
  isOffline: boolean;
  fetchProfileSettings: () => Promise<ProfileSettings>;
  updateProfileSettings: (
    settings: ProfileSettings,
  ) => Promise<ProfileSettings>;
  syncProfileSettings: () => Promise<ProfileSettings | null>;
  loadFromLocal: () => Promise<ProfileSettings | null>;
}

export const ProfileContext = createContext<ProfileContextProps | null>(null);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Try to sync on mount
    syncProfileSettings();
  }, []);

  const fetchProfileSettings = async () => {
    try {
      const settings = await profileService.getSettings();
      setProfileSettings(settings);
      setIsOffline(false);
      return settings;
    } catch (error) {
      setIsOffline(true);
      throw error;
    }
  };

  const updateProfileSettings = async (settings: ProfileSettings) => {
    try {
      const updatedSettings = await profileService.setSettings(settings);
      setProfileSettings(updatedSettings);
      setIsOffline(false);
      return updatedSettings;
    } catch (error) {
      // Settings were saved locally even if server update failed
      setProfileSettings(settings);
      setIsOffline(true);
      return settings;
    }
  };

  const syncProfileSettings = async () => {
    try {
      const settings = await profileService.sync();
      if (settings) {
        setProfileSettings(settings);
        setIsOffline(false);
      }
      return settings;
    } catch (error) {
      console.error("Sync failed:", error);
      setIsOffline(true);
      // Load from local storage as fallback
      const localSettings = await profileService.loadFromStorage();
      if (localSettings) {
        setProfileSettings(localSettings);
      }
      return localSettings;
    }
  };

  const loadFromLocal = async () => {
    const settings = await profileService.loadFromStorage();
    if (settings) {
      setProfileSettings(settings);
    }
    return settings;
  };

  return (
    <ProfileContext.Provider
      value={{
        profileSettings,
        isOffline,
        fetchProfileSettings,
        updateProfileSettings,
        syncProfileSettings,
        loadFromLocal,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
