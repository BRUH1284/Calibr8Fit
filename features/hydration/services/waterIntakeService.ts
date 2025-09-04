import { waterIntakeRecords } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { WaterIntakeRecord } from "../types/WaterIntakeRecors";

export const waterIntakeService = {
    ...createSyncService<
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
        endpoint: '/water-intake',
        collectionKey: 'waterIntakeRecords',
        mapRemoteArrayToLocal: async (remote) => remote.map(({ amountInMilliliters, ...record }) => ({
            ...record,
            amountInMl: amountInMilliliters,
            time: new Date(record.time).getTime(),
            modifiedAt: new Date(record.modifiedAt).getTime(),
        })),
        mapLocalArrayToRemote: async (local) => local.map(({ amountInMl, ...record }) => ({
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
    }),
    async loadTodayWaterIntakeRecords() {
        const start = new Date().setHours(0, 0, 0, 0);
        const end = start + 24 * 60 * 60 * 1000;

        return this.load(false, (t) => and(
            eq((t as any).deleted, false),
            gte((t as any).time, start),
            lt((t as any).time, end)
        )!);
    },
}