import { createContext, useEffect, useState } from "react";
import { userService } from "../services/userService";
import { UserProfile, UserSummary } from "../types/user";

interface UserContextProps {
  // Currently logged-in user
  currentUser?: UserProfile;
  fetchCurrentUserProfile: () => Promise<void>;

  // Functions to update current user profile counts
  changeFriendsCount: (delta: number) => void;
  changeFollowingCount: (delta: number) => void;

  // Search functionality
  searchUsers: (
    query: string,
    page: number,
    pageSize: number
  ) => Promise<UserSummary[]>;

  // User details
  getUserByUsername: (username: string) => Promise<UserSummary>;
  getUserProfileByUsername: (username: string) => Promise<UserProfile>;
}

export const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>();

  // Fetch current user profile on mount
  useEffect(() => {
    fetchCurrentUserProfile();
  }, []);

  // Fetch current user profile
  const fetchCurrentUserProfile = async () => {
    try {
      setCurrentUser(await userService.getCurrentUserProfile());
    } catch (error) {
      console.error("Failed to fetch current user profile:", error);
    }
  };

  // Update current user profile when needed
  const changeFriendsCount = (delta: number) => {
    setCurrentUser((prev) =>
      prev ? { ...prev, friendsCount: prev.friendsCount + delta } : prev
    );
  };

  const changeFollowingCount = (delta: number) => {
    setCurrentUser((prev) =>
      prev ? { ...prev, followingCount: prev.followingCount + delta } : prev
    );
  };

  // Search functionality
  const searchUsers = async (query: string, page: number, pageSize: number) => {
    if (query.trim().length === 0) return [];

    try {
      const results = await userService.searchUsers(query, page, pageSize);
      return results.filter((user) => user.username !== currentUser?.username);
    } catch (error) {
      console.error("User search failed:", error);
      return [];
    }
  };

  // User details
  const getUserByUsername = async (username: string): Promise<UserSummary> => {
    try {
      return await userService.getUserByUsername(username);
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  };

  const getUserProfileByUsername = async (
    username: string
  ): Promise<UserProfile> => {
    try {
      return await userService.getUserProfileByUsername(username);
    } catch (error) {
      console.error("Failed to get user profile:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        fetchCurrentUserProfile,
        changeFriendsCount,
        changeFollowingCount,
        searchUsers,
        getUserByUsername,
        getUserProfileByUsername,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
