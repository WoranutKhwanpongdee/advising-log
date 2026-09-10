// ============================================================
// AdvisingLog — Mock Store (React Context)
// Simple reactive store for prototype state management
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type {
  AdvisingRequest,
  Appointment,
  AdvisingSession,
  FollowUp,
  Referral,
  Notification,
  EarlyWarningCase,
  ExitCase,
  AdvisorExitAssessment,
  StudentVoiceResponse,
  StudentDocument,
  User,
  StudentAdvisorAssignment,
  AdvisingCategoryConfig,
  DocumentType,
  AuditLog,
  SystemApiConfig,
  RosterImportEntry,
  RosterImportResult,
} from '@/types'
import {
  mockRequests,
  mockAppointments,
  mockSessions,
  mockFollowUps,
  mockReferrals,
  mockNotifications,
  mockEarlyWarnings,
  mockExitCases,
  mockAdvisorAssessments,
  mockStudentVoiceResponses,
  mockStudentDocuments,
  mockUsers,
  mockRoster,
  mockCategoryConfigs,
  mockDocumentTypes,
  mockAuditLogs,
} from '@/data/mock-data'

// --- Helper: generate simple IDs ---
let counter = 1000
function nextId(prefix: string): string {
  counter++
  return `${prefix}${counter}`
}

function now(): string {
  return new Date().toISOString().split('T')[0]
}

// --- Store Shape ---

interface StoreState {
  users: User[]
  roster: StudentAdvisorAssignment[]
  requests: AdvisingRequest[]
  appointments: Appointment[]
  sessions: AdvisingSession[]
  followUps: FollowUp[]
  referrals: Referral[]
  notifications: Notification[]
  earlyWarnings: EarlyWarningCase[]
  exitCases: ExitCase[]
  advisorAssessments: AdvisorExitAssessment[]
  studentVoiceResponses: StudentVoiceResponse[]
  documents: StudentDocument[]
  categoryConfigs: AdvisingCategoryConfig[]
  documentTypes: DocumentType[]
  auditLogs: AuditLog[]
  systemApiConfig: SystemApiConfig
}

interface StoreActions {
  // Requests
  addRequest: (req: Omit<AdvisingRequest, 'id' | 'createdAt' | 'updatedAt'>) => AdvisingRequest
  updateRequestStatus: (id: string, status: AdvisingRequest['status']) => void

  // Appointments
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void

  // Sessions
  addSession: (ses: Omit<AdvisingSession, 'id' | 'createdAt'>) => AdvisingSession

  // Follow-ups
  addFollowUp: (fu: Omit<FollowUp, 'id' | 'createdAt'>) => FollowUp
  updateFollowUpStatus: (id: string, status: FollowUp['status']) => void

  // Referrals
  addReferral: (ref: Omit<Referral, 'id' | 'createdAt'>) => Referral
  updateReferralStatus: (id: string, status: Referral['status']) => void

  // Notifications
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (userId: string) => void

  // Early Warnings
  addEarlyWarning: (ew: Omit<EarlyWarningCase, 'id' | 'createdAt'>) => EarlyWarningCase
  updateEarlyWarningStatus: (id: string, status: EarlyWarningCase['status']) => void

  // Exit Cases
  addExitCase: (ec: Omit<ExitCase, 'id' | 'createdAt' | 'updatedAt'>) => ExitCase
  updateExitCaseStatus: (id: string, status: ExitCase['status']) => void

  // Advisor Assessments
  addAdvisorAssessment: (a: Omit<AdvisorExitAssessment, 'id' | 'createdAt'>) => AdvisorExitAssessment

  // Student Voice Responses
  addStudentVoiceResponse: (svr: Omit<StudentVoiceResponse, 'id' | 'createdAt'>) => StudentVoiceResponse

  // Documents
  addDocument: (doc: Omit<StudentDocument, 'id'>) => StudentDocument
  updateDocumentStatus: (id: string, status: StudentDocument['status']) => void

  // Users
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User
  updateUser: (id: string, updates: Partial<User>) => void

  // Roster
  addRosterEntry: (entry: Omit<StudentAdvisorAssignment, 'id' | 'assignedAt'>) => void
  updateRosterEntry: (studentId: string, newAdvisorId: string) => void
  batchImportRoster: (entries: RosterImportEntry[], mode: 'upsert' | 'replace') => RosterImportResult

  // System & API Configuration
  toggleAiApi: (enabled: boolean, adminName?: string) => void
  toggleUserAiAccess: (userId: string, enabled: boolean, adminName?: string) => void

  // Categories
  addCategory: (cat: Omit<AdvisingCategoryConfig, 'id'>) => void
  updateCategory: (id: string, updates: Partial<AdvisingCategoryConfig>) => void

  // Document Types
  addDocumentType: (dt: Omit<DocumentType, 'id'>) => void
  updateDocumentType: (id: string, updates: Partial<DocumentType>) => void

  // Audit
  addAuditLog: (log: Omit<AuditLog, 'id' | 'createdAt'>) => void
}


type Store = StoreState & StoreActions

const StoreContext = createContext<Store | null>(null)

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([...mockUsers])
  const [roster, setRoster] = useState<StudentAdvisorAssignment[]>([...mockRoster])
  const [requests, setRequests] = useState<AdvisingRequest[]>([...mockRequests])
  const [appointments, setAppointments] = useState<Appointment[]>([...mockAppointments])
  const [sessions, setSessions] = useState<AdvisingSession[]>([...mockSessions])
  const [followUps, setFollowUps] = useState<FollowUp[]>([...mockFollowUps])
  const [referrals, setReferrals] = useState<Referral[]>([...mockReferrals])
  const [notifications, setNotifications] = useState<Notification[]>([...mockNotifications])
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningCase[]>([...mockEarlyWarnings])
  const [exitCases, setExitCases] = useState<ExitCase[]>([...mockExitCases])
  const [advisorAssessments, setAdvisorAssessments] = useState<AdvisorExitAssessment[]>([...mockAdvisorAssessments])
  const [studentVoiceResponses, setStudentVoiceResponses] = useState<StudentVoiceResponse[]>([...mockStudentVoiceResponses])
  const [documents, setDocuments] = useState<StudentDocument[]>([...mockStudentDocuments])
  const [categoryConfigs, setCategoryConfigs] = useState<AdvisingCategoryConfig[]>([...mockCategoryConfigs])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([...mockDocumentTypes])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([...mockAuditLogs])
  const [systemApiConfig, setSystemApiConfig] = useState<SystemApiConfig>(() => {
    const saved = localStorage.getItem('advising_log_system_api_config')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {}
    }
    return {
      isAiApiEnabled: true,
      provider: 'Google Gemini 1.5 Flash',
      model: 'gemini-1.5-flash',
      lastToggledAt: new Date().toISOString(),
      lastToggledBy: 'Admin (System)',
      notes: 'Active for Higher Ed QA retention analysis',
    }
  })

  // --- Actions ---

  const addRequest = useCallback((req: Omit<AdvisingRequest, 'id' | 'createdAt' | 'updatedAt'>): AdvisingRequest => {
    const newReq: AdvisingRequest = { ...req, id: nextId('REQ'), createdAt: now(), updatedAt: now() }
    setRequests(prev => [newReq, ...prev])
    return newReq
  }, [])

  const updateRequestStatus = useCallback((id: string, status: AdvisingRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, updatedAt: now() } : r))
  }, [])

  const addAppointment = useCallback((apt: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = { ...apt, id: nextId('APT'), createdAt: now() }
    setAppointments(prev => [newApt, ...prev])
    return newApt
  }, [])

  const updateAppointmentStatus = useCallback((id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }, [])

  const addSession = useCallback((ses: Omit<AdvisingSession, 'id' | 'createdAt'>): AdvisingSession => {
    const newSes: AdvisingSession = { ...ses, id: nextId('SES'), createdAt: now() }
    setSessions(prev => [newSes, ...prev])
    return newSes
  }, [])

  const addFollowUp = useCallback((fu: Omit<FollowUp, 'id' | 'createdAt'>): FollowUp => {
    const newFu: FollowUp = { ...fu, id: nextId('FU'), createdAt: now() }
    setFollowUps(prev => [newFu, ...prev])
    return newFu
  }, [])

  const updateFollowUpStatus = useCallback((id: string, status: FollowUp['status']) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status, ...(status === 'completed' ? { completedAt: now() } : {}) } : f))
  }, [])

  const addReferral = useCallback((ref: Omit<Referral, 'id' | 'createdAt'>): Referral => {
    const newRef: Referral = { ...ref, id: nextId('REF'), createdAt: now() }
    setReferrals(prev => [newRef, ...prev])
    return newRef
  }, [])

  const updateReferralStatus = useCallback((id: string, status: Referral['status']) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }, [])

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications(prev => [{ ...n, id: nextId('NOT'), createdAt: now() }, ...prev])
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }, [])

  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n))
  }, [])

  const addEarlyWarning = useCallback((ew: Omit<EarlyWarningCase, 'id' | 'createdAt'>): EarlyWarningCase => {
    const newEw: EarlyWarningCase = { ...ew, id: nextId('EW'), createdAt: now() }
    setEarlyWarnings(prev => [newEw, ...prev])
    return newEw
  }, [])

  const updateEarlyWarningStatus = useCallback((id: string, status: EarlyWarningCase['status']) => {
    setEarlyWarnings(prev => prev.map(e => e.id === id ? { ...e, status } : e))
  }, [])

  const addExitCase = useCallback((ec: Omit<ExitCase, 'id' | 'createdAt' | 'updatedAt'>): ExitCase => {
    const newEc: ExitCase = { ...ec, id: nextId('EX'), createdAt: now(), updatedAt: now() }
    setExitCases(prev => [newEc, ...prev])
    return newEc
  }, [])

  const updateExitCaseStatus = useCallback((id: string, status: ExitCase['status']) => {
    setExitCases(prev => prev.map(e => e.id === id ? { ...e, status, updatedAt: now() } : e))
  }, [])

  const addAdvisorAssessment = useCallback((a: Omit<AdvisorExitAssessment, 'id' | 'createdAt'>): AdvisorExitAssessment => {
    const newA: AdvisorExitAssessment = { ...a, id: nextId('AEA'), createdAt: now() }
    setAdvisorAssessments(prev => [newA, ...prev])
    return newA
  }, [])

  const addStudentVoiceResponse = useCallback((svr: Omit<StudentVoiceResponse, 'id' | 'createdAt'>): StudentVoiceResponse => {
    const newSvr: StudentVoiceResponse = { ...svr, id: nextId('SVR'), createdAt: new Date().toISOString() }
    setStudentVoiceResponses(prev => [newSvr, ...prev])
    return newSvr
  }, [])

  const addDocument = useCallback((doc: Omit<StudentDocument, 'id'>): StudentDocument => {
    const newDoc: StudentDocument = { ...doc, id: nextId('DOC') }
    setDocuments(prev => [newDoc, ...prev])
    return newDoc
  }, [])

  const updateDocumentStatus = useCallback((id: string, status: StudentDocument['status']) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }, [])

  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = { ...user, id: nextId('USR'), createdAt: now() }
    setUsers(prev => [...prev, newUser])
    return newUser
  }, [])

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
  }, [])

  const addRosterEntry = useCallback((entry: Omit<StudentAdvisorAssignment, 'id' | 'assignedAt'>) => {
    setRoster(prev => [...prev, { ...entry, id: nextId('R'), assignedAt: now() }])
  }, [])

  const updateRosterEntry = useCallback((studentId: string, newAdvisorId: string) => {
    setRoster(prev => prev.map(r => r.studentId === studentId && r.isActive ? { ...r, advisorId: newAdvisorId } : r))
  }, [])

  const addCategory = useCallback((cat: Omit<AdvisingCategoryConfig, 'id'>) => {
    setCategoryConfigs(prev => [...prev, { ...cat, id: nextId('CAT') }])
  }, [])

  const updateCategory = useCallback((id: string, updates: Partial<AdvisingCategoryConfig>) => {
    setCategoryConfigs(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])

  const addDocumentType = useCallback((dt: Omit<DocumentType, 'id'>) => {
    setDocumentTypes(prev => [...prev, { ...dt, id: nextId('DT') }])
  }, [])

  const updateDocumentType = useCallback((id: string, updates: Partial<DocumentType>) => {
    setDocumentTypes(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
  }, [])

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id' | 'createdAt'>) => {
    setAuditLogs(prev => [{ ...log, id: nextId('AL'), createdAt: new Date().toISOString() }, ...prev])
  }, [])

  const toggleAiApi = useCallback((enabled: boolean, adminName: string = 'Admin') => {
    setSystemApiConfig(prev => {
      const updated: SystemApiConfig = {
        ...prev,
        isAiApiEnabled: enabled,
        lastToggledAt: new Date().toISOString(),
        lastToggledBy: adminName,
      }
      localStorage.setItem('advising_log_system_api_config', JSON.stringify(updated))
      return updated
    })
  }, [])

  const toggleUserAiAccess = useCallback((userId: string, enabled: boolean, adminName: string = 'Admin') => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, hasAiAccess: enabled } : u)))
    const target = users.find(u => u.id === userId)
    setAuditLogs(prev => [
      {
        id: nextId('AL'),
        userId: 'ADM001',
        userName: adminName,
        userRole: 'admin',
        action: 'user_ai_access_toggled',
        description: `Admin ${enabled ? 'GRANTED' : 'REVOKED'} AI access for user ${target?.name || userId} (${target?.code || ''})`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }, [users])


  const batchImportRoster = useCallback((
    entries: RosterImportEntry[],
    mode: 'upsert' | 'replace'
  ): RosterImportResult => {
    let addedCount = 0
    let updatedCount = 0
    let unchangedCount = 0
    let skippedCount = 0
    const errors: string[] = []
    const preview: RosterImportResult['preview'] = []

    const seenStudentCodes = new Set<string>()
    const validBatch: Array<{ student: User; advisor: User; rawEntry: RosterImportEntry }> = []

    for (const entry of entries) {
      const sCode = (entry.studentCode || '').trim()
      const aTarget = (entry.advisorCodeOrEmail || '').trim().toLowerCase()

      if (!sCode) {
        skippedCount++
        continue
      }

      if (seenStudentCodes.has(sCode)) {
        skippedCount++
        errors.push(`รหัสนักศึกษา ${sCode} ปรากฏซ้ำในชุดข้อมูล (ยึดรายการแรกและข้ามรายการซ้ำ)`)
        continue
      }
      seenStudentCodes.add(sCode)

      const student = users.find(u => u.code === sCode && u.role === 'student')
      if (!student) {
        skippedCount++
        errors.push(`ไม่พบรหัสนักศึกษา "${sCode}" ในฐานข้อมูล`)
        preview.push({
          studentCode: sCode,
          studentName: 'ไม่พบในระบบ',
          newAdvisorName: aTarget,
          action: 'error',
          errorReason: `ไม่พบนักศึกษารหัส ${sCode}`,
        })
        continue
      }

      const advisor = users.find(u =>
        u.role === 'advisor' && (
          u.code.toLowerCase() === aTarget ||
          u.email.toLowerCase() === aTarget ||
          u.name.toLowerCase().includes(aTarget) ||
          u.id.toLowerCase() === aTarget
        )
      )

      if (!advisor) {
        skippedCount++
        errors.push(`ไม่พบอาจารย์ที่ปรึกษา "${aTarget}" สำหรับนักศึกษา ${sCode}`)
        preview.push({
          studentCode: sCode,
          studentName: student.name,
          newAdvisorName: 'ไม่พบอาจารย์',
          action: 'error',
          errorReason: `ไม่พบอาจารย์ "${aTarget}"`,
        })
        continue
      }

      validBatch.push({ student, advisor, rawEntry: entry })
    }

    if (mode === 'replace') {
      // In replace mode: all active roster entries are replaced by this batch
      setRoster(prev => {
        const inactives = prev.filter(r => !r.isActive)
        const updatedList: StudentAdvisorAssignment[] = [...inactives]

        for (const item of validBatch) {
          const existing = prev.find(r => r.studentId === item.student.id && r.isActive)
          const oldAdvisor = existing ? users.find(u => u.id === existing.advisorId) : undefined

          updatedList.push({
            id: nextId('R'),
            studentId: item.student.id,
            advisorId: item.advisor.id,
            assignedAt: now(),
            isActive: true,
          })

          if (!existing) {
            addedCount++
            preview.push({
              studentCode: item.student.code,
              studentName: item.student.name,
              newAdvisorName: item.advisor.name,
              action: 'add',
            })
          } else if (existing.advisorId !== item.advisor.id) {
            updatedCount++
            preview.push({
              studentCode: item.student.code,
              studentName: item.student.name,
              oldAdvisorName: oldAdvisor?.name,
              newAdvisorName: item.advisor.name,
              action: 'update',
            })
          } else {
            unchangedCount++
            preview.push({
              studentCode: item.student.code,
              studentName: item.student.name,
              oldAdvisorName: oldAdvisor?.name,
              newAdvisorName: item.advisor.name,
              action: 'no_change',
            })
          }
        }

        return updatedList
      })
    } else {
      // In upsert mode (Default & Recommended):
      // - Updates existing active student assignment to new advisor (no duplicate rows)
      // - Adds new assignment if student has no prior active assignment
      // - Unmentioned students remain completely untouched!
      setRoster(prev => {
        const nextRoster = [...prev]

        for (const item of validBatch) {
          const existingIdx = nextRoster.findIndex(r => r.studentId === item.student.id && r.isActive)

          if (existingIdx >= 0) {
            const existing = nextRoster[existingIdx]
            const oldAdvisor = users.find(u => u.id === existing.advisorId)

            if (existing.advisorId === item.advisor.id) {
              unchangedCount++
              preview.push({
                studentCode: item.student.code,
                studentName: item.student.name,
                oldAdvisorName: oldAdvisor?.name,
                newAdvisorName: item.advisor.name,
                action: 'no_change',
              })
            } else {
              updatedCount++
              nextRoster[existingIdx] = {
                ...existing,
                advisorId: item.advisor.id,
                assignedAt: now(),
              }
              preview.push({
                studentCode: item.student.code,
                studentName: item.student.name,
                oldAdvisorName: oldAdvisor?.name,
                newAdvisorName: item.advisor.name,
                action: 'update',
              })
            }
          } else {
            addedCount++
            nextRoster.push({
              id: nextId('R'),
              studentId: item.student.id,
              advisorId: item.advisor.id,
              assignedAt: now(),
              isActive: true,
            })
            preview.push({
              studentCode: item.student.code,
              studentName: item.student.name,
              newAdvisorName: item.advisor.name,
              action: 'add',
            })
          }
        }

        return nextRoster
      })
    }

    return {
      mode,
      totalRows: entries.length,
      addedCount,
      updatedCount,
      unchangedCount,
      skippedCount,
      errors,
      preview,
    }
  }, [users])

  const store: Store = {
    users, roster, requests, appointments, sessions, followUps, referrals,
    notifications, earlyWarnings, exitCases, advisorAssessments, studentVoiceResponses, documents,
    categoryConfigs, documentTypes, auditLogs, systemApiConfig,
    addRequest, updateRequestStatus,
    addAppointment, updateAppointmentStatus,
    addSession,
    addFollowUp, updateFollowUpStatus,
    addReferral, updateReferralStatus,
    addNotification, markNotificationRead, markAllNotificationsRead,
    addEarlyWarning, updateEarlyWarningStatus,
    addExitCase, updateExitCaseStatus,
    addAdvisorAssessment,
    addStudentVoiceResponse,
    addDocument, updateDocumentStatus,
    addUser, updateUser,
    addRosterEntry, updateRosterEntry, batchImportRoster,
    toggleAiApi, toggleUserAiAccess,
    addCategory, updateCategory,
    addDocumentType, updateDocumentType,
    addAuditLog,
  }


  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
