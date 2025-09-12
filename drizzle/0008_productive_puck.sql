CREATE TABLE `consumption_records` (
	`id` text PRIMARY KEY NOT NULL,
	`food_id` text,
	`user_food_id` text,
	`user_meal_id` text,
	`quantity_in_grams` integer NOT NULL,
	`time` integer NOT NULL,
	`modified_at` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_foods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_meal_id`) REFERENCES `user_meals`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "food_or_user_food_or_meal_check" CHECK(( ("consumption_records"."food_id" IS NOT NULL) + ("consumption_records"."user_food_id" IS NOT NULL) + ("consumption_records"."user_meal_id" IS NOT NULL) ) = 1)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_meal_ingredients` (
	`id` text PRIMARY KEY NOT NULL,
	`user_meal_id` text NOT NULL,
	`food_id` text,
	`user_food_id` text,
	`quantity_in_grams` integer NOT NULL,
	FOREIGN KEY (`user_meal_id`) REFERENCES `user_meals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_foods`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "food_or_user_food_check" CHECK(("__new_user_meal_ingredients"."food_id" IS NOT NULL) != ("__new_user_meal_ingredients"."user_food_id" IS NOT NULL))
);
--> statement-breakpoint
INSERT INTO `__new_user_meal_ingredients`("id", "user_meal_id", "food_id", "user_food_id", "quantity_in_grams") SELECT "id", "user_meal_id", "food_id", "user_food_id", "quantity_in_grams" FROM `user_meal_ingredients`;--> statement-breakpoint
DROP TABLE `user_meal_ingredients`;--> statement-breakpoint
ALTER TABLE `__new_user_meal_ingredients` RENAME TO `user_meal_ingredients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;