import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { api } from "./api";
import { authManager } from './authManager';

const getPermission = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    return finalStatus === 'granted';
}

const getToken = async (): Promise<string | null> => {
    try {
        const devicePushToken = await Notifications.getDevicePushTokenAsync();
        return devicePushToken.data;
    } catch (error) {
        console.error('Error fetching push token:', error as any);
        return null;
    }
}

const getStoredToken = async (): Promise<string | null> =>
    await SecureStore.getItemAsync('push_token');

const storeToken = async (token: string) =>
    await SecureStore.setItemAsync('push_token', token);

const clearToken = async () =>
    await SecureStore.deleteItemAsync('push_token');

const register = async () => {
    // Check permission
    const permissionGranted = await getPermission();
    if (!permissionGranted) return Error('Push notification permission not granted');

    // Get the token
    const token = await getToken();
    if (!token) throw new Error('Token retrieval failed');

    if (token === await getStoredToken()) return; // Already registered

    // Store the token
    await storeToken(token);

    // Register token with backend
    await api.request({
        endpoint: '/push/register',
        method: 'POST',
        body: {
            token,
            deviceId: authManager.getDeviceId(),
        },
    });
}

export const pushService = {
    register,
    clearToken,
};