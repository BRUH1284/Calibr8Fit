import { api } from "@/shared/services/api";
import { FriendRequest, UserProfile, UserSummary } from "../types/user";

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

const getUserProfileByUsername = async (username: string): Promise<UserProfile> => {
    const response = await api.request({
        endpoint: `/user-profile/${encodeURIComponent(username)}`,
        method: 'GET',
    });
    return {
        ...response,
        username: response.userName,
    } as UserProfile;
}

const sendFriendRequest = async (username: string): Promise<FriendRequest> => {
    const response = await api.request({
        endpoint: `/friendship/request/${encodeURIComponent(username)}`,
        method: 'POST',
    });
    return {
        requester: response.requester,
        receiver: response.receiver,
        requestedAt: new Date(response.requestedAt),
    } as FriendRequest;
}

const acceptFriendRequest = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/request/${encodeURIComponent(username)}/accept`,
        method: 'POST',
    });
}

const cancelFriendRequest = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/request/${encodeURIComponent(username)}/cancel`,
        method: 'DELETE',
    });
}

const rejectFriendRequest = async (userId: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/request/${encodeURIComponent(userId)}/reject`,
        method: 'DELETE',
    });
}

const removeFriend = async (userId: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/${encodeURIComponent(userId)}`,
        method: 'DELETE',
    });
}

export const userRepositoryService = {
    searchUsers,
    getUserProfileByUsername,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    rejectFriendRequest,
    removeFriend,
};
