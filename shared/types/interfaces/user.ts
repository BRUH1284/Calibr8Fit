import { ActivityLevel } from "../enums/activityLevel";
import { Climate } from "../enums/climate";
import { Gender } from "../enums/gender";
import { Goal } from "../enums/goal";

export interface UserProfileSettings {
    firstName: string;
    lastName: string;
    bio: string;
    friendsVisible: boolean;
    age: number;
    weight: number;
    targetWeight: number;
    height: number;
    gender: Gender;
    activityLevel: ActivityLevel;
    userClimate: Climate;
    goal: Goal;
}