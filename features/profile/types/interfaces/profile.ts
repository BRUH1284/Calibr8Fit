import { ActivityLevel } from "@/shared/types/enums/activityLevel";
import { Climate } from "@/shared/types/enums/climate";
import { Gender } from "@/shared/types/enums/gender";

export interface ProfileSettings {
    firstName: string;
    lastName: string;
    bio: string;
    friendsVisible: boolean;
    dateOfBirth: Date;
    weight: number;
    targetWeight: number;
    height: number;
    gender: Gender;
    activityLevel: ActivityLevel;
    climate: Climate;
}