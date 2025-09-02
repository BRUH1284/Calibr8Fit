import { activityRecords } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import * as Crypto from 'expo-crypto';
import { createContext, useEffect, useState } from "react";
import { activityRecordService } from "../services/activityRecordService";
import { ActivityRecord } from "../types/ActivityRecord";

interface ActivityRecordContextProps {
  todayRecords: ActivityRecord[];
  todayCaloriesBurned: number;
  addActivityRecord: (
    record: Omit<InferInsertModel<typeof activityRecords>, 'id' | 'modifiedAt'>
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
    record: Omit<InferInsertModel<typeof activityRecords>, 'id' | 'modifiedAt'>
  ): Promise<ActivityRecord[]> => {
    setTodayRecords(prevRecords => [
      ...prevRecords,
      {
        ...record,
        id: Crypto.randomUUID(),
      } as ActivityRecord
    ]);
    const newRecords = await activityRecordService.add(record);
    setTodayRecords(newRecords);
    return newRecords;
  };

  const deleteActivityRecord = async (id: string): Promise<ActivityRecord[]> => {
    setTodayRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    const updatedRecords = await activityRecordService.softDelete(id);
    setTodayRecords(updatedRecords);
    return updatedRecords;
  };

  const syncActivityRecords = async () => {
    const syncedRecords = await activityRecordService.sync();
    setTodayRecords(syncedRecords);
    return syncedRecords;
  };

  const loadActivityRecords = async (today: boolean = false) => {
    const loadedRecords = today ? await activityRecordService.loadToday() : await activityRecordService.load();
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