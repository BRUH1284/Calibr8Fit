import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import {
    activities,
    activityRecords,
    foods,
    userActivities,
    userFoods,
    userMealIngredients,
    userMeals,
    waterIntakeRecords,
    weightRecords
} from './schema';

const sqlite = SQLite.openDatabaseSync('db.db');

export const db = drizzle(sqlite);

export const clearAllTables = async (): Promise<void> => {
    try {
        // Delete from tables with foreign key dependencies first
        await db.delete(userMealIngredients);
        await db.delete(activityRecords);

        // Then delete from other tables
        await db.delete(userMeals);
        await db.delete(userFoods);
        await db.delete(userActivities);
        await db.delete(waterIntakeRecords);
        await db.delete(weightRecords);
        await db.delete(foods);
        await db.delete(activities);

        console.log('All tables cleared successfully');
    } catch (error) {
        console.error('Error clearing tables:', error);
        throw error;
    }
};