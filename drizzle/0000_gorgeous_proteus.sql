CREATE TABLE `activities` (
	`code` integer PRIMARY KEY NOT NULL,
	`majorHeading` text NOT NULL,
	`metValue` integer NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activities_description_unique` ON `activities` (`description`);