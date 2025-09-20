import { dailyBurnTarget } from "@/db/schema";
import { useRecommendations } from "@/features/profile/hooks/useRecommendations";
import { InferInsertModel } from "drizzle-orm";
import { createContext, useEffect, useState } from "react";
import { useActivityRecord } from "../hooks/useActivityRecord";
import { dailyBurnService } from "../services/dailyBurnService";
import { DailyBurnTarget } from "../types/dailyBurnTarget";

interface DailyBurnContextProps {
  targets: DailyBurnTarget[];
  todayCaloriesTarget: number;
  todayCaloriesBurned: number;
  addDailyBurnTarget: (
    target: Omit<InferInsertModel<typeof dailyBurnTarget>, 'id' | 'modifiedAt'>
  ) => Promise<void>;
  deleteDailyBurnTarget: (id: string) => Promise<void>;
  syncDailyBurnTargets: () => Promise<void>;
  loadDailyBurnTargets: () => Promise<DailyBurnTarget[]>;
  loadTodayDailyBurnTargets: () => Promise<DailyBurnTarget[]>;
  loadInRange: (start: number, end: number) => Promise<DailyBurnTarget[]>;
}

export const DailyBurnContext = createContext<DailyBurnContextProps | null>(null);

export const DailyBurnProvider = (
  { children }: { children: React.ReactNode }
) => {
  const [targets, setTodayTargets] = useState<DailyBurnTarget[]>([]);
  const [todayCaloriesTarget, setTodayCaloriesTarget] = useState<number>(0);
  const [todayCaloriesBurned, setTodayCaloriesBurned] = useState<number>(0);

  const { todayRecords } = useActivityRecord();
  const { todayActivityCaloriesBurned } = useActivityRecord();
  const { caloriesBurnedCalculator } = useRecommendations();

  useEffect(() => {
    // Calculate total calories target from today's targets
    const totalCalories = targets.reduce((total, target) => {
      return total + caloriesBurnedCalculator(
        (target.activity ?? target.userActivity!).metValue,
        target.duration / 60,
      );
    }, 0);
    setTodayCaloriesTarget(totalCalories);
  }, [targets, caloriesBurnedCalculator]);

  useEffect(() => {
    // Calculate total calories burned
    const totalCalories = targets.reduce((total, target) =>
      total + todayActivityCaloriesBurned(target.activityId ?? target.userActivityId!)
      , 0);

    setTodayCaloriesBurned(totalCalories);
  }, [targets, todayRecords]);

  // Sync daily burn targets when the component mounts
  useEffect(() => {
    syncDailyBurnTargets();
  }, []);

  const addDailyBurnTarget = async (
    target: Omit<InferInsertModel<typeof dailyBurnTarget>, 'id' | 'modifiedAt'>
  ) => {
    await dailyBurnService.add(target);
    loadTodayDailyBurnTargets();
  };

  const deleteDailyBurnTarget = async (id: string) => {
    await dailyBurnService.softDelete(id);
    loadTodayDailyBurnTargets();
  };

  const syncDailyBurnTargets = async () => {
    await dailyBurnService.sync();
    loadTodayDailyBurnTargets();
  };

  const loadDailyBurnTargets = async () => {
    const loadedTargets = await dailyBurnService.load();
    return loadedTargets;
  };

  const loadTodayDailyBurnTargets = async () => {
    const loadedTargets = await dailyBurnService.loadToday();
    setTodayTargets(loadedTargets);
    return loadedTargets;
  };

  return (
    <DailyBurnContext.Provider value={{
      targets,
      todayCaloriesTarget,
      todayCaloriesBurned,
      loadInRange: dailyBurnService.loadInRange,
      addDailyBurnTarget,
      deleteDailyBurnTarget,
      syncDailyBurnTargets,
      loadDailyBurnTargets,
      loadTodayDailyBurnTargets
    }}>
      {children}
    </DailyBurnContext.Provider>
  );
};

