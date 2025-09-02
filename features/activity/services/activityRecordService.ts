import { db } from "@/db/db";
import { activities, activityRecords, userActivities } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, inArray, lte, sql } from "drizzle-orm";
import { ActivityRecord } from "../types/ActivityRecord";

const loadActivityRecords = async (today: boolean = false, includeDeleted: boolean = false): Promise<ActivityRecord[]> => {
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
        .where(
            and(
                eq(activityRecords.deleted, false),
                lte(activityRecords.time, today ? new Date().setHours(0, 0, 0, 0) / 1000 : Number.MAX_SAFE_INTEGER)
            )
        )
}

// const syncActivityRecords = async (): Promise<ActivityRecord[]> => {
//     // Get the last sync time for activity records in unix seconds
//     const lastSyncTime = await syncTimeService.getLastSyncTimeSeconds(SyncEntityType.ActivityRecords);

//     try {
//         // Fetch activity records last update time
//         const updatedAt = await api.request({
//             endpoint: '/activity-record/last-updated-at',
//             method: 'GET',
//         });

//         // Convert updatedAt to seconds
//         const updatedAtSeconds = Math.floor(new Date(updatedAt).getTime() / 1000);

//         if (updatedAtSeconds === lastSyncTime)
//             return loadActivityRecords(); // No new updates, return local data

//         // Fetch modified user activities since the last sync time
//         const modifiedActivities = await db
//             .select()
//             .from(activityRecords)
//             .where(gt(activityRecords.modifiedAt, lastSyncTime));

//         console.log('Modified activity records:', modifiedActivities.length);

//         // Sync modified activity records with the server
//         const response = await api.request({
//             endpoint: '/activity-record/sync',
//             method: 'POST',
//             body: {
//                 lastSyncedAt: new Date(lastSyncTime * 1000).toISOString(), // Convert to ISO string
//                 activityRecords: modifiedActivities.map(({ userActivityId, ...record }) => ({
//                     ...record,
//                     activityId: record.activityId || userActivityId, // Use activityId or userActivityId
//                     modifiedAt: new Date(record.modifiedAt * 1000).toISOString(), // Convert to ISO string for the server
//                 })),
//             },
//         }) as {
//             syncedAt: string;
//             activityRecords: {
//                 id: string;
//                 activityId: string;
//                 duration: number;
//                 caloriesBurned: number;
//                 time: number;
//                 modifiedAt: string;
//                 deleted: boolean;
//             }[];
//         };

//         const activitiesIdSet = new Set((await db
//             .select({ id: activities.id })
//             .from(activities)
//             .where(
//                 inArray(activities.id, response.activityRecords.map(record => record.id))
//             )
//         ).map(row => row.id));

//         // Convert server response to local ActivityRecord format
//         const fetchedRecords: InferSelectModel<typeof activityRecords>[] = response.activityRecords.map(record => ({
//             ...record,
//             activityId: activitiesIdSet.has(record.activityId) ? record.activityId : null,
//             userActivityId: activitiesIdSet.has(record.activityId) ? null : record.activityId,
//             time: Math.floor(new Date(record.time).getTime() / 1000), // Ensure time is in seconds
//             modifiedAt: Math.floor(new Date(record.modifiedAt).getTime() / 1000), // Ensure modifiedAt is in seconds
//         }));

//         // Upsert synced activity records
//         if (fetchedRecords.length !== 0)
//             await db
//                 .insert(activityRecords)
//                 .values(fetchedRecords)
//                 .onConflictDoUpdate({
//                     target: activityRecords.id,
//                     set: {
//                         activityId: sql`excluded.${activityRecords.activityId}`,
//                         userActivityId: sql`excluded.${activityRecords.userActivityId}`,
//                         duration: sql`excluded.${activityRecords.duration}`,
//                         caloriesBurned: sql`excluded.${activityRecords.caloriesBurned}`,
//                         time: sql`excluded.${activityRecords.time}`,
//                         modifiedAt: sql`excluded.${activityRecords.modifiedAt}`,
//                         deleted: sql`excluded.${activityRecords.deleted}`,
//                     },
//                 });

//         // Update the last sync time
//         await syncTimeService.setLastSyncTimeSeconds(SyncEntityType.ActivityRecords, updatedAtSeconds);
//     } catch (e) {
//         console.error('Failed to fetch last updated time for activity records:', e);
//     }
//     return loadActivityRecords(true);
// }

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
        customLoad: (includeDeleted: boolean) => loadActivityRecords(false, includeDeleted),
    }),
    loadToday: () => loadActivityRecords(true),
}