import { api } from "@/shared/services/api";
import { patchService } from "@/shared/services/patchService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileSettings } from "../types/interfaces/profile";

const STORAGE_KEY = "profile_settings";

// Load profile settings from local storage
const loadFromStorage = async (): Promise<ProfileSettings | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Convert dateOfBirth string back to Date
    if (parsed.dateOfBirth) {
      parsed.dateOfBirth = new Date(parsed.dateOfBirth);
    }
    return parsed as ProfileSettings;
  } catch (error) {
    console.error("Failed to load profile settings from storage:", error);
    return null;
  }
};

// Save profile settings to local storage
const saveToStorage = async (settings: ProfileSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save profile settings to storage:", error);
  }
};

// Fetch settings from server, fallback to local storage on failure
const getSettings = async (): Promise<ProfileSettings> => {
  try {
    // Fetch profile settings from the server
    const response = await api.request({
      endpoint: "/user-profile/settings",
      method: "GET",
    });

    // Map response to ProfileSettings format
    const { userName, ...rest } = response;
    const settings = { ...rest, userName } as ProfileSettings;

    // Save to local storage
    await saveToStorage(settings);

    return settings;
  } catch (error) {
    console.log(
      "Failed to fetch profile settings from server, loading from local storage:",
      error,
    );

    // Fallback to local storage (offline mode)
    const localSettings = await loadFromStorage();
    if (localSettings) {
      return localSettings;
    }

    throw new Error(
      "Failed to load profile settings: no server connection and no local data available",
    );
  }
};

// Update settings on server or save locally if offline
const setSettings = async (
  profileSettings: ProfileSettings,
): Promise<ProfileSettings> => {
  const { userName, profilePictureUrl, ...settingsForApi } = profileSettings;

  // Update modifiedAt to current time
  const updatedSettings = {
    ...profileSettings,
    modifiedAt: Date.now(),
  };

  // Save to local storage first
  await saveToStorage(updatedSettings);

  // Convert modifiedAt from number to ISO string for API
  const apiPayload = {
    ...settingsForApi,
    modifiedAt: new Date(updatedSettings.modifiedAt).toISOString(),
  };
  const patchBody = patchService.createJsonPatch(apiPayload);

  try {
    // Try to update on server
    let response = await api.request({
      endpoint: "/user-profile/settings",
      method: "PUT",
      body: patchBody,
    });

    if (!response)
      throw new Error(`Failed to set profile settings: ${response}`);

    // Map response back to ProfileSettings format
    const { userName: responseUserName, ...responseRest } = response;
    const serverSettings = {
      ...responseRest,
      userName: responseUserName,
    } as ProfileSettings;

    // Update local storage with server response
    await saveToStorage(serverSettings);

    return serverSettings;
  } catch (error) {
    console.log(
      "Failed to update profile settings on server, using local copy:",
      error,
    );

    // Return the locally saved settings
    return updatedSettings;
  }
};

// Sync local storage with server when available
const sync = async (): Promise<ProfileSettings | null> => {
  try {
    // Get local settings
    const localSettings = await loadFromStorage();

    // Fetch current server settings
    const serverSettings = await getSettings();

    // If no local settings, just use server data
    if (!localSettings) {
      return serverSettings;
    }

    // Compare modifiedAt timestamps - use the newer one
    if (localSettings.modifiedAt > serverSettings.modifiedAt) {
      // Local changes are newer, push to server
      console.log("Local settings are newer, syncing to server");
      return await setSettings(localSettings);
    } else {
      // Server has newer data, use it
      console.log("Server settings are newer, using server data");
      await saveToStorage(serverSettings);
      return serverSettings;
    }
  } catch (error) {
    console.log("Sync failed, staying in offline mode:", error);
    // Return local data if sync fails
    return await loadFromStorage();
  }
};

export const profileService = {
  getSettings,
  setSettings,
  sync,
  loadFromStorage,
};
