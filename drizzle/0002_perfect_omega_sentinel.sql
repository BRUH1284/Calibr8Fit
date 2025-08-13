CREATE TABLE `activity_records` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text,
	`user_activity_id` text,
	`duration` integer NOT NULL,
	`calories_burned` real NOT NULL,
	`time` integer NOT NULL,
	`modified_at` integer DEFAULT 1754724741 NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_activity_id`) REFERENCES `user_activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_activities`("id", "majorHeading", "metValue", "description") SELECT "id", "majorHeading", "metValue", "description" FROM `activities`;--> statement-breakpoint
DROP TABLE `activities`;--> statement-breakpoint
ALTER TABLE `__new_activities` RENAME TO `activities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL,
	`modified_at` integer DEFAULT 1754724741 NOT NULL,
	`deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_activities`("id", "majorHeading", "metValue", "description", "modified_at", "deleted") SELECT "id", "majorHeading", "metValue", "description", "modified_at", "deleted" FROM `user_activities`;--> statement-breakpoint
DROP TABLE `user_activities`;--> statement-breakpoint
ALTER TABLE `__new_user_activities` RENAME TO `user_activities`;