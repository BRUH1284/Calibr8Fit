import { createContext, useEffect, useState } from "react";
import { userActivityService } from "../services/userActivityService";
import { UserActivity } from "../types/userActivity";

interface UserActivityContextProps {
  userActivities: UserActivity[];
  fetchUserActivities: () => Promise<UserActivity[]>;
  syncUserActivities: () => Promise<UserActivity[]>;
}

export const UserActivityContext = createContext<UserActivityContextProps | null>(null);

export const UserActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  // Fetch user activities when the component mounts
  useEffect(() => {
    syncUserActivities();
  }, []);

  const fetchUserActivities = async () => {
    try {
      const fetchedActivities = await userActivityService.fetchUserActivity();
      setUserActivities(fetchedActivities);
      return fetchedActivities;
    } catch (error) {
      console.error("Failed to fetch user activities:", error);
      return [];
    }
  };

  const syncUserActivities = async () => {
    try {
      const syncedActivities = await userActivityService.syncUserActivity();
      setUserActivities(syncedActivities);
      return syncedActivities;
    } catch (error) {
      console.error("Failed to sync user activities:", error);
      return [];
    }
  };

  return (
    <UserActivityContext.Provider value={{
      userActivities,
      fetchUserActivities,
      syncUserActivities
    }}>
      {children}
    </UserActivityContext.Provider>
  );
};