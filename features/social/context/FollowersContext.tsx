import { createContext } from "react";
import { followersService } from "../services/followersService";
import { UserSummary } from "../types/user";
import { useUser } from "../hooks";

interface FollowersContextProps {
  // Search functionality
  searchFollowers: (
    username: string,
    query: string,
    page: number,
    pageSize: number,
  ) => Promise<UserSummary[]>;
  searchFollowing: (
    username: string,
    query: string,
    page: number,
    pageSize: number,
  ) => Promise<UserSummary[]>;

  // Follow actions
  follow: (username: string) => Promise<void>;
  unfollow: (username: string) => Promise<void>;
}

export const FollowersContext = createContext<FollowersContextProps | null>(
  null,
);

export const FollowersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { changeFollowingCount } = useUser();

  // Search functionality
  const searchFollowers = async (
    username: string,
    query: string,
    page: number,
    pageSize: number,
  ) => {
    try {
      return await followersService.searchFollowers(
        username,
        query,
        page,
        pageSize,
      );
    } catch (error) {
      console.error("Followers search failed:", error);
      return [];
    }
  };

  const searchFollowing = async (
    username: string,
    query: string,
    page: number,
    pageSize: number,
  ) => {
    try {
      return await followersService.searchFollowing(
        username,
        query,
        page,
        pageSize,
      );
    } catch (error) {
      console.error("Following search failed:", error);
      return [];
    }
  };

  // Follow actions
  const follow = async (username: string) => {
    try {
      await followersService.follow(username);
      // Update profile following count
      changeFollowingCount(1);
    } catch (error) {
      console.error("Failed to follow user:", error);
      throw error;
    }
  };

  const unfollow = async (username: string) => {
    try {
      await followersService.unfollow(username);
      // Update profile following count
      changeFollowingCount(-1);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      throw error;
    }
  };

  return (
    <FollowersContext.Provider
      value={{
        // Search functionality
        searchFollowers,
        searchFollowing,
        // Actions
        follow,
        unfollow,
      }}
    >
      {children}
    </FollowersContext.Provider>
  );
};
