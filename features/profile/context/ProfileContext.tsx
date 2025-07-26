import { createContext } from "react";
import { profileService } from "../services/profileService";
import { ProfileSettings } from "../types/interfaces/profile";

interface ProfileContextProps {
  fetchProfileSettings: () => Promise<ProfileSettings>;
  updateProfileSettings: (settings: ProfileSettings) => Promise<ProfileSettings>;
}

export const ProfileContext = createContext<ProfileContextProps | null>(null);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchProfileSettings = async () => {
    return await profileService.getSettings();
  };

  const updateProfileSettings = async (settings: ProfileSettings) => {
    return await profileService.setSettings(settings);
  };

  return (
    <ProfileContext.Provider value={{ fetchProfileSettings, updateProfileSettings }}>
      {children}
    </ProfileContext.Provider>
  );
}