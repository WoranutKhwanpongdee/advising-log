CREATE TABLE `advising_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`category` text NOT NULL,
	`sub_category` text,
	`details` text NOT NULL,
	`preferred_date` text NOT NULL,
	`preferred_time` text NOT NULL,
	`attachments` text DEFAULT '[]' NOT NULL,
	`pdpa_consent` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `advising_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`appointment_id` text,
	`student_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`session_date` text NOT NULL,
	`summary` text NOT NULL,
	`problem` text NOT NULL,
	`advice` text NOT NULL,
	`actions_taken` text NOT NULL,
	`outcome` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `advising_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`student_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`scheduled_date` text NOT NULL,
	`scheduled_time` text NOT NULL,
	`location` text NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`student_confirmed` integer DEFAULT false,
	`student_declined` integer DEFAULT false,
	`student_decline_reason` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `advising_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`user_role` text NOT NULL,
	`action` text NOT NULL,
	`description` text NOT NULL,
	`target_id` text,
	`timestamp` text NOT NULL,
	`ip_address` text
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`public_id` text NOT NULL,
	`url` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `early_warnings` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`risk_level` text NOT NULL,
	`indicators` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exit_cases` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`exit_type` text NOT NULL,
	`reason_code` text NOT NULL,
	`reason_category` text NOT NULL,
	`details` text NOT NULL,
	`documents` text DEFAULT '[]' NOT NULL,
	`advisor_assessment` text,
	`status` text DEFAULT 'submitted' NOT NULL,
	`pdpa_consent` integer DEFAULT true NOT NULL,
	`voice_survey_completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `follow_up_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`follow_up_id` text NOT NULL,
	`student_id` text NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`follow_up_id`) REFERENCES `follow_ups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `follow_ups` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text,
	`request_id` text,
	`student_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`task` text NOT NULL,
	`due_date` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`completed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `advising_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`request_id`) REFERENCES `advising_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text,
	`student_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`target_unit` text NOT NULL,
	`reason` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `advising_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `student_advisor_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`assigned_at` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `student_voice_responses` (
	`id` text PRIMARY KEY NOT NULL,
	`exit_case_id` text,
	`student_id` text,
	`is_anonymous` integer DEFAULT false NOT NULL,
	`exit_type` text NOT NULL,
	`academic_year` text NOT NULL,
	`primary_factors` text NOT NULL,
	`curriculum_rating` integer NOT NULL,
	`teaching_rating` integer NOT NULL,
	`advisor_rating` integer NOT NULL,
	`services_rating` integer NOT NULL,
	`overall_rating` integer NOT NULL,
	`what_could_university_do_better` text,
	`curriculum_improvement_suggestions` text,
	`advice_for_future_students` text,
	`share_with_advisor` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`exit_case_id`) REFERENCES `exit_cases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`department` text DEFAULT 'School of Applied Digital Technology (ADT)' NOT NULL,
	`phone` text,
	`is_active` integer DEFAULT true NOT NULL,
	`has_ai_access` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_code_unique` ON `users` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);