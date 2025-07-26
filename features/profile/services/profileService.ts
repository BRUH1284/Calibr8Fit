import { api } from "@/shared/services/api";
import { ProfileSettings } from "../types/interfaces/profile";

const getSettings = async () => {
    const response = await api.request('/user-profile/settings', {
        method: 'GET',
    });

    return response as ProfileSettings;
}

const setSettings = async (profileSettings: ProfileSettings) => {
    const response = await api.request('/user-profile/settings', {
        method: 'PUT',
        body: profileSettings,
    });

    if (!response)
        throw new Error('Failed to set profile settings');

    return response as ProfileSettings;
}

export const profileService = {
    getSettings,
    setSettings,
};