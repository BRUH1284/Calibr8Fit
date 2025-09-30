import { api } from "@/shared/services/api";

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
    follow,
    unfollow,
};