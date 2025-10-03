import { api } from "@/shared/services/api";
import { UserProfile, UserSummary } from "../types/user";

const searchUsers = async (query: string, page: number, pageSize: number): Promise<UserSummary[]> => {
    const response = await api.request({
        endpoint: `/users/search?query=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`,
        method: 'GET',
    });
    return response.map((user: any) => ({
        ...user,
        username: user.userName,
        // Map other fields as necessary
    })) as UserSummary[];
};

const getCurrentUserProfile = async (): Promise<UserProfile> => {
    const response = await api.request({
        endpoint: '/user-profile',
        method: 'GET',
    });
    return {
        ...response,
        username: response.userName,
    } as UserProfile;
};

const getUserByUsername = async (username: string): Promise<UserSummary> => {
    const response = await api.request({
        endpoint: `/users/${encodeURIComponent(username)}`,
        method: 'GET',
    });
    return {
        ...response,
        username: response.userName,
    } as UserSummary;
};

const getUserProfileByUsername = async (username: string): Promise<UserProfile> => {
    const response = await api.request({
        endpoint: `/user-profile/${encodeURIComponent(username)}`,
        method: 'GET',
    });
    return {
        ...response,
        username: response.userName,
    } as UserProfile;
};

export const userService = {
    getCurrentUserProfile,
    searchUsers,
    getUserByUsername,
    getUserProfileByUsername,
};