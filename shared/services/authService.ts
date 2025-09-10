import { clearAllTables } from '@/db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "./api";
import { authManager } from './authManager';
import { syncTimeService } from './syncTimeService';

const isRegistered = async () => {
    return !!(await AsyncStorage.getItem('registration_state'));
}

const setRegistered = async (state: boolean) => {
    if (state)
        await AsyncStorage.setItem('registration_state', 'complete');
    else
        await AsyncStorage.removeItem('registration_state');
}

const register = async (username: string, password: string) => {
    const response = await api.request({
        endpoint: '/auth/register',
        method: 'POST',
        body: { userName: username, password, deviceId: 'device-id-placeholder' }, // Replace with actual device ID logic
    });

    console.log('Register response:', response);

    if (response.accessToken) {
        authManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    } else {
        throw new Error('Registration failed: No token received');
    }
}

const login = async (username: string, password: string) => {
    const response = await api.request({
        endpoint: '/auth/login',
        method: 'POST',
        body: { userName: username, password, deviceId: 'device-id-placeholder' }, // Replace with actual device ID logic
    });

    if (response.accessToken) {
        authManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    } else {
        throw new Error('Login failed: No token received');
    }
}

const logout = async () => {
    authManager.clearTokens();
    clearAllTables();
    syncTimeService.clearAllLastSyncTimes();
    await setRegistered(false);
    return;
}

export const authService = {
    register,
    login,
    logout,
    isRegistered,
    setRegistered
};