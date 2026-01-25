import { consumptionRecords } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { createContext, useEffect, useState } from "react";
import { consumptionRecordService } from "../services/consumptionRecordService";
import {
    calcCaloricValue,
    ConsumptionRecord,
} from "../types/consumptionRecord";

interface ConsumptionRecordContextProps {
  todayRecords: ConsumptionRecord[];
  todayCaloriesConsumed: number;
  addConsumptionRecord: (
    record: Omit<
      InferInsertModel<typeof consumptionRecords>,
      "id" | "modifiedAt"
    >,
  ) => Promise<void>;
  deleteConsumptionRecord: (id: string) => Promise<void>;
  syncConsumptionRecords: () => Promise<void>;
  loadConsumptionRecords: () => Promise<ConsumptionRecord[]>;
  loadToday: () => Promise<ConsumptionRecord[]>;
  loadInTimeNumberRange: (
    start: number,
    end: number,
  ) => Promise<ConsumptionRecord[]>;
  loadDailyTotalInNumberRange: (
    start: Date,
    end: Date,
  ) => Promise<{ date: Date; value: number }[]>;
}

export const ConsumptionRecordContext =
  createContext<ConsumptionRecordContextProps | null>(null);

export const ConsumptionRecordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [todayRecords, setTodayRecords] = useState<ConsumptionRecord[]>([]);
  const [todayCaloriesConsumed, setTodayCaloriesConsumed] = useState<number>(0);

  useEffect(() => {
    // Calculate total calories consumed from today's records
    const totalCalories = todayRecords.reduce(
      (sum, record) => calcCaloricValue(record) + sum,
      0,
    );
    setTodayCaloriesConsumed(totalCalories);
  }, [todayRecords]);

  // Sync consumption records when the component mounts
  useEffect(() => {
    syncConsumptionRecords();
  }, []);

  const addConsumptionRecord = async (
    record: Omit<
      InferInsertModel<typeof consumptionRecords>,
      "id" | "modifiedAt"
    >,
  ) => {
    await consumptionRecordService.add(record);
    loadToday();
  };

  const deleteConsumptionRecord = async (id: string) => {
    setTodayRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id),
    );
    await consumptionRecordService.softDelete(id);
    loadToday();
  };

  const syncConsumptionRecords = async () => {
    await consumptionRecordService.sync();
    loadToday();
  };

  const loadConsumptionRecords = async () => {
    const loadedRecords = await consumptionRecordService.load();
    return loadedRecords;
  };

  const loadToday = async () => {
    const loadedRecords = await consumptionRecordService.loadToday();
    setTodayRecords(loadedRecords);
    return loadedRecords;
  };

  return (
    <ConsumptionRecordContext.Provider
      value={{
        ...consumptionRecordService,
        todayRecords,
        todayCaloriesConsumed,
        addConsumptionRecord,
        deleteConsumptionRecord,
        syncConsumptionRecords,
        loadConsumptionRecords,
        loadToday,
      }}
    >
      {children}
    </ConsumptionRecordContext.Provider>
  );
};
