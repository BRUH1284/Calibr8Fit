import { userActivities } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { sql } from "drizzle-orm";
import { UserActivity } from "../types/userActivity";

export const userActivityService = createSyncService<
    typeof userActivities,
    UserActivity,
    {
        id: string;
        majorHeading: string;
        metValue: number;
        description: string;
        modifiedAt: string; // ISO date string from the server
        deleted: boolean;
    }
>({
    entityType: SyncEntityType.UserActivities,
    table: userActivities,
    endpoint: '/activity/my',
    collectionKey: 'userActivities',
    mapRemoteArrayToLocal: async (remote) => remote.map((activity) => ({
        ...activity,
        modifiedAt: new Date(activity.modifiedAt).getTime(), // Convert to unix timestamp
    })),
    mapLocalArrayToRemote: async (local) => local.map((activity) => ({
        ...activity,
        modifiedAt: new Date(activity.modifiedAt).toISOString() // Convert to ISO string for the server
    })),
    primaryKey: userActivities.id,
    upsertSet: {
        majorHeading: sql.raw(`excluded.${userActivities.majorHeading.name}`),
        metValue: sql.raw(`excluded.${userActivities.metValue.name}`),
        description: sql.raw(`excluded.${userActivities.description.name}`),
        modifiedAt: sql.raw(`excluded.${userActivities.modifiedAt.name}`),
        deleted: sql.raw(`excluded.${userActivities.deleted.name}`),
    },
});