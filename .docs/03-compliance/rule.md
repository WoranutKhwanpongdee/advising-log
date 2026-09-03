# rule.md Z-Tech Dynamics — Legal & Compliance Rules for AI Agents
# Z-Tech Dynamics — Legal & Compliance Rules (rule.md)

# GroupName
**1. Phonepadith Kongsengchanh	6631503083		6631503083@lamduan.mfu.ac.th**

**2. Sai Seng Main	            6631503085	    6631503085@lamduan.mfu.ac.th**

**3. Woranut Khwanpongdee	    6631503036	    6631503036@lamduan.mfu.ac.th**

**4. Wilasinee Mangkorn	        6631503039	    6631503039@lamduan.mfu.ac.th (Written)**

**5. Pirisa Kitichai	        6631503031	    6631503031@lamduan.mfu.ac.th**

Read this before writing any code that touches user data or user actions.

> **CRITICAL CONTEXT:** AdvisingLog is a student advising system that handles **HIGHLY SENSITIVE PERSONAL DATA**, including but not limited to:
> - Advising session records with personal, mental health, and financial issues
> - Dropout/leave reasons and root cause analysis
> - Private advisor evaluations (never visible to students)
> - Student Voice Forms (consent-based exit surveys)
> - Documents and photos (medical certificates, financial statements, personal correspondence)
>
> **CLASSIFICATION:** All data in this system is classified as **Sensitive Personal Data** under PDPA Section 26, requiring explicit consent, heightened security measures, and strict access controls. Violations of these rules constitute legal violations and will cause the User Validation Gate to fail.

---

## 1. PDPA (Personal Data Protection Act B.E. 2562)

**What it is and requires:**
The PDPA protects individuals' personal data by requiring lawful collection, clear consent, and secure storage, while granting data subjects the rights to access, correct, and delete their information. **Sensitive Personal Data** (Section 26) — including health data, mental state, financial status, criminal records, biometric data, and personal/family problems — requires **explicit written consent**, **heightened security measures**, and **data minimization**.

**Legal References:**
- Section 19: Consent requirements
- Section 26: Sensitive personal data restrictions
- Section 30: Right to access
- Section 36: Right to correction
- Section 37: Right to erasure (Right to be Forgotten)
- Section 40: Data breach notification (within 72 hours)

### 1.1 Sensitive Data Collection & Consent

**Rules for the AI Agent:**

- **If** the system records an advising log under the `personal`, `mental_health`, `financial`, `family_issue`, or `dropout_risk` category:
  - It MUST treat the record as **Sensitive Personal Data** under PDPA Section 26
  - It MUST restrict read access to ONLY: (a) the assigned Advisor, (b) the owning Student, and (c) authorized Admin
  - It MUST NEVER expose this data to classmates, other advisors, unrelated staff, or QA coordinators
  - It MUST log all access attempts with user ID, timestamp, and action type
  - It MUST require explicit role-based permission checks on EVERY read/write operation

- **If** the system presents the Student Voice Form (dropout/leave exit survey):
  - It MUST request **explicit, granular consent** via a checkbox BEFORE collecting the student's own words
  - The consent checkbox MUST be **unchecked by default** (opt-in, not opt-out)
  - The form MUST display a clear privacy notice explaining:
    - What data is being collected
    - Who will have access to it
    - How it will be used (root cause analysis only)
    - That participation is voluntary and will NOT affect the dropout/leave approval
  - The student's refusal MUST NOT block, delay, or negatively impact the dropout/leave approval workflow
  - If consent is granted, the form data MUST be stored separately from the advisor evaluation and linked only by `student_code`

- **If** the system collects documents or photos that may contain sensitive information (e.g., medical certificates, financial statements, legal documents):
  - It MUST validate file types and reject files that are not explicitly allowed (PDF, JPG, PNG only)
  - It MUST limit file size to 10MB per file and maximum 5 files per advising log
  - It MUST scan for malware before storing
  - It MUST store files in Cloudinary with **private/authenticated URLs** that expire within 7 days
  - It MUST NOT store PII (name, student ID, national ID) in Cloudinary metadata or tags
  - It MUST store only the Cloudinary `public_id` in the D1 database, never the full URL or binary data

### 1.2 Data Minimization & De-identification

**Rules for the AI Agent:**

- **If** the system generates QA/AUN-QA reports or dashboards for the Program Chair / QA Coordinator:
  - It MUST mask or strip ALL direct identifiers:
    - Student names → replace with `student_code` or `STUDENT_XXXX`
    - Full student IDs → replace with last 4 digits only (`***1234`)
    - Email addresses → replace with `[REDACTED]`
    - Phone numbers → replace with `[REDACTED]`
    - National IDs → replace with `[REDACTED]`
  - It MUST present ONLY:
    - Aggregated statistics (counts, percentages, averages)
    - De-identified `student_code` references
    - Tagged categories (academic, financial, mental health, etc.)
  - It MUST NOT allow export of individual student records to QA coordinators
  - It MUST apply de-identification at the **database query level** (SQL WHERE clause or Drizzle ORM), not just the frontend

- **If** the system displays advising records or dropout reasons in any UI:
  - It MUST check the requesting user's role and relationship to the record
  - Students can ONLY view their own records
  - Advisors can ONLY view records for students assigned to them as advisees
  - QA Coordinators can ONLY view aggregated/de-identified data
  - Admins can view workflow status but NOT the content of sensitive records
  - ANY unauthorized access attempt MUST be logged and denied

### 1.3 Data Security & Encryption

**Rules for the AI Agent:**

- **If** the system stores student profiles, advising records, or dropout reasons in Cloudflare D1:
  - It MUST encrypt sensitive fields **at rest** using AES-256 encryption:
    - `email`
    - `phone_number`
    - `national_id`
    - `address`
    - `health_notes`
    - `financial_notes`
    - `mental_health_notes`
    - `family_issues`
    - `dropout_reason`
  - It MUST use parameterized queries (Drizzle ORM) to prevent SQL injection
  - It MUST NOT log sensitive data in application logs, error messages, or debug output
  - It MUST store only Cloudinary `public_id` references for media, never binary files or base64 strings

- **If** the system transmits sensitive data between frontend and backend:
  - It MUST use HTTPS/TLS 1.3 for all API requests
  - It MUST NOT send sensitive data in URL query parameters
  - It MUST send sensitive data in request bodies only
  - It MUST validate all input with Zod schemas on BOTH frontend and backend

### 1.4 Data Subject Rights

**Rules for the AI Agent:**

- **If** a student exercises their **Right to Access** (PDPA Section 30):
  - The system MUST provide a UI or API endpoint for students to view all their own advising records
  - The response MUST include: date, advisor name, category, summary, advice, and attached documents
  - The system MUST NOT expose private advisor evaluation notes

- **If** a student exercises their **Right to Correct** (PDPA Section 36):
  - The system MUST allow students to request corrections to their profile data
  - The system MUST NOT allow students to edit finalized advising records directly
  - Corrections to finalized records MUST go through an amendment process that preserves the original record

- **If** a student exercises their **Right to Erasure** (PDPA Section 37):
  - The system MUST delete their personal profile and identifiable advising content
  - The system MUST retain ONLY:
    - Anonymized, de-identified counts for academic QA records
    - 90-day traffic logs required by Computer Crime Act §26
    - Legal hold records if applicable
  - The system MUST NOT delete data that is required for legal compliance or academic record-keeping
  - The deletion MUST be logged with timestamp and requesting user ID

- **If** the system detects a **data breach** (PDPA Section 40):
  - The system MUST have a mechanism to detect unauthorized access or data leakage
  - The system MUST notify the Data Protection Officer (DPO) within 72 hours
  - The system MUST notify affected data subjects if the breach poses high risk
  - The system MUST log the breach details, affected data, and remediation actions

---

## 2. Computer Crime Act §26 (Access/Traffic Log Retention)

**What it is and requires:**
Section 26 requires system administrators and service providers to retain "traffic data" (logs of user access and system interactions) for a **minimum of 90 days** to ensure data is available for law enforcement cybercrime investigations. Failure to comply can result in fines and imprisonment.

**Legal References:**
- Computer Crime Act B.E. 2550 (2007), Section 26
- Ministerial Notification on Traffic Data Retention

### 2.1 Traffic Log Collection

**Rules for the AI Agent:**

- **If** a user performs ANY of the following actions, the system MUST record and store the following information in an **append-only** log table:
  - **Login/Logout:**
    - User ID
    - Source IP address
    - User-Agent string
    - Exact timestamp (ISO 8601 format)
    - Authentication method (MFU SSO, local, etc.)
    - Success/failure status
  - **Advising Log Actions (create, read, update, delete):**
    - User ID
    - Source IP address
    - Exact timestamp
    - Action type (`create`, `read`, `update`, `delete`)
    - Advising log ID
    - Student ID (if applicable)
    - Success/failure status
  - **Drop/Leave Form Actions:**
    - User ID
    - Source IP address
    - Exact timestamp
    - Action type (`submit`, `approve`, `reject`, `escalate`)
    - Request ID
    - Student ID
    - Success/failure status
  - **Document Upload/Download:**
    - User ID
    - Source IP address
    - Exact timestamp
    - Action type (`upload`, `download`, `delete`)
    - Cloudinary `public_id`
    - File name
    - File size
    - Success/failure status
  - **QA Report Export:**
    - User ID
    - Source IP address
    - Exact timestamp
    - Report type
    - Export format (CSV, Excel, PDF)
    - Success/failure status

- **If** the system detects an attempt to read an advising record or drop/leave form that the requester is NOT authorized to access:
  - The system MUST write a **security event** to the append-only log with:
    - User ID
    - Source IP address
    - Exact timestamp
    - Resource ID requested
    - Requested action
    - Denial reason (unauthorized role, not owner, etc.)
  - The system MUST deny the request
  - The system MUST NOT expose the content of the denied resource

### 2.2 Traffic Log Retention & Integrity

**Rules for the AI Agent:**

- **If** the system runs automated database cleanup or archiving scripts:
  - It MUST be explicitly programmed to **exclude all access and traffic logs from deletion** until they are at least **90 days old**
  - It MUST NOT allow manual deletion of traffic logs by administrators
  - It MUST verify log retention before executing cleanup operations

- **If** storing these access logs, the system MUST:
  - Write them to an **append-only** database table or immutable storage (e.g., Cloudflare D1 with row-level immutability, or a separate audit log table)
  - Prevent tampering or unauthorized modification by administrators
  - Use cryptographic hashing (SHA-256) to chain log entries and detect tampering
  - Store logs in a separate database or schema from application data

- **If** a student or advisor deletes their account:
  - The system MUST retain their traffic and access logs for the remaining 90-day period
  - The system MUST NOT delete or anonymize traffic logs until the 90-day retention period has expired
  - The system MUST log the account deletion event with timestamp and requesting user ID

### 2.3 Traffic Log Access & Audit

**Rules for the AI Agent:**

- **If** a law enforcement agency or court orders the disclosure of traffic logs:
  - The system MUST provide a mechanism to export logs for a specific user, time range, or action type
  - The export MUST be in a machine-readable format (CSV, JSON)
  - The export MUST be logged with the requesting authority, order number, and timestamp

- **If** an administrator or auditor needs to review traffic logs:
  - The system MUST require elevated permissions (Admin or Security Officer role)
  - The system MUST log all log access attempts
  - The system MUST NOT allow modification or deletion of logs during review

---

## 3. Electronic Transactions Act §9 / 26 / 28 (E-Signatures)

**What it is and requires:**
This Act ensures that electronic signatures and data messages are legally recognized, requiring them to be **reliable**, **uniquely linked to the signer**, **under their sole control**, and **capable of detecting any subsequent alterations** to the data. Electronic approvals and signatures in the AdvisingLog system must meet these requirements to be legally valid.

**Legal References:**
- Electronic Transactions Act B.E. 2544 (2001), Sections 9, 26, 28
- Royal Decree on Electronic Signatures

### 3.1 Electronic Approval Workflows

**Rules for the AI Agent:**

- **If** a user performs an approval action in the dropout/leave workflow:
  - The workflow sequence MUST be: `Student Submission → Admin Pre-fill → Advisor Private Evaluation → Program Chair Approval`
  - Each approval action MUST be cryptographically bound to:
    - The authenticated user session (session ID, JWT token)
    - The user's verified MFU identity (email, student ID, or staff ID)
    - The exact timestamp (ISO 8601 format)
    - The resource ID (request ID, advising log ID)
    - The action type (`submit`, `approve`, `reject`, `escalate`)
  - The approval MUST be stored in the database with a digital signature (SHA-256 hash of the approval data + user ID + timestamp)
  - The approval MUST NOT be modifiable after submission without invalidating the signature

- **If** an Advisor or Program Chair finalizes an advising record or a dropout/leave decision:
  - The system MUST apply a digital signature to the finalized record, embedding:
    - The approver's verified identity (MFU email, staff ID)
    - The exact time of approval
    - The record ID
    - The approval action
  - The system MUST store the signature in the database alongside the record
  - The system MUST prevent any further modifications to the finalized record without re-approval

### 3.2 Tamper-Evident Records

**Rules for the AI Agent:**

- **If** a user or admin attempts to alter a finalized advising record or an approved dropout/leave decision:
  - The system MUST invalidate the previous electronic signature
  - The system MUST record the change in the append-only audit log with:
    - User ID
    - Source IP address
    - Exact timestamp
    - Record ID
    - Old value
    - New value
    - Reason for change
  - The system MUST require a new approval action from the authorized approver
  - The system MUST NOT allow the change to take effect until re-approved

- **If** the system generates a digital receipt, an advising summary, or an exported QA report for a user:
  - The system MUST include a **tamper-evident hash** (SHA-256) of the underlying data
  - The hash MUST be displayed in the document or metadata
  - The hash MUST be verifiable by the recipient to prove the record has not been modified since the moment it was finalized

### 3.3 Private Advisor Evaluations

**Rules for the AI Agent:**

- **If** a private advisor evaluation is attached to a dropout/leave case:
  - The evaluation MUST be signed at the moment of submission with:
    - The advisor's verified identity
    - The exact timestamp
    - The case ID
  - The evaluation MUST remain invisible to the student at all times
  - The evaluation MUST be stored in a separate table or field with restricted access
  - The evaluation MUST still be verifiable as an authentic, unaltered record by authorized personnel (Program Chair, Admin)

### 3.4 Digital Signature Verification

**Rules for the AI Agent:**

- **If** the system needs to verify the authenticity of a finalized record or approval:
  - The system MUST recalculate the SHA-256 hash of the record data + user ID + timestamp
  - The system MUST compare the recalculated hash with the stored signature
  - The system MUST reject the record if the hashes do not match
  - The system MUST log all verification attempts with timestamp and result

---

## 4. Role-Based Access Control (Derived Compliance Requirement)

**What it is and requires:**
To satisfy both PDPA data minimization and the Electronic Transactions Act, the system MUST enforce strict separation between the four roles: **Student**, **Advisor**, **Program Chair / QA Coordinator**, and **Admin**. Every protected API endpoint and UI route MUST validate BOTH the requester's role AND their ownership/assignment relationship to the requested resource.

**Legal References:**
- PDPA Section 26 (Sensitive Personal Data)
- Electronic Transactions Act Section 9 (Reliability of Electronic Signatures)

### 4.1 Student Role Permissions

**Rules for the AI Agent:**

- **If** a Student accesses advising data:
  - The system MUST allow viewing ONLY their own records
  - The system MUST hide any private advisor evaluation notes
  - The system MUST allow the student to:
    - Request advising meetings
    - View their own advising history
    - Submit drop/leave requests
    - Complete the Student Voice Form (if consent is granted)
  - The system MUST NOT allow the student to:
    - View other students' records
    - Edit finalized advising records
    - Access QA reports or dashboards
    - Manage user accounts

### 4.2 Advisor Role Permissions

**Rules for the AI Agent:**

- **If** an Advisor accesses advising data:
  - The system MUST allow access ONLY to students assigned to them as advisees
  - The system MUST verify the advisor-student relationship in the database before granting access
  - The system MUST allow the advisor to:
    - Create, read, update advising logs for their advisees
    - Manage follow-up tasks for their advisees
    - Approve/reject drop/leave requests from their advisees
    - Complete private advisor evaluations for dropout cases
    - Refer students to support units
  - The system MUST NOT allow the advisor to:
    - View records for students not assigned to them
    - Access QA reports or dashboards
    - Manage user accounts
    - Modify finalized records without re-approval

### 4.3 Program Chair / QA Coordinator Role Permissions

**Rules for the AI Agent:**

- **If** a Program Chair / QA Coordinator accesses the system:
  - The system MUST provide ONLY aggregated or de-identified reports
  - The system MUST NEVER expose individual sensitive records
  - The system MUST allow the QA Coordinator to:
    - View QA dashboards with aggregated statistics
    - Export de-identified reports (CSV, Excel, PDF)
    - Analyze root causes of dropout/leave cases
    - View follow-up success rates
  - The system MUST NOT allow the QA Coordinator to:
    - View individual student names, IDs, or contact information
    - Access raw advising records
    - Modify any data
    - Manage user accounts

### 4.4 Admin Role Permissions

**Rules for the AI Agent:**

- **If** an Admin accesses the system:
  - The system MUST allow workflow and master-data management
  - The system MUST allow the Admin to:
    - Manage user accounts (create, update, deactivate)
    - Configure master data (tags, support directory, categories)
    - Oversee drop/leave workflows
    - View traffic logs and audit trails
    - Pre-fill objective data in drop/leave forms (GPA, credits, admission channel)
  - The system MUST NOT allow the Admin to:
    - View the content of private advisor evaluations
    - View sensitive student personal notes (mental health, financial, family issues)
    - Modify finalized advising records without re-approval
    - Delete traffic logs before the 90-day retention period

### 4.5 Backend Enforcement

**Rules for the AI Agent:**

- **Every** protected API endpoint MUST validate BOTH:
  1. The requester's role (Student, Advisor, QA Coordinator, Admin)
  2. Their ownership/assignment relationship to the requested resource
- Frontend hiding alone is INSUFFICIENT
- The system MUST use middleware or guards to enforce RBAC on the backend
- The system MUST return HTTP 403 Forbidden for unauthorized requests
- The system MUST log all unauthorized access attempts with user ID, timestamp, and resource ID
- The system MUST NOT expose sensitive data in error messages or API responses

---

## 5. Data Retention Policy

**What it is and requires:**
The system MUST define clear retention periods for different types of data to comply with PDPA and academic record-keeping requirements.

### 5.1 Retention Periods

| Data Type | Retention Period | Rationale |
| --------- | ---------------- | --------- |
| Traffic/Access Logs | 90 days minimum | Computer Crime Act §26 |
| Advising Records (non-sensitive) | 5 years after graduation | Academic record-keeping |
| Advising Records (sensitive) | 2 years after graduation | PDPA data minimization |
| Drop/Leave Forms | 5 years after graduation | Academic record-keeping |
| Student Voice Forms | 2 years after graduation | PDPA data minimization |
| QA Reports (de-identified) | 10 years | AUN-QA compliance |
| User Profiles | Until account deletion + 90 days | PDPA Right to Erasure |

### 5.2 Automated Cleanup

**Rules for the AI Agent:**

- **If** the system runs automated cleanup scripts:
  - The script MUST check the retention period for each data type before deletion
  - The script MUST exclude traffic logs until they are at least 90 days old
  - The script MUST log all deletion events with timestamp, data type, and affected record IDs
  - The script MUST NOT delete data that is under legal hold or required for ongoing investigations

---

## 6. Breach Notification & Incident Response

**What it is and requires:**
PDPA Section 40 requires data controllers to notify the Data Protection Officer (DPO) and affected data subjects of data breaches within 72 hours if the breach poses high risk.

### 6.1 Breach Detection

**Rules for the AI Agent:**

- **If** the system detects unauthorized access, data leakage, or suspicious activity:
  - The system MUST log the event with:
    - User ID (if known)
    - Source IP address
    - Exact timestamp
    - Affected resource IDs
    - Type of breach (unauthorized access, data export, etc.)
  - The system MUST alert the DPO or security team immediately
  - The system MUST NOT expose sensitive data in error messages or logs

### 6.2 Breach Notification

**Rules for the AI Agent:**

- **If** a data breach is confirmed:
  - The system MUST provide a mechanism to notify the DPO within 72 hours
  - The system MUST provide a mechanism to notify affected data subjects if the breach poses high risk
  - The notification MUST include:
    - Nature of the breach
    - Types of data affected
    - Number of affected records
    - Remediation actions taken
    - Contact information for the DPO
  - The system MUST log all notifications with timestamp and recipient

---

## 7. Rule Change Process

**What it is and requires:**
Rules in this document can only be modified with written approval from the Product Owner and QA Coordinator. Any rule change must include updated traceability to user interviews or legal requirements.

**Rules for the AI Agent:**

- **If** a rule change is proposed:
  - The change MUST be documented in the commit message referencing this file
  - The change MUST include:
    - Reason for the change
    - Legal or user interview justification
    - Impact assessment
    - Rollback plan
  - The change MUST be approved by the Product Owner and QA Coordinator before implementation
  - The change MUST be communicated to all team members

---

## 8. Compliance Verification Checklist

**Before considering any feature complete, verify:**

- [ ] All sensitive data is encrypted at rest
- [ ] All sensitive data is transmitted over HTTPS/TLS 1.3
- [ ] All API endpoints validate BOTH role AND ownership
- [ ] All access attempts are logged in an append-only table
- [ ] All traffic logs are retained for at least 90 days
- [ ] All approvals are cryptographically signed and tamper-evident
- [ ] All QA reports are de-identified at the database query level
- [ ] All Student Voice Forms require explicit consent
- [ ] All Cloudinary media uses private/authenticated URLs
- [ ] All data subject rights (access, correct, erase) are implemented
- [ ] All breach notification mechanisms are in place
- [ ] All retention periods are enforced by automated cleanup scripts

**Failure to meet ANY of these requirements will cause the User Validation Gate to fail.**