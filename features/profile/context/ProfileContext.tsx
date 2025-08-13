import { createContext, useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import { ProfileSettings } from "../types/interfaces/profile";

interface ProfileContextProps {
  profileSettings?: ProfileSettings;
  fetchProfileSettings: () => Promise<ProfileSettings>;
  updateProfileSettings: (settings: ProfileSettings) => Promise<ProfileSettings>;
}

export const ProfileContext = createContext<ProfileContextProps | null>(null);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>();

  useEffect(() => {
    fetchProfileSettings();
  }, []);

  const fetchProfileSettings = async () => {
    setProfileSettings(await profileService.getSettings());
    return profileSettings!;
  };

  const updateProfileSettings = async (settings: ProfileSettings) => {
    setProfileSettings(await profileService.setSettings(settings));
    return profileSettings!;
  };

  return (
    <ProfileContext.Provider value={{ profileSettings, fetchProfileSettings, updateProfileSettings }}>
      {children}
    </ProfileContext.Provider>
  );
}