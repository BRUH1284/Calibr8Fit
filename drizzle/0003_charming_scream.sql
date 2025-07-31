PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL,
	`updated_at` text DEFAULT '2025-07-31T20:02:43.301Z' NOT NULL,
	`sync_status` integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_activities`("id", "majorHeading", "metValue", "description", "updated_at", "sync_status") SELECT "id", "majorHeading", "metValue", "description", "updated_at", "sync_status" FROM `user_activities`;--> statement-breakpoint
DROP TABLE `user_activities`;--> statement-breakpoint
ALTER TABLE `__new_user_activities` RENAME TO `user_activities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;