CREATE TABLE `weight_records` (
	`id` text PRIMARY KEY NOT NULL,
	`weight` real NOT NULL,
	`time` integer NOT NULL,
	`modified_at` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL
);
