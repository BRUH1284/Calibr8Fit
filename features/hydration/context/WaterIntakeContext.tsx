import { createContext, useEffect, useState } from "react";
import { waterIntakeService } from "../services/waterIntakeService";
import { WaterIntakeRecord } from "../types/WaterIntakeRecors";

interface WaterIntakeContextProps {
  todayWaterIntakeInMl: number;
  syncWaterIntake: () => Promise<void>;
  loadWaterIntake: () => Promise<WaterIntakeRecord[]>;
  loadTodayWaterIntakeRecords: () => Promise<WaterIntakeRecord[]>;
  addWaterIntakeRecord: (record: { time: number; amountInMl: number }) => Promise<void>;
}

export const WaterIntakeContext = createContext<WaterIntakeContextProps | null>(null);

export const WaterIntakeProvider = (
  { children }: { children: React.ReactNode }
) => {
  const [todayWaterIntakeInMl, setTodayWaterIntakeInMl] = useState<number>(0);
  const [todayWaterIntakeRecords, setTodayWaterIntakeRecords] = useState<WaterIntakeRecord[]>([]);

  // Sync water intake records when the component mounts
  useEffect(() => {
    syncWaterIntake();
  }, []);

  useEffect(() => {
    setTodayWaterIntakeInMl(
      todayWaterIntakeRecords.reduce((total, record) => total + record.amountInMl, 0)
    );
  }, [todayWaterIntakeRecords]);

  const syncWaterIntake = async () => {
    await waterIntakeService.sync();
    loadTodayWaterIntakeRecords();
  };

  const addWaterIntakeRecord = async (
    record: { time: number; amountInMl: number }
  ) => {
    await waterIntakeService.add(record);
    loadTodayWaterIntakeRecords();
  };

  const loadWaterIntake = waterIntakeService.load;

  const loadTodayWaterIntakeRecords = async () => {
    const records = await waterIntakeService.loadTodayWaterIntakeRecords();
    setTodayWaterIntakeRecords(records);
    return records;
  };

  return (
    <WaterIntakeContext.Provider value={{
      todayWaterIntakeInMl,
      syncWaterIntake,
      loadWaterIntake,
      loadTodayWaterIntakeRecords,
      addWaterIntakeRecord
    }}>
      {children}
    </WaterIntakeContext.Provider>
  );
}