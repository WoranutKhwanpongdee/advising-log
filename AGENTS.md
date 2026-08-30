# AGENTS.md

## Project Overview

AdvisingLog is a web-based student advising system.
The system manages student-advisor meetings, advising records,
follow-ups, documents, dropout/leave cases, and QA reporting.

## User Roles

- Student
- Advisor
- Program Chair / QA Coordinator
- Admin

## Tech Stack

- Frontend: React + Vite + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Backend: Cloudflare Workers + Hono
- Database: Cloudflare D1 + Drizzle ORM
- Validation: Zod
- Charts: Recharts
- Excel/CSV: SheetJS
- Testing: Vitest + Playwright

## Development Rules

- Use TypeScript for all application code.
- Follow the existing project structure and conventions.
- Use reusable components instead of duplicating UI code.
- Validate user input with Zod.
- Use Drizzle ORM for database access.
- Do not expose sensitive student information unnecessarily.
- Follow role-based permissions for all protected features.
- Keep Student, Advisor, QA, and Admin permissions clearly separated.
- Do not add new libraries without discussing the reason first.

## Database Rules

- Use Drizzle migrations for database changes.
- Do not modify the production database manually.
- Keep sensitive student data protected.
- Use IDs/student codes instead of exposing personal information where possible.

## Testing

Before considering a feature complete:

1. Run Vitest.
2. Run Playwright for important user flows.
3. Check TypeScript errors.
4. Check that role permissions work correctly.

## Git

- Use clear commit messages.
- Keep commits focused on one feature or change.
- Do not commit secrets, API keys, or environment files.
