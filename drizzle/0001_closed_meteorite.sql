PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL,
	`modified_at` integer DEFAULT 1754641341 NOT NULL,
	`deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_activities`("id", "majorHeading", "metValue", "description", "modified_at", "deleted") SELECT "id", "majorHeading", "metValue", "description", "modified_at", "deleted" FROM `user_activities`;--> statement-breakpoint
DROP TABLE `user_activities`;--> statement-breakpoint
ALTER TABLE `__new_user_activities` RENAME TO `user_activities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;