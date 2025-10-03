import { api } from "@/shared/services/api";
import { UserSummary } from "../types/user";

const searchFollowers = async (
    username: string,
    query: string,
    page: number,
    pageSize: number
): Promise<UserSummary[]> => {
    const response = await api.request({
        endpoint: `/follow/${encodeURIComponent(username)}/followers/search?query=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`,
        method: 'GET',
    });
    return response.map((dto: any) => ({
        ...dto,
        username: dto.userName,
    })) as UserSummary[];
};

const searchFollowing = async (
    username: string,
    query: string,
    page: number,
    pageSize: number
): Promise<UserSummary[]> => {
    const response = await api.request({
        endpoint: `/follow/${encodeURIComponent(username)}/following/search?query=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`,
        method: 'GET',
    });
    return response.map((dto: any) => ({
        ...dto,
        username: dto.userName,
    })) as UserSummary[];
};


const follow = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/follow/${encodeURIComponent(username)}`,
        method: 'POST',
    });
};

const unfollow = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/follow/${encodeURIComponent(username)}`,
        method: 'DELETE',
    });
};

export const followersService = {
    searchFollowers,
    searchFollowing,
    follow,
    unfollow,
};