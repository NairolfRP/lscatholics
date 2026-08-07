CREATE TABLE `pending_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`amount` integer NOT NULL,
	`mode` integer DEFAULT 0 NOT NULL,
	`metadata` text DEFAULT '' NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pending_payments_expires_at_idx` ON `pending_payments` (`expires_at`);