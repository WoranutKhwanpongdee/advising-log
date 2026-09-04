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

export const ADVISING_CATEGORIES: { value: AdvisingCategory; label: string; labelEn: string; labelTh: string }[] = [
  { value: 'scholarship_document', label: 'Scholarship / Document Signing', labelEn: 'Scholarship / Document Signing', labelTh: 'ทุนการศึกษา / ลงนามเอกสาร' },
  { value: 'financial', label: 'Financial Issues', labelEn: 'Financial Issues', labelTh: 'ปัญหาทางการเงิน / ค่าธรรมเนียม' },
  { value: 'registration', label: 'Course Registration', labelEn: 'Course Registration', labelTh: 'การลงทะเบียนเรียน / เพิ่ม-ถอน' },
  { value: 'student_status', label: 'Student Status', labelEn: 'Student Status', labelTh: 'สถานภาพนักศึกษา' },
  { value: 'academic_performance', label: 'Academic Performance / GPA / Probation', labelEn: 'Academic Performance / GPA / Probation', labelTh: 'ผลการเรียน / GPA / ภาวะวิทยาทัณฑ์' },
  { value: 'internship_career', label: 'Internship / Co-op / Career', labelEn: 'Internship / Co-op / Career', labelTh: 'ฝึกงาน / สหกิจศึกษา / อาชีพ' },
  { value: 'personal', label: 'Personal Issues', labelEn: 'Personal Issues', labelTh: 'ปัญหาส่วนตัว / การปรับตัว' },
  { value: 'withdrawal_leave', label: 'Withdrawal / Leave of Absence', labelEn: 'Withdrawal / Leave of Absence', labelTh: 'การขอลาพัก / ขอลาออก' },
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

export const REFERRAL_DESTINATIONS: { value: ReferralDestination; label: string; labelEn: string; labelTh: string }[] = [
  { value: 'guidance_counseling', label: 'Guidance & Counseling Center', labelEn: 'Guidance & Counseling Center', labelTh: 'ศูนย์แนะแนวและให้คำปรึกษา' },
  { value: 'scholarship_office', label: 'Scholarship Office', labelEn: 'Scholarship Office', labelTh: 'งานทุนการศึกษา' },
  { value: 'financial_office', label: 'Financial Services Office', labelEn: 'Financial Services Office', labelTh: 'ส่วนการเงินและบัญชี' },
  { value: 'mental_health', label: 'Mental Health & Wellness Unit', labelEn: 'Mental Health & Wellness Unit', labelTh: 'หน่วยบริการสุขภาพจิต' },
  { value: 'academic_support', label: 'Academic Support Center', labelEn: 'Academic Support Center', labelTh: 'ศูนย์สนับสนุนการเรียนรู้วิชาการ' },
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

export const EXIT_REASON_CODES: { value: ExitReasonCode; label: string; labelEn: string; labelTh: string }[] = [
  { value: 'financial', label: 'Financial Difficulty', labelEn: 'Financial Difficulty', labelTh: 'ปัญหาด้านการเงิน / ค่าใช้จ่าย' },
  { value: 'academic', label: 'Academic Difficulty', labelEn: 'Academic Difficulty', labelTh: 'ผลการเรียน / ไม่ถนัดในสาขา' },
  { value: 'health', label: 'Physical Health', labelEn: 'Physical Health', labelTh: 'ปัญหาสุขภาพทางกาย' },
  { value: 'personal_family', label: 'Personal / Family Circumstances', labelEn: 'Personal / Family Circumstances', labelTh: 'ภาระครอบครัว / ส่วนตัว' },
  { value: 'mental_health', label: 'Mental Health', labelEn: 'Mental Health', labelTh: 'สภาวะสุขภาพจิต / ความเครียด' },
  { value: 'transfer', label: 'Institution Transfer', labelEn: 'Institution Transfer', labelTh: 'โอนย้ายสถาบันการศึกษา' },
  { value: 'career_work', label: 'Career / Employment', labelEn: 'Career / Employment', labelTh: 'ประกอบอาชีพ / ศึกษาต่อ' },
  { value: 'other', label: 'Other Reasons', labelEn: 'Other Reasons', labelTh: 'เหตุผลอื่นๆ' },
]

export type ExitCaseStatus = 'open' | 'under_review' | 'resolved' | 'closed'

export type EarlyWarningType = 'academic_risk' | 'financial_risk' | 'attendance' | 'personal'

export const EARLY_WARNING_TYPES: { value: EarlyWarningType; label: string; labelEn: string; labelTh: string }[] = [
  { value: 'academic_risk', label: 'Academic Risk (Low GPA)', labelEn: 'Academic Risk (Low GPA)', labelTh: 'เสี่ยงทางวิชาการ (GPA ต่ำ)' },
  { value: 'financial_risk', label: 'Financial Risk', labelEn: 'Financial Risk', labelTh: 'เสี่ยงค้างชำระค่าธรรมเนียม' },
  { value: 'attendance', label: 'Attendance Risk', labelEn: 'Attendance Risk', labelTh: 'ปัญหาการเข้าเรียนไม่สม่ำเสมอ' },
  { value: 'personal', label: 'Personal & Well-being', labelEn: 'Personal & Well-being', labelTh: 'ปัญหาส่วนตัว / ความเป็นอยู่' },
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
  dataAnalysisConsent: boolean
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
