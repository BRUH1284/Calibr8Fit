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
    // Get the last sync time for user activities in unix seconds
    const lastSyncTime = (await syncTimeService.getLastSyncTimeSeconds(SyncEntity.UserActivities));

    try {
        // Fetch user activities last update time
        const updatedAt = await api.request({
            endpoint: '/activity/my/last-updated-at',
            method: 'GET',
        });

        // Convert updatedAt to seconds
        const updatedAtSeconds = Math.floor(new Date(updatedAt).getTime() / 1000);

        if (updatedAtSeconds <= lastSyncTime)
            return loadUserActivity(); // No new updates, return local data


        // Fetch modified user activities since the last sync time
        const modifiedActivities = await db
            .select()
            .from(userActivities)
            .where(gt(userActivities.modifiedAt, lastSyncTime));

        // Sync modified user activities with the server
        const response = await api.request({
            endpoint: '/activity/my/sync',
            method: 'POST',
            body: {
                lastSyncedAt: new Date(lastSyncTime * 1000).toISOString(), // Convert to ISO string
                userActivities: modifiedActivities.map(activity => ({
                    ...activity,
                    modifiedAt: new Date(activity.modifiedAt * 1000).toISOString(), // Convert to ISO string for the server
                })),
            },
        }) as {
            syncedAt: string;
            userActivities: {
                id: string;
                majorHeading: string;
                metValue: number;
                description: string;
                modifiedAt: string; // ISO date string from the server
                deleted: boolean;
            }[];
        };

        // Convert response to UserActivity[]
        const syncedActivities: UserActivity[] = response.userActivities.map((activity) => ({
            ...activity,
            // Convert modifiedAt to unix timestamp in seconds
            modifiedAt: Math.floor(new Date(activity.modifiedAt).getTime() / 1000), // Ensure modifiedAt is in seconds
        }));

        // Clear existing user activities after the last sync time
        await db
            .delete(userActivities)
            .where(gt(userActivities.modifiedAt, lastSyncTime));

        // Insert synced user activities
        if (syncedActivities.length !== 0)
            await db.insert(userActivities).values(syncedActivities);

        // Update the last sync time
        await syncTimeService.setLastSyncTime(SyncEntity.UserActivities, new Date(updatedAt));
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
        Promise<UserActivity[]> => {
        // Insert a new user activity into the database
        await db.insert(userActivities).values({
            id: Crypto.randomUUID(),
            ...activity
        });

        // Sync user activities to ensure the latest data is fetched
        return await syncUserActivity();
    }


export const userActivityService = {
    fetchUserActivity,
    syncUserActivity,
    loadUserActivity,
    addUserActivity
}
