import * as SecureStore from 'expo-secure-store';
import { api } from "./api";


const register = async (username: string, password: string) => {
    const response = await api.request('/auth/register', {
        method: 'POST',
        body: { userName: username, password, deviceId: 'device-id-placeholder' }, // Replace with actual device ID logic
    });

    console.log('Register response:', response);

    if (response.accessToken) {
        await SecureStore.setItemAsync('access_token', response.accessToken);
        await SecureStore.setItemAsync('refresh_token', response.refreshToken);
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
        await SecureStore.setItemAsync('access_token', response.accessToken);
        await SecureStore.setItemAsync('refresh_token', response.refreshToken);
        return response;
    } else {
        throw new Error('Login failed: No token received');
    }
}

export const authService = {
    register,
    login
};