import AsyncStorage from "@react-native-async-storage/async-storage";

export enum SyncEntityType {
    Activities = "activities",
    UserActivities = "user_activities",
    ActivityRecords = "activity_records",
    WaterIntakeRecords = "water_intake_records",
    WeightRecords = "weight_records",
    Foods = "foods",
    UserFoods = "user_foods",
    Meals = "meals",
}

export interface SyncTimeService {
    getLastSyncTime(entity: SyncEntityType): Promise<Date>;
    setLastSyncTime(entity: SyncEntityType, time: Date): Promise<void>;
    getLastSyncTimeMilliseconds(entity: SyncEntityType): Promise<number>;
    setLastSyncTimeMilliseconds(entity: SyncEntityType, time: number): Promise<void>;
    clearLastSyncTime(entity: SyncEntityType): Promise<void>;
    clearAllLastSyncTimes(): Promise<void>;
}

export const syncTimeService: SyncTimeService = {
    async getLastSyncTime(entity: SyncEntityType): Promise<Date> {
        const lastSyncTime = await AsyncStorage.getItem(`lastSyncTime_${entity}`);
        return lastSyncTime ? new Date(lastSyncTime) : new Date(0); // Default to epoch if not set
    },

    async setLastSyncTime(entity: SyncEntityType, time: Date): Promise<void> {
        await AsyncStorage.setItem(`lastSyncTime_${entity}`, time.getTime().toString());
    },

    async clearLastSyncTime(entity: SyncEntityType): Promise<void> {
        await AsyncStorage.removeItem(`lastSyncTime_${entity}`);
    },

    async clearAllLastSyncTimes(): Promise<void> {
        const keys = await AsyncStorage.getAllKeys();
        const syncTimeKeys = keys.filter(key => key.startsWith('lastSyncTime_'));
        await AsyncStorage.multiRemove(syncTimeKeys);
    },

    async getLastSyncTimeMilliseconds(entity: SyncEntityType): Promise<number> {
        const lastSyncTime = await AsyncStorage.getItem(`lastSyncTime_${entity}`);
        return lastSyncTime ? parseInt(lastSyncTime, 10) : 0; // Default to 0 if not set
    },

    async setLastSyncTimeMilliseconds(entity: SyncEntityType, time: number): Promise<void> {
        await AsyncStorage.setItem(`lastSyncTime_${entity}`, time.toString());
    }
}