// ============================================================
// AdvisingLog — Mock Data
// Realistic, connected data for all demo roles
// ============================================================

import type {
  User,
  StudentAdvisorAssignment,
  AdvisingRequest,
  Appointment,
  AdvisingSession,
  FollowUp,
  Referral,
  AdvisingCategoryConfig,
  DocumentType,
  StudentDocument,
  Notification,
  EarlyWarningCase,
  ExitCase,
  AdvisorExitAssessment,
  AuditLog,
} from '@/types'

// --- Users ---

export const mockUsers: User[] = [
  // Students
  { id: 'STU001', code: '6631503001', name: 'Somchai Jaidee', email: 'somchai.j@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5601', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU002', code: '6631503002', name: 'Ploy Srisuk', email: 'ploy.s@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5602', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU003', code: '6631503003', name: 'Nattapong Wongchai', email: 'nattapong.w@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5603', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU004', code: '6631503004', name: 'Kannika Thongkam', email: 'kannika.t@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5604', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU005', code: '6631503005', name: 'Arthit Phanit', email: 'arthit.p@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5605', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU006', code: '6631503006', name: 'Siriporn Meechai', email: 'siriporn.m@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5606', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU007', code: '6631503007', name: 'Tanawat Rungroj', email: 'tanawat.r@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5607', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU008', code: '6631503008', name: 'Pimchanok Saetang', email: 'pimchanok.s@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5608', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU009', code: '6631503009', name: 'Kittipat Somboon', email: 'kittipat.s@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5609', isActive: true, createdAt: '2024-06-01' },
  { id: 'STU010', code: '6631503010', name: 'Waraporn Chantara', email: 'waraporn.c@student.mfu.ac.th', role: 'student', department: 'School of Information Technology', phone: '081-234-5610', isActive: true, createdAt: '2024-06-01' },
  // Advisors
  { id: 'ADV001', code: 'EMP-1001', name: 'Dr. Prasit Kanchanawat', email: 'prasit.k@mfu.ac.th', role: 'advisor', department: 'School of Information Technology', phone: '053-916-001', isActive: true, createdAt: '2020-01-15' },
  { id: 'ADV002', code: 'EMP-1002', name: 'Dr. Wipawan Buathong', email: 'wipawan.b@mfu.ac.th', role: 'advisor', department: 'School of Information Technology', phone: '053-916-002', isActive: true, createdAt: '2019-08-01' },
  { id: 'ADV003', code: 'EMP-1003', name: 'Dr. Chaiwat Namsai', email: 'chaiwat.n@mfu.ac.th', role: 'advisor', department: 'School of Information Technology', phone: '053-916-003', isActive: true, createdAt: '2021-01-10' },
  // QA Chair
  { id: 'QA001', code: 'EMP-2001', name: 'Assoc. Prof. Rattana Pongsakorn', email: 'rattana.p@mfu.ac.th', role: 'qa_chair', department: 'School of Information Technology', phone: '053-916-010', isActive: true, createdAt: '2018-01-01' },
  // Admin
  { id: 'ADM001', code: 'EMP-3001', name: 'Supattra Kaewmanee', email: 'supattra.k@mfu.ac.th', role: 'admin', department: 'Academic Affairs', phone: '053-916-020', isActive: true, createdAt: '2019-03-01' },
]

// --- Student–Advisor Roster ---

export const mockRoster: StudentAdvisorAssignment[] = [
  { id: 'R001', studentId: 'STU001', advisorId: 'ADV001', assignedAt: '2024-06-15', isActive: true },
  { id: 'R002', studentId: 'STU002', advisorId: 'ADV001', assignedAt: '2024-06-15', isActive: true },
  { id: 'R003', studentId: 'STU003', advisorId: 'ADV001', assignedAt: '2024-06-15', isActive: true },
  { id: 'R004', studentId: 'STU004', advisorId: 'ADV002', assignedAt: '2024-06-15', isActive: true },
  { id: 'R005', studentId: 'STU005', advisorId: 'ADV002', assignedAt: '2024-06-15', isActive: true },
  { id: 'R006', studentId: 'STU006', advisorId: 'ADV002', assignedAt: '2024-06-15', isActive: true },
  { id: 'R007', studentId: 'STU007', advisorId: 'ADV003', assignedAt: '2024-06-15', isActive: true },
  { id: 'R008', studentId: 'STU008', advisorId: 'ADV003', assignedAt: '2024-06-15', isActive: true },
  { id: 'R009', studentId: 'STU009', advisorId: 'ADV003', assignedAt: '2024-06-15', isActive: true },
  { id: 'R010', studentId: 'STU010', advisorId: 'ADV001', assignedAt: '2024-06-15', isActive: true },
]

// --- Advising Requests ---

export const mockRequests: AdvisingRequest[] = [
  { id: 'REQ001', studentId: 'STU001', advisorId: 'ADV001', category: 'academic_performance', details: 'I received a warning letter about my GPA dropping below 2.00 this semester. I need guidance on course selection for next semester to recover.', preferredDate: '2026-09-10', preferredTime: '10:00', attachments: ['gpa_report.pdf'], pdpaConsent: true, status: 'scheduled', createdAt: '2026-08-28', updatedAt: '2026-08-30' },
  { id: 'REQ002', studentId: 'STU002', advisorId: 'ADV001', category: 'scholarship_document', details: 'I need my advisor to sign a scholarship renewal form. The deadline is September 20.', preferredDate: '2026-09-05', preferredTime: '14:00', attachments: ['scholarship_form.pdf'], pdpaConsent: true, status: 'completed', createdAt: '2026-08-20', updatedAt: '2026-09-01' },
  { id: 'REQ003', studentId: 'STU003', advisorId: 'ADV001', category: 'personal', details: 'I have been feeling overwhelmed and want to discuss my academic workload and personal situation.', preferredDate: '2026-09-12', preferredTime: '11:00', attachments: [], pdpaConsent: true, status: 'requested', createdAt: '2026-09-01', updatedAt: '2026-09-01' },
  { id: 'REQ004', studentId: 'STU004', advisorId: 'ADV002', category: 'internship_career', details: 'I want to discuss internship opportunities for the upcoming summer semester and get recommendation letters.', preferredDate: '2026-09-08', preferredTime: '13:00', attachments: ['resume.pdf'], pdpaConsent: true, status: 'pending', createdAt: '2026-08-25', updatedAt: '2026-08-26' },
  { id: 'REQ005', studentId: 'STU005', advisorId: 'ADV002', category: 'registration', details: 'I need help resolving a registration hold on my account. I cannot register for next semester courses.', preferredDate: '2026-09-03', preferredTime: '09:00', attachments: [], pdpaConsent: true, status: 'completed', createdAt: '2026-08-18', updatedAt: '2026-08-28' },
  { id: 'REQ006', studentId: 'STU006', advisorId: 'ADV002', category: 'withdrawal_leave', details: 'I am considering taking a leave of absence due to family circumstances. I need to understand the process and implications.', preferredDate: '2026-09-15', preferredTime: '10:00', attachments: [], pdpaConsent: true, status: 'scheduled', createdAt: '2026-09-02', updatedAt: '2026-09-03' },
  { id: 'REQ007', studentId: 'STU007', advisorId: 'ADV003', category: 'financial', details: 'I am having difficulty paying tuition fees. I would like to discuss financial aid options and payment plans.', preferredDate: '2026-09-06', preferredTime: '14:00', attachments: [], pdpaConsent: true, status: 'completed', createdAt: '2026-08-22', updatedAt: '2026-09-01' },
  { id: 'REQ008', studentId: 'STU008', advisorId: 'ADV003', category: 'student_status', details: 'I need to clarify my student status. I received conflicting information about my enrollment status from different offices.', preferredDate: '2026-09-11', preferredTime: '15:00', attachments: ['enrollment_letter.pdf'], pdpaConsent: true, status: 'requested', createdAt: '2026-09-02', updatedAt: '2026-09-02' },
  { id: 'REQ009', studentId: 'STU010', advisorId: 'ADV001', category: 'academic_performance', details: 'I want to discuss strategies to improve my grades in core courses. I am struggling with the programming modules.', preferredDate: '2026-09-14', preferredTime: '11:00', attachments: [], pdpaConsent: true, status: 'requested', createdAt: '2026-09-03', updatedAt: '2026-09-03' },
]

// --- Appointments ---

export const mockAppointments: Appointment[] = [
  { id: 'APT001', requestId: 'REQ001', studentId: 'STU001', advisorId: 'ADV001', scheduledDate: '2026-09-10', scheduledTime: '10:00', location: 'Room S2-301', status: 'scheduled', createdAt: '2026-08-30' },
  { id: 'APT002', requestId: 'REQ002', studentId: 'STU002', advisorId: 'ADV001', scheduledDate: '2026-09-01', scheduledTime: '14:00', location: 'Room S2-301', status: 'completed', createdAt: '2026-08-25' },
  { id: 'APT003', requestId: 'REQ005', studentId: 'STU005', advisorId: 'ADV002', scheduledDate: '2026-08-28', scheduledTime: '09:30', location: 'Room S2-205', status: 'completed', createdAt: '2026-08-20' },
  { id: 'APT004', requestId: 'REQ006', studentId: 'STU006', advisorId: 'ADV002', scheduledDate: '2026-09-15', scheduledTime: '10:00', location: 'Room S2-205', status: 'scheduled', createdAt: '2026-09-03' },
  { id: 'APT005', requestId: 'REQ007', studentId: 'STU007', advisorId: 'ADV003', scheduledDate: '2026-09-01', scheduledTime: '14:00', location: 'Room S2-108', status: 'completed', createdAt: '2026-08-25' },
]

// --- Advising Sessions (completed) ---

export const mockSessions: AdvisingSession[] = [
  { id: 'SES001', requestId: 'REQ002', appointmentId: 'APT002', studentId: 'STU002', advisorId: 'ADV001', sessionDate: '2026-09-01', summary: 'Scholarship renewal form signed and returned. Discussed maintaining GPA requirements for scholarship retention.', problem: 'Student needed advisor signature on scholarship renewal form before deadline.', advice: 'Maintain GPA above 3.00. Consider taking lighter course load next semester if needed.', actionsTaken: 'Signed scholarship renewal form. Reviewed student transcript.', outcome: 'Form signed. Student will submit to scholarship office.', createdAt: '2026-09-01' },
  { id: 'SES002', requestId: 'REQ005', appointmentId: 'APT003', studentId: 'STU005', advisorId: 'ADV002', sessionDate: '2026-08-28', summary: 'Registration hold resolved. Issue was due to missing health checkup form. Assisted student with proper documentation.', problem: 'Student had a registration hold preventing course enrollment.', advice: 'Submit health checkup form to student affairs. Check registration system after 24 hours.', actionsTaken: 'Called Student Affairs to expedite hold removal. Helped student fill out health form.', outcome: 'Hold removed within 24 hours. Student successfully registered.', createdAt: '2026-08-28' },
  { id: 'SES003', requestId: 'REQ007', appointmentId: 'APT005', studentId: 'STU007', advisorId: 'ADV003', sessionDate: '2026-09-01', summary: 'Discussed financial aid options. Student is eligible for emergency fund and work-study program.', problem: 'Student facing difficulty paying tuition fees for current semester.', advice: 'Apply for emergency financial aid fund. Consider university work-study program for additional income.', actionsTaken: 'Provided emergency fund application form. Referred to Financial Office for payment plan options.', outcome: 'Student will apply for emergency fund. Referral sent to Financial Office.', createdAt: '2026-09-01' },
]

// --- Follow-ups ---

export const mockFollowUps: FollowUp[] = [
  { id: 'FU001', sessionId: 'SES001', requestId: 'REQ002', studentId: 'STU002', advisorId: 'ADV001', task: 'Submit scholarship renewal form to Scholarship Office', dueDate: '2026-09-10', status: 'completed', completedAt: '2026-09-03', createdAt: '2026-09-01' },
  { id: 'FU002', sessionId: 'SES002', requestId: 'REQ005', studentId: 'STU005', advisorId: 'ADV002', task: 'Verify course registration is complete after hold removal', dueDate: '2026-09-05', status: 'completed', completedAt: '2026-08-30', createdAt: '2026-08-28' },
  { id: 'FU003', sessionId: 'SES003', requestId: 'REQ007', studentId: 'STU007', advisorId: 'ADV003', task: 'Submit emergency financial aid application', dueDate: '2026-09-15', status: 'pending', createdAt: '2026-09-01' },
  { id: 'FU004', sessionId: 'SES003', requestId: 'REQ007', studentId: 'STU007', advisorId: 'ADV003', task: 'Visit Financial Office to set up payment plan', dueDate: '2026-09-10', status: 'in_progress', createdAt: '2026-09-01' },
]

// --- Referrals ---

export const mockReferrals: Referral[] = [
  { id: 'REF001', sessionId: 'SES003', studentId: 'STU007', advisorId: 'ADV003', reason: 'Student needs financial assistance and payment plan options.', destination: 'financial_office', status: 'referred', referredAt: '2026-09-01', createdAt: '2026-09-01' },
]

// --- Category Config ---

export const mockCategoryConfigs: AdvisingCategoryConfig[] = [
  { id: 'CAT001', value: 'scholarship_document', label: 'Scholarship / Document Signing', subCategories: ['Scholarship Renewal', 'Recommendation Letter', 'Certificate Request', 'Transcript Request'], isActive: true },
  { id: 'CAT002', value: 'financial', label: 'Financial Issues', subCategories: ['Tuition Payment', 'Financial Aid', 'Emergency Fund', 'Work-Study'], isActive: true },
  { id: 'CAT003', value: 'registration', label: 'Registration', subCategories: ['Course Registration', 'Add/Drop', 'Registration Hold', 'Section Change'], isActive: true },
  { id: 'CAT004', value: 'student_status', label: 'Student Status', subCategories: ['Enrollment Verification', 'Status Change', 'Readmission'], isActive: true },
  { id: 'CAT005', value: 'academic_performance', label: 'Academic Performance / GPA / Probation', subCategories: ['GPA Recovery Plan', 'Probation Counseling', 'Course Planning', 'Academic Support'], isActive: true },
  { id: 'CAT006', value: 'internship_career', label: 'Internship / Cooperative Education / Career', subCategories: ['Internship Search', 'Co-op Placement', 'Career Guidance', 'Recommendation'], isActive: true },
  { id: 'CAT007', value: 'personal', label: 'Personal Issues', subCategories: ['Stress / Wellbeing', 'Conflict Resolution', 'Accommodation', 'General Guidance'], isActive: true },
  { id: 'CAT008', value: 'withdrawal_leave', label: 'Withdrawal / Leave of Absence', subCategories: ['Temporary Leave', 'Permanent Withdrawal', 'Transfer Out'], isActive: true },
]

// --- Document Types ---

export const mockDocumentTypes: DocumentType[] = [
  { id: 'DT001', name: 'Scholarship Renewal Form', signatureMethod: 'wet_signature', isActive: true },
  { id: 'DT002', name: 'Leave of Absence Form', signatureMethod: 'wet_signature', isActive: true },
  { id: 'DT003', name: 'Internship Agreement', signatureMethod: 'e_signature', isActive: true },
  { id: 'DT004', name: 'Course Add/Drop Form', signatureMethod: 'e_signature', isActive: true },
  { id: 'DT005', name: 'Withdrawal Form', signatureMethod: 'wet_signature', isActive: true },
  { id: 'DT006', name: 'Recommendation Request', signatureMethod: 'e_signature', isActive: true },
]

// --- Student Documents ---

export const mockStudentDocuments: StudentDocument[] = [
  { id: 'DOC001', studentId: 'STU002', documentTypeId: 'DT001', documentName: 'Scholarship Renewal Form', fileName: 'scholarship_form_signed.pdf', status: 'signed', signatureMethod: 'wet_signature', uploadedAt: '2026-08-25', signedAt: '2026-09-01' },
  { id: 'DOC002', studentId: 'STU006', documentTypeId: 'DT002', documentName: 'Leave of Absence Form', status: 'required', signatureMethod: 'wet_signature' },
  { id: 'DOC003', studentId: 'STU004', documentTypeId: 'DT003', documentName: 'Internship Agreement', fileName: 'internship_agreement.pdf', status: 'uploaded', signatureMethod: 'e_signature', uploadedAt: '2026-08-30' },
  { id: 'DOC004', studentId: 'STU001', documentTypeId: 'DT004', documentName: 'Course Add/Drop Form', status: 'required', signatureMethod: 'e_signature' },
]

// --- Notifications ---

export const mockNotifications: Notification[] = [
  { id: 'NOT001', userId: 'STU001', type: 'info', title: 'Appointment Scheduled', message: 'Your advising appointment has been scheduled for September 10, 2026 at 10:00 AM in Room S2-301.', relatedId: 'APT001', isRead: false, createdAt: '2026-08-30' },
  { id: 'NOT002', userId: 'STU001', type: 'action_required', title: 'Follow-up Required', message: 'Please complete the course add/drop form before the deadline.', relatedId: 'DOC004', isRead: false, createdAt: '2026-09-01' },
  { id: 'NOT003', userId: 'STU002', type: 'success', title: 'Follow-up Completed', message: 'Your scholarship renewal form has been submitted successfully.', relatedId: 'FU001', isRead: true, createdAt: '2026-09-03' },
  { id: 'NOT004', userId: 'ADV001', type: 'action_required', title: 'New Advising Request', message: 'Nattapong Wongchai (6631503003) has submitted a new advising request regarding personal issues.', relatedId: 'REQ003', isRead: false, createdAt: '2026-09-01' },
  { id: 'NOT005', userId: 'ADV001', type: 'action_required', title: 'New Advising Request', message: 'Waraporn Chantara (6631503010) has submitted a new advising request regarding academic performance.', relatedId: 'REQ009', isRead: false, createdAt: '2026-09-03' },
  { id: 'NOT006', userId: 'STU006', type: 'info', title: 'Appointment Scheduled', message: 'Your advising appointment has been scheduled for September 15, 2026 at 10:00 AM in Room S2-205.', relatedId: 'APT004', isRead: false, createdAt: '2026-09-03' },
  { id: 'NOT007', userId: 'STU007', type: 'warning', title: 'Follow-up Due Soon', message: 'Your follow-up task "Submit emergency financial aid application" is due on September 15.', relatedId: 'FU003', isRead: false, createdAt: '2026-09-08' },
  { id: 'NOT008', userId: 'ADV002', type: 'action_required', title: 'Pending Request', message: 'Kannika Thongkam (6631503004) has a pending advising request about internship/career that needs review.', relatedId: 'REQ004', isRead: false, createdAt: '2026-08-26' },
]

// --- Early Warning Cases ---

export const mockEarlyWarnings: EarlyWarningCase[] = [
  { id: 'EW001', studentId: 'STU001', advisorId: 'ADV001', warningType: 'academic_risk', severity: 'high', description: 'Student GPA dropped below 2.00. Received academic warning letter. At risk of probation if GPA does not improve next semester.', dateDetected: '2026-08-25', recommendedAction: 'Schedule advising session to create GPA recovery plan. Consider reduced course load.', followUpDate: '2026-09-15', status: 'active', createdAt: '2026-08-25' },
  { id: 'EW002', studentId: 'STU009', advisorId: 'ADV003', warningType: 'attendance', severity: 'medium', description: 'Student has missed more than 20% of classes in two courses. Pattern started 3 weeks ago.', dateDetected: '2026-08-30', recommendedAction: 'Contact student to check welfare. Schedule meeting to discuss attendance issues.', followUpDate: '2026-09-10', status: 'active', createdAt: '2026-08-30' },
]

// --- Exit Cases ---

export const mockExitCases: ExitCase[] = [
  { id: 'EX001', studentId: 'STU006', advisorId: 'ADV002', exitType: 'leave_of_absence', reasonCode: 'personal_family', details: 'Student needs to take a temporary leave to care for an ill family member. Plans to return next academic year.', preferredEffectiveDate: '2026-10-01', status: 'under_review', createdAt: '2026-09-02', updatedAt: '2026-09-03' },
]

// --- Advisor Exit Assessments ---

export const mockAdvisorAssessments: AdvisorExitAssessment[] = []

// --- Audit Logs ---

export const mockAuditLogs: AuditLog[] = [
  { id: 'AL001', userId: 'STU001', userName: 'Somchai Jaidee', userRole: 'student', action: 'request_created', description: 'Created advising request REQ001 for Academic Performance', targetId: 'REQ001', createdAt: '2026-08-28T09:15:00' },
  { id: 'AL002', userId: 'ADV001', userName: 'Dr. Prasit Kanchanawat', userRole: 'advisor', action: 'appointment_scheduled', description: 'Scheduled appointment for Somchai Jaidee on September 10', targetId: 'APT001', createdAt: '2026-08-30T14:22:00' },
  { id: 'AL003', userId: 'STU002', userName: 'Ploy Srisuk', userRole: 'student', action: 'request_created', description: 'Created advising request REQ002 for Scholarship / Document Signing', targetId: 'REQ002', createdAt: '2026-08-20T10:30:00' },
  { id: 'AL004', userId: 'ADV001', userName: 'Dr. Prasit Kanchanawat', userRole: 'advisor', action: 'session_completed', description: 'Completed advising session with Ploy Srisuk. Signed scholarship form.', targetId: 'SES001', createdAt: '2026-09-01T15:00:00' },
  { id: 'AL005', userId: 'ADV001', userName: 'Dr. Prasit Kanchanawat', userRole: 'advisor', action: 'followup_created', description: 'Created follow-up for Ploy Srisuk: Submit scholarship renewal form', targetId: 'FU001', createdAt: '2026-09-01T15:05:00' },
  { id: 'AL006', userId: 'STU002', userName: 'Ploy Srisuk', userRole: 'student', action: 'document_signed', description: 'Scholarship Renewal Form signed by advisor', targetId: 'DOC001', createdAt: '2026-09-01T15:10:00' },
  { id: 'AL007', userId: 'ADV002', userName: 'Dr. Wipawan Buathong', userRole: 'advisor', action: 'session_completed', description: 'Completed advising session with Arthit Phanit. Registration hold resolved.', targetId: 'SES002', createdAt: '2026-08-28T10:30:00' },
  { id: 'AL008', userId: 'ADV003', userName: 'Dr. Chaiwat Namsai', userRole: 'advisor', action: 'referral_created', description: 'Referred Tanawat Rungroj to Financial Office for payment plan options', targetId: 'REF001', createdAt: '2026-09-01T15:20:00' },
  { id: 'AL009', userId: 'STU006', userName: 'Siriporn Meechai', userRole: 'student', action: 'exit_case_created', description: 'Created exit case EX001: Leave of Absence due to personal/family reasons', targetId: 'EX001', createdAt: '2026-09-02T11:00:00' },
  { id: 'AL010', userId: 'ADV001', userName: 'Dr. Prasit Kanchanawat', userRole: 'advisor', action: 'warning_created', description: 'Created early warning for Somchai Jaidee: Academic risk (high severity)', targetId: 'EW001', createdAt: '2026-08-25T16:30:00' },
  { id: 'AL011', userId: 'ADM001', userName: 'Supattra Kaewmanee', userRole: 'admin', action: 'roster_updated', description: 'Updated student-advisor roster. Assigned 10 students to 3 advisors.', createdAt: '2026-06-15T09:00:00' },
]

// --- Helper functions ---

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id)
}

export function getUsersByRole(role: User['role']): User[] {
  return mockUsers.filter(u => u.role === role)
}

export function getAdvisorForStudent(studentId: string): User | undefined {
  const assignment = mockRoster.find(r => r.studentId === studentId && r.isActive)
  if (!assignment) return undefined
  return mockUsers.find(u => u.id === assignment.advisorId)
}

export function getStudentsForAdvisor(advisorId: string): User[] {
  const studentIds = mockRoster
    .filter(r => r.advisorId === advisorId && r.isActive)
    .map(r => r.studentId)
  return mockUsers.filter(u => studentIds.includes(u.id))
}
