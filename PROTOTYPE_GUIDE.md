# AdvisingLog Prototype Guide

Welcome to the AdvisingLog local development prototype! This guide explains how to start, navigate, and test the core workflows of the system.

> [!NOTE]
> This is a **frontend-only prototype**. All data is mock data and is stored in memory using React Context. Refreshing your browser will reset the data to its initial state. No real backend or database is connected.

## 🚀 How to Run the Prototype

1. Open your terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your web browser and go to: **[http://localhost:5173](http://localhost:5173)**

---

## 🔐 Simulated Authentication

When you open the application, you will see a simulated SSO login screen. This allows you to easily switch between different user roles to test how the system behaves for different types of users.

### Available Roles:
1. **Student**: Submits requests, uploads documents, and tracks advising history.
2. **Advisor**: Manages student requests, schedules sessions, and writes advising logs.
3. **Program Chair / QA**: Views system-wide analytics and reviews exit cases.
4. **Admin**: Manages user accounts and the student-advisor roster.

To switch roles, simply click the **Log Out** button (door icon) in the top right corner of the application to return to the login screen.

---

## 🧪 Testing the Core Workflow

To see the system in action, follow this step-by-step end-to-end workflow:

### Step 1: Request Advising (As a Student)
1. Log in as a **Student** (e.g., select *Somchai Jaidee*).
2. Click **Request Advising** in the sidebar.
3. Fill out the form:
   - Select a category (e.g., "Academic Performance").
   - Write a problem description.
   - Choose a preferred date and time.
   - Check the PDPA consent box.
4. Click **Submit Request**.
5. Log out.

### Step 2: Schedule the Session (As an Advisor)
1. Log in as an **Advisor** (e.g., select *Dr. Prasit Kanchanawat*, who is Somchai's advisor).
2. Go to **Advising Sessions** in the sidebar.
3. Under the **Pending** tab, you will see the request Somchai just submitted.
4. Click **Accept**, then click **Schedule**.
5. Pick a date, time, and location (e.g., "Room S2-301") and confirm.
6. The request will move to the **Upcoming** tab.

### Step 3: Complete the Session (As an Advisor)
1. Still on the **Advising Sessions** page, go to the **Upcoming** tab.
2. Find Somchai's scheduled appointment and click **Complete**.
3. Now, navigate to **Advisor Log** in the sidebar.
4. Select the completed session from the dropdown.
5. Fill in the advising log (Summary, Advice Provided, etc.).
6. Optionally, create a follow-up task (e.g., "Submit study plan by Friday").
7. Click **Save Advising Log**.
8. Log out.

### Step 4: Verify the Log (As a Student)
1. Log back in as the **Student** (*Somchai Jaidee*).
2. Check your **Notifications** (bell icon in the top right) to see the appointment and follow-up alerts.
3. Go to **Advising History**, click on the completed request, and review the session notes and timeline.
4. Go to **Follow-ups** and click **Complete** on the task your advisor assigned you.

---

## 📊 Exploring Other Features

### QA Dashboard
Log in as the **Program Chair / QA** (*Assoc. Prof. Rattana*) to explore the analytics dashboard. This view aggregates all the mock data into interactive charts (category distribution, exit reasons, advisor workload).

### Early Warnings & Referrals
Log in as an **Advisor** to create an Early Warning (e.g., for low attendance) or refer a student to another department (e.g., Financial Office).

### Exit Cases
1. Log in as a **Student** and submit an **Exit Form** (e.g., Leave of Absence).
2. Log in as their **Advisor** and go to **Exit Cases** to submit an official Advisor Assessment.
3. Log in as the **Program Chair / QA**, go to **Exit Case Review**, and finalize/close the case.
