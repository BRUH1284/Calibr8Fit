import { db } from "@/db/db";
import { consumptionRecords, foods, userFoods, userMealIngredients, userMeals } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { ConsumptionRecord } from "../types/consumptionRecord";
import { MealIngredient } from "../types/meal";

const load = async (today: boolean = false): Promise<ConsumptionRecord[]> => {
    const start = new Date().setHours(0, 0, 0, 0);
    const end = start + 24 * 60 * 60 * 1000;

    const predicates = today ? [
        eq(consumptionRecords.deleted, false),
        gte(consumptionRecords.time, start),
        lt(consumptionRecords.time, end)
    ] : [];

    const records = await db
        .select({
            id: consumptionRecords.id,
            foodId: consumptionRecords.foodId,
            userFoodId: consumptionRecords.userFoodId,
            userMealId: consumptionRecords.userMealId,
            quantity: consumptionRecords.quantity,
            time: consumptionRecords.time,
            modifiedAt: consumptionRecords.modifiedAt,
            deleted: consumptionRecords.deleted,
            food: foods,
            userFood: userFoods,
            userMeal: userMeals
        })
        .from(consumptionRecords)
        .leftJoin(foods, eq(consumptionRecords.foodId, foods.id))
        .leftJoin(userFoods, eq(consumptionRecords.userFoodId, userFoods.id))
        .leftJoin(userMeals, eq(consumptionRecords.userMealId, userMeals.id))
        .where(and(...predicates));

    if (records.length === 0) return [];

    const mealIds = records.map(record => record.userMealId).filter(id => id !== null);
    const mealIngredients = (await db
        .select()
        .from(userMealIngredients)
        .where(inArray(userMealIngredients.userMealId, mealIds))
        .leftJoin(foods, eq(userMealIngredients.foodId, foods.id))
        .leftJoin(userFoods, eq(userMealIngredients.userFoodId, userFoods.id)))
        .map(({ user_meal_ingredients, foods, user_foods }) => ({
            ...user_meal_ingredients,
            food: foods,
            userFood: user_foods,
        })) as MealIngredient[];

    const ingredientsByMealId: Record<string, MealIngredient[]> = {};
    for (const ingredient of mealIngredients) {
        if (!ingredientsByMealId[ingredient.userMealId])
            ingredientsByMealId[ingredient.userMealId] = [];
        ingredientsByMealId[ingredient.userMealId].push(ingredient);
    }

    return records.map(record => ({
        ...record,
        userMeal: record.userMealId === null || record.userMeal === null ? null : {
            ...record.userMeal,
            mealIngredients: (ingredientsByMealId[record.userMealId] || []).map(ingredient => ({
                ...ingredient,
                foodId: ingredient.foodId === null ? undefined : ingredient.foodId,
                userFoodId: ingredient.userFoodId === null ? undefined : ingredient.userFoodId,
            })),
        }
    }));
}

const syncService = createSyncService<
    typeof consumptionRecords,
    ConsumptionRecord,
    {
        id: string;
        foodId: string | null;
        userMealId: string | null;
        quantity: number;
        time: string;
        modifiedAt: string;
        deleted: boolean;
    }
>({
    entityType: SyncEntityType.ConsumptionRecords,
    table: consumptionRecords,
    endpoint: '/consumption-record',
    collectionKey: 'consumptionRecords',
    mapRemoteArrayToLocal: async (remote) => {
        const foodsIdSet = new Set((await db
            .select({ id: foods.id })
            .from(foods)
            .where(
                inArray(foods.id, remote.map(record => record.foodId).filter(id => id !== null))
            )
        ).map(row => row.id));

        return remote.map((record) => ({
            ...record,
            foodId: record.foodId !== null ? (foodsIdSet.has(record.foodId) ? record.foodId : null) : null,
            userFoodId: record.foodId !== null ? (foodsIdSet.has(record.foodId) ? null : record.foodId) : null,
            userMealId: record.userMealId,
            modifiedAt: new Date(record.modifiedAt).getTime(), // Convert to unix timestamp
            time: new Date(record.time).getTime(), // Convert to unix timestamp
        })) as ConsumptionRecord[];
    },
    mapLocalArrayToRemote: async (local) => local.map((record) => ({
        ...record,
        foodId: record.foodId ?? record.userFoodId ?? null,
        modifiedAt: new Date(record.modifiedAt).toISOString(), // Convert to ISO string for the server
        time: new Date(record.time).toISOString(),
    })),
    primaryKey: consumptionRecords.id,
    upsertSet: {
        foodId: sql.raw(`excluded.${consumptionRecords.foodId.name}`),
        userFoodId: sql.raw(`excluded.${consumptionRecords.userFoodId.name}`),
        userMealId: sql.raw(`excluded.${consumptionRecords.userMealId.name}`),
        quantity: sql.raw(`excluded.${consumptionRecords.quantity.name}`),
        time: sql.raw(`excluded.${consumptionRecords.time.name}`),
        modifiedAt: sql.raw(`excluded.${consumptionRecords.modifiedAt.name}`),
        deleted: sql.raw(`excluded.${consumptionRecords.deleted.name}`),
    },
});

export const consumptionRecordService = {
    ...syncService,
    load,
    loadToday: () => load(true),
};