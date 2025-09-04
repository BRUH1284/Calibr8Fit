import { createContext, useEffect, useState } from "react";
import { userActivityService } from "../services/userActivityService";
import { UserActivity } from "../types/userActivity";

interface UserActivityContextProps {
  userActivities: UserActivity[];
  fetchUserActivities: () => Promise<void>;
  syncUserActivities: () => Promise<void>;
  addUserActivity: (activity: Omit<UserActivity, 'id' | 'modifiedAt' | 'deleted'>) => Promise<void>;
}

export const UserActivityContext = createContext<UserActivityContextProps | null>(null);

export const UserActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  // Sync user activities when the component mounts
  useEffect(() => {
    syncUserActivities();
  }, []);

  const loadUserActivities = async () => {
    const localActivities = await userActivityService.load();
    setUserActivities(localActivities);
  };

  const fetchUserActivities = async () => {
    await userActivityService.fetch();
    loadUserActivities();
  };

  const syncUserActivities = async () => {
    await userActivityService.sync();
    loadUserActivities();
  };

  const addUserActivity = async (
    activity: Omit<UserActivity, 'id' | 'modifiedAt' | 'deleted'>
  ) => {
    await userActivityService.add(activity);
    loadUserActivities();
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