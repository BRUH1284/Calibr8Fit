import { api } from "@/shared/services/api";
import { UserProfile, UserSummary } from "../types/user";

const searchUsers = async (query: string): Promise<UserSummary[]> => {
    const response = await api.request({
        endpoint: `/users/search?query=${encodeURIComponent(query)}`,
        method: 'GET',
    });
    return response.map((user: any) => ({
        ...user,
        username: user.userName,
        // Map other fields as necessary
    })) as UserSummary[];
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
    searchUsers,
    getUserByUsername,
    getUserProfileByUsername,
};