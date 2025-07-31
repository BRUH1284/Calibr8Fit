import { SyncStatus } from "@/shared/types/enums/dbTypes";

export interface UserActivity {
    id: string;
    majorHeading: string;
    metValue: number;
    description: string;
    syncStatus: SyncStatus;
    updatedAt: string; // ISO date string
}