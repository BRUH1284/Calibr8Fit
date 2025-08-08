import AsyncStorage from "@react-native-async-storage/async-storage";

export enum SyncEntity {
    Activities = "activities",
    UserActivities = "user_activities",
}

export interface SyncTimeService {
    getLastSyncTime(entity: SyncEntity): Promise<Date>;
    setLastSyncTime(entity: SyncEntity, time: Date): Promise<void>;
    getLastSyncTimeSeconds(entity: SyncEntity): Promise<number>;
    setLastSyncTimeSeconds(entity: SyncEntity, time: number): Promise<void>;
    clearLastSyncTime(entity: SyncEntity): Promise<void>;
}

export const syncTimeService: SyncTimeService = {
    async getLastSyncTime(entity: SyncEntity): Promise<Date> {
        const lastSyncTime = await AsyncStorage.getItem(`lastSyncTime_${entity}`);
        return lastSyncTime ? new Date(lastSyncTime) : new Date(0); // Default to epoch if not set
    },

    async setLastSyncTime(entity: SyncEntity, time: Date): Promise<void> {
        await AsyncStorage.setItem(`lastSyncTime_${entity}`, Math.floor(time.getTime() / 1000).toString());
    },

    async clearLastSyncTime(entity: SyncEntity): Promise<void> {
        await AsyncStorage.removeItem(`lastSyncTime_${entity}`);
    },

    async getLastSyncTimeSeconds(entity: SyncEntity): Promise<number> {
        const lastSyncTime = await AsyncStorage.getItem(`lastSyncTime_${entity}`);
        return lastSyncTime ? parseInt(lastSyncTime, 10) : 0; // Default to 0 if not set
    },

    async setLastSyncTimeSeconds(entity: SyncEntity, time: number): Promise<void> {
        await AsyncStorage.setItem(`lastSyncTime_${entity}`, time.toString());
    }
}