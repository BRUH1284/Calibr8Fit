CREATE TABLE `data_version` (
	`data_resource` integer PRIMARY KEY NOT NULL,
	`last_modified` integer,
	`checksum` text
);
