import { authManager } from './authManager';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type RequestConfig = {
    endpoint: string,
    method?: string,
    body?: any,
    headers?: Record<string, string>,
    [key: string]: any
};

const refreshToken = async () => {
    const response = await api.request({
        endpoint: '/auth/refresh-token',
        method: 'POST',
        body: {
            oldAccessToken: authManager.getAccessToken(),
            refreshToken: authManager.getRefreshToken(),
            deviceId: authManager.getDeviceId(),
        },
    });

    console.warn('Refresh token response:', response);
    authManager.setTokens(response.accessToken, response.refreshToken);

    return !!response.accessToken;
}

const request = async (requestConfig: RequestConfig): Promise<any> => {
    const {
        endpoint,
        method = 'GET',
        body,
        headers = {},
        ...customConfig
    } = requestConfig;

    const token = authManager.getAccessToken();

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

        if (response.status === 401) {
            // try refresh tokens
            if (requestConfig.endpoint !== '/auth/refresh-token' && await refreshToken())
                return request(requestConfig); // Retry the request with new tokens

            // If refresh fails or endpoint is already refresh-token, handle unauthorized
            authManager.handleUnauthorized();
        }

        // If response is not ok, throw an error
        if (!response.ok) {
            let error = new Error();
            try {
                const errorData = await response.json();
                error = new Error(errorData.title);
                // Create and throw a custom error
                error.cause = errorData.errors ? errorData.errors : errorData;
            } catch (e) {
                console.warn('Failed to parse error response:', e);
                error = new Error(e as any);
            }
            // Attach the status code to the error
            (error as any).status = response.status;
            throw error;
        }

        // If response is ok, parse the response body
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
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