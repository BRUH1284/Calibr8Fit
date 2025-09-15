import { Activity } from "./activity";
import { UserActivity } from "./userActivity";

export interface ActivityRecord {
    id: string;
    activityId: string | null; // Reference to the activity
    activity: Activity | null; // Optional reference to the activity
    userActivityId: string | null; // Reference to the user activity
    userActivity: UserActivity | null; // Optional reference to the user activity
    duration: number; // in seconds
    caloriesBurned: number; // Calories burned during the activity
    time: number; // Unix timestamp in milliseconds
    modifiedAt: number; // Unix timestamp in milliseconds
    deleted: boolean; // Indicates if the record is deleted
}

export interface ActivityItem {
    id: string;
    userActivityId?: string;
    majorHeading: string;
    description: string;
    metValue: number;
}