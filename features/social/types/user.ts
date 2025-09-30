export interface UserSummary {
    username: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
}

export interface UserProfile extends UserSummary {
    bio: string;
    friendsCount: number;
    followersCount: number;
    followingCount: number;
    friendshipStatus: FriendshipStatus;
    followedByMe: boolean;
}

export interface FriendRequest {
    requester: UserSummary;
    receiver: UserSummary;
    requestedAt: Date;
}

export enum FriendshipStatus {
    None = 0,
    PendingSent = 1,
    PendingReceived = 2,
    Friends = 3,
}