import { activityRecords } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import { createContext, useEffect, useState } from "react";
import { activityRecordService } from "../services/activityRecordService";
import { ActivityRecord } from "../types/activityRecord";

interface ActivityRecordContextProps {
  todayRecords: ActivityRecord[];
  todayCaloriesBurned: number;
  addActivityRecord: (
    record: Omit<InferInsertModel<typeof activityRecords>, "id" | "modifiedAt">,
  ) => Promise<void>;
  deleteActivityRecord: (id: string) => Promise<void>;
  syncActivityRecords: () => Promise<void>;
  loadActivityRecords: () => Promise<ActivityRecord[]>;
  loadTodayActivityRecords: () => Promise<ActivityRecord[]>;
  loadInRange: (start: number, end: number) => Promise<ActivityRecord[]>;
  todayActivityCaloriesBurned: (activityId: string) => number;
}

export const ActivityRecordContext =
  createContext<ActivityRecordContextProps | null>(null);

export const ActivityRecordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [todayRecords, setTodayRecords] = useState<ActivityRecord[]>([]);
  const [todayCaloriesBurned, setTodayCaloriesBurned] = useState<number>(0);

  useEffect(() => {
    setTodayCaloriesBurned(
      todayRecords.reduce((total, record) => total + record.caloriesBurned, 0),
    );
  }, [todayRecords]);

  // Sync activity records when the component mounts
  useEffect(() => {
    syncActivityRecords();
  }, []);

  const addActivityRecord = async (
    record: Omit<InferInsertModel<typeof activityRecords>, "id" | "modifiedAt">,
  ) => {
    setTodayRecords((prevRecords) => [
      ...prevRecords,
      {
        ...record,
        id: Crypto.randomUUID(),
      } as ActivityRecord,
    ]);
    await activityRecordService.add(record);
    loadTodayActivityRecords();
  };

  const deleteActivityRecord = async (id: string) => {
    setTodayRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id),
    );
    await activityRecordService.softDelete(id);
    loadTodayActivityRecords();
  };

  const syncActivityRecords = async () => {
    await activityRecordService.sync();
    loadTodayActivityRecords();
  };

  const loadActivityRecords = async () => {
    const loadedRecords = await activityRecordService.load();
    return loadedRecords;
  };

  const loadTodayActivityRecords = async () => {
    const loadedRecords = await activityRecordService.loadToday();
    setTodayRecords(loadedRecords);
    return loadedRecords;
  };

  const todayActivityCaloriesBurned = (activityId: string) =>
    todayRecords
      .filter(
        (record) =>
          record.activityId === activityId ||
          record.userActivityId === activityId,
      )
      .reduce((total, record) => total + record.caloriesBurned, 0);

  return (
    <ActivityRecordContext.Provider
      value={{
        todayRecords,
        todayCaloriesBurned,
        addActivityRecord,
        deleteActivityRecord,
        syncActivityRecords,
        loadActivityRecords,
        loadTodayActivityRecords,
        loadInRange: activityRecordService.loadInTimeNumberRange,
        todayActivityCaloriesBurned,
      }}
    >
      {children}
    </ActivityRecordContext.Provider>
  );
};
