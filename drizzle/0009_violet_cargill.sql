CREATE TABLE `daily_burn_target` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`user_activity_id` text NOT NULL,
	`duration` integer NOT NULL,
	`modified_at` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_activity_id`) REFERENCES `user_activities`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "activity_or_user_activity_check" CHECK(("daily_burn_target"."activity_id" IS NOT NULL) != ("daily_burn_target"."user_activity_id" IS NOT NULL))
);
