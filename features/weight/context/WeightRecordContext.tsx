import { useProfile } from "@/features/profile/hooks/useProfile";
import * as Crypto from 'expo-crypto';
import { createContext, useEffect, useState } from "react";
import { weightRecordService } from "../services/weightRecordService";
import { WeightRecord } from "../types/WeightRecord";

interface WeightRecordContextProps {
  weight: number;
  syncWeightRecords: () => Promise<void>;
  loadWeightRecords: () => Promise<WeightRecord[]>;
  loadTodayWeightRecords: () => Promise<WeightRecord[]>;
  addWeightRecord: (record: { time: number; weight: number }) => Promise<void>;
}

export const WeightRecordContext = createContext<WeightRecordContextProps | null>(null);

export const WeightRecordProvider = (
  { children }: { children: React.ReactNode }
) => {
  const { profileSettings, updateProfileSettings } = useProfile();

  const [weight, setWeight] = useState<number>(0);
  const [todayWeightRecords, setTodayWeightRecords] = useState<WeightRecord[]>([]);

  // Sync weight records when the component mounts
  useEffect(() => {
    syncWeightRecords();
  }, []);

  useEffect(() => {
    setWeight(
      todayWeightRecords.length > 0 ? todayWeightRecords[todayWeightRecords.length - 1].weight : 0
    );
  }, [todayWeightRecords]);

  const syncWeightRecords = async () => {
    await weightRecordService.sync();
    loadTodayWeightRecords();
  };

  const addWeightRecord = async (
    record: { time: number; weight: number }
  ) => {
    setTodayWeightRecords(prevRecords => [
      ...prevRecords,
      {
        ...record,
        id: Crypto.randomUUID(),
      } as WeightRecord
    ]);

    await weightRecordService.add(record);

    // Update profile weight if different
    if (profileSettings && record.weight !== profileSettings.weight)
      updateProfileSettings({ ...profileSettings, weight: record.weight });

    loadTodayWeightRecords();
  };

  const loadWeightRecords = weightRecordService.load;

  const loadTodayWeightRecords = async () => {
    const records = await weightRecordService.loadTodayWeightRecords();
    setTodayWeightRecords(records);
    return records;
  };

  return (
    <WeightRecordContext.Provider value={{
      weight,
      syncWeightRecords,
      loadWeightRecords,
      loadTodayWeightRecords,
      addWeightRecord
    }}>
      {children}
    </WeightRecordContext.Provider>
  );
}