import { weightRecords } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { WeightRecord } from "../types/WeightRecord";

export const weightRecordService = {
    ...createSyncService<
        typeof weightRecords,
        WeightRecord,
        {
            id: string;
            weight: number;
            time: string;
            modifiedAt: string;
            deleted: boolean;
        }
    >({
        entityType: SyncEntityType.WeightRecords,
        table: weightRecords,
        endpoint: '/weight',
        collectionKey: 'weightRecords',
        mapRemoteArrayToLocal: async (remote) => remote.map((record) => ({
            ...record,
            time: new Date(record.time).getTime(),
            modifiedAt: new Date(record.modifiedAt).getTime(),
        })),
        mapLocalArrayToRemote: async (local) => local.map((record) => ({
            ...record,
            time: new Date(record.time).toISOString(),
            modifiedAt: new Date(record.modifiedAt).toISOString(),
        })),
        primaryKey: weightRecords.id,
        upsertSet: {
            weight: sql.raw(`excluded.${weightRecords.weight.name}`),
            time: sql.raw(`excluded.${weightRecords.time.name}`),
            modifiedAt: sql.raw(`excluded.${weightRecords.modifiedAt.name}`),
            deleted: sql.raw(`excluded.${weightRecords.deleted.name}`),
        },
    }),
    async loadTodayWeightRecords() {
        const start = new Date().setHours(0, 0, 0, 0);
        const end = start + 24 * 60 * 60 * 1000;

        return this.load(false, (t) => and(
            eq((t as any).deleted, false),
            gte((t as any).time, start),
            lt((t as any).time, end)
        )!);
    },
}