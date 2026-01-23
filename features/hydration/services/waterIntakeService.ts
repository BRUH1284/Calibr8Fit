import { waterIntakeRecords } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { createTimeSeriesQueryService } from "@/shared/services/createTimeSeriesQueryService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { eq, sql } from "drizzle-orm";
import { WaterIntakeRecord } from "../types/WaterIntakeRecord";

const syncService = createSyncService<
  typeof waterIntakeRecords,
  WaterIntakeRecord,
  {
    id: string;
    amountInMilliliters: number;
    time: string;
    modifiedAt: string;
    deleted: boolean;
  }
>({
  entityType: SyncEntityType.WaterIntakeRecords,
  table: waterIntakeRecords,
  endpoint: "/water-intake",
  collectionKey: "waterIntakeRecords",
  mapRemoteArrayToLocal: async (remote) =>
    remote.map(({ amountInMilliliters, ...record }) => ({
      ...record,
      amountInMl: amountInMilliliters,
      time: new Date(record.time).getTime(),
      modifiedAt: new Date(record.modifiedAt).getTime(),
    })),
  mapLocalArrayToRemote: async (local) =>
    local.map(({ amountInMl, ...record }) => ({
      ...record,
      amountInMilliliters: amountInMl,
      time: new Date(record.time).toISOString(),
      modifiedAt: new Date(record.modifiedAt).toISOString(),
    })),
  primaryKey: waterIntakeRecords.id,
  upsertSet: {
    amountInMl: sql.raw(`excluded.${waterIntakeRecords.amountInMl.name}`),
    time: sql.raw(`excluded.${waterIntakeRecords.time.name}`),
    modifiedAt: sql.raw(`excluded.${waterIntakeRecords.modifiedAt.name}`),
    deleted: sql.raw(`excluded.${waterIntakeRecords.deleted.name}`),
  },
});

const timeSeriesQueryService = createTimeSeriesQueryService<
  typeof waterIntakeRecords,
  WaterIntakeRecord
>(
  waterIntakeRecords,
  waterIntakeRecords.amountInMl,
  eq(waterIntakeRecords.deleted, false),
);

export const waterIntakeService = {
  ...syncService,
  ...timeSeriesQueryService,
};
