// ============================================================
// AdvisingLog — API Client Service
// Type-safe HTTP client connecting Frontend to Cloudflare Workers Backend
// ============================================================

import type {
  User,
  AdvisingRequest,
  Appointment,
  AdvisingSession,
  FollowUp,
  FollowUpProgress,
  ExitCase,
  StudentVoiceResponse,
  AuditLog,
} from '@/types'

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8787'

class ApiClient {
  private base: string

  constructor(base: string) {
    this.base = base.replace(/\/$/, '')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    try {
      const url = `${this.base}${endpoint}`
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })
      if (!res.ok) {
        return null
      }
      return (await res.json()) as T
    } catch (_err) {
      // Offline fallback: returns null if backend is unreachable
      return null
    }
  }

  // --- Health & Info ---
  async getHealth() {
    return this.request<{ status: string; environment: string; database: string }>('/api/health')
  }

  async getInfo() {
    return this.request<{ app: string; roles: string[]; techStack: Record<string, string> }>('/api/info')
  }

  // --- Users ---
  async getUsers(role?: string) {
    const query = role ? `?role=${role}` : ''
    return this.request<{ users: User[] }>(`/api/users${query}`)
  }

  async getUser(id: string) {
    return this.request<{ user: User }>(`/api/users/${id}`)
  }

  async saveUser(user: Partial<User>) {
    return this.request<{ success: boolean; user: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  }

  // --- Advising Requests ---
  async getRequests(params?: { studentId?: string; advisorId?: string }) {
    const q = new URLSearchParams()
    if (params?.studentId) q.append('studentId', params.studentId)
    if (params?.advisorId) q.append('advisorId', params.advisorId)
    const qs = q.toString() ? `?${q.toString()}` : ''
    return this.request<{ requests: AdvisingRequest[] }>(`/api/requests${qs}`)
  }

  async createRequest(req: Partial<AdvisingRequest>) {
    return this.request<{ success: boolean; request: AdvisingRequest }>('/api/requests', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  }

  async updateRequestStatus(id: string, status: string) {
    return this.request<{ success: boolean }>(`/api/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // --- Appointments & Sessions ---
  async getAppointments() {
    return this.request<{ appointments: Appointment[] }>('/api/appointments')
  }

  async createAppointment(apt: Partial<Appointment>) {
    return this.request<{ success: boolean; appointment: Appointment }>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(apt),
    })
  }

  async getSessions() {
    return this.request<{ sessions: AdvisingSession[] }>('/api/sessions')
  }

  async createSession(session: Partial<AdvisingSession>) {
    return this.request<{ success: boolean; session: AdvisingSession }>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    })
  }

  // --- Follow-ups & Progress ---
  async getFollowUps(studentId?: string) {
    const query = studentId ? `?studentId=${studentId}` : ''
    return this.request<{ followUps: FollowUp[] }>(`/api/follow-ups${query}`)
  }

  async createFollowUp(fu: Partial<FollowUp>) {
    return this.request<{ success: boolean; followUp: FollowUp }>('/api/follow-ups', {
      method: 'POST',
      body: JSON.stringify(fu),
    })
  }

  async updateFollowUpStatus(id: string, status: string) {
    return this.request<{ success: boolean }>(`/api/follow-ups/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  async getFollowUpProgress() {
    return this.request<{ progress: FollowUpProgress[] }>('/api/follow-up-progress')
  }

  async saveFollowUpProgress(progress: Partial<FollowUpProgress>) {
    return this.request<{ success: boolean; progress: FollowUpProgress }>('/api/follow-up-progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    })
  }

  // --- Exit Cases & Student Voice ---
  async getExitCases() {
    return this.request<{ exitCases: ExitCase[] }>('/api/exit-cases')
  }

  async createExitCase(exitCase: Partial<ExitCase>) {
    return this.request<{ success: boolean; exitCase: ExitCase }>('/api/exit-cases', {
      method: 'POST',
      body: JSON.stringify(exitCase),
    })
  }

  async updateExitCase(id: string, updates: Partial<ExitCase>) {
    return this.request<{ success: boolean }>(`/api/exit-cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async submitStudentVoice(survey: Partial<StudentVoiceResponse>) {
    return this.request<{ success: boolean; survey: StudentVoiceResponse }>('/api/student-voice', {
      method: 'POST',
      body: JSON.stringify(survey),
    })
  }

  // --- Audit Logs ---
  async getAuditLogs() {
    return this.request<{ logs: AuditLog[] }>('/api/audit-logs')
  }

  async logAudit(log: Partial<AuditLog>) {
    return this.request<{ success: boolean; log: AuditLog }>('/api/audit-logs', {
      method: 'POST',
      body: JSON.stringify(log),
    })
  }
}

export const api = new ApiClient(API_BASE)
export default api
