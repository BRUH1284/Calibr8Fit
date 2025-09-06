import { createContext, useEffect, useState } from "react";
import { userFoodService } from "../services/userFoodService";
import { UserFood } from "../types/userFood";

interface UserFoodContextProps {
  userFoods: UserFood[];
  fetchUserFoods: () => Promise<void>;
  syncUserFoods: () => Promise<void>;
  addUserFood: (food: Omit<UserFood, 'id' | 'modifiedAt' | 'deleted'>) => Promise<void>;
}

export const UserFoodContext = createContext<UserFoodContextProps | null>(null);

export const UserFoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [userFoods, setUserFoods] = useState<UserFood[]>([]);

  // Sync user foods when the component mounts
  useEffect(() => {
    syncUserFoods();
  }, []);

  const loadUserFoods = async () => {
    const localFoods = await userFoodService.load();
    setUserFoods(localFoods);
  };

  const fetchUserFoods = async () => {
    await userFoodService.fetch();
    loadUserFoods();
  };

  const syncUserFoods = async () => {
    await userFoodService.sync();
    loadUserFoods();
  };

  const addUserFood = async (
    food: Omit<UserFood, 'id' | 'modifiedAt' | 'deleted'>
  ) => {
    await userFoodService.add(food);
    loadUserFoods();
  };

  return (
    <UserFoodContext.Provider value={{
      userFoods,
      fetchUserFoods,
      syncUserFoods,
      addUserFood
    }}>
      {children}
    </UserFoodContext.Provider>
  );
};
