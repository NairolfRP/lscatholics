DROP INDEX IF EXISTS `church_events_start_date_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `church_events_end_date_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `job_postings_active_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `job_postings_expires_at_idx`;--> statement-breakpoint
CREATE INDEX `church_events_period_idx` ON `church_events` (`start_date`,`end_date`);--> statement-breakpoint
CREATE INDEX `job_postings_active_expires_at_idx` ON `job_postings` (`is_active`,`expires_at`);