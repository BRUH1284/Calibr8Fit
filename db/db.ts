import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from "./schema";
import {
  activities,
  activityRecords,
  consumptionRecords,
  dailyBurnTarget,
  foods,
  userActivities,
  userFoods,
  userMealIngredients,
  userMeals,
  waterIntakeRecords,
  weightRecords,
} from "./schema";

const sqlite = SQLite.openDatabaseSync("db.db");

export const db = drizzle(sqlite, { schema });

export const clearAllTables = async (): Promise<void> => {
  try {
    // Delete from tables with foreign key dependencies first
    await db.delete(userMealIngredients);
    await db.delete(activityRecords);
    await db.delete(consumptionRecords);
    await db.delete(dailyBurnTarget);

    // Then delete from other tables
    await db.delete(userMeals);
    await db.delete(userFoods);
    await db.delete(userActivities);
    await db.delete(waterIntakeRecords);
    await db.delete(weightRecords);
    await db.delete(foods);
    await db.delete(activities);

    console.log("All tables cleared successfully");
  } catch (error) {
    console.error("Error clearing tables:", error);
    throw error;
  }
};
