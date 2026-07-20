DROP INDEX "accounts_user_id_idx";--> statement-breakpoint
DROP INDEX "accounts_user_id_provider_id_unique";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "sessions_user_id_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "church_events_slug_unique";--> statement-breakpoint
DROP INDEX "church_events_parish_idx";--> statement-breakpoint
DROP INDEX "church_events_start_date_idx";--> statement-breakpoint
DROP INDEX "church_events_end_date_idx";--> statement-breakpoint
DROP INDEX "church_events_author_id_idx";--> statement-breakpoint
DROP INDEX "posts_slug_unique";--> statement-breakpoint
DROP INDEX "posts_status_published_at_idx";--> statement-breakpoint
DROP INDEX "posts_author_id_idx";--> statement-breakpoint
ALTER TABLE `posts` ALTER COLUMN "published_at" TO "published_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
CREATE INDEX `accounts_user_id_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_user_id_provider_id_unique` ON `accounts` (`user_id`,`provider_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `church_events_slug_unique` ON `church_events` (`slug`);--> statement-breakpoint
CREATE INDEX `church_events_parish_idx` ON `church_events` (`parish`);--> statement-breakpoint
CREATE INDEX `church_events_start_date_idx` ON `church_events` (`start_date`);--> statement-breakpoint
CREATE INDEX `church_events_end_date_idx` ON `church_events` (`end_date`);--> statement-breakpoint
CREATE INDEX `church_events_author_id_idx` ON `church_events` (`author_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_status_published_at_idx` ON `posts` (`status`,`"published_at" desc`);--> statement-breakpoint
CREATE INDEX `posts_author_id_idx` ON `posts` (`author_id`);