import React from 'react';
import { FollowersProvider } from './FollowersContext';
import { FriendsProvider } from './FriendsContext';
import { UserProvider } from './UserContext';

interface SocialProviderProps {
  children: React.ReactNode;
}

/**
 * Combined provider that includes User, Friends, and Followers contexts.
 * Use this provider to wrap your app or social feature components to get
 * access to all social functionality through their respective hooks.
 * 
 * @example
 * ```tsx
 * <SocialProvider>
 *   <YourSocialComponents />
 * </SocialProvider>
 * ```
 */
export const SocialProvider: React.FC<SocialProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <FriendsProvider>
        <FollowersProvider>
          {children}
        </FollowersProvider>
      </FriendsProvider>
    </UserProvider>
  );
};