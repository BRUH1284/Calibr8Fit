import { ActivityLevel } from "@/shared/types/enums/activityLevel";
import { Climate } from "@/shared/types/enums/climate";
import { Gender } from "@/shared/types/enums/gender";
import { createContext, useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { recommendationsService } from "../services/recommendationsService";

export interface RecommendationsContextProps {
  caloriesBurnedCalculator: (met: number, minutes: number) => number;
  getRMR: () => number;
  getWaterIntake: () => number;
  getBurnTarget: () => number;
  getConsumptionTarget: () => number;
  waterIntake: number;
  rmr: number;
  burnTarget: number;
  consumptionTarget: number;
}

export const RecommendationsContext = createContext<RecommendationsContextProps | null>(null);

export const RecommendationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { profileSettings } = useProfile();
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [rmr, setRmr] = useState<number>(0);
  const [burnTarget, setBurnTarget] = useState<number>(0);
  const [consumptionTarget, setConsumptionTarget] = useState<number>(0);

  useEffect(() => {
    setWaterIntake(getWaterIntake());
    setRmr(getRMR());
    setBurnTarget(getBurnTarget());
    setConsumptionTarget(getConsumptionTarget());
  }, [profileSettings]);

  const caloriesBurnedCalculator = (met: number, minutes: number): number => {
    return recommendationsService.caloriesBurnedCalculator(
      met,
      minutes,
      profileSettings?.weight || 0,
    );
  };

  const age = new Date().getFullYear() - new Date(profileSettings?.dateOfBirth ?? new Date()).getFullYear();

  const getRMR = (): number => {
    return recommendationsService.rmrCalculator(
      profileSettings?.gender || Gender.Male,
      profileSettings?.activityLevel || ActivityLevel.Sedentary,
      profileSettings?.weight || 0,
      profileSettings?.height || 0,
      age,
    );
  };

  const getWaterIntake = (): number => {
    return recommendationsService.waterCalculator(
      profileSettings?.gender || Gender.Male,
      profileSettings?.activityLevel || ActivityLevel.Sedentary,
      profileSettings?.weight || 0,
      profileSettings?.climate || Climate.Temperate,
    );
  };

  const getBurnTarget = (): number => {
    return recommendationsService.burningCalculator(
      profileSettings?.weight || 0,
      profileSettings?.targetWeight || 0,
    );
  }

  const getConsumptionTarget = (): number => {
    return recommendationsService.consumptionCalculator(
      profileSettings?.gender || Gender.Male,
      profileSettings?.activityLevel || ActivityLevel.Sedentary,
      profileSettings?.weight || 0,
      profileSettings?.targetWeight || 0,
      profileSettings?.height || 0,
      age,
    );
  }

  return (
    <RecommendationsContext.Provider value={{
      caloriesBurnedCalculator,
      getRMR,
      getWaterIntake,
      getBurnTarget,
      getConsumptionTarget,
      burnTarget,
      consumptionTarget,
      waterIntake,
      rmr
    }}>
      {children}
    </RecommendationsContext.Provider>
  );
}