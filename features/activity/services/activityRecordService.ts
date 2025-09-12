import { db } from "@/db/db";
import { activities, activityRecords, userActivities } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { ActivityRecord } from "../types/activityRecord";

const loadActivityRecords = async (today: boolean = false, includeDeleted: boolean = false): Promise<ActivityRecord[]> => {
    const start = new Date().setHours(0, 0, 0, 0);
    const end = start + 24 * 60 * 60 * 1000;

    const predicates = today ? [
        eq(activityRecords.deleted, false),
        gte(activityRecords.time, start),
        lt(activityRecords.time, end)
    ] : [];

    return db
        .select({
            id: activityRecords.id,
            activityId: activityRecords.activityId,
            userActivityId: activityRecords.userActivityId,
            duration: activityRecords.duration,
            caloriesBurned: activityRecords.caloriesBurned,
            time: activityRecords.time,
            modifiedAt: activityRecords.modifiedAt,
            deleted: activityRecords.deleted,
            activity: {
                id: activities.id,
                majorHeading: activities.majorHeading,
                metValue: activities.metValue,
                description: activities.description,
            },
            userActivity: {
                id: userActivities.id,
                majorHeading: userActivities.majorHeading,
                metValue: userActivities.metValue,
                description: userActivities.description,
                modifiedAt: userActivities.modifiedAt,
                deleted: userActivities.deleted,
            },
        })
        .from(activityRecords)
        .leftJoin(activities, eq(activityRecords.activityId, activities.id))
        .leftJoin(userActivities, eq(activityRecords.userActivityId, userActivities.id))
        .where(and(...predicates))
}

export const activityRecordService = {
    ...createSyncService<
        typeof activityRecords,
        ActivityRecord,
        {
            id: string;
            activityId: string;
            duration: number;
            caloriesBurned: number;
            time: string;
            modifiedAt: string;
            deleted: boolean;
        }
    >({
        entityType: SyncEntityType.ActivityRecords,
        table: activityRecords,
        endpoint: '/activity-record',
        collectionKey: 'activityRecords',
        mapRemoteArrayToLocal: async (remote) => {
            const activitiesIdSet = new Set((await db
                .select({ id: activities.id })
                .from(activities)
                .where(
                    inArray(activities.id, remote.map(record => record.id))
                )
            ).map(row => row.id));

            return remote.map((record) => ({
                ...record,
                activityId: activitiesIdSet.has(record.activityId) ? record.activityId : null,
                userActivityId: activitiesIdSet.has(record.activityId) ? null : record.activityId,
                time: new Date(record.time).getTime(), // Convert to unix timestamp
                modifiedAt: new Date(record.modifiedAt).getTime(), // Convert to unix timestamp
            })) as ActivityRecord[]
        },
        mapLocalArrayToRemote: async (local) => local.map(({ userActivityId, ...record }) => ({
            ...record,
            activityId: record.activityId || userActivityId, // Use activityId or userActivityId
            modifiedAt: new Date(record.modifiedAt).toISOString(), // Convert to ISO string for the server
            time: new Date(record.time).toISOString(), // Convert to ISO string for the server
        }) as {
            id: string;
            activityId: string;
            duration: number;
            caloriesBurned: number;
            time: string;
            modifiedAt: string;
            deleted: boolean;
        }),
        primaryKey: activityRecords.id,
        upsertSet: {
            activityId: sql.raw(`excluded.${activityRecords.activityId.name}`),
            userActivityId: sql.raw(`excluded.${activityRecords.userActivityId.name}`),
            duration: sql.raw(`excluded.${activityRecords.duration.name}`),
            caloriesBurned: sql.raw(`excluded.${activityRecords.caloriesBurned.name}`),
            time: sql.raw(`excluded.${activityRecords.time.name}`),
            modifiedAt: sql.raw(`excluded.${activityRecords.modifiedAt.name}`),
            deleted: sql.raw(`excluded.${activityRecords.deleted.name}`),
        },
    }),
    loadToday: () => loadActivityRecords(true),
}