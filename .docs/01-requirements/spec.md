# AdvisingLog System Specification

## Document Information

**Project:** AdvisingLog - Student Advising Record System (Software Engineering Department)  
**Version:** 1.0  
**Last Updated:** 2026-09-19  
**Status:** Functional Prototype → MVP Development  

---

## 1. System Overview

### 1.1 Purpose

AdvisingLog is a web-based student advising system designed to manage student-advisor meetings, advising records, follow-ups, documents, dropout/leave cases, and QA reporting. The system aims to replace paper-based advising processes with a centralized digital platform that supports AUN-QA accreditation requirements.

### 1.2 Problem Statement

Based on user interviews, the current advising process has these core pain points:

- **Data Fragmentation:** Advising sessions occur across scattered channels (emails, personal chats, face-to-face) with no centralized system to aggregate advising histories
- **Privacy & Data Sharing Concerns:** Students are reluctant to disclose sensitive issues (mental health, family problems) due to fear of data leaks. Advisors discuss student cases but lack recording tools with categorization tags to filter or de-identify personal information
- **No Auto Follow-up:** After providing advice or referrals, there is rarely a follow-up mechanism to track if issues were resolved, resulting in abandoned cases
- **Lack of Evidence for AUN-QA:** Data scattered across personal chats or emails cannot be easily extracted into quantitative statistics (advisor workload, C5) or qualitative data (Reason Code/Root Cause for dropout cases, C8) to generate rapid Quality Reports

### 1.3 Proposed Solution

A web application with clean, minimal UI featuring:

- **SSO Login:** Secure authentication strictly via MFU Mail to verify identity
- **Smart Form & Tagging:** Concise advising record form capturing topics and advice, with category tagging system and Cloudinary integration for file attachments
- **Auto Follow-up & Smart Routing:** Automated date reminders for case outcome updates, with auto-suggested "Additional Support" contact points based on problem tags
- **AUN-QA Ready Dashboard:** Automatically transforms consultation logs into statistical reports with strict role-based access control (RBAC) protecting sensitive case details

---

## 2. User Roles

| Role | Description |
|------|-------------|
| **Student** | Submits meeting requests to advisors for academics, activities, personal limitations, or private matters. Views status/history of own requests. Completes satisfaction surveys. |
| **Advisor** | Receives routed requests, manages appointments, writes brief interaction notes, applies category tags for privacy, handles case referrals. Approves/signs documents. |
| **Program Chair / QA Coordinator** | Accesses system dashboard for overall statistical summary to generate Quality Reports for AUN-QA. Views aggregate statistics only, with scoped case-level access restricted to dropout cases. |
| **Admin** | Core system administrator (e.g., Ajarn Oil). Imports and manages student-advisor roster. Oversees system access permissions. Configures document categories and signature methods. Maintains audit trails. |

---

## 3. Functional Requirements

### 3.1 Core Advising Workflow

#### FR-01: Online Advising Request Submission
**Priority:** High  
**Description:** Students submit advising requests to their assigned advisor through the system, selecting problem categories and attaching supporting documents. Replaces paper forms.  
**AUN-QA Mapping:** C6.3 (advising availability & quality)

#### FR-02: Standard Problem Categories (Mandatory Dropdown)
**Priority:** High  
**Description:** System requires students to select problem categories from a predefined dropdown (mandatory, not free text) to enable aggregation/grouping/trend analysis per AUN-QA standards. Supports at least 9 categories with coded sub-types:

1. Scholarship/Tuition signing
2. Financial [sub-types: payment postponement, arrears]
3. Registration [sub-types: add-drop, late registration, credit overload]
4. Probation maintenance
5. Restoration of academic status
6. Leave of Absence/Dropout
7. Academic performance advising (GPA/probation)
8. Internship/Co-op/Career
9. Personal/Mental Health (referral only)

Admin can extend categories via FR-03. Each category/document type has attribute for allowed signature method (see FR-21). When category (6) Leave of Absence/Dropout is selected, the request is flagged as a dropout case for special handling (see FR-27, FR-28).

**AUN-QA Mapping:** C6.2, C6.3, C8 (retention/dropout)

#### FR-03: Manage Problem Categories
**Priority:** Medium  
**Description:** Admin can add/edit/disable problem categories beyond the standard list, including configuring/setting the allowed signature method attribute for each category/document type (see FR-21).

#### FR-04: Store Student-Advisor Roster Within System
**Priority:** High  
**Description:** System stores and verifies student-advisor relationships from the internally maintained roster — **confirmed that university reg system does not provide integration**. Roster comes from import per FR-22.

**AUN-QA Mapping:** C6.2 (monitoring student progress via cohort tracking), C6.3 (proving advisor-advisee relationships work)

#### FR-05: Auto-Route Requests to Assigned Advisor
**Priority:** High  
**Description:** System automatically sends requests to the correct assigned advisor of the requesting student, referencing the internal roster (FR-04/FR-22) instead of students searching advisor names in reg system. Upon successful routing, system automatically sends an email summary with secure reply link to the advisor (see FR-26).

**AUN-QA Mapping:** C6.3

#### FR-06: In-System Appointment Scheduling
**Priority:** High  
**Description:** Advisor proposes/confirm appointment times within the system. Student confirms appointment. Replaces email-based scheduling.

#### FR-07: Automated Notifications
**Priority:** High  
**Description:** System notifies both parties when new requests arrive, appointments are confirmed/changed, and before appointment times. Notification channels to be determined in technical decisions. Note: Email notification for new requests to advisors with reply link that logs response is specifically detailed in FR-26 (special case of "new request" notification in this requirement).

**AUN-QA Mapping:** C6.3

#### FR-08: Record Interaction Notes
**Priority:** High  
**Description:** Advisor records summary of topics discussed, problems encountered, and advice provided after each meeting.

**AUN-QA Mapping:** C6.2, C6.3

#### FR-09: Record Outcomes and Follow-up
**Priority:** High  
**Description:** System records whether follow-up is needed, whether referral to other departments is needed (e.g., Career Services, Financial Aid, Counseling), and sets follow-up date. For dropout/leave of absence cases, this outcome is used together with reason code (FR-27) to form the case evidence set (FR-28).

**AUN-QA Mapping:** C6.2

#### FR-10: Referral to Other Departments
**Priority:** Medium  
**Description:** When recording that a referral occurred in interaction notes, system records destination department (Career/Financial Aid/Mental Health/Other) for tracking and statistics.

#### FR-11: Upload Scanned Documents with Audit Trail (Wet Signature)
**Priority:** High  
**Description:** Advisor/Student uploads documents requiring real paper signatures (wet signature) that are then scanned into the system. System records uploader and timestamp as audit trail. This is the **primary path** for document types designated as `wet-signature-only` (see FR-21). Confirmed to remain necessary because many documents still require real signatures.

**AUN-QA Mapping:** C5 (administrative support/workload)

#### FR-12: In-System Electronic Signatures (E-Signature)
**Priority:** Medium  
**Description:** System supports electronic signatures within the system to approve requests/record meetings **only for document types designated as `e-signature-allowed`** (see FR-21). Does not replace FR-11 for documents requiring wet-signature. Includes timestamp and audit trail.

#### FR-13: Satisfaction Survey
**Priority:** High  
**Description:** System sends short satisfaction survey to students after each meeting to measure advising quality.

**AUN-QA Mapping:** C6.3

#### FR-14: Automatic Response Time Measurement
**Priority:** High  
**Description:** System automatically records and calculates duration from request submission to confirmed appointment. No manual calculation required.

**AUN-QA Mapping:** C6.3

#### FR-15: Statistics Dashboard
**Priority:** High  
**Description:** System provides dashboard for Program Chair/QA Coordinator showing: number of meetings (by category), average response time, average satisfaction score, and workload per advisor. Includes counting dropout/leave of absence cases by reason code (FR-27) at aggregate level (count only, not raw note content — see FR-20/NFR-06) to support **C8**.

**AUN-QA Mapping:** C6.2, C6.3, C5

#### FR-16: Export AUN-QA Evidence
**Priority:** High  
**Description:** QA Coordinator can export dashboard statistics as files for evidence in Criterion 6 assessment (referencing C5, C8). File format to be determined in technology stack decisions. For deep case-level evidence per dropout case (reason code + timeline + referral + resolution), see FR-28 which is case-level export separate from FR-16's aggregate dashboard export.

**AUN-QA Mapping:** C6.2, C6.3, C5, C8

#### FR-17: View Own Request Status/History (Student)
**Priority:** Medium  
**Description:** Students view status of their requests (submitted/pending appointment/appointed/completed) and past meeting history.

#### FR-18: View Requests/Meeting History (Advisor)
**Priority:** High  
**Description:** Advisors view requests and meeting history of students under their responsibility — including full meeting timeline per person (see FR-28) for students under their responsibility.

#### FR-19: Manage User Role Permissions
**Priority:** High  
**Description:** Admin manages user roles (Student, Advisor, Program Chair/QA Coordinator, Admin) and data access permissions by role.

#### FR-20: Control Access to Sensitive Records
**Priority:** High  
**Description:** System limits access to meeting record content flagged as sensitive (e.g., mental health referrals) to directly involved parties only. QA Coordinator sees only statistics, not detailed record content — **confirmed per original assumption**. This restriction also covers sensitive reason codes (e.g., mental health) when displaying/exporting to QA Coordinator per FR-15/FR-16 (show only count level, not per-person raw note content).  

**Scoped Carve-Out Exception — Confirmed:** Program Chair/QA Coordinator can access full case-level data **only for cases designated as dropout/leave of absence/dropout** (per FR-28) for specific C8 qualitative analysis purposes, not broad opening of QA Coordinator access to sensitive records of general cases. For non-dropout cases, original principle in FR-20/NFR-06 (aggregate statistics only) remains fully in effect.

**AUN-QA Mapping:** C6.2, C6.3, C8

#### FR-21: Configure "Allowed Signature Method" per Category/Document
**Priority:** High  
**Description:** Each problem category/document type has attribute specifying allowed signature method with 2 values: `wet-signature-only` (must sign on paper then upload scan per FR-11 only) or `e-signature-allowed` (can use e-signature in system per FR-12). System uses this attribute to automatically propose correct signature flow to users. Extends from category configuration in FR-02/FR-03 (added after confirming hybrid signature model).

#### FR-22: Import and Maintain Student-Advisor Roster
**Priority:** High  
**Description:** Admin imports (import) student names and advisor relationships from Excel/CSV files exported from reg system (e.g., start of semester/start of term) since reg system does not provide direct integration. Can manually edit individuals (add/move/disable relationships) to support mid-semester changes.

**AUN-QA Mapping:** C6.2, C6.3

#### FR-23: Standard Dataset for Consultation Records
**Priority:** High  
**Description:** System must store at least the following dataset per 1 request/meeting 1 item, designed as coded/enumerated values as much as possible (not purely free text) to enable **aggregate/grouping/trend analysis** per AUN-QA principles:

1. Student ID, Name, Year, Curriculum Year/Cohort — referenced from internal roster (FR-04/FR-22), not directly from reg system. Use cohort binding for progress monitoring (**C6.2**)
2. Advisor Name — referenced from same roster. Used to prove advisor–advisee relationships work (**C6.3**)
3. Problem Category (coded per FR-02) — most important field for aggregation
4. Document Type Requesting Signature (coded) — linked to allowed signature method (FR-21) and actual signature path (FR-11/FR-12). Used to measure workload/administrative support (**C5**)
5. Request Date and Actual Meeting Date (timestamp auto-recorded) — used to measure responsiveness and meeting frequency (linked to FR-14, NFR-05)

**AUN-QA Mapping:** C6.2, C6.3, C5

#### FR-24: Request Status Lifecycle
**Priority:** High  
**Description:** System defines clear state model for each advising request: Requested → Scheduled → Met → Signed/Closed, with support for Cancelled status. Each status change auto-records timestamp for measuring turnaround time per step and preventing requests from being dropped without status updates. This is the record's state model, separate from FR-14 (which measures overall response time request→appointment), but uses the same per-status timestamps together. Actions advisor selects via reply link in email (FR-26) are one channel that causes status changes (e.g., "accept request"/"propose appointment time" changes from requested → scheduled), equivalent to actions directly in system UI.

**AUN-QA Mapping:** C6.2, C6.3

#### FR-25: Record PDPA Consent at Request Submission
**Priority:** High  
**Description:** System requires students to provide consent (mandatory checkbox, cannot submit request without ticking) before each advising request submission. System records timestamp of consent and version of consent text used at that time as evidence. This captures functional data tied to PDPA policy in NFR-06.

#### FR-26: Send Email Summary with Secure Reply Link to Advisor Upon Successful Routing
**Priority:** High  
**Description:** When system successfully routes request to correct advisor (per FR-05), system automatically sends email summary to advisor containing: request essentials (student name, problem category per FR-02, document type requesting signature per FR-21/FR-23, student's specified message/reason), plus attached "reply link" (actionable link) that brings advisor directly into system to take action on request (e.g., accept, propose appointment time, reject). This is an actionable link entering the system, **not parsing email reply text**. Link must verify identity of the specific advisor responsible for that request, has limited lifetime and/or single-use (tokenized/expiring link — see NFR-01) to prevent others from responding on their behalf. Any action advisor selects via this link must be logged with timestamp and recorded as status change equivalent to action taken directly in system UI. This email itself serves as evidence of advisor responsiveness per AUN-QA requirements.

**AUN-QA Mapping:** C6.3

#### FR-27: Store Reason Code / Root Cause of Dropout and Leave of Absence
**Priority:** High  
**Description:** System stores "reason code" as **coded taxonomy** (not purely free text) — **mandatory field** when request problem category is "Leave of Absence/Dropout" (FR-02 item 6) or designated as dropout case. Initial taxonomy set by Admin: (1) Financial, (2) Academic Performance (probation/GPA), (3) Physical Health, (4) Mental Health, (5) Family/Personal Problems, (6) Institution Transfer/Major Change, (7) Adjustment/Social Problems, (8) Career/Work Reasons, (9) Other. Admin can extend/modify this taxonomy similar to managing problem categories (see FR-03). Free text expansion field accompanies reason code, but code must always be selected from list to enable aggregation/pattern finding per AUN-QA principles. Supports **C8** (retention/dropout), linked to **C6.2** (monitoring student progress). System stores this field for human analysis, **does not auto-theme or use NLP analysis** (out of scope for this iteration).

**AUN-QA Mapping:** C6.2, C8

#### FR-28: Compile Per-Person Consultation History and Export Dropout Case Evidence Set
**Priority:** High  
**Description:** System compiles/links all meeting history per individual student (from existing data per FR-08, FR-09, FR-23) into single timeline per student for qualitative review, and can export dropout case evidence set per individual comprising: reason code (FR-27) + meeting timeline + interaction narrative (FR-08) + referral (FR-10) + resolution (FR-09) as evidence file for **C8**. System only **compiles/links/exports data**, does not analyze themes or synthesize narrative automatically (not a qualitative analysis/NLP module — out of scope per confirmation).  

**Access Rights — Confirmed:** (1) Advisor owning the case can always access full timeline/narrative of students under their responsibility (per FR-18); (2) Program Chair/QA Coordinator can access full timeline + interaction narrative + reason code (including sensitive values like mental health) and export dropout case evidence set **only for dropout/leave of absence/dropout cases** (per FR-20/NFR-06 scoped carve-out). This access is based on lawful basis/necessity for quality assessment per AUN-QA Criterion 8 (purpose limitation — usable only for this purpose, not others). For non-dropout cases, QA Coordinator continues to see only aggregate statistics (per FR-20/NFR-06 original principle). Every access to case-level full content by QA Coordinator must be logged in access audit log (see NFR-07).

**AUN-QA Mapping:** C6.2, C8

#### FR-29: Dropout Playbook & Intervention Workflow
**Priority:** High  
**Description:** System provides structured dropout intervention playbook for advisors to guide students through retention alternatives before final withdrawal. When a student indicates intention to withdraw or dropout (FR-02 category 6), system prompts advisor to:
1. Assess retention feasibility (GPA, academic standing, financial barriers)
2. Explore alternatives: temporary leave of absence, credit load reduction, academic support programs
3. Document intervention attempt with outcome
4. If withdrawal proceeds, ensure proper dropout form completion with required signatures

**AUN-QA Mapping:** C6.2 (monitoring student progress), C8 (retention/dropout)

#### FR-30: Detailed Exit Form Workflow with Signature Methods
**Priority:** High  
**Description:** System implements formal exit form (Leave of Absence / Withdrawal / Dropout) with signature method routing per FR-21:
- **Wet Signature Path:** Student prints form → signs physically → scans/uploads → advisor verifies signature → advisor approves → system marks as complete with audit trail
- **E-Signature Path:** Student completes form online → ticks PDPA consent checkbox → digital signature timestamp → auto-routes to advisor for review → advisor approves electronically → system marks as complete with audit trail
- **Conditional Approval:** System enforces that wet-signature documents require advisor approval before completion, while e-signature documents can be completed immediately with digital confirmation

**Exit Form Fields:**
- Student ID, Name, Current Academic Year, Cohort
- Exit Type: Withdrawal / Leave of Absence / Transfer / Dropout
- Effective Date of Exit
- Reason Code (mandatory, per FR-27 taxonomy)
- Narrative Description (free text)
- Student Voice Feedback (optional, for context)
- Signature Method: Wet/E-Signature (auto-selected per document type config)
- Digital Signature Consent (if e-signature path)
- Advisor Approval (timestamped)
- Department Chair Approval (if required per university policy)

**AUN-QA Mapping:** C6.2, C8

#### FR-31: Enhanced Referral Integration & Tracking
**Priority:** Medium  
**Description:** System strengthens referral workflow with structured follow-up tracking:
- When advisor marks referral in interaction note (FR-09), system captures: destination unit, referral purpose, urgency level
- System generates referral ticket sent to destination unit (Counselling, Financial Aid, Career Services, etc.)
- Destination unit can update referral status: received → in progress → completed → closed
- Referral status syncs back to advising session timeline
- System tracks referral completion rate as QA metric for intervention effectiveness

**Referral Fields:**
- Destination Unit (categorized: wellbeing, academic, financial, specialized)
- Referral Purpose: e.g., mental health counseling, emergency financial aid, career guidance
- Urgency: Routine / Urgent / Emergency
- Referral Date
- Referring Advisor
- Outcome / Resolution
- Closure Date

**AUN-QA Mapping:** C6.2 (close the loop), C8 (intervention effectiveness)

#### FR-32: Semester Root-Cause Analysis Report Generation
**Priority:** High  
**Description:** System generates semester-level root-cause analysis report for dropout/late graduation based on coded taxonomy from FR-27:
- Aggregates all dropout cases by reason code with counts and percentages
- Compares semester-over-semester trends in dropout rates by reason
- Identifies top 3 root causes with actionable recommendations
- Cross-references with GPA distribution, withdrawal patterns, and referral outcomes
- Generates PDF report with: executive summary, statistical tables, trend charts, improvement actions
- Report auto-generated at semester end or on-demand for QA Coordinator

**Report Sections:**
1. Executive Summary (key patterns and trends)
2. Dropout Statistics (total count, rate by semester, reason code breakdown)
3. Academic Performance Correlation (GPA distribution of dropout vs non-dropout)
4. Timing Analysis (when in semester dropouts occur most)
5. Referral Effectiveness (which interventions had success rates)
6. Recommended Actions (semester-specific and curriculum-level)
7. Appendix: De-identified case summary table

**AUN-QA Mapping:** C8 (retention/dropout analysis & improvement actions)

#### FR-33: Evidence Capture Automation for AUN-QA
**Priority:** High  
**Description:** System automates evidence capture aligned to AUN-QA requirements as work happens, eliminating year-end reconstruction:
- Advising sessions: auto-capture date, category, outcome → C6.2, C6.3 evidence
- Dropouts: auto-capture reason code, timeline, referral status → C8 evidence
- Interventions: auto-capture early-warning triggers + actions + outcomes → C6.2 evidence
- Student Voice: auto-capture satisfaction scores + qualitative feedback → C6.3 evidence
- Workload: auto-calculate advisor session counts, response times → C5 evidence
- Referrals: auto-track referral requests, destination responses, outcomes → C6.2 close-the-loop evidence

**Evidence Storage:**
- De-identified data for QA statistics (no personal identifiers)
- Time-stamped audit trails for all records
- Links to source documents (Cloudinary) where applicable
- Export-ready formats: CSV for statistics, PDF for case files
- Access logs for sensitive data viewing (per NFR-07)

**AUN-QA Mapping:** C6.2, C6.3, C5, C8

### 3.2 System Configuration & Administration

#### FR-30: Category and Signature Method Configuration
Admin can configure problem categories and document types with allowed signature methods (`wet-signature-only` or `e-signature-allowed`) per FR-21.

#### FR-31: User and Role Management
Admin manages user accounts, assigns roles (Student, Advisor, QA Coordinator, Admin), and controls system access permissions.

#### FR-32: System Audit Trail
System maintains comprehensive audit trails for all critical actions including document approvals, signature applications, access to sensitive records, and configuration changes.

---

## 4. Non-Functional Requirements

### 4.1 Security & Access Control

#### NFR-01: Role-Based Access Control (RBAC)
System must control data access by user role, especially for sensitive meeting records.  

**Enhanced (regarding FR-26):** Reply links sent via external email (actionable link) must verify identity of specific individual, have limited lifetime and/or single-use (tokenized/expiring) to prevent non-advisor request owners from responding on their behalf.

### 4.2 Data Integrity

#### NFR-02: Data Freshness
**Modified after confirming reg integration unavailable (see section 7.2):** System holds copy (roster) of student-advisor data imported from reg export files (FR-22). Must have data freshness control mechanism (e.g., recording last import date and referencing academic semester with roster each time), and support re-import to update data while preserving original meeting history of students when re-importing.

### 4.3 Auditability

#### NFR-03: Approval/Signature Audit Trail
**Enhanced to cover hybrid signature model (see section 7.1):** Every approval/signature must have timestamp and audit trail (who, when, what action) that can be retroactively verified. Covers both paths: (1) documents signed on paper then uploaded as scan (FR-11), and (2) documents signed with e-signature in system (FR-12). Must record which path each document used per allowed signature method attribute (FR-21).

### 4.4 Reportability

#### NFR-04: Export Capability
System must be able to export dashboard statistics as files usable as evidence for AUN-QA assessment. File format not locked pending technology stack decisions.

### 4.5 Time-Based Metrics Traceability

#### NFR-05: Automatic Time Event Recording
All events related to response time (request submission, appointment, confirmation) must be auto-recorded with time for accurate response time calculation and retroactive verification.  

**Enhanced (regarding FR-26):** Covers responses via reply link in email as well (time link opened/time action selected), not just actions in system UI.

### 4.6 Privacy / PDPA Compliance

#### NFR-06: PDPA Compliance
Storage, access, and retention of meeting records containing personal data/sensitive information must comply with PDPA.  

**Confirmed that QA Coordinator sees only aggregate statistics, not per-person record content (see section 7.3).** Specific retention period not yet concluded (remains open issue, must be defined before production). Covers sensitive reason codes (FR-27 e.g., mental health) and dropout case evidence sets (FR-28) as well.  

**Scoped Carve-Out Exception — Confirmed:** For dropout/leave of absence/dropout cases only, Program Chair/QA Coordinator can access full case-level content (including sensitive values) based on lawful basis/necessity for quality assessment per AUN-QA Criterion 8 (purpose limitation — usable only for this purpose, not others). For non-dropout cases, QA Coordinator continues to see only aggregate statistics per original principle.

### 4.7 Access/Read Audit Logging

#### NFR-07: Access/Read Audit Logging
Every time Program Chair/QA Coordinator views or exports full case-level content (timeline + interaction narrative + reason code) of dropout/leave of absence/dropout cases (per FR-20/FR-28), system must record access audit log separate from NFR-03 which is approval/signature audit trail. NFR-07 is specifically **read/access audit**, recording at minimum: who accessed, when accessed, which case/student accessed, and action (view/export). This log must be retroactively verifiable as evidence that access to sensitive data occurred within defined scope (limited to dropout cases only).

---

## 5. AUN-QA Criterion Mapping

| Criterion | Linked FR/NFR |
|-----------|---------------|
| **C6.2** (monitoring student progress) | FR-08, FR-09, FR-15, FR-16, FR-23 (cohort/year), FR-24 (prevent dropped cases), FR-27 (root cause linked to progress monitoring), NFR-05 |
| **C6.3** (advising availability & quality) | FR-01, FR-02, FR-05, FR-06, FR-07, FR-08, FR-13, FR-14, FR-15, FR-23 (proving advisor-advisee relationships), FR-24 (turnaround), FR-26 (evidence of advisor responsiveness via email link) |
| **C5** (staff workload) | FR-15 (workload per advisor), FR-16, FR-23 (document type/administrative support) |
| **C8** (retention/dropout) | FR-09 (referral/follow-up), FR-10, FR-16, FR-02 (grouping problem categories for trend analysis e.g., dropout linked to financial), FR-27 (reason code/root cause of dropout), FR-28 (timeline + case-level access + export dropout case evidence per individual — including QA Coordinator scoped carve-out access), FR-20/NFR-06 (sensitive data access scope with carve-out for dropout cases), **NFR-07 (access audit log for case-level access of dropout cases — newly added)** |

---

## 6. Technical Stack

### 6.1 Frontend
- **Framework:** React + Vite + TypeScript
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** Context API (currently), React Query (planned for API integration)
- **Validation:** Zod
- **Charts:** Recharts
- **Excel/CSV Export:** SheetJS
- **Testing:** Vitest + React Testing Library + Playwright

### 6.2 Backend
- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Database:** Cloudflare D1 + Drizzle ORM
- **Media Storage:** Cloudinary (images, documents, secure URLs)
- **Authentication:** SSO (Microsoft Entra/Google Workspace/OAuth) - planned

### 6.3 Development
- **Package Manager:** pnpm (workspaces)
- **Version Control:** Git with conventional commits
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **CI/CD:** GitHub Actions (planned)

---

## 7. Resolved Requirements Decisions

### 7.1 Signature Model — Confirmed: Hybrid

**Decision:** Many documents still require real paper signatures (wet signature) then upload scan, while some document types can use e-signature in system. Not "either/or" per original assumption, but **using both together**, separated by document type.

**Impact:**
- FR-11 (upload scan + audit trail) — remains **High/MVP** as primary path for documents requiring real signatures
- FR-12 (e-signature in system) — remains **Medium** but specifies usable only for document types where allowed
- **FR-21 (new)** — attribute "allowed signature method" (`wet-signature-only` / `e-signature-allowed`) per category/document
- NFR-03 — enhanced to make audit trail cover both paths (scan signed documents, and e-signature)

### 7.2 Reg System Integration — Confirmed: Not Possible

**Decision:** University registration system does not provide integration (no API, no integration). Original assumption ("reg is single source of truth / don't create duplicate student DB") **cannot be used** — AdvisingLog system must maintain its own student-advisor roster.

**Impact:**
- FR-04 — changed from "verify data from reg via integration" to "store student-advisor roster within system", verify relationships from internal roster, not reg
- **FR-22 (new)** — import and maintain student-advisor roster: support Excel/CSV file import (start of semester/per semester) + manual individual editing (add/move/disable) by Admin
- FR-05 (auto-route) — adjusted to reference internal roster (from import) instead of querying reg
- NFR-02 — changed from "reg is single source of truth / no duplicate DB" to "system holds copy of imported roster, must have data freshness control mechanism and support re-import to update while preserving original meeting history"
- Scope (sections 2.1/2.2) and Actors (section 3) adjusted text that previously wrote about integrate/real-time from reg to reflect using internal roster instead — verified no integrate/real-time text remains in this document

### 7.3 PDPA and Sensitive Record Access — Confirmed: Per Original Assumption

**Decision:** Program Chair/QA Coordinator sees only aggregate statistics, not per-person sensitive meeting record content. Exactly matches original assumption.

**Impact:** No substantive changes — FR-20 and NFR-06 are correct as written in first draft (adjusted only text to specify "confirmed" instead of "assumption")

### 7.4 Dropout Root Cause Analysis Scope — Confirmed: Scope A Only

**Decision:** User selected scope **A — "System as Evidence Source"** i.e., store reason code (coded taxonomy) + link meeting history + export for human analysis, **did not select** (B) in-system qualitative narrative recording/synthesis module, and **did not select** (C) system auto-theme/NLP — both approaches are **explicitly out of scope for this iteration**, not included in FR-27/FR-28 or any other FR in this document.

**Impact:**
- **FR-27 (new)** — store reason code as coded taxonomy (mandatory when dropout/leave of absence/dropout case)
- **FR-28 (new)** — compile per-person meeting timeline + export dropout case evidence set (compile/link/export only, no analysis)
- Both FR-27 and FR-28 explicitly state **"no auto-theme or NLP analysis"** and **"no auto-theme synthesis or narrative analysis"** respectively to prevent scope creeping toward B/C unintentionally during design/development
- If future expansion to B or C is desired, must open new requirement iteration and confirm scope with users again

### 7.5 Dropout Case Qualitative Data Access — Confirmed: Option 3 (Scoped Carve-Out for Dropout Cases Only)

**Decision:** User selected option 3 of 3 — Program Chair/QA Coordinator sees full case-level data (meeting timeline + interaction narrative + reason code including sensitive values) and can export case evidence sets **only for dropout/leave of absence/dropout cases** because necessary for writing AUN-QA C8 qualitative analysis, with access audit log recording access — **explicitly confirmed that this relaxation scope is limited to dropout cases only, not broad opening of QA Coordinator access to sensitive records of general cases**. For non-dropout cases, original principle in FR-20/NFR-06 (aggregate statistics only) remains fully in effect.

**Impact:**
- **FR-28** — expand access rights: originally specified "full detail viewing limited to advisor owning case" → add Program Chair/QA Coordinator can access full timeline + narrative + export **only for dropout cases** (data minimization — not every request/meeting)
- **FR-20** — add scoped carve-out exception specifying this is exception for dropout cases only, original principle (aggregate statistics only) still applies to general cases
- **NFR-06** — add same text, specifying lawful basis/necessity for quality assessment (necessary for root cause analysis per AUN-QA C8) and purpose limitation (usable only for this purpose)
- **NFR-07 (new)** — access/read audit logging: record every time Program Chair/QA Coordinator views/exports full case-level content of dropout/leave of absence/dropout cases (who/when/which case/action), separate from NFR-03 which is approval/signature audit (write/approval audit), intentionally for clarity of traceability between "who approved what" (NFR-03) and "who read/saw what sensitive data" (NFR-07)

---

## 8. Field-Level AUN-QA Mapping

User provided AUN-QA level field details with rationale (AUN-QA angle) for each field, emphasizing that AUN-QA core is not just "having records" but must **aggregate + analyze + close the loop**. Table below summarizes each user-specified field is covered by which FR in this document (no field is missing):

| User-Specified Field | AUN-QA Angle | Covering FR |
|---------------------|--------------|-------------|
| Student ID, Name, Year, Curriculum Year | Bind to cohort for progress monitoring (6.2) | FR-23 (referenced from roster per FR-04/FR-22) |
| Advisor Name | Prove advisor–advisee relationships work (6.3) | FR-23 (referenced from roster per FR-04/FR-22), FR-05 |
| Request Date / Actual Meeting Date | responsiveness + meeting frequency = evidence that advising actually occurred | FR-23 (store timestamp), FR-14 (calculate response time), NFR-05 |
| Problem Category (mandatory dropdown) | Most important, enables aggregation | FR-02 (mandatory dropdown 9 categories + sub-types) |
| Document Type Requesting Signature | Linked to workload/administrative support | FR-23 (document type field), FR-21, FR-11/FR-12 |
| Status (Requested → Scheduled → Met → Signed/Closed) | Measure turnaround, prevent dropped cases | FR-24 (status lifecycle) |
| Advisor Notes / Actions Taken | Qualitative evidence of counselling (6.3) | FR-08 (interaction note) |
| Follow-up Needed / Referral to Department | Close the loop (scholarship, career, financial) | FR-09 (follow-up), FR-10 (referral) |
| Outcome / Resolution | Close case + use for improvement action | FR-09 (outcome/follow-up) |
| PDPA Consent (checkbox) | Necessary because storing personal data/mental health for some cases | FR-25 (functional capture), NFR-06 (policy) |
| Reason Code / Root Cause of Dropout (added 2026-08-26) | Root cause analysis of dropout — close the loop per **C8** principles, linked to **C6.2** | FR-27 (coded taxonomy), FR-28 (timeline + per-case export) |

---

## 9. Related Documents

- **[backlog.md](./backlog.md)** — Master product backlog with MoSCoW prioritization
- **[proposal.md](./proposal.md)** — Updated project proposal document
- **[user-journey.md](../../02-design/user-journey.md)** — User journey documentation
- **[AGENTS.md](../../AGENTS.md)** — Development rules and technical guidelines
