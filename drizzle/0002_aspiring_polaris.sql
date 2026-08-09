DROP INDEX `posts_status_published_at_idx`;--> statement-breakpoint
CREATE INDEX `posts_status_published_at_idx` ON `posts` (`status`,`published_at`);--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));
