import { createContext, useEffect, useState } from "react";
import { userActivityService } from "../services/userActivityService";
import { UserActivity } from "../types/userActivity";

interface UserActivityContextProps {
  userActivities: UserActivity[];
  fetchUserActivities: () => Promise<UserActivity[]>;
  syncUserActivities: () => Promise<UserActivity[]>;
  addUserActivity: (activity: Omit<UserActivity, 'id' | 'modifiedAt' | 'deleted'>) => Promise<UserActivity>;
}

export const UserActivityContext = createContext<UserActivityContextProps | null>(null);

export const UserActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  // Sync user activities when the component mounts
  useEffect(() => {
    syncUserActivities();
  }, []);

  const loadUserActivities = async () => {
    const localActivities = await userActivityService.loadUserActivity();
    setUserActivities(localActivities);
    return localActivities;
  };

  const fetchUserActivities = async () => {
    const fetchedActivities = await userActivityService.fetchUserActivity();
    setUserActivities(fetchedActivities);
    return fetchedActivities;
  };

  const syncUserActivities = async () => {
    const syncedActivities = await userActivityService.syncUserActivity();
    setUserActivities(syncedActivities);
    return syncedActivities;
  };

  const addUserActivity =
    async (activity: Omit<UserActivity, 'id' | 'modifiedAt' | 'deleted'>):
      Promise<UserActivity> => {
      // Add a new user activity
      const newActivity = await userActivityService.addUserActivity(activity);
      // Update the state with the new activity
      setUserActivities(prevActivities => [...prevActivities, newActivity]);
      return newActivity;
    };

  return (
    <UserActivityContext.Provider value={{
      userActivities,
      fetchUserActivities,
      syncUserActivities,
      addUserActivity
    }}>
      {children}
    </UserActivityContext.Provider>
  );
};