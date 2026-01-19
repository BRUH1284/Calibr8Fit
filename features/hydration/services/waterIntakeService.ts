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
  try {
    const rows = await db
      .select({
        date: sql<number>`strftime('%s', datetime(${waterIntakeRecords.time} / 1000, 'unixepoch', 'localtime', 'start of day', 'utc'))`,
        total: sql<number>`SUM(${waterIntakeRecords.amountInMl})`,
      })
      .from(waterIntakeRecords)
      .where(
        and(
          eq(waterIntakeRecords.deleted, false),
          gte(waterIntakeRecords.time, start.getTime()),
          lt(waterIntakeRecords.time, end.getTime())
        )
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const totalsByDay = new Map<number, number>();

    rows.forEach((r) => {
      totalsByDay.set(Number(r.date), Number(r.total));
    });

    for (let dt = new Date(start); dt < end; dt.setDate(dt.getDate() + 1)) {
      const dayTs = Math.floor(dt.getTime() / 1000);
      if (!totalsByDay.has(dayTs)) {
        totalsByDay.set(dayTs, 0);
      }
    }

    return Array.from(totalsByDay.entries())
      .map(([dateTs, value]) => ({
        date: new Date(dateTs * 1000),
        value,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
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
