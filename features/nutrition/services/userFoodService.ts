import { userFoods } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { sql } from "drizzle-orm";
import { UserFood } from "../types/userFood";

export const userFoodService = createSyncService<
    typeof userFoods,
    UserFood,
    {
        id: string;
        name: string;
        caloricValue: number;
        fat: number;
        saturatedFats: number;
        monounsaturatedFats: number;
        polyunsaturatedFats: number;
        carbohydrates: number;
        sugars: number;
        protein: number;
        dietaryFiber: number;
        water: number;
        cholesterol: number;
        sodium: number;
        vitaminA: number;
        vitaminB1Thiamine: number;
        vitaminB11FolicAcid: number;
        vitaminB12: number;
        vitaminB2Riboflavin: number;
        vitaminB3Niacin: number;
        vitaminB5PantothenicAcid: number;
        vitaminB6: number;
        vitaminC: number;
        vitaminD: number;
        vitaminE: number;
        vitaminK: number;
        calcium: number;
        copper: number;
        iron: number;
        magnesium: number;
        manganese: number;
        phosphorus: number;
        potassium: number;
        selenium: number;
        zinc: number;
        nutritionDensity: number;
        modifiedAt: string; // ISO date string from the server
        deleted: boolean;
    }
>({
    entityType: SyncEntityType.UserFoods,
    table: userFoods,
    endpoint: '/food/my',
    collectionKey: 'userFoods',
    mapRemoteArrayToLocal: async (remote) => remote.map((food) => ({
        ...food,
        modifiedAt: new Date(food.modifiedAt).getTime(), // Convert to unix timestamp
    })),
    mapLocalArrayToRemote: async (local) => local.map((food) => ({
        ...food,
        modifiedAt: new Date(food.modifiedAt).toISOString() // Convert to ISO string for the server
    })),
    primaryKey: userFoods.id,
    upsertSet: {
        name: sql.raw(`excluded.${userFoods.name.name}`),
        caloricValue: sql.raw(`excluded.${userFoods.caloricValue.name}`),
        fat: sql.raw(`excluded.${userFoods.fat.name}`),
        saturatedFats: sql.raw(`excluded.${userFoods.saturatedFats.name}`),
        monounsaturatedFats: sql.raw(`excluded.${userFoods.monounsaturatedFats.name}`),
        polyunsaturatedFats: sql.raw(`excluded.${userFoods.polyunsaturatedFats.name}`),
        carbohydrates: sql.raw(`excluded.${userFoods.carbohydrates.name}`),
        sugars: sql.raw(`excluded.${userFoods.sugars.name}`),
        protein: sql.raw(`excluded.${userFoods.protein.name}`),
        dietaryFiber: sql.raw(`excluded.${userFoods.dietaryFiber.name}`),
        water: sql.raw(`excluded.${userFoods.water.name}`),
        cholesterol: sql.raw(`excluded.${userFoods.cholesterol.name}`),
        sodium: sql.raw(`excluded.${userFoods.sodium.name}`),
        vitaminA: sql.raw(`excluded.${userFoods.vitaminA.name}`),
        vitaminB1Thiamine: sql.raw(`excluded.${userFoods.vitaminB1Thiamine.name}`),
        vitaminB11FolicAcid: sql.raw(`excluded.${userFoods.vitaminB11FolicAcid.name}`),
        vitaminB12: sql.raw(`excluded.${userFoods.vitaminB12.name}`),
        vitaminB2Riboflavin: sql.raw(`excluded.${userFoods.vitaminB2Riboflavin.name}`),
        vitaminB3Niacin: sql.raw(`excluded.${userFoods.vitaminB3Niacin.name}`),
        vitaminB5PantothenicAcid: sql.raw(`excluded.${userFoods.vitaminB5PantothenicAcid.name}`),
        vitaminB6: sql.raw(`excluded.${userFoods.vitaminB6.name}`),
        vitaminC: sql.raw(`excluded.${userFoods.vitaminC.name}`),
        vitaminD: sql.raw(`excluded.${userFoods.vitaminD.name}`),
        vitaminE: sql.raw(`excluded.${userFoods.vitaminE.name}`),
        vitaminK: sql.raw(`excluded.${userFoods.vitaminK.name}`),
        calcium: sql.raw(`excluded.${userFoods.calcium.name}`),
        copper: sql.raw(`excluded.${userFoods.copper.name}`),
        iron: sql.raw(`excluded.${userFoods.iron.name}`),
        magnesium: sql.raw(`excluded.${userFoods.magnesium.name}`),
        manganese: sql.raw(`excluded.${userFoods.manganese.name}`),
        phosphorus: sql.raw(`excluded.${userFoods.phosphorus.name}`),
        potassium: sql.raw(`excluded.${userFoods.potassium.name}`),
        selenium: sql.raw(`excluded.${userFoods.selenium.name}`),
        zinc: sql.raw(`excluded.${userFoods.zinc.name}`),
        nutritionDensity: sql.raw(`excluded.${userFoods.nutritionDensity.name}`),
        modifiedAt: sql.raw(`excluded.${userFoods.modifiedAt.name}`),
        deleted: sql.raw(`excluded.${userFoods.deleted.name}`),
    },
});
