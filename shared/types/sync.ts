import { SQL, Table } from "drizzle-orm";
import { SyncEntityType } from "../services/syncTimeService";

export type SyncEntity = {
    id: string;
    modifiedAt: number;
    deleted: boolean;
}

export type UpsertSet<TColumns extends Record<string, unknown>> = Record<
    keyof TColumns,
    unknown
>;

export type SyncConfig<
    TTable extends Table,
    TLocal extends SyncEntity,
    TRemote = TLocal
> = {
    entityType: SyncEntityType;
    table: TTable;
    endpoint: string;
    collectionKey: string;
    primaryKey: unknown;
    upsertSet: UpsertSet<Omit<TTable["$inferInsert"], 'id'>>;
    mapRemoteArrayToLocal?: (remote: TRemote[]) => Promise<TLocal[]>;
    mapLocalArrayToRemote?: (local: TLocal[]) => Promise<TRemote[]>;
    customLoad?: (includeDeleted: boolean, loadWhere?: SQL | ((alias: TTable) => SQL)) => Promise<TLocal[]>;
    customUpsert?: (data: TLocal[]) => Promise<void>;
    customModifiedSince?: (since: number) => Promise<TLocal[]>;
};