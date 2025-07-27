import * as SecureStore from 'expo-secure-store';

type AuthEvents = {
    onUnauthorized: () => void;
};

class AuthManager {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private events: AuthEvents | null = null;

    async loadTokens() {
        this.accessToken = await SecureStore.getItemAsync('access_token');
        this.refreshToken = await SecureStore.getItemAsync('refresh_token');
        console.log('Loaded tokens:', this.accessToken, this.refreshToken);
    }

    setTokens(access: string, refresh: string) {
        this.accessToken = access;
        this.refreshToken = refresh;
        SecureStore.setItemAsync('access_token', access);
        SecureStore.setItemAsync('refresh_token', refresh);
    }

    getAccessToken() {
        return this.accessToken;
    }

    getRefreshToken() {
        return this.refreshToken;
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        SecureStore.deleteItemAsync('access_token');
        SecureStore.deleteItemAsync('refresh_token');
    }

    setEvents(events: AuthEvents) {
        this.events = events;
    }

    handleUnauthorized() {
        this.clearTokens();
        this.events?.onUnauthorized?.();
    }
}

export const authManager = new AuthManager();