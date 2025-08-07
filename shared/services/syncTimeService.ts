import AsyncStorage from "@react-native-async-storage/async-storage";

export enum SyncEntity {
    Activities = "activities",
    UserActivities = "user_activities",
}

export interface SyncTimeService {
    getLastSyncTime(entity: SyncEntity): Promise<Date>;
    setLastSyncTime(entity: SyncEntity, time: Date): Promise<void>;
    clearLastSyncTime(entity: SyncEntity): Promise<void>;
}

export const syncTimeService: SyncTimeService = {
    async getLastSyncTime(entity: SyncEntity): Promise<Date> {
        const lastSyncTime = await AsyncStorage.getItem(`lastSyncTime_${entity}`);
        return lastSyncTime ? new Date(lastSyncTime) : new Date(0); // Default to epoch if not set
    },

    async setLastSyncTime(entity: SyncEntity, time: Date): Promise<void> {
        await AsyncStorage.setItem(`lastSyncTime_${entity}`, time.toISOString());
    },

    async clearLastSyncTime(entity: SyncEntity): Promise<void> {
        await AsyncStorage.removeItem(`lastSyncTime_${entity}`);
    }
}