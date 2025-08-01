import { db } from "@/db/db";
import { activities } from "@/db/schema";
import { api } from "@/shared/services/api";

const loadActivities = async () => {
    return await db.select().from(activities);
}

const fetchActivities = async () => {
    const response = await api.request({
        endpoint: '/activity',
        method: 'GET',
    });

    // Clear existing activities
    await db.delete(activities);
    // Insert new activities
    await db.insert(activities).values(response);

    return response;
}

export const activityService = {
    fetchActivities,
    loadActivities
};