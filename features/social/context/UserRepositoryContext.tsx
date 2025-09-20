import { useProfile } from "@/features/profile/hooks/useProfile";
import { createContext, useState } from "react";
import { userRepositoryService } from "../services/userRepositoryService";
import { UserProfile, UserSummary } from "../types/user";

interface UserRepositoryContextProps {
  // Search functionality
  searchResults: UserSummary[];
  isSearching: boolean;
  searchUsers: (query: string) => Promise<void>;

  // User details
  getUserByUsername: (username: string) => Promise<UserSummary>;
  getUserProfileByUsername: (username: string) => Promise<UserProfile>;
  setSelectedUser: (user: UserProfile | null) => void;
  selectedUser: UserProfile | null;

  // Friends management
  friends: UserSummary[];
  friendRequests: UserSummary[];
  loadFriends: () => Promise<void>;
  loadFriendRequests: () => Promise<void>;

  // Friend actions
  sendFriendRequest: (username: string) => Promise<void>;
  cancelFriendRequest: (username: string) => Promise<void>;
  acceptFriendRequest: (username: string) => Promise<void>;
  rejectFriendRequest: (username: string) => Promise<void>;
  removeFriend: (username: string) => Promise<void>;
}

export const UserRepositoryContext = createContext<UserRepositoryContextProps | null>(null);

export const UserRepositoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { profileSettings } = useProfile();

  // Search state
  const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Friends state
  const [friends, setFriends] = useState<UserSummary[]>([]);
  const [friendRequests, setFriendRequests] = useState<UserSummary[]>([]);

  // Search functionality
  const searchUsers = async (query: string) => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await userRepositoryService.searchUsers(query);
      setSearchResults(results.filter(user => user.username !== profileSettings?.username));
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // User details
  const getUserByUsername = async (username: string): Promise<UserSummary> => {
    throw new Error("Not implemented");
  };

  const getUserProfileByUsername = async (username: string): Promise<UserProfile> => {
    try {
      return await userRepositoryService.getUserProfileByUsername(username);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  const updateSelectedUser = async () => {
    if (!selectedUser) return;
    setSelectedUser(await getUserProfileByUsername(selectedUser.username));
  };

  // Friends management
  const loadFriends = async () => {
    try {
      throw new Error("Not implemented");
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      throw new Error("Not implemented");
    } catch (error) {
      console.error('Failed to load friend requests:', error);
    }
  };

  // Friend actions
  const sendFriendRequest = async (username: string) => {
    try {
      await userRepositoryService.sendFriendRequest(username);
      await updateSelectedUser();
    } catch (error) {
      console.error('Failed to send friend request:', error);
      throw error;
    }
  };

  const cancelFriendRequest = async (username: string) => {
    try {
      await userRepositoryService.cancelFriendRequest(username);
      await updateSelectedUser();
    } catch (error) {
      console.error('Failed to cancel friend request:', error);
      throw error;
    }
  };

  const acceptFriendRequest = async (userId: string) => {
    try {
      await userRepositoryService.acceptFriendRequest(userId);
      await updateSelectedUser();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
      throw error;
    }
  };

  const rejectFriendRequest = async (userId: string) => {
    try {
      await userRepositoryService.rejectFriendRequest(userId);
      await updateSelectedUser();
    } catch (error) {
      console.error('Failed to reject friend request:', error);
      throw error;
    }
  };

  const removeFriend = async (userId: string) => {
    try {
      await userRepositoryService.removeFriend(userId);
      await updateSelectedUser();
    } catch (error) {
      console.error('Failed to remove friend:', error);
      throw error;
    }
  };

  return (
    <UserRepositoryContext.Provider value={{
      // Search
      searchResults,
      isSearching,
      searchUsers,

      // User details
      getUserByUsername,
      getUserProfileByUsername,
      selectedUser,
      setSelectedUser,

      // Friends
      friends,
      friendRequests,
      loadFriends,
      loadFriendRequests,

      // Friend actions
      sendFriendRequest,
      cancelFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
    }}>
      {children}
    </UserRepositoryContext.Provider>
  );
};