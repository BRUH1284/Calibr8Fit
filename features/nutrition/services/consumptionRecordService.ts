import { db } from "@/db/db";
import { consumptionRecords, foods, userFoods, userMeals } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { createTimeSeriesQueryService } from "@/shared/services/createTimeSeriesQueryService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { ConsumptionRecord } from "../types/consumptionRecord";

const nullToUndefined = <T>(v: T | null | undefined): T | undefined => {
  return v ?? undefined;
};

const loadInRange = async (
  start: number,
  end: number,
): Promise<ConsumptionRecord[]> => {
  const predicates = [
    eq(consumptionRecords.deleted, false),
    gte(consumptionRecords.time, start),
    lt(consumptionRecords.time, end),
  ];

  const records = await db.query.consumptionRecords.findMany({
    where: and(...predicates),
    with: {
      food: true,
      userFood: true,
      userMeal: {
        with: {
          ingredients: {
            with: {
              food: true,
              userFood: true,
            },
          },
        },
      },
    },
  });

  return records;
};

const loadToday = async (): Promise<ConsumptionRecord[]> => {
  const start = new Date().setHours(0, 0, 0, 0);
  const end = start + 24 * 60 * 60 * 1000;

  return loadInRange(start, end);
};

const timeSeriesQueryService = createTimeSeriesQueryService<
  typeof consumptionRecords,
  ConsumptionRecord
>(
  consumptionRecords,
  consumptionRecords.quantity,
  eq(consumptionRecords.deleted, false),
  {
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
    userMeal: userMeals,
  },
);

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
  endpoint: "/consumption-record",
  collectionKey: "consumptionRecords",
  mapRemoteArrayToLocal: async (remote) => {
    const foodsIdSet = new Set(
      (
        await db
          .select({ id: foods.id })
          .from(foods)
          .where(
            inArray(
              foods.id,
              remote.map((record) => record.foodId).filter((id) => id !== null),
            ),
          )
      ).map((row) => row.id),
    );

    return remote.map((record) => ({
      ...record,
      foodId:
        record.foodId !== null
          ? foodsIdSet.has(record.foodId)
            ? record.foodId
            : null
          : null,
      userFoodId:
        record.foodId !== null
          ? foodsIdSet.has(record.foodId)
            ? null
            : record.foodId
          : null,
      userMealId: record.userMealId,
      modifiedAt: new Date(record.modifiedAt).getTime(), // Convert to unix timestamp
      time: new Date(record.time).getTime(), // Convert to unix timestamp
    })) as ConsumptionRecord[];
  },
  mapLocalArrayToRemote: async (local) =>
    local.map((record) => ({
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
  loadToday,
  loadInRange,
};
function nu(foodId: any) {
  throw new Error("Function not implemented.");
}
