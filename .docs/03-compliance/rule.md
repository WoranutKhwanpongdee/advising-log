# AdvisingLog - Legal & Compliance Rules for AI Agents

Read this before writing any code that touches user data or user actions.

## PDPA (Personal Data Protection Act B.E. 2562)

**What it is:** Thailand's Personal Data Protection Act governs the collection, use,
disclosure, storage, and deletion of personal data. AdvisingLog handles sensitive
student information, including health, mental-health, financial, family, and
dropout-related information.

**What it requires:** consent, purpose limitation, data minimisation, secure
processing, data-subject access/correction/deletion rights, and explicit consent
and heightened protection for sensitive personal data under Section 26.

**Rules for the agent:**

- If the system stores a student's name, student code, email, phone number, address,
  health information, financial information, mental-health information, family
  issues, advising notes, or dropout reason, it must classify and protect the data
  according to its sensitivity.
- If the system collects sensitive personal data, it must obtain explicit,
  informed, and purpose-specific consent before collection unless a lawful
  exception applies.
- If the system presents a Student Voice Form, it must show a clear privacy notice
  and an unchecked consent checkbox before collecting the student's own words.
- If a student refuses optional consent, the system must not block, delay, or
  disadvantage the student's advising or dropout/leave workflow.
- If the system uses personal data, it must use it only for the stated advising,
  support, workflow, or approved quality-assurance purpose.
- If the system no longer needs personal data, it must delete or anonymise it
  according to the approved retention policy and any legal hold.
- If the system displays a student's record, it must verify both the requester's
  role and their ownership or assignment relationship on the backend.
- If the requester is a Student, the system must return only that student's own
  records and must hide private advisor evaluations.
- If the requester is an Advisor, the system must return records only for assigned
  advisees.
- If the requester is a Program Chair or QA Coordinator, the system must return
  only aggregated or de-identified data and must prevent individual-record export.
- If the requester is an Admin, the system may expose workflow status and master
  data but must not expose sensitive personal notes or private advisor evaluations.
- If an unauthorised user requests personal data, the system must deny the request,
  return HTTP 403, and record the security event without revealing the data.
- If the system generates a QA or AUN-QA report, it must remove names, full student
  IDs, email addresses, phone numbers, and national IDs at the database query
  level, not only in the frontend.
- If the system stores sensitive fields in D1, it must encrypt them at rest using
  approved encryption such as AES-256 and must never store plaintext secrets.
- If the system transmits personal data, it must use HTTPS/TLS and must send
  sensitive values in request bodies rather than URL query parameters.
- If the system accepts input, it must validate it with the approved schema on both
  frontend and backend and must use parameterised Drizzle ORM queries.
- If the system stores documents or photos, it must allow only PDF, JPG, and PNG,
  enforce a 10 MB per-file limit and a maximum of five files per advising log,
  scan files for malware, and use private or authenticated expiring URLs.
- If the system stores a Cloudinary asset, it must store only its `public_id` in
  D1 and must not put names, student IDs, national IDs, or other PII in metadata
  or tags.
- If a student requests access, correction, or erasure, the system must provide a
  controlled workflow that protects private advisor evaluations and preserves
  legally required, anonymised, or legally held records.
- If the system detects a personal-data breach, it must record the incident,
  alert the DPO or security team, and support notification within the legally
  required timeframe, including within 72 hours where applicable.
- If the system writes logs or errors, it must not include sensitive personal data,
  credentials, tokens, or document contents.

## Computer Crime Act Section 26

**What it is:** Section 26 requires service providers and system administrators to
retain computer traffic data so that system activity can be investigated by an
authorised authority.

**What it requires:** keep an access/traffic log for at least 90 days, tied to a
real authenticated user, with accurate timestamps and sufficient details to trace
an action. Logs must be protected from unauthorised alteration or deletion.

**Rules for the agent:**

- If the system has a login or logout event, it must log the real user ID, source
  IP address, user-agent, authentication method, exact ISO 8601 timestamp, and
  success or failure status.
- If the system creates, reads, updates, or deletes an advising log, it must log
  the real user ID, source IP address, timestamp, action, resource ID, student
  code where necessary, and success or failure status.
- If the system processes a dropout or leave form, it must log the user ID, source
  IP address, timestamp, action, request ID, student code where necessary, and
  success or failure status.
- If the system uploads, downloads, or deletes a document, it must log the user ID,
  source IP address, timestamp, action, Cloudinary `public_id`, file name, file
  size, and success or failure status.
- If the system exports a QA report, it must log the user ID, source IP address,
  timestamp, report type, export format, and success or failure status.
- If an access attempt is unauthorised, it must deny the request and append a
  security event containing the user ID when known, source IP, timestamp, resource
  ID, requested action, and denial reason.
- If the system stores traffic logs, it must retain them for at least 90 days and
  must not delete them early when an account is deleted.
- If the system runs cleanup, it must check the retention period, exclude logs
  younger than 90 days, respect legal holds, and log each deletion decision.
- If the system stores traffic logs, it must use an append-only or immutable store,
  restrict log access to authorised roles, and protect entries against tampering.
- If the system uses hash chaining or equivalent integrity controls, it must verify
  integrity during audit and record failed verification attempts.
- If an administrator or auditor views traffic logs, the system must require
  elevated permission and log the viewing attempt; it must not permit modification
  or deletion during review.
- If a lawful authority requests traffic data, the system must support a scoped,
  machine-readable export and log the authority, order or reference number, scope,
  requester, and timestamp.
- If the system records IP addresses or user-agent strings, it must restrict access
  to operational, security, audit, and lawful-investigation purposes.

## Electronic Transactions Act Section 9 / 26 / 28

**What it is:** These provisions recognise electronic data and signatures when the
record is reliable, attributable to the signer, under the signer's control, and
capable of showing later alteration. Section 26 addresses a presumed-reliable
electronic signature, while Section 28 concerns the duties of a certification
authority (CA).

**What it requires:** a valid e-signature test under Section 9, a presumed-reliable
signature process under Section 26, and compliance with applicable CA duties under
Section 28. An approval must be attributable, time-stamped, tamper-evident, and
verifiable after submission.

**Rules for the agent:**

- If the user clicks "I agree" on a consent, privacy notice, Student Voice Form,
  or other legally meaningful declaration, the system must record the authenticated
  user ID, verified identity, exact timestamp, text or version agreed to, purpose,
  session ID, IP address, and result.
- If the user submits an approval or rejection, the system must bind the action to
  the authenticated session, verified MFU identity, resource ID, action type, and
  exact ISO 8601 timestamp.
- If the system finalises an advising record or dropout/leave decision, it must
  create and store a tamper-evident SHA-256 signature over the approved data,
  user identity, timestamp, and action.
- If the system stores an approval or signature, it must prevent silent changes
  after submission and preserve the original record for verification.
- If a user attempts to alter a finalised record, the system must invalidate or
  supersede the prior signature, record the old and new values and reason in an
  append-only audit log, and require re-approval before the change takes effect.
- If the system generates a receipt, advising summary, or QA export, it must
  include a verifiable SHA-256 hash of the underlying finalised data.
- If the system stores a private advisor evaluation, it must sign it at submission,
  restrict it to authorised personnel, and keep it invisible to the student.
- If the system verifies a signature, it must recalculate the hash, compare it with
  the stored value, reject mismatches, and log the verification result.
- If the system relies on a certification authority or certificate, it must use an
  authorised CA, protect signing keys, validate certificate status, and follow the
  CA's applicable duties under Section 28.
- If the system cannot attribute an electronic action to a verified user or cannot
  detect subsequent alteration, it must not treat that action as a valid approval.
