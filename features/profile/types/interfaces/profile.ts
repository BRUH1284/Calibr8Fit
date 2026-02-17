import { ActivityLevel } from "@/shared/types/enums/activityLevel";
import { Climate } from "@/shared/types/enums/climate";
import { Gender } from "@/shared/types/enums/gender";

export interface ProfileSettings {
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  targetWeight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  climate: Climate;
  profilePictureUrl?: string;
  forcedConsumptionTarget: number;
  forcedBurnTarget: number;
  forcedHydrationTarget: number;
  modifiedAt: number;
}
