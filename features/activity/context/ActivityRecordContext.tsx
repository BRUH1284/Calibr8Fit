import { activityRecords } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { createContext, useEffect, useState } from "react";
import { activityRecordService } from "../services/activityRecordService";
import { ActivityRecord } from "../types/ActivityRecord";

interface ActivityRecordContextProps {
  todayRecords: ActivityRecord[];
  todayCaloriesBurned: number;
  addActivityRecord: (
    record: Omit<InferInsertModel<typeof activityRecords>, 'id'>
  ) => Promise<ActivityRecord[]>;
  deleteActivityRecord: (id: string) => Promise<ActivityRecord[]>;
  syncActivityRecords: () => Promise<ActivityRecord[]>;
  loadActivityRecords: (today?: boolean) => Promise<ActivityRecord[]>;
}

export const ActivityRecordContext = createContext<ActivityRecordContextProps | null>(null);

export const ActivityRecordProvider = (
  { children }: { children: React.ReactNode }
) => {
  const [todayRecords, setTodayRecords] = useState<ActivityRecord[]>([]);
  const [todayCaloriesBurned, setTodayCaloriesBurned] = useState<number>(0);

  useEffect(() => {
    setTodayCaloriesBurned(
      todayRecords.reduce((total, record) => total + record.caloriesBurned, 0)
    );
  }, [todayRecords]);

  // Sync activity records when the component mounts
  useEffect(() => {
    syncActivityRecords();
  }, []);

  const addActivityRecord = async (
    record: Omit<InferInsertModel<typeof activityRecords>, 'id'>
  ): Promise<ActivityRecord[]> => {
    setTodayRecords(prevRecords => [
      ...prevRecords,
      {
        ...record,
        id: crypto.randomUUID(),
      } as ActivityRecord
    ]);
    const newRecords = await activityRecordService.addActivityRecord(record);
    setTodayRecords(newRecords);
    return newRecords;
  };

  const deleteActivityRecord = async (id: string): Promise<ActivityRecord[]> => {
    setTodayRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    const updatedRecords = await activityRecordService.deleteActivityRecord(id);
    setTodayRecords(updatedRecords);
    return updatedRecords;
  };

  const syncActivityRecords = async () => {
    const syncedRecords = await activityRecordService.syncActivityRecords();
    setTodayRecords(syncedRecords);
    return syncedRecords;
  };

  const loadActivityRecords = async (today: boolean = false) => {
    const loadedRecords = await activityRecordService.loadActivityRecords(today);
    return loadedRecords;
  };

  return (
    <ActivityRecordContext.Provider value={{
      todayRecords,
      todayCaloriesBurned,
      addActivityRecord,
      deleteActivityRecord,
      syncActivityRecords,
      loadActivityRecords
    }}>
      {children}
    </ActivityRecordContext.Provider>
  );
};