import { db } from "@/db/db";
import { userActivities } from "@/db/schema";
import { api } from "@/shared/services/api";
import { SyncEntity, syncTimeService } from "@/shared/services/syncTimeService";
import { gt } from "drizzle-orm";
import * as Crypto from 'expo-crypto';
import { UserActivity } from "../types/userActivity";

const loadUserActivity = async (): Promise<UserActivity[]> => {
    try {
        // Fetch user activities from the local database
        return await db.select().from(userActivities);;
    }
    catch (error) {
        console.warn("Failed to load user activities from local database:", error);
        return [];
    }
}

const syncUserActivity = async (): Promise<UserActivity[]> => {
    // Get the last sync time for user activities
    const lastSyncTime = await syncTimeService.getLastSyncTime(SyncEntity.UserActivities);

    try {
        // Fetch user activities last update time
        const updatedAt = new Date(await api.request({
            endpoint: '/activity/my/last-updated-at',
            method: 'GET',
        }));

        if (updatedAt <= lastSyncTime)
            return loadUserActivity(); // No new updates, return local data

        // Fetch modified user activities since the last sync time
        const modifiedActivities = await db
            .select()
            .from(userActivities)
            .where(gt(userActivities.modifiedAt, lastSyncTime.toISOString()));

        // Sync modified user activities with the server
        const syncedActivities = await api.request({
            endpoint: '/activity/my/sync',
            method: 'POST',
            body: {
                lastSyncedAt: lastSyncTime.toISOString(),
                userActivities: modifiedActivities,
            },
        }) as UserActivity[];

        // Clear existing user activities after the last sync time
        await db
            .delete(userActivities)
            .where(gt(userActivities.modifiedAt, lastSyncTime.toISOString()));

        // Insert synced user activities
        if (syncedActivities.length !== 0)
            await db.insert(userActivities).values(syncedActivities);

        // Update the last sync time
        syncTimeService.setLastSyncTime(SyncEntity.UserActivities, updatedAt);
    } catch (e) {
        console.error('Failed to sync user activities:', e);
    }
    return loadUserActivity(); // Fallback to local data if API call fails
}

const fetchUserActivity = async (): Promise<UserActivity[]> => {
    try {
        const response = await api.request({
            endpoint: '/activity/my',
            method: 'GET',
        }) as UserActivity[];
        return response;
    } catch (error) {
        console.error("Failed to fetch user activities:", error);
        throw error;
    }
}

const addUserActivity =
    async (activity: Omit<UserActivity, 'id' | 'modifiedAt' | 'deleted'>):
        Promise<UserActivity> => {
        // Post the new activity to the server
        try {
            const response = await api.request({
                endpoint: '/activity/my',
                method: 'POST',
                body: {
                    majorHeading: activity.majorHeading,
                    metValue: activity.metValue,
                    description: activity.description,
                }
            }) as UserActivity;
            // Assuming the server returns the created activity
            return (await db.insert(userActivities).values(response).returning())[0];

        } catch (error) {
            console.warn("Failed to post activity:", error);
            // Regardless of the server request outcome, we insert the activity into the local database
            return (await db.insert(userActivities).values({ id: Crypto.randomUUID(), ...activity }).returning())[0];
        }
    }

export const userActivityService = {
    fetchUserActivity,
    syncUserActivity,
    loadUserActivity,
    addUserActivity
}
