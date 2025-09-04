export interface WaterIntakeRecord {
    id: string;
    amountInMl: number; // Amount of water intake in milliliters
    time: number; // Unix timestamp in milliseconds
    modifiedAt: number; // Unix timestamp in milliseconds
    deleted: boolean; // Indicates if the record is deleted
}