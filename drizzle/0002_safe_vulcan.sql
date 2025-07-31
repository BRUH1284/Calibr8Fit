CREATE TABLE `user_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL,
	`sync_status` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activities` (
	`code` integer PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_activities`("code", "majorHeading", "metValue", "description") SELECT "code", "majorHeading", "metValue", "description" FROM `activities`;--> statement-breakpoint
DROP TABLE `activities`;--> statement-breakpoint
ALTER TABLE `__new_activities` RENAME TO `activities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `data_version` DROP COLUMN `last_modified`;