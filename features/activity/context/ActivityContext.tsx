import { createContext, useEffect, useState } from "react";
import { activityService } from "../services/activityService";
import { Activity } from "../types/activity";

interface ActivityContextProps {
  activities: Activity[];
  fetchActivities: () => Promise<Activity[]>;
  syncActivities: () => Promise<Activity[]>;
  loadActivities: () => Promise<Activity[]>;
}

export const ActivityContext = createContext<ActivityContextProps | null>(null);

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Fetch activities when the component mounts
  useEffect(() => {
    syncActivities();
  }, []);

  const syncActivities = async () => {
    const syncedActivities = await activityService.syncActivities();
    setActivities(syncedActivities);
    return syncedActivities;
  }

  const fetchActivities = async () => {
    const fetchedActivities = await activityService.fetchActivities();
    setActivities(fetchedActivities);
    return fetchedActivities;
  };

  const loadActivities = async () => {
    const localActivities = await activityService.loadActivities();
    setActivities(localActivities);
    return localActivities;
  };

  return (
    <ActivityContext.Provider value={{
      activities,
      syncActivities,
      fetchActivities,
      loadActivities,
    }}>
      {children}
    </ActivityContext.Provider>
  );
};