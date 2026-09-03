# AGENTS.md

## Project Overview

AdvisingLog is a web-based student advising system.
The system manages student-advisor meetings, advising records,
follow-ups, documents (via Cloudinary), dropout/leave cases, and QA reporting.

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
- Media Storage: Cloudinary (images, documents, secure URLs)
- Validation: Zod
- Charts: Recharts
- Excel/CSV: SheetJS
- Testing: Vitest + Playwright

## Development Rules

- Use TypeScript for all application code.
- Follow the existing project structure and conventions.
- Use reusable components instead of duplicating UI code.
- Validate user input with Zod on both frontend and backend.
- Use Drizzle ORM for database access; never write raw SQL unless absolutely necessary.
- Use Cloudinary for all media uploads; do not store files in D1 or local filesystem.
- Always use authenticated/private Cloudinary URLs for sensitive student documents.
- Do not expose sensitive student information unnecessarily.
- Follow role-based permissions for all protected features.
- Keep Student, Advisor, QA, and Admin permissions clearly separated.
- Do not add new libraries without discussing the reason first.
- Tag Cloudinary assets with `student_code` and `log_id` only; never include PII in metadata.

## Database Rules

- Use Drizzle migrations for all database schema changes.
- Do not modify the production database manually.
- Store only Cloudinary `public_id` references in D1; never store binary data or full URLs.
- Keep sensitive student data protected and de-identified where possible.
- Use IDs/student codes instead of exposing personal information in logs and reports.
- Ensure foreign key constraints are defined for all relational tables.

## Testing

Before considering a feature complete:

1. Run Vitest for unit and integration tests.
2. Run Playwright for critical user flows (advising log creation, drop form workflow, follow-up completion).
3. Check TypeScript errors (`tsc --noEmit`).
4. Verify role-based permissions work correctly for each endpoint and UI route.
5. Test Cloudinary upload flow including error handling and invalid file types.

## Git

- Use clear, descriptive commit messages following conventional commits.
- Keep commits focused on one feature or change.
- Do not commit secrets, API keys, `.env` files, or Cloudinary credentials.
- Include migration files when committing database changes.