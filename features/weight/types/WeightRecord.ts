export interface WeightRecord {
    id: string;
    weight: number; // Weight in kilograms
    time: number; // Unix timestamp in milliseconds
    modifiedAt: number; // Unix timestamp in milliseconds
    deleted: boolean; // Indicates if the record is deleted
}