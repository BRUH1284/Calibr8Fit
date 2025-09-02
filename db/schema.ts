import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const activities = sqliteTable("activities", {
    id: text().primaryKey().notNull(),
    majorHeading: text().notNull(),
    metValue: real().notNull(),
    description: text().notNull(),
});

export const userActivities = sqliteTable("user_activities", {
    id: text().primaryKey().notNull(),
    majorHeading: text('major_heading').notNull(),
    metValue: real('met_value').notNull(),
    description: text('description').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});

export const activityRecords = sqliteTable("activity_records", {
    id: text().primaryKey().notNull(),
    activityId: text('activity_id').references(() => activities.id),
    userActivityId: text('user_activity_id').references(() => userActivities.id),
    duration: int('duration').notNull(),
    caloriesBurned: real('calories_burned').notNull(),
    time: int('time').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});