import { db } from "@/db/db";
import { eq, gt, InferInsertModel } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import * as Crypto from 'expo-crypto';
import { SyncConfig, SyncEntity } from "../types/sync";
import { api } from "./api";
import { syncTimeService } from "./syncTimeService";

export function createSyncService<
    TTable extends SQLiteTable,
    TLocal extends SyncEntity,
    TRemote
>(config: SyncConfig<TTable, TLocal, TRemote>) {
    const {
        entityType,
        table,
        endpoint,
        collectionKey,
        mapRemoteArrayToLocal,
        mapLocalArrayToRemote,
        primaryKey,
        upsertSet,
        customLoad
    } = config;

    const load = async (includeDeleted: boolean = false): Promise<TLocal[]> => {
        if (customLoad)
            return await customLoad(includeDeleted);

        // Load data from the local database
        return await db
            .select()
            .from(table)
            .where(eq((table as any).deleted, includeDeleted)) as unknown as TLocal[];
    }

    const fetch = async (): Promise<TLocal[]> => {
        try {
            // Fetch data from the server
            const response = await api.request({
                endpoint,
                method: 'GET',
            }) as TRemote[];
            // Map remote data to local format if a mapping function is provided
            return mapRemoteArrayToLocal
                ? mapRemoteArrayToLocal(response)
                : response as unknown as TLocal[];
        } catch (error) {
            console.error("Failed to fetch:", error);
            throw error;
        }
    }

    const add = async (data: Omit<InferInsertModel<TTable>, 'id' | 'modifiedAt'>): Promise<TLocal[]> => {
        try {
            // Insert a new entry into the database
            await db
                .insert(table)
                .values({
                    ...data,
                    modifiedAt: Date.now(),
                    id: Crypto.randomUUID()
                } as unknown as InferInsertModel<TTable>);
        } catch (error) {
            console.error("Failed to insert local data:", error);
            throw error;
        }
        // Sync to ensure the data is synced with the server
        return await sync();
    }

    const softDelete = async (id: string): Promise<TLocal[]> => {
        try {
            // Mark the entry as deleted in the local database
            await db
                .update(table)
                .set({
                    deleted: true,
                    modifiedAt: Date.now() // Update modifiedAt to current time
                } as unknown as InferInsertModel<TTable>)
                .where(eq((table as any).id, id));
        } catch (error) {
            console.error("Failed to mark local data as deleted:", error);
            throw error;
        }
        // Sync to ensure the deletion is synced with the server
        return await sync();
    }

    const lastUpdatedAt = async () => new Date(
        await api.request({
            endpoint: `${endpoint}/last-updated-at`,
            method: 'GET'
        })).getTime();

    const sync = async (): Promise<TLocal[]> => {
        // Get the last sync time for the entity table
        const lastSync = await syncTimeService.getLastSyncTimeMilliseconds(entityType);
        try {
            // Fetch the last updated time from the server
            const updatedAt = await lastUpdatedAt();

            // Fetch modified entities since the last sync time
            const modifiedEntities = await db
                .select()
                .from(table)
                .where(gt((table as any).modifiedAt, lastSync)) as TLocal[];

            // If no new updates on either side, return local data
            if (updatedAt === lastSync && modifiedEntities.length === 0)
                return load();

            // Sync modified entities with the server
            const response = (await api.request({
                endpoint: `${endpoint}/sync`,
                method: 'POST',
                body: {
                    lastSyncedAt: new Date(lastSync).toISOString(), // Convert to ISO string
                    [collectionKey]: mapLocalArrayToRemote
                        ? await mapLocalArrayToRemote(modifiedEntities)
                        : modifiedEntities as unknown as TRemote[],
                },
            })) as {
                lastSyncedAt: string
            } & Record<string, TRemote[]>;

            // Map remote data to local format if a mapping function is provided
            const inserts = mapRemoteArrayToLocal
                ? await mapRemoteArrayToLocal(response[collectionKey])
                : response[collectionKey] as unknown as TLocal[];

            // Insert new/updated entries
            if (inserts.length)
                await db
                    .insert(table)
                    .values(inserts)
                    .onConflictDoUpdate({ target: primaryKey as any, set: upsertSet as any });

            await syncTimeService.setLastSyncTimeMilliseconds(entityType, new Date(response.lastSyncedAt).getTime());
        } catch (e) {
            console.error('Failed to sync entities:', e);
            console.log(entityType)
        }
        return load();
    }

    return { load, fetch, sync, add, softDelete };
}