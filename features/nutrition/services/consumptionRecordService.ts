import { db } from "@/db/db";
import { consumptionRecords, foods } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { createTimeSeriesQueryService } from "@/shared/services/createTimeSeriesQueryService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { eq, inArray, sql } from "drizzle-orm";
import { ConsumptionRecord } from "../types/consumptionRecord";

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

const timeSeriesQueryService = createTimeSeriesQueryService(
  db.query.consumptionRecords,
  "quantity",
  {
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
  eq(consumptionRecords.deleted, false),
);

export const consumptionRecordService = {
  ...syncService,
  ...timeSeriesQueryService,
  loadInTimeNumberRange: (start: number, end: number) =>
    timeSeriesQueryService.loadInTimeNumberRange(start, end) as Promise<
      ConsumptionRecord[]
    >,
  loadToday: () =>
    timeSeriesQueryService.loadToday() as Promise<ConsumptionRecord[]>,
};
