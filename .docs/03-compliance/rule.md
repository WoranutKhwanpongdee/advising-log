# System Rules

This document defines the key rules and constraints for the AdvisingLog system.
The rules are based on the project requirements and are intended to protect
student information and ensure proper use of the system.

---

## 1. User Roles & Access

The system has four user roles:

- Student
- Advisor
- Program Chair / QA Coordinator
- Admin

Each role must only have access to the information and functions required
for their responsibilities.

### Student
- Can access their own profile and advising information.
- Can request meetings with their assigned advisor.
- Can submit required forms and satisfaction surveys.
- Cannot access other students' information.

### Advisor
- Can access students assigned to them.
- Can create and manage Advisor Logs for their assigned students.
- Can manage follow-ups, referrals, and advising outcomes.
- Cannot access students outside their assigned responsibility unless authorized.

### Program Chair / QA Coordinator
- Can view program-level advising and dropout statistics.
- Can access information required for QA and AUN-QA reporting.
- Should use anonymized or aggregated data whenever individual identification
  is not required.

### Admin
- Can manage users and student-advisor assignments.
- Can manage system configuration and reference data.
- Access to sensitive information should be limited to administrative needs.

---

## 2. Student Information Privacy

- Student information must only be accessible to authorized users.
- Sensitive information must not be exposed unnecessarily.
- Personal information should not be included in reports when identification
  is not required.
- Student identifiers should be minimized when data is used for analysis.
- Personal data must be handled according to applicable university policies
  and legal requirements.

---

## 3. Advisor Log Rules

- Advisor Logs can only be created or updated by authorized advisors.
- Each log must be associated with the correct student and advisor.
- Advising records should contain only information relevant to the advising case.
- Follow-ups should include a status and, when applicable, a follow-up date.
- Changes to important advising records should be traceable through audit logs.
- Existing records should not be silently deleted or overwritten.

---

## 4. Meeting Request Rules

- Students can request meetings with their assigned advisor.
- Meeting requests must be sent to the correct advisor.
- Advisors are responsible for confirming or scheduling meetings.
- Meeting status should be clearly recorded.
- Supporting documents may be attached when required.

---

## 5. Document Rules

- Uploaded documents must be accessible only to authorized users.
- Paper-signed documents may be scanned and uploaded.
- E-signatures may only be used for document types where they are permitted.
- Documents must not be shared publicly.
- Access to sensitive documents should be logged where appropriate.

---

## 6. Dropout / Leave / Resignation Rules

- Student Exit Forms and Advisor Exit Forms must remain separate.
- Students should provide information from their own perspective.
- Advisors should provide information based on their advising experience.
- Dropout, leave, and resignation reasons should use predefined categories
  where possible.
- Individual student identities should be separated from data used for
  statistical analysis where possible.
- Consultation history may be used to understand previous support and
  follow-up, subject to access permissions.

---

## 7. Satisfaction Survey Rules

- Students may submit a satisfaction survey after an advising session.
- Survey responses should be used for evaluating and improving the advising process.
- Survey results should not unnecessarily expose individual student identities.

---

## 8. QA & Reporting Rules

- QA reports must use accurate and traceable data.
- Statistics should be generated from recorded system data.
- Reports should minimize unnecessary personal information.
- Exported data must only be accessible to authorized users.
- AUN-QA evidence should be traceable to the underlying records where appropriate.

---

## 9. Audit & Accountability

The system should maintain audit records for important actions, including:

- User account changes
- Student-advisor assignment changes
- Creation or modification of important advising records
- Changes to dropout or exit information
- Document uploads or changes
- Administrative actions

Audit records should include sufficient information to determine
who performed an action and when it occurred.

---

## 10. Data Integrity

- Required information must be validated before submission.
- Records must be associated with the correct user and student.
- Duplicate or inconsistent records should be minimized.
- Important records should not be permanently deleted without authorization.
- Data changes should remain traceable where required.

---

## 11. Data Export

- Only authorized users may export system data.
- Exported data should contain only the information necessary for the purpose.
- Sensitive personal information should be excluded or anonymized when possible.
- Exported files must be handled securely.

---

## 12. General Principle

The system should follow these principles:

> **Collect as you go → Stay traceable → Store once, reuse → Close the loop**

The system should support student advising while minimizing unnecessary
collection, exposure, and duplication of personal information.
