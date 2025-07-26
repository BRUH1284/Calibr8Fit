import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { api } from "./api";

const isRegistered = async () => {
    return !!(await AsyncStorage.getItem('registration_state'));
}

const setRegistered = async (state: boolean) => {
    if (state)
        await AsyncStorage.setItem('registration_state', 'complete');
    else
        await AsyncStorage.removeItem('registration_state');
}

const setTokens = async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
}

const register = async (username: string, password: string) => {
    const response = await api.request('/auth/register', {
        method: 'POST',
        body: { userName: username, password, deviceId: 'device-id-placeholder' }, // Replace with actual device ID logic
    });

    console.log('Register response:', response);

    if (response.accessToken) {
        await setTokens(response.accessToken, response.refreshToken);
        return response;
    } else {
        throw new Error('Login failed: No token received');
    }
}

const login = async (username: string, password: string) => {
    const response = await api.request('/auth/login', {
        method: 'POST',
        body: { userName: username, password, deviceId: 'device-id-placeholder' }, // Replace with actual device ID logic
    });

    if (response.accessToken) {
        await setTokens(response.accessToken, response.refreshToken);
        return response;
    } else {
        throw new Error('Login failed: No token received');
    }
}

const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
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