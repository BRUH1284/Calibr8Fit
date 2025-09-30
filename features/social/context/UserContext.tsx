import { useProfile } from "@/features/profile/hooks/useProfile";
import { createContext } from "react";
import { userService } from "../services/userService";
import { UserProfile, UserSummary } from "../types/user";

interface UserContextProps {
  // Search functionality
  searchUsers: (query: string) => Promise<UserSummary[]>;

  // User details
  getUserByUsername: (username: string) => Promise<UserSummary>;
  getUserProfileByUsername: (username: string) => Promise<UserProfile>;
}

export const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { profileSettings } = useProfile();

  // Search functionality
  const searchUsers = async (query: string) => {
    if (query.trim().length === 0)
      return [];

    try {
      const results = await userService.searchUsers(query);
      return results.filter(user => user.username !== profileSettings?.username);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  // User details
  const getUserByUsername = async (username: string): Promise<UserSummary> => {
    try {
      return await userService.getUserByUsername(username);
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  };

  const getUserProfileByUsername = async (username: string): Promise<UserProfile> => {
    try {
      return await userService.getUserProfileByUsername(username);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{
      searchUsers,
      getUserByUsername,
      getUserProfileByUsername,
    }}>
      {children}
    </UserContext.Provider>
  );
};