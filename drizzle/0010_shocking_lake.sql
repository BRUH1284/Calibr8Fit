PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_burn_target` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text,
	`user_activity_id` text,
	`duration` integer NOT NULL,
	`modified_at` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_activity_id`) REFERENCES `user_activities`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "activity_or_user_activity_check" CHECK(("__new_daily_burn_target"."activity_id" IS NOT NULL) != ("__new_daily_burn_target"."user_activity_id" IS NOT NULL))
);
--> statement-breakpoint
INSERT INTO `__new_daily_burn_target`("id", "activity_id", "user_activity_id", "duration", "modified_at", "deleted") SELECT "id", "activity_id", "user_activity_id", "duration", "modified_at", "deleted" FROM `daily_burn_target`;--> statement-breakpoint
DROP TABLE `daily_burn_target`;--> statement-breakpoint
ALTER TABLE `__new_daily_burn_target` RENAME TO `daily_burn_target`;--> statement-breakpoint
PRAGMA foreign_keys=ON;