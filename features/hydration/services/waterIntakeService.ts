import { db } from "@/db/db";
import { waterIntakeRecords } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, gte, lt, sql } from "drizzle-orm";
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

const loadInRange = async (start: number, end: number) =>
  syncService.load(
    false,
    (t) => and(eq(t.deleted, false), gte(t.time, start), lt(t.time, end))!
  );

const loadDailySumInRange = async (
  start: Date,
  end: Date
): Promise<{ date: Date; value: number }[]> => {
  const startTs = start.setHours(0, 0, 0, 0);
  const endTs = end.setHours(24, 0, 0, 0);

  try {
    const result = await db
      .select({
        date: sql<number>`strftime('%s', DATE(${waterIntakeRecords.time}, 'unixepoch', 'localtime'))`,
        total: sql<number>`SUM(${waterIntakeRecords.amountInMl})`,
      })
      .from(waterIntakeRecords)
      .where(
        and(
          eq(waterIntakeRecords.deleted, false),
          gte(waterIntakeRecords.time, startTs),
          lt(waterIntakeRecords.time, endTs)
        )
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    console.log("Daily total in range:", result);

    return result.map((r) => ({
      date: new Date(r.date as number),
      value: r.total as number,
    }));
  } catch (error) {
    console.error("Error loading daily sum in range:", error);
    throw error;
  }
};

const loadToday = async () =>
  loadInRange(
    new Date().setHours(0, 0, 0, 0),
    new Date().setHours(24, 0, 0, 0)
  );

export const waterIntakeService = {
  ...syncService,
  loadToday,
  loadInRange,
  loadDailySumInRange,
};
