import { db } from "@/db/db";
import { userActivities } from "@/db/schema";
import { api } from "@/shared/services/api";
import { SyncStatus } from "@/shared/types/enums/dbTypes";
import { UserActivity } from "../types/userActivity";

const syncUserActivity = async (): Promise<UserActivity[]> => {
    const localActivities = await db.select().from(userActivities);

    let newActivities: UserActivity[] = [];
    let modifiedActivities: UserActivity[] = [];
    let deletedActivities: UserActivity[] = [];

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
        await api.request(`/activity`, {
            method: 'DELETE',
            body: deletedActivities.map(activity => activity.id)
        });

    // Push new activities
    if (newActivities.length > 0)
        await api.request(`/activity`, {
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
        await api.request(`/activity`, {
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
    const response = await api.request(`/activity/my`, {
        method: 'GET',
    });

    return response;
}

export const userActivityService = {
    fetchUserActivity,
    syncUserActivity,
}