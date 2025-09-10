CREATE TABLE `user_meal_ingredients` (
	`id` text PRIMARY KEY NOT NULL,
	`user_meal_id` text,
	`food_id` text,
	`user_food_id` text,
	`quantity_in_grams` integer NOT NULL,
	FOREIGN KEY (`user_meal_id`) REFERENCES `user_meals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_foods`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "food_or_user_food_check" CHECK(("user_meal_ingredients"."food_id" IS NOT NULL) != ("user_meal_ingredients"."user_food_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `user_meals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notes` text,
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
	FOREIGN KEY (`user_activity_id`) REFERENCES `user_activities`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "activity_or_user_activity_check" CHECK(("__new_activity_records"."activity_id" IS NOT NULL) != ("__new_activity_records"."user_activity_id" IS NOT NULL))
);
--> statement-breakpoint
INSERT INTO `__new_activity_records`("id", "activity_id", "user_activity_id", "duration", "calories_burned", "time", "modified_at", "deleted") SELECT "id", "activity_id", "user_activity_id", "duration", "calories_burned", "time", "modified_at", "deleted" FROM `activity_records`;--> statement-breakpoint
DROP TABLE `activity_records`;--> statement-breakpoint
ALTER TABLE `__new_activity_records` RENAME TO `activity_records`;--> statement-breakpoint
PRAGMA foreign_keys=ON;