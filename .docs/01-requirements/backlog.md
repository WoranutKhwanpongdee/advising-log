# Backlog

This document serves as the master product backlog for the AdvisingLog system. It tracks all required work to transition the current frontend prototype into a secure, scalable production application.

## 🧱 1. Infrastructure & Backend Setup
- [x] **Monorepo Setup**: Root package configuration with workspaces for frontend and backend.
- [x] **Database Provisioning**: Initialize Cloudflare D1 instances for staging and production environments. *(Local D1 binding configured)*
- [x] **Hono Server Setup**: Scaffolding the Cloudflare Workers + Hono application structure with routing. *(Basic `index.ts` with health/info routes exists)*
- [x] **Drizzle ORM Base Setup**: Scaffold Drizzle configuration and initial `Users`, `Advising Records`, and `Meetings` schemas.
- [ ] **Drizzle ORM Expansion**: Define remaining schemas (Follow-ups, Exit Cases, Attachments).
- [ ] **Database Migrations**: Set up Drizzle migration scripts and CI/CD automated schema deployment.
- [ ] **Environment Variables**: Configure and secure secrets (API keys, DB credentials) using Cloudflare Secrets.

## 🔐 2. Authentication & Authorization
- [ ] **SSO Integration**: Replace simulated Auth Context with real SSO (e.g., Microsoft Entra, Google Workspace, or generic OAuth).
- [ ] **Session Management**: Implement secure HTTP-only cookies or JWT tokens for session persistence.
- [x] **Frontend RBAC**: Frontend route guarding implemented (`RequireRole` in `App.tsx`).
- [ ] **Backend RBAC Middleware**: Create Hono middleware to enforce strict Role-Based Access Control (Student, Advisor, QA, Admin) on the server.
- [ ] **Audit Logging**: Track and log sensitive actions (e.g., viewing a student's private document or changing user roles).

## 🔌 3. Core API Endpoints (CRUD)
- [ ] **User Management APIs**: Endpoints for Admin to manage the student-advisor roster.
- [ ] **Advising Request APIs**: Endpoints for students to submit, update, and cancel requests.
- [ ] **Session & Scheduling APIs**: Endpoints for advisors to accept, schedule, and complete sessions.
- [ ] **Advising Log APIs**: Endpoints for creating and editing post-session logs and summaries.
- [ ] **Follow-up APIs**: Endpoints for assigning tasks and for students to mark them as complete.
- [ ] **Exit Case APIs**: Endpoints for Leave of Absence/Dropout workflows, advisor assessments, and QA reviews.

## 📁 4. Media & Document Management (Cloudinary)
- [ ] **Secure Upload Flow**: Implement backend endpoint to generate signed Cloudinary upload tokens.
- [ ] **File Validation**: Enforce file type (PDF, JPG, PNG) and size limits during upload.
- [ ] **Private Asset Access**: Generate time-limited, authenticated URLs for viewing sensitive student documents.
- [ ] **Metadata Tagging**: Ensure assets are tagged with `student_code` and `log_id` for easy bulk management without exposing PII.

## 🌐 5. Frontend Integration & Migration
- [ ] **Data Fetching Layer**: Implement a data fetching library (e.g., React Query or SWR) to replace the mock Context API. *(React Query is installed but not yet implemented)*
- [ ] **Form Validation**: Ensure Zod validation schemas are shared and synced between the React frontend and Hono backend.
- [x] **Toast Notifications**: Implement global Toast notifications for success/error states. *(Completed via `ToastContext`)*
- [ ] **API Error Handling**: Implement global error handling and loading states for all real API calls.
- [ ] **Pagination & Filtering**: Update frontend tables/lists to use server-side pagination and filtering for performance.

## 📧 6. Notifications & Automations
- [ ] **Email Service Provider Setup**: Integrate with SendGrid, AWS SES, or Resend.
- [ ] **Transactional Emails**: Create templates and triggers for session confirmations, follow-up assignments, and cancellations.
- [ ] **Scheduled Reminders (Cron)**: Use Cloudflare Worker Cron Triggers to send 24-hour appointment reminders.
- [ ] **In-App Notifications**: Implement real-time notifications or polling for new alerts in the top navigation bar.

## 📊 7. QA, Analytics & Reporting
- [x] **QA Dashboard UI**: Build analytics dashboard UI with `recharts` for category distribution, workload, and exit reasons. *(Completed in `QADashboard.tsx`)*
- [ ] **Aggregate Queries**: Write complex D1 SQL queries for the QA dashboard to feed the charts.
- [ ] **Data De-identification**: Ensure analytics queries strip out PII (names, specific IDs) before returning data to the UI.
- [ ] **Export to CSV/Excel**: Implement `SheetJS` on the frontend or backend to allow QA to download report data. *(SheetJS `xlsx` package is installed)*

## 📈 8. Advanced / Future Features
- [ ] **Calendar Integration**: Two-way sync with Google Calendar or Microsoft Outlook for advisors.
- [ ] **Batch Processing**: Allow Admins to upload a CSV to bulk-create students and assign them to advisors.
- [ ] **PDF Generation**: Generate official PDF reports of completed advising logs or exit cases.
- [ ] **Mobile Optimization / PWA**: Ensure all workflows are highly responsive and consider Progressive Web App features.

## 🛡 9. Testing & Quality Assurance
- [ ] **Backend Unit Tests**: Write Vitest tests for complex logic, RBAC, and data validation.
- [ ] **E2E Testing (Playwright)**: Expand coverage for critical user journeys (e.g., end-to-end exit case submission and approval).
- [ ] **Security Scanning**: Automated dependency scanning and vulnerability checks.

## 🚀 10. DevOps & CI/CD
- [ ] **GitHub Actions Setup**: Create pipelines for linting, type-checking (`tsc --noEmit`), and running tests on PRs.
- [ ] **Automated Deployments**: Configure GitHub Actions to automatically deploy to Cloudflare Workers on merges to `main`.
- [ ] **Staging Environment**: Set up a parallel staging environment for testing changes before production release.
