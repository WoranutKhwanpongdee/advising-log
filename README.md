# 🎓 AdvisingLog

> A web-based student advising system designed to replace the current paper-and-email workflow.

[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)]()
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)]()

---

## 📖 Overview

**AdvisingLog** is a centralized platform for managing the full lifecycle of student
advising — from scheduling meetings and recording advising sessions, to tracking
follow-ups, managing dropout/leave cases, and generating **AUN-QA** compliance reports.

The system consolidates scattered advising activities into a single source of truth,
making it easier for advisors, students, and administrators to stay aligned and for
the program to collect quality-assurance evidence.

---

## 🎯 Problem Statement

The current advising process relies on **paper forms and scattered email threads**, which leads to:

| Pain Point | Impact |
| ---------- | ------ |
| ❌ No systematic follow-up | Advising cases are recorded but never tracked to resolution |
| ❌ Scattered records | Documents lost across emails and physical files |
| ❌ No centralized data | Hard to produce AUN-QA evidence (C6 Student Support, C8 dropout analysis) |
| ❌ Unclear routing | Students don't know who to contact for different issues |
| ❌ Privacy concerns | Sensitive student data handled without PDPA-aware processes |

---

## ✨ Key Features

### 📝 Advising Records
- Structured advising session logs (date, topic, advice, tags)
- Categories: academic, activities, general, and personal matters
- Document & photo attachments (stored in Cloudinary)

### 🔄 Automated Follow-up System
- Auto-triggered follow-up tasks based on critical tags and time
- Kanban-style tracking (`pending → in progress → completed`)
- Full follow-up history timeline

### 📉 Dropout & Leave Management
- Multi-step workflow: `Student → Admin → Advisor → Program Chair`
- Private advisor evaluation form
- Consent-based **Student Voice Form** (filled on student's own device)
- De-identified dropout register with coded root causes

### 🧭 Support Directory
- "Who should I ask?" routing for academic, activity, and welfare issues
- Referrals to the appropriate support unit (counselling, financial aid, etc.)

### 📊 AUN-QA Reporting
- Dashboard with statistics via Recharts
- Exportable reports (CSV/Excel) using SheetJS
- Root-cause analysis for dropout/leave cases

### 🔒 PDPA-Aware Design
- De-identified records for reporting
- Consent-based data collection
- Role-based access control

---

## 👥 User Roles

| Role | Responsibilities |
| ---- | ---------------- |
| 🎓 **Student** | Request meetings, submit drop/leave requests, view own advising history, complete Student Voice Form |
| 👨‍🏫 **Advisor** | Record advising sessions, manage follow-ups, approve requests, complete dropout evaluation, refer students |
| 📊 **Program Chair / QA Coordinator** | View aggregate statistics, generate AUN-QA reports, analyze root causes |
| 🏢 **Admin** | Manage user accounts, configure master data (tags, directory), oversee workflows |

---

## 👥 Project Members

| # | Student ID | Name | Role |
| :-: | :---------: | :--- | :--- |
| 01 | `6631503083` | **Phonepadith Kongsengchanh** | 🎨 UX/UI Designer |
| 02 | `6631503085` | **Sai Seng Main** | 🧭 Tech Lead |
| 03 | `6631503036` | **Woranut Khwanpongdee** | 🤖 AI Lead |
| 04 | `6631503039` | **Wilasinee Mangkorn** | ✅ QA / Test |
| 05 | `6631503031` | **Pirisa Kitichai** | 📦 Product Owner |

---

## 🛠 Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Frontend** | React + Vite + TypeScript |
| **UI** | Tailwind CSS + shadcn/ui |
| **Backend** | Cloudflare Workers + Hono |
| **Database** | Cloudflare D1 + Drizzle ORM |
| **Media Storage** | Cloudinary (images, documents, secure URLs) |
| **Validation** | Zod |
| **Charts** | Recharts |
| **Import/Export** | SheetJS |
| **Testing** | Vitest + Playwright |

---

## 🚀 Getting Started

> 🚧 The project is currently **in development**.