CREATE TABLE `activities` (
	`code` integer PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` real NOT NULL,
	`description` text NOT NULL,
	`modified_at` text DEFAULT '2025-08-07T18:49:58.334Z' NOT NULL,
	`deleted` integer DEFAULT false NOT NULL
);
