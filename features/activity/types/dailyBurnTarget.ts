import { Activity } from "./activity";
import { UserActivity } from "./userActivity";

export interface DailyBurnTarget {
    id: string; // Changed from number to string to match SyncEntity constraint
    activityId: string | null;
    userActivityId: string | null;
    duration: number; // in seconds
    modifiedAt: number; // unix timestamp
    deleted: boolean;

    activity: Activity | null;
    userActivity: UserActivity | null;
}