CREATE TABLE `water_intake_records` (
	`id` text PRIMARY KEY NOT NULL,
	`amount_in_ml` real NOT NULL,
	`time` integer NOT NULL,
	`modified_at` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activity_records` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text,
	`user_activity_id` text,
	`duration` integer NOT NULL,
	`calories_burned` real NOT NULL,
	`time` integer NOT NULL,
	`modified_at` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_activity_id`) REFERENCES `user_activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_activity_records`("id", "activity_id", "user_activity_id", "duration", "calories_burned", "time", "modified_at", "deleted") SELECT "id", "activity_id", "user_activity_id", "duration", "calories_burned", "time", "modified_at", "deleted" FROM `activity_records`;--> statement-breakpoint
DROP TABLE `activity_records`;--> statement-breakpoint
ALTER TABLE `__new_activity_records` RENAME TO `activity_records`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`major_heading` text NOT NULL,
	`met_value` real NOT NULL,
	`description` text NOT NULL,
	`modified_at` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_activities`("id", "major_heading", "met_value", "description", "modified_at", "deleted") SELECT "id", "major_heading", "met_value", "description", "modified_at", "deleted" FROM `user_activities`;--> statement-breakpoint
DROP TABLE `user_activities`;--> statement-breakpoint
ALTER TABLE `__new_user_activities` RENAME TO `user_activities`;