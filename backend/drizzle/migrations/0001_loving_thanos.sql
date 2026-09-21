CREATE TABLE `ai_api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`key` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`provider` text DEFAULT 'Google Gemini' NOT NULL,
	`model` text DEFAULT 'gemini-1.5-flash' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`last_tested_at` text
);
