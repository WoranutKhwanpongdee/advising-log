// ============================================================
// AdvisingLog — Core TypeScript Types
// ============================================================

// --- Enums / Literal Unions ---

export type UserRole = 'student' | 'advisor' | 'qa_chair' | 'admin'

export type AdvisingCategory =
  | 'scholarship_document'
  | 'financial'
  | 'registration'
  | 'student_status'
  | 'academic_performance'
  | 'internship_career'
  | 'personal'
  | 'withdrawal_leave'

export const ADVISING_CATEGORIES: { value: AdvisingCategory; label: string }[] = [
  { value: 'scholarship_document', label: 'Scholarship / Document Signing' },
  { value: 'financial', label: 'Financial Issues' },
  { value: 'registration', label: 'Registration' },
  { value: 'student_status', label: 'Student Status' },
  { value: 'academic_performance', label: 'Academic Performance / GPA / Probation' },
  { value: 'internship_career', label: 'Internship / Cooperative Education / Career' },
  { value: 'personal', label: 'Personal Issues' },
  { value: 'withdrawal_leave', label: 'Withdrawal / Leave of Absence' },
]

export type RequestStatus =
  | 'requested'
  | 'pending'
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'closed'

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export type FollowUpStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'

export type ReferralStatus = 'pending' | 'referred' | 'in_progress' | 'completed'

export type ReferralDestination =
  | 'guidance_counseling'
  | 'scholarship_office'
  | 'financial_office'
  | 'mental_health'
  | 'academic_support'

export const REFERRAL_DESTINATIONS: { value: ReferralDestination; label: string }[] = [
  { value: 'guidance_counseling', label: 'Guidance / Counseling' },
  { value: 'scholarship_office', label: 'Scholarship Office' },
  { value: 'financial_office', label: 'Financial Office' },
  { value: 'mental_health', label: 'Mental Health Service' },
  { value: 'academic_support', label: 'Academic Support' },
]

export type ExitType = 'withdrawal' | 'leave_of_absence' | 'transfer' | 'dropout'

export type ExitReasonCode =
  | 'financial'
  | 'academic'
  | 'health'
  | 'personal_family'
  | 'mental_health'
  | 'transfer'
  | 'career_work'
  | 'other'

export const EXIT_REASON_CODES: { value: ExitReasonCode; label: string }[] = [
  { value: 'financial', label: 'Financial' },
  { value: 'academic', label: 'Academic' },
  { value: 'health', label: 'Health' },
  { value: 'personal_family', label: 'Personal / Family' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'career_work', label: 'Career / Work' },
  { value: 'other', label: 'Other' },
]

export type ExitCaseStatus = 'open' | 'under_review' | 'resolved' | 'closed'

export type EarlyWarningType = 'academic_risk' | 'financial_risk' | 'attendance' | 'personal'

export const EARLY_WARNING_TYPES: { value: EarlyWarningType; label: string }[] = [
  { value: 'academic_risk', label: 'Academic Risk' },
  { value: 'financial_risk', label: 'Financial Risk' },
  { value: 'attendance', label: 'Attendance Problems' },
  { value: 'personal', label: 'Personal Issues' },
]

export type EarlyWarningSeverity = 'low' | 'medium' | 'high' | 'critical'

export type SignatureMethod = 'wet_signature' | 'e_signature'

export type DocumentStatus = 'required' | 'uploaded' | 'signed' | 'approved' | 'rejected'

export type NotificationType = 'info' | 'warning' | 'success' | 'action_required'

export type AuditAction =
  | 'user_login'
  | 'request_created'
  | 'request_updated'
  | 'appointment_scheduled'
  | 'session_completed'
  | 'log_created'
  | 'followup_created'
  | 'followup_completed'
  | 'referral_created'
  | 'document_uploaded'
  | 'document_signed'
  | 'exit_case_created'
  | 'exit_case_updated'
  | 'warning_created'
  | 'qa_viewed_case'
  | 'qa_exported_data'
  | 'user_role_changed'
  | 'roster_updated'
  | 'category_updated'

// --- Core Models ---

export interface User {
  id: string
  code: string  // Student ID or Employee Code
  name: string
  email: string
  role: UserRole
  department: string
  phone?: string
  isActive: boolean
  createdAt: string
}

export interface StudentAdvisorAssignment {
  id: string
  studentId: string
  advisorId: string
  assignedAt: string
  isActive: boolean
}

export interface AdvisingRequest {
  id: string
  studentId: string
  advisorId: string
  category: AdvisingCategory
  subCategory?: string
  details: string
  preferredDate: string
  preferredTime: string
  attachments: string[]    // simulated file names
  pdpaConsent: boolean
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  requestId: string
  studentId: string
  advisorId: string
  scheduledDate: string
  scheduledTime: string
  location: string
  status: AppointmentStatus
  createdAt: string
}

export interface AdvisingSession {
  id: string
  requestId: string
  appointmentId: string
  studentId: string
  advisorId: string
  sessionDate: string
  summary: string
  problem: string
  advice: string
  actionsTaken: string
  outcome: string
  createdAt: string
}

export interface FollowUp {
  id: string
  sessionId: string
  requestId: string
  studentId: string
  advisorId: string
  task: string
  dueDate: string
  status: FollowUpStatus
  completedAt?: string
  createdAt: string
}

export interface Referral {
  id: string
  sessionId: string
  studentId: string
  advisorId: string
  reason: string
  destination: ReferralDestination
  status: ReferralStatus
  referredAt: string
  createdAt: string
}

export interface AdvisingCategoryConfig {
  id: string
  value: AdvisingCategory
  label: string
  subCategories: string[]
  isActive: boolean
}

export interface DocumentType {
  id: string
  name: string
  signatureMethod: SignatureMethod
  isActive: boolean
}

export interface StudentDocument {
  id: string
  studentId: string
  documentTypeId: string
  documentName: string
  fileName?: string
  status: DocumentStatus
  signatureMethod: SignatureMethod
  uploadedAt?: string
  signedAt?: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedId?: string
  isRead: boolean
  createdAt: string
}

export interface EarlyWarningCase {
  id: string
  studentId: string
  advisorId: string
  warningType: EarlyWarningType
  severity: EarlyWarningSeverity
  description: string
  dateDetected: string
  recommendedAction: string
  followUpDate: string
  status: 'active' | 'monitoring' | 'resolved'
  createdAt: string
}

export interface ExitCase {
  id: string
  studentId: string
  advisorId: string
  exitType: ExitType
  reasonCode: ExitReasonCode
  details: string
  preferredEffectiveDate: string
  status: ExitCaseStatus
  createdAt: string
  updatedAt: string
}

export interface AdvisorExitAssessment {
  id: string
  exitCaseId: string
  advisorId: string
  assessment: string
  contributingFactors: string
  actionsTaken: string
  referralsMade: string
  followUpAttempts: string
  recommendation: string
  resolution: string
  createdAt: string
}

export interface SatisfactionSurvey {
  id: string
  sessionId: string
  studentId: string
  rating: number  // 1-5
  feedback: string
  createdAt: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  action: AuditAction
  description: string
  targetId?: string
  metadata?: string
  createdAt: string
}
