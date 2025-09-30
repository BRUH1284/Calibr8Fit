import { api } from "@/shared/services/api";
import { FriendRequest, UserSummary } from "../types/user";

const getFriends = async (): Promise<UserSummary[]> => {
    const response = await api.request({
        endpoint: '/friendship/friends',
        method: 'GET',
    });
    return response.map((user: any) => ({
        ...user,
        username: user.userName,
    })) as UserSummary[];
};

const getFriendRequests = async (): Promise<UserSummary[]> => {
    const response = await api.request({
        endpoint: '/friendship/requests',
        method: 'GET',
    });
    return response.map((request: any) => ({
        ...request.requester,
        username: request.requester.userName,
    })) as UserSummary[];
};

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
};

const acceptFriendRequest = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/request/${encodeURIComponent(username)}/accept`,
        method: 'POST',
    });
};

const cancelFriendRequest = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/request/${encodeURIComponent(username)}/cancel`,
        method: 'DELETE',
    });
};

const rejectFriendRequest = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/request/${encodeURIComponent(username)}/reject`,
        method: 'DELETE',
    });
};

const removeFriend = async (username: string): Promise<void> => {
    await api.request({
        endpoint: `/friendship/${encodeURIComponent(username)}`,
        method: 'DELETE',
    });
};

export const friendsService = {
    getFriends,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    rejectFriendRequest,
    removeFriend,
};