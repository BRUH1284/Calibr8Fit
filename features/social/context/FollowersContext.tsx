import { createContext } from "react";
import { followersService } from "../services/followersService";

interface FollowersContextProps {
  // Follow actions
  follow: (username: string) => Promise<void>;
  unfollow: (username: string) => Promise<void>;
}

export const FollowersContext = createContext<FollowersContextProps | null>(null);

export const FollowersProvider = ({ children }: { children: React.ReactNode }) => {
  // Follow actions
  const follow = async (username: string) => {
    try {
      await followersService.follow(username);
    } catch (error) {
      console.error('Failed to follow user:', error);
      throw error;
    }
  };

  const unfollow = async (username: string) => {
    try {
      await followersService.unfollow(username);
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      throw error;
    }
  };

  return (
    <FollowersContext.Provider value={{
      // Actions
      follow,
      unfollow,
    }}>
      {children}
    </FollowersContext.Provider>
  );
};