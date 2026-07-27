CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `accounts_user_id_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_user_id_provider_id_unique` ON `accounts` (`user_id`,`provider_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`impersonated_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`role` text NOT NULL,
	`banned` integer NOT NULL,
	`ban_reason` text,
	`ban_expires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `church_events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
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
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `church_events_slug_unique` ON `church_events` (`slug`);--> statement-breakpoint
CREATE INDEX `church_events_parish_idx` ON `church_events` (`parish`);--> statement-breakpoint
CREATE INDEX `church_events_start_date_idx` ON `church_events` (`start_date`);--> statement-breakpoint
CREATE INDEX `church_events_end_date_idx` ON `church_events` (`end_date`);--> statement-breakpoint
CREATE INDEX `church_events_author_id_idx` ON `church_events` (`author_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
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
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_status_published_at_idx` ON `posts` (`status`,"published_at" desc);--> statement-breakpoint
CREATE INDEX `posts_author_id_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE TABLE `job_postings` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(150) NOT NULL,
	`slug` text(150) NOT NULL,
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
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `job_postings_slug_unique` ON `job_postings` (`slug`);--> statement-breakpoint
CREATE INDEX `job_postings_department_idx` ON `job_postings` (`department`);--> statement-breakpoint
CREATE INDEX `job_postings_employment_type_idx` ON `job_postings` (`employment_type`);--> statement-breakpoint
CREATE INDEX `job_postings_active_idx` ON `job_postings` (`is_active`);--> statement-breakpoint
CREATE INDEX `job_postings_expires_at_idx` ON `job_postings` (`expires_at`);