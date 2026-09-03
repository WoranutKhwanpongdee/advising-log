# AdvisingLog System User Journey

This outlines the User Journeys within the AdvisingLog system, separated by four key roles based on the provided activity diagrams: QA, Admin, Advisor and Student.

---

## 1. Quality Assurance (QA) User Journey

![alt text](<Quality Assurance (QA) User Journey.jpg>)

### 1.1 Authentication Phase
1. **Start:** User accesses the login page.
2. **Select Role:** User selects the desired role for access.
   * **System Response:** Displays the Demo User Selection screen.
3. **Choose Demo User:** In the example diagram, Assoc. Prof. Rattana Pongsakorn is chosen.
   * **System Response:** Validates credentials and creates a session, then displays the QA Dashboard.

### 1.2 Dashboard Main Activities (Repeat-while loop)
The user can repeatedly perform actions within this loop as long as they are logged into the system:
1. **View Dashboard:**
   * **System Response:** Displays the Dashboard Aggregate Stats.
2. **Click Export Report:**
   * **System Response:** Generates a report.
3. **Click Exit Case Review:**
   * **System Response:** Displays the Exit Case Review Page.
   * **Sub-User Actions:** Views Exit Cases and clicks Review.
   * **System Response:** Displays individual Student Cases and processes the review request. The flow then loops back to the aggregate stats view or the exit case review page.

### 1.3 Session Termination Phase
1. **User Log Out:** The user initiates the logout process.
   * **System Response:** System terminates the session.
2. **End.**

---

## 2. Admin User Journey

![alt text](<Admin User Journey.jpg>)

### 2.1 Authentication & Initial Dashboard Phase
1. **Start:** User accesses the login page.
2. **Select 'Admin' Role:** User selects the 'Admin' role.
3. **Choose Demo User:** In the example, Supattra Kaewmanee is chosen.
   * **System Response:** Displays the Demo Selection screen, authenticates the user, and displays the initial Dashboard. The Dashboard displays the Default View.

### 2.2 Sidebar Main Activities (Admin Area Selection branching)
Users can click on sidebar links to select specific administrative areas for management:

* **A. User Management:**
  * Clicks 'User Management' link -> System displays User Management page -> Branches into sub-actions:
    * **Add User (Branch Add):** Clicks Add User -> System displays the Add User form (implicitly).
    * **Deactivate User (User: Click 'Deactivate'):** -> System deactivates the user and updates the list.

* **B. Student-Advisor Roster:**
  * Clicks 'Student-Advisor Roster' link -> System displays the Student-Advisor Roster page -> Branches into sub-actions (implicitly):
    * **Import:** Clicks 'Import' -> System displays the updated form.
    * **Assign Advisor:** -> System displays the Assign Advisor form.
    * **Change Advisor:** -> System displays the Change Advisor form.

* **C. Advising Categories:**
  * Clicks 'Categories' link -> System displays the Advising Categories page -> Branches into sub-actions:
    * **Add Category (Branch Add):** Clicks 'Category' -> System displays the Advising Category form (implicitly).
    * **Disable Category (Select 'Category' click 'Disable'):** -> System displays the category and updates the list.

* **D. Document Types:**
  * Clicks 'Document Types' link -> System displays the Document Types page -> Branches into sub-actions:
    * **Add Document Type (Branch Add):** Clicks 'Document Type' -> System displays the Document Type form (implicitly).
    * **Disable Document Type (Select 'Document Type' click 'Disable'):** -> System displays the document type and updates the list.

* **E. Audit Logs:**
  * Clicks 'Audit Logs' link -> System displays the Audit Logs page.

### 2.3 Session Termination Phase
1. **Access Profile (Use: Click profile icon):**
2. **Log Out (User: Click 'Sign Out' button):**
   * **System Response:** System terminates the user session and redirects back to the login page.
3. **End.**

---

## 3. Advisor User Journey

![alt text](<Advisor User Journey.jpg>)

### 3.1 Dashboard Access Flow (Initial Flow)
1. **Start -> Navigate to Login Screen.**
2. **Select 'Advisor' Role.**
3. **Choose Demo Advisor User:** e.g., Dr. Prasit.
4. **Access Advisor Dashboard:** Views KPIs and Key Lists such as Pending Requests, Upcoming Appointments, and Early Warnings.

### 3.2 Task-Specific Activities (Fork to Task Tabs)
From the dashboard, the user can separate into multiple parallel task tabs (fork):

* **A. Advising Sessions Tab:**
  * Navigate to tab -> View Pending Request List -> Determine Action Type?:
    * **Accept [Accept Request]:** Accept the incoming request.
    * **Schedule [Schedule Session]:** Schedule a session (completes details and changes status).
    * **Cancel [Cancel Request]:** Cancel the request.
  * Also allows viewing other session categories (Upcoming, Completed, Cancelled).

* **B. Advisor Log Tab:**
  * Navigate to tab -> Determine if a completed session log is needed? (Completed session log needed?):
    * **Yes:** Select the completed session and Write/Submit the log.
    * **No:** View the 'No sessions to log' message.

* **C. Early Warning Tab:**
  * Navigate to tab -> Determine Action Type (Action Type determined?):
    * **Monitor Monthly [Monitor active]:** Decide between Monitor Warning or Resolve Warning.
    * **Create New Warning [Create new warning]:** Clicks 'Create Warning' -> Completes and submits the warning form.
    * **Implicit Exit [Implicit exit]:** This path leads directly to the creation of an exit case form.

* **D. Referrals Tab:**
  * Navigate to tab -> Click 'Create Referral' -> Complete and submit the referral form.

* **E. Exit Cases Tab:**
  * Navigate to tab -> Click 'Manage Exit/Dropout Cases' -> Complete and submit the case form.

### 3.3 Session Termination Flow
1. **Merge activities (Join after finish session or perform other tasks).**
2. **End - Academic Advisor.**

---

## 4. Student User Journey

![alt text](<Student User Journey.jpg>)

### 4.1 Authentication Phase
1. **START:** User navigates to the login page (`advisinglog.dev/login`).
2. **Select Role: Student:** Click the 'Student' role option.
3. **Select Demo Student User:** Choose a demo profile (e.g., Ploy Srisuk).
4. **Authentication Check (Successful Authentication?):**
   * **No:** Loops back to the login page.
   * **Yes:** Lands on the Student Dashboard.

### 4.2 Dashboard & Main Activities Phase (Fork)
Upon landing on the Student Dashboard, the student can view Summary Cards, Advisor Info, and Latest Requests. From the dashboard, the path separates (Fork) into multiple distinct student activities:

* **A. Request Advising:** Initiate 'Request Advising' -> Complete Advising Request Form (Category, Details, Date/Time, Attachment, PDPA Consent) -> Action: Submit Request.
* **B. Advising History:** Navigate to 'Advising History' tab -> View Advising History (Review past requests and statuses).
* **C. Documents:** Navigate to 'Documents' tab -> Check Signatures and Document Statuses (View signature and document tables).
* **D. Follow-ups:** Navigate to 'Follow-ups' tab -> Track Follow-up Tasks (Review Assigned Tasks, Due Dates, and Statuses).
* **E. Exit Form:** Navigate to 'Exit Form' tab -> Complete Exit Request Form (Exit Type, Reason, Details, Effective Date) -> Action: Submit Request.

### 4.3 Logout Phase
1. **Merge activities (Join after completing tasks).**
2. **Review Summary and Confirm Logout:** User reviews final advising summary data and confirms logout actions or document tables.
   * **Implicit Logout loop:**
     * Performs Logout.
     * Reviews final summary & Logout (confirm actions or initiate direct logout).
   * All paths merge at the final decision point before termination.
3. **End.**