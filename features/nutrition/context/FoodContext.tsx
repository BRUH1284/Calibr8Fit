import { createContext, useEffect, useState } from "react";
import { foodService } from "../services/foodService";
import { Food } from "../types/food";

interface FoodContextProps {
  foods: Food[];
  fetchFoods: () => Promise<Food[]>;
  syncFoods: () => Promise<Food[]>;
  loadFoods: () => Promise<Food[]>;
}

export const FoodContext = createContext<FoodContextProps | null>(null);

export const FoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [foods, setFoods] = useState<Food[]>([]);

  // Fetch foods when the component mounts
  useEffect(() => {
    syncFoods();
  }, []);

  const syncFoods = async () => {
    const syncedFoods = await foodService.syncFoods();
    setFoods(syncedFoods);
    return syncedFoods;
  }

  const fetchFoods = async () => {
    const fetchedFoods = await foodService.fetchFoods();
    setFoods(fetchedFoods);
    return fetchedFoods;
  };

  const loadFoods = async () => {
    const localFoods = await foodService.loadFoods();
    setFoods(localFoods);
    return localFoods;
  };

  return (
    <FoodContext.Provider value={{
      foods,
      syncFoods,
      fetchFoods,
      loadFoods,
    }}>
      {children}
    </FoodContext.Provider>
  );
};
