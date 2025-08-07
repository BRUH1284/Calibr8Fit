import { db } from "@/db/db";
import { activities } from "@/db/schema";
import { api } from "@/shared/services/api";
import { SyncEntity, syncTimeService } from "@/shared/services/syncTimeService";
import { Activity } from "../types/activity";

const loadActivities = async (): Promise<Activity[]> => {
    return db.select().from(activities);
}

const syncActivities = async (): Promise<Activity[]> => {
    // Get the last sync time for activities
    const lastSyncTime = await syncTimeService.getLastSyncTime(SyncEntity.Activities);

    try {
        // Fetch activities last update time
        const updatedAt = await api.request({
            endpoint: '/activity/last-updated-at',
            method: 'GET',
        });

        console.log("Last sync time:", lastSyncTime);

        if (new Date(updatedAt) < lastSyncTime)
            return loadActivities(); // No new updates, return local data

        const fetchedActivities = await fetchActivities();

        // Update the last sync time
        await syncTimeService.setLastSyncTime(SyncEntity.Activities, new Date(updatedAt));

        return fetchedActivities;
    } catch (e) {
        console.error('Failed to fetch last updated time for activities:', e);
        return loadActivities(); // Fallback to local data if API call fails
    }
}

const fetchActivities = async (): Promise<Activity[]> => {
    const response = await api.request({
        endpoint: '/activity',
        method: 'GET',
    });

    // Clear existing activities
    await db.delete(activities);

    // If no activities are returned, return an empty array
    if (response.length === 0) return [];

    // Insert new activities
    await db.insert(activities).values(response);

    return response;
}

export const activityService = {
    fetchActivities,
    loadActivities,
    syncActivities,
};