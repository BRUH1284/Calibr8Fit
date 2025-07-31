import { SyncStatus } from "@/shared/types/enums/dbTypes";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dataVersion = sqliteTable("data_version", {
    resource: int('data_resource').primaryKey({ autoIncrement: false }), // DataResource enum
    checksum: text('checksum')
});

export const activities = sqliteTable("activities", {
    code: int().primaryKey({ autoIncrement: false }),
    majorHeading: text().notNull(),
    metValue: real().notNull(),
    description: text().notNull(),
});

export const userActivities = sqliteTable("user_activities", {
    id: text().primaryKey(),
    majorHeading: text().notNull(),
    metValue: real().notNull(),
    description: text().notNull(),
    updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
    syncStatus: int('sync_status').notNull().default(SyncStatus.SYNCED), // SyncStatus enum
});