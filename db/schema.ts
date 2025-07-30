import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dataVersion = sqliteTable("data_version", {
    resource: int('data_resource').primaryKey({ autoIncrement: false }), // DataResource enum
    lastModified: int('last_modified'),
    checksum: text('checksum')
});

export const activities = sqliteTable("activities", {
    code: int().primaryKey({ autoIncrement: false }),
    majorHeading: text().notNull(),
    metValue: int().notNull(),
    description: text().notNull().unique(),
});
