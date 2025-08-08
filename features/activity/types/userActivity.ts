export interface UserActivity {
    id: string;
    majorHeading: string;
    metValue: number;
    description: string;
    modifiedAt: number; // Unix timestamp in seconds
    deleted: boolean;
}