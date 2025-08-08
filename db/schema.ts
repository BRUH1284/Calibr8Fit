import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const activities = sqliteTable("activities", {
    code: int().primaryKey({ autoIncrement: false }),
    majorHeading: text().notNull(),
    metValue: real().notNull(),
    description: text().notNull(),
});

export const userActivities = sqliteTable("user_activities", {
    id: text().primaryKey().notNull(),
    majorHeading: text().notNull(),
    metValue: real().notNull(),
    description: text().notNull(),
    modifiedAt: int('modified_at').notNull().default(Math.floor(Date.now() / 1000)),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});