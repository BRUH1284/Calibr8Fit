import { createContext } from "react";
import { friendsService } from "../services/friendsService";

interface FriendsContextProps {
  // Friend actions
  sendFriendRequest: (username: string) => Promise<void>;
  cancelFriendRequest: (username: string) => Promise<void>;
  acceptFriendRequest: (username: string) => Promise<void>;
  rejectFriendRequest: (username: string) => Promise<void>;
  removeFriend: (username: string) => Promise<void>;
}

export const FriendsContext = createContext<FriendsContextProps | null>(null);

export const FriendsProvider = ({ children }: { children: React.ReactNode }) => {
  // Friend actions
  const sendFriendRequest = async (username: string) => {
    try {
      await friendsService.sendFriendRequest(username);
    } catch (error) {
      console.error('Failed to send friend request:', error);
      throw error;
    }
  };

  const cancelFriendRequest = async (username: string) => {
    try {
      await friendsService.cancelFriendRequest(username);
    } catch (error) {
      console.error('Failed to cancel friend request:', error);
      throw error;
    }
  };

  const acceptFriendRequest = async (username: string) => {
    try {
      await friendsService.acceptFriendRequest(username);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
      throw error;
    }
  };

  const rejectFriendRequest = async (username: string) => {
    try {
      await friendsService.rejectFriendRequest(username);
    } catch (error) {
      console.error('Failed to reject friend request:', error);
      throw error;
    }
  };

  const removeFriend = async (username: string) => {
    try {
      await friendsService.removeFriend(username);
    } catch (error) {
      console.error('Failed to remove friend:', error);
      throw error;
    }
  };

  return (
    <FriendsContext.Provider value={{
      // Actions
      sendFriendRequest,
      cancelFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
    }}>
      {children}
    </FriendsContext.Provider>
  );
};