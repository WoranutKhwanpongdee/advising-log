# AdvisingLog Feature List

This document outlines the core features of the AdvisingLog system, organized by user role.

## 🎓 Student Features

- **Advising Requests**: Submit requests for advising sessions, specify categories (e.g., Academic Performance), provide a problem description, and select preferred dates and times.
- **PDPA Consent**: Explicitly accept PDPA consent when submitting requests or forms.
- **Document Management**: Securely upload and manage sensitive documents via Cloudinary.
- **Advising History**: View past advising sessions, detailed notes, and timelines.
- **Follow-ups**: View and mark assigned follow-up tasks as complete (e.g., "Submit study plan").
- **Exit Forms**: Submit official exit forms for processes such as Leave of Absence or Dropout.
- **Notifications**: Receive alerts for scheduled appointments, new follow-up tasks, and request status changes.

## 👨‍🏫 Advisor Features

- **Request Management**: View pending advising requests from assigned students.
- **Scheduling**: Accept requests and schedule sessions by specifying date, time, and location.
- **Advising Logs**: Write comprehensive advising logs post-session, detailing summaries, advice provided, and next steps.
- **Follow-up Assignment**: Create and assign actionable follow-up tasks for students to complete.
- **Early Warnings**: Proactively create early warnings for students (e.g., for low attendance or falling grades).
- **Referrals**: Refer students to other specialized departments (e.g., Financial Office or Counseling).
- **Exit Assessments**: Submit official advisor assessments for students who have filed exit forms.

## 📊 Program Chair / QA Coordinator Features

- **QA Dashboard**: Access comprehensive analytics dashboards detailing system-wide metrics.
- **Analytics Charts**: View distributions of advising categories, common exit reasons, and overall advisor workload.
- **Exit Case Review**: Review submitted exit cases, read advisor assessments, and finalize/close the cases.
- **Compliance Monitoring**: Ensure advising processes meet QA standards through aggregated, de-identified reporting.

## ⚙️ Admin Features

- **User Management**: Create, update, and manage accounts for Students, Advisors, and QA staff.
- **Roster Management**: Manage the official student-advisor roster and reassign advisors as needed.

## 🛠 System & Technical Features

- **Role-Based Access Control (RBAC)**: Strict separation of permissions between Students, Advisors, QA, and Admins.
- **Secure Media Storage**: All sensitive documents and images are stored securely on Cloudinary using authenticated/private URLs.
- **Data Privacy**: Automatic de-identification of sensitive student data in logs and reports.
- **Responsive UI**: A modern, accessible web interface built with React, Tailwind CSS, and shadcn/ui.
