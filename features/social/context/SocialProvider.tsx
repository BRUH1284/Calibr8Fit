import React from "react";
import { FollowersProvider } from "./FollowersContext";
import { FriendsProvider } from "./FriendsContext";
import { PostsProvider } from "./PostsContext";
import { UserProvider } from "./UserContext";

interface SocialProviderProps {
  children: React.ReactNode;
}

export const SocialProvider: React.FC<SocialProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <PostsProvider>
        <FriendsProvider>
          <FollowersProvider>{children}</FollowersProvider>
        </FriendsProvider>
      </PostsProvider>
    </UserProvider>
  );
};
