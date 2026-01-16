import { createContext, useCallback, useEffect, useState } from "react";
import { waterIntakeService } from "../services/waterIntakeService";
import { WaterIntakeRecord } from "../types/WaterIntakeRecord";

interface WaterIntakeContextProps {
  todayWaterIntakeInMl: number;
  syncWaterIntake: () => Promise<void>;
  loadWaterIntake: () => Promise<WaterIntakeRecord[]>;
  loadTodayWaterIntakeRecords: () => Promise<WaterIntakeRecord[]>;
  addWaterIntakeRecord: (record: {
    time: number;
    amountInMl: number;
  }) => Promise<void>;
  loadInRange: (start: number, end: number) => Promise<WaterIntakeRecord[]>;
  getDailyTotalInRange: (
    start: Date,
    end: Date
  ) => Promise<{ date: Date; value: number }[]>;
}

export const WaterIntakeContext = createContext<WaterIntakeContextProps | null>(
  null
);

export const WaterIntakeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [todayWaterIntakeInMl, setTodayWaterIntakeInMl] = useState<number>(0);
  const [todayWaterIntakeRecords, setTodayWaterIntakeRecords] = useState<
    WaterIntakeRecord[]
  >([]);

  const syncWaterIntake = useCallback(async () => {
    await waterIntakeService.sync();
    loadTodayWaterIntakeRecords();
  }, []);

  // Sync water intake records when the component mounts
  useEffect(() => {
    syncWaterIntake();
  }, [syncWaterIntake]);

  useEffect(() => {
    setTodayWaterIntakeInMl(
      todayWaterIntakeRecords.reduce(
        (total, record) => total + record.amountInMl,
        0
      )
    );
  }, [todayWaterIntakeRecords]);

  const addWaterIntakeRecord = async (record: {
    time: number;
    amountInMl: number;
  }) => {
    console.log("Adding water intake record:", record);
    await waterIntakeService.add(record);
    loadTodayWaterIntakeRecords();
  };

  const loadWaterIntake = waterIntakeService.load;

  const loadTodayWaterIntakeRecords = async () => {
    const records = await waterIntakeService.loadToday();
    setTodayWaterIntakeRecords(records);
    return records;
  };

  const getDailyTotalInRange = async (start: Date, end: Date) => {
    return await waterIntakeService.loadDailySumInRange(start, end);
  };

  const loadInRange = waterIntakeService.loadInRange;

  return (
    <WaterIntakeContext.Provider
      value={{
        todayWaterIntakeInMl,
        syncWaterIntake,
        loadWaterIntake,
        loadTodayWaterIntakeRecords,
        addWaterIntakeRecord,
        loadInRange,
        getDailyTotalInRange,
      }}
    >
      {children}
    </WaterIntakeContext.Provider>
  );
};
