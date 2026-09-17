PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`impersonated_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_sessions`(`id`, `expires_at`, `token`, `ip_address`, `user_agent`, `user_id`, `impersonated_by`, `created_at`, `updated_at`) SELECT `id`, `expires_at`, `token`, `ip_address`, `user_agent`, `user_id`, `impersonated_by`, `created_at`, `updated_at` FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text NOT NULL,
	`banned` integer NOT NULL,
	`ban_reason` text,
	`ban_expires` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`(`id`, `name`, `email`, `email_verified`, `image`, `role`, `banned`, `ban_reason`, `ban_expires`, `created_at`, `updated_at`) SELECT `id`, `name`, `email`, `email_verified`, `image`, `role`, `banned`, `ban_reason`, `ban_expires`, `created_at`, `updated_at` FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_church_events` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`location` text NOT NULL,
	`parish` text,
	`cover_image_url` text NOT NULL,
	`flyer_url` text,
	`registration_required` integer DEFAULT false,
	`max_participants` integer,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`author_id` text,
	CONSTRAINT `church_events_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
INSERT INTO `__new_church_events`(`id`, `title`, `slug`, `description`, `content`, `location`, `parish`, `cover_image_url`, `flyer_url`, `registration_required`, `max_participants`, `start_date`, `end_date`, `created_at`, `updated_at`, `author_id`) SELECT `id`, `title`, `slug`, `description`, `content`, `location`, `parish`, `cover_image_url`, `flyer_url`, `registration_required`, `max_participants`, `start_date`, `end_date`, `created_at`, `updated_at`, `author_id` FROM `church_events`;--> statement-breakpoint
DROP TABLE `church_events`;--> statement-breakpoint
ALTER TABLE `__new_church_events` RENAME TO `church_events`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_job_postings` (
	`id` text PRIMARY KEY,
	`title` text(150) NOT NULL,
	`slug` text(150) NOT NULL UNIQUE,
	`description` text(2000),
	`reports_to` text(100),
	`department` text NOT NULL,
	`responsibilities` text DEFAULT (json_array()),
	`requirements` text DEFAULT (json_array()),
	`skills` text DEFAULT (json_array()),
	`salary_min` integer,
	`salary_max` integer,
	`employment_type` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`posted_at` integer,
	`expires_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`author_id` text,
	CONSTRAINT `job_postings_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
INSERT INTO `__new_job_postings`(`id`, `title`, `slug`, `description`, `reports_to`, `department`, `responsibilities`, `requirements`, `skills`, `salary_min`, `salary_max`, `employment_type`, `is_active`, `posted_at`, `expires_at`, `created_at`, `updated_at`, `author_id`) SELECT `id`, `title`, `slug`, `description`, `reports_to`, `department`, `responsibilities`, `requirements`, `skills`, `salary_min`, `salary_max`, `employment_type`, `is_active`, `posted_at`, `expires_at`, `created_at`, `updated_at`, `author_id` FROM `job_postings`;--> statement-breakpoint
DROP TABLE `job_postings`;--> statement-breakpoint
ALTER TABLE `__new_job_postings` RENAME TO `job_postings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`excerpt` text,
	`category` text,
	`content` text NOT NULL,
	`cover_image_url` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`author_display_name` text DEFAULT 'John Doe' NOT NULL,
	`author_id` text,
	`discord_message_id` text,
	CONSTRAINT `posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
INSERT INTO `__new_posts`(`id`, `title`, `slug`, `excerpt`, `category`, `content`, `cover_image_url`, `status`, `published_at`, `created_at`, `updated_at`, `author_display_name`, `author_id`, `discord_message_id`) SELECT `id`, `title`, `slug`, `excerpt`, `category`, `content`, `cover_image_url`, `status`, `published_at`, `created_at`, `updated_at`, `author_display_name`, `author_id`, `discord_message_id` FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `sessions_token_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `users_email_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `church_events_slug_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `posts_slug_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `job_postings_slug_unique`;--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `church_events_parish_idx` ON `church_events` (`parish`);--> statement-breakpoint
CREATE INDEX `church_events_start_date_idx` ON `church_events` (`start_date`);--> statement-breakpoint
CREATE INDEX `church_events_end_date_idx` ON `church_events` (`end_date`);--> statement-breakpoint
CREATE INDEX `church_events_author_id_idx` ON `church_events` (`author_id`);--> statement-breakpoint
CREATE INDEX `job_postings_department_idx` ON `job_postings` (`department`);--> statement-breakpoint
CREATE INDEX `job_postings_employment_type_idx` ON `job_postings` (`employment_type`);--> statement-breakpoint
CREATE INDEX `job_postings_active_idx` ON `job_postings` (`is_active`);--> statement-breakpoint
CREATE INDEX `job_postings_expires_at_idx` ON `job_postings` (`expires_at`);--> statement-breakpoint
CREATE INDEX `posts_status_published_at_idx` ON `posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `posts_author_id_idx` ON `posts` (`author_id`);