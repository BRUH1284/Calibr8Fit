import { Activity } from "./activity";
import { UserActivity } from "./userActivity";

export interface ActivityRecord {
    id: string;
    activityId: string | null; // Reference to the activity
    activity: Activity | null; // Optional reference to the activity
    userActivityId: string | null; // Reference to the user activity
    userActivity: UserActivity | null; // Optional reference to the user activity
    duration: number; // Unix timestamp in seconds
    caloriesBurned: number; // Calories burned during the activity
    time: number; // Unix timestamp in seconds
    modifiedAt: number; // Unix timestamp in seconds
    deleted: boolean; // Indicates if the record is deleted
}