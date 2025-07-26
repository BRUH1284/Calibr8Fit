import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com';

const request = async (
    endpoint: string,
    {
        method = 'GET',
        body,
        headers = {},
        ...customConfig
    }: {
        method?: string,
        body?: any,
        headers?: Record<string, string>,
        customConfig?: Record<string, any>
    } = {}) => {
    const token = await SecureStore.getItemAsync('access_token');

    // Create the request configuration
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
        ...customConfig,
    };

    // Perform the API request
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // If response is not ok, throw an error
        if (!response.ok) {
            const errorData = await response.json();

            // Create and throw a custom error
            const error = new Error(errorData.title);
            error.cause = errorData.errors ? errorData.errors : errorData;
            (error as any).status = response.status;
            throw error;
        }
        // If response is ok, return the parsed JSON
        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            console.log('API error:', error.message);
            console.log('Error details:', error.cause);
            console.log('Status:', (error as any).status);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

export const api = {
    request,
}