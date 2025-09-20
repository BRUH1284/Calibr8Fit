import { api } from "@/shared/services/api";
import { ProfileSettings } from "../types/interfaces/profile";

const getSettings = async () => {
    // Fetch profile settings from the server
    const response = await api.request({
        endpoint: '/user-profile/settings',
        method: 'GET',
    });
    response.username = response.userName; // Map userName to username
    return response as ProfileSettings;
}

const setSettings = async (profileSettings: ProfileSettings) => {
    let response = await api.request({
        endpoint: '/user-profile/settings',
        method: 'PUT',
        body: profileSettings,
    });

    response.username = response.userName; // Map userName to username

    if (!response)
        throw new Error('Failed to set profile settings');

    return response as ProfileSettings;
}

export const profileService = {
    getSettings,
    setSettings,
};