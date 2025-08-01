import { db } from "@/db/db";
import { userActivities } from "@/db/schema";
import { api } from "@/shared/services/api";
import { SyncStatus } from "@/shared/types/enums/dbTypes";
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
    // Load local user activities
    const localActivities = await loadUserActivity();

    let newActivities: UserActivity[] = [];
    let modifiedActivities: UserActivity[] = [];
    let deletedActivities: UserActivity[] = [];

    // Classify activities based on sync status
    for (const activity of localActivities) {
        switch (activity.syncStatus) {
            case SyncStatus.NEW:
                newActivities.push(activity);
                break;
            case SyncStatus.MODIFIED:
                modifiedActivities.push(activity);
                break;
            case SyncStatus.DELETED:
                deletedActivities.push(activity);
                break;
        }
    }

    // Delete activities
    if (deletedActivities.length > 0)
        await api.request({
            endpoint: `/activity/my`,
            method: 'DELETE',
            body: deletedActivities.map(activity => activity.id)
        });

    // Push new activities
    if (newActivities.length > 0)
        await api.request({
            endpoint: `/activity/my`,
            method: 'POST',
            body: newActivities.map(activity => ({
                majorHeading: activity.majorHeading,
                metValue: activity.metValue,
                description: activity.description,
                updatedAt: activity.updatedAt,
            }))
        });

    // Update modified activities
    if (modifiedActivities.length > 0)
        await api.request({
            endpoint: `/activity/my`,
            method: 'PUT',
            body: modifiedActivities.map(activity => ({
                id: activity.id,
                majorHeading: activity.majorHeading,
                metValue: activity.metValue,
                description: activity.description,
                updatedAt: activity.updatedAt,
            }))
        });


    // Fetch updated user activities after sync
    const updatedActivities = await fetchUserActivity();

    // Clear existing user activities
    await db.delete(userActivities);
    // Insert updated user activities
    await db.insert(userActivities).values(updatedActivities);

    return updatedActivities;
}

const fetchUserActivity = async (): Promise<UserActivity[]> => {
    try {
        const response = await api.request({
            endpoint: '/activity/my',
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Failed to fetch user activities:", error);
        throw error;
    }
}

const addUserActivity =
    async (activity: Omit<UserActivity, 'id' | 'syncStatus' | 'updatedAt'>):
        Promise<UserActivity> => {
        let newActivity = {
            ...activity,
            id: crypto.randomUUID(), // Generate a unique ID for the new activity
            syncStatus: SyncStatus.NEW,
            updatedAt: new Date().toISOString()
        };


        // Post the new activity to the server
        try {
            const response = await api.request({
                endpoint: '/activity/my',
                method: 'POST',
                body: [{
                    majorHeading: newActivity.majorHeading,
                    metValue: newActivity.metValue,
                    description: newActivity.description,
                    updatedAt: newActivity.updatedAt,
                }]
            });
            // Assuming the server returns the created activity with its ID and updatedAt
            newActivity = response[0];
        } catch (error) {
            console.warn("Failed to add post activity:", error);
        } finally {
            // Regardless of the server request outcome, we insert the activity into the local database
            await db.insert(userActivities).values(newActivity);
        }

        return newActivity;
    }

export const userActivityService = {
    fetchUserActivity,
    syncUserActivity,
    loadUserActivity,
    addUserActivity
}
