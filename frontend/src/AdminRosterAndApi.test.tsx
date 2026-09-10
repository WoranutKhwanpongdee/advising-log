import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoreProvider, useStore } from '@/data/mock-store'
import { ToastProvider } from '@/contexts/ToastContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import UserManagement from '@/pages/admin/UserManagement'
import AiGovernance from '@/pages/admin/AiGovernance'
import Roster from '@/pages/admin/Roster'
import { analyzeWithLLM } from '@/services/aiService'

// Mock currentUser as Admin
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('@/contexts/AuthContext')>('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      currentUser: {
        id: 'ADM001',
        code: 'A001',
        name: 'System Admin',
        email: 'admin@mfu.ac.th',
        role: 'admin',
        department: 'Academic Operations',
        isActive: true,
        createdAt: '2024-01-01',
      },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  }
})

function renderWithProviders(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <LanguageProvider>
          <StoreProvider>
            <ToastProvider>{ui}</ToastProvider>
          </StoreProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('Admin API Control & CSV Roster Import', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // -------------------------------------------------------------
  // PART 1: Admin API Toggle Tests
  // -------------------------------------------------------------
  it('renders AI/LLM API control card in AdminDashboard and toggles API state', () => {
    renderWithProviders(<AdminDashboard />)

    // Verify card exists
    expect(screen.getByText(/การควบคุม API & ระบบปัญญาประดิษฐ์/i)).toBeInTheDocument()
    expect(screen.getByText(/API: เปิดใช้งาน/i)).toBeInTheDocument()

    const toggleButton = screen.getByRole('button', { name: /เปิดใช้งานอยู่ \(คลิกเพื่อปิด\)/i })
    expect(toggleButton).toBeInTheDocument()

    // Toggle OFF
    act(() => {
      fireEvent.click(toggleButton)
    })

    expect(screen.getByText(/API: ปิดใช้งาน/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ปิดใช้งานอยู่ \(คลิกเพื่อเปิด\)/i })).toBeInTheDocument()
  })

  it('rejects LLM calls with disabled notice when Admin turns off the API', async () => {
    // Manually set API config to disabled in localStorage
    localStorage.setItem(
      'advising_log_system_api_config',
      JSON.stringify({ isAiApiEnabled: false, provider: 'Google Gemini', model: 'gemini-1.5-flash' })
    )

    const res = await analyzeWithLLM({
      mode: 'strategic_synthesis',
      cases: [],
      language: 'th',
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe('AI_API_DISABLED')
    expect(res.analysis).toContain('ระบบบริการ AI / LLM ถูกปิดการใช้งานชั่วคราวโดยผู้ดูแลระบบ')
  })

  // -------------------------------------------------------------
  // PART 2: Per-User AI Governance Tests
  // -------------------------------------------------------------
  it('enforces Layer 2 per-user AI authorization (rejects when user hasAiAccess is false)', async () => {
    // Master switch is ON
    localStorage.setItem(
      'advising_log_system_api_config',
      JSON.stringify({ isAiApiEnabled: true, provider: 'Google Gemini', model: 'gemini-1.5-flash' })
    )

    const res = await analyzeWithLLM({
      mode: 'strategic_synthesis',
      cases: [],
      language: 'th',
      userHasAiAccess: false, // Individual revoked
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe('USER_AI_ACCESS_DENIED')
    expect(res.analysis).toContain('บัญชีของคุณไม่ได้รับสิทธิ์เข้าถึงระบบ AI')
  })

  it('prioritizes Layer 1 Master Switch over Layer 2 individual access', async () => {
    // Master switch is OFF, even if user has individual permission
    localStorage.setItem(
      'advising_log_system_api_config',
      JSON.stringify({ isAiApiEnabled: false, provider: 'Google Gemini', model: 'gemini-1.5-flash' })
    )

    const res = await analyzeWithLLM({
      mode: 'strategic_synthesis',
      cases: [],
      language: 'th',
      userHasAiAccess: true, // User has individual permission, but master switch is off
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe('AI_API_DISABLED')
    expect(res.analysis).toContain('ระบบบริการ AI / LLM ถูกปิดการใช้งานชั่วคราวโดยผู้ดูแลระบบ')
  })

  it('renders clean UserManagement without AI column and contains quick link to AiGovernance', () => {
    renderWithProviders(<UserManagement />)

    // Check link banner
    expect(screen.getByText(/ศูนย์ควบคุมระบบ AI และการกำหนดสิทธิ์/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ไปที่หน้าจัดการระบบ AI/i })).toBeInTheDocument()

    // Ensure AI column is NOT in the table (no student confusion)
    expect(screen.queryByText(/สิทธิ์การใช้งาน AI/i)).not.toBeInTheDocument()
  })

  it('renders dedicated AiGovernance page and excludes students from personnel delegation', async () => {
    renderWithProviders(<AiGovernance />)

    // Header and Master Switch
    expect(screen.getByRole('heading', { name: /จัดการระบบ AI & กำหนดสิทธิ์ \(AI Governance\)/i })).toBeInTheDocument()
    expect(screen.getByText(/สวิตช์ควบคุมหลักของระบบ/i)).toBeInTheDocument()

    // Switch to Personnel Access tab
    const personnelTabBtn = screen.getByRole('button', { name: /กำหนดสิทธิ์บุคลากร/i })
    act(() => {
      fireEvent.click(personnelTabBtn)
    })

    // Expect faculty-only notice banner
    expect(screen.getByText(/ระบบกำหนดสิทธิ์เฉพาะบุคลากร \(Faculty & QA Staff Only\)/i)).toBeInTheDocument()

    // Faculty members SHOULD be present
    expect(screen.getByText(/Dr. Prasit Kanchanawat/i)).toBeInTheDocument()
    expect(screen.getByText(/Dr. Wipawan Buathong/i)).toBeInTheDocument()

    // Students MUST NOT be present
    expect(screen.queryByText('6631503001')).not.toBeInTheDocument()
    expect(screen.queryByText('Somchai Jaidee')).not.toBeInTheDocument()

    // Find toggle button for revoked faculty (Dr. Wipawan) and click
    const revokedButtons = screen.getAllByRole('button', { name: /ระงับสิทธิ์ \(Revoked\)/i })
    expect(revokedButtons.length).toBeGreaterThan(0)

    await act(async () => {
      fireEvent.click(revokedButtons[0])
    })

    // Now count of allowed buttons should increase
    const allowedButtons = screen.getAllByRole('button', { name: /มีสิทธิ์ AI \(Allowed\)/i })
    expect(allowedButtons.length).toBeGreaterThan(0)
  })

  it('records an audit log entry when Admin toggles per-user AI permission', async () => {
    let storeRef: any
    function TestComponent() {
      storeRef = useStore()
      return <div>Store Test</div>
    }

    renderWithProviders(<TestComponent />)

    const initialAuditCount = storeRef.auditLogs.length

    await act(async () => {
      storeRef.toggleUserAiAccess('ADV002', true, 'TestAdmin')
    })

    // Check updated user state
    const user = storeRef.users.find((u: any) => u.id === 'ADV002')
    expect(user?.hasAiAccess).toBe(true)

    // Check audit log created
    expect(storeRef.auditLogs.length).toBe(initialAuditCount + 1)
    const latestLog = storeRef.auditLogs[0]
    expect(latestLog.action).toBe('user_ai_access_toggled')
    expect(latestLog.description).toContain('GRANTED AI access for user Dr. Wipawan Buathong')
  })

  // -------------------------------------------------------------
  // PART 3: CSV Roster Import & Duplicate Prevention Tests
  // -------------------------------------------------------------
  it('opens CSV Roster Import modal and displays duplicate prevention & mode explanation', () => {
    renderWithProviders(<Roster />)

    const importBtn = screen.getByRole('button', { name: /นำเข้าไฟล์ CSV/i })
    act(() => {
      fireEvent.click(importBtn)
    })

    // Expect FAQ & Policy clarifications to answer user questions
    expect(screen.getByText(/ข้อมูลจะซ้ำไหม\? \(Zero Duplicate\)/i)).toBeInTheDocument()
    expect(screen.getByText(/จะแทนที่ทั้งหมดไหม\? \(Mode Choice\)/i)).toBeInTheDocument()
    expect(screen.getByText(/อัปเดตและเพิ่มใหม่ \(Upsert \/ Merge\)/i)).toBeInTheDocument()
    expect(screen.getByText(/แทนที่ข้อมูลทั้งหมด \(Full Replace \/ Overwrite\)/i)).toBeInTheDocument()
  })

  it('loads sample CSV data and generates validation preview with zero duplicates', async () => {
    renderWithProviders(<Roster />)

    // Open import modal
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /นำเข้าไฟล์ CSV/i }))
    })

    // Click load sample data
    const loadSampleBtn = screen.getByRole('button', { name: /โหลดข้อมูลตัวอย่าง/i })
    act(() => {
      fireEvent.click(loadSampleBtn)
    })

    // Expect to switch to preview tab and show summary
    expect(screen.getByText(/2\. ตรวจสอบพรีวิว/i)).toBeInTheDocument()
    expect(screen.getAllByText(/6631503001/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/6631503002/i).length).toBeGreaterThan(0)

    // Confirm button should be enabled
    const commitBtn = screen.getByRole('button', { name: /ยืนยันการนำเข้า/i })
    expect(commitBtn).toBeInTheDocument()

    // Click commit
    await act(async () => {
      fireEvent.click(commitBtn)
    })

    // Modal should close on success
    expect(screen.queryByText(/2\. ตรวจสอบพรีวิว/i)).not.toBeInTheDocument()
  })

  it('performs store batch import in Upsert mode without deleting unaffected students or duplicating records', async () => {
    let storeRef: any
    function TestComponent() {
      storeRef = useStore()
      return <div data-testid="active-count">{storeRef.roster.filter((r: any) => r.isActive).length}</div>
    }

    renderWithProviders(<TestComponent />)

    const initialRosterLength = storeRef.roster.filter((r: any) => r.isActive).length
    expect(initialRosterLength).toBeGreaterThan(0)

    // Student 6631503001 already exists in mock data
    const samplePayload = [
      { studentCode: '6631503001', advisorCodeOrEmail: 'ADV002', notes: 'Reassigned' },
      { studentCode: '6631503001', advisorCodeOrEmail: 'ADV003', notes: 'Duplicate row in same file' },
    ]

    let result: any
    await act(async () => {
      result = storeRef.batchImportRoster(samplePayload, 'upsert')
    })

    // Expect duplicate detection to skip the 2nd row
    expect(result.skippedCount).toBe(1)
    expect(result.updatedCount).toBe(1)
    expect(result.errors.length).toBeGreaterThanOrEqual(1)
    expect(result.errors[0]).toContain('ปรากฏซ้ำ')

    // Verify student 6631503001 has exactly 1 active assignment
    const activeAssignments = storeRef.roster.filter(
      (r: any) => r.isActive && r.studentId === 'STU001'
    )
    expect(activeAssignments.length).toBe(1)
    expect(activeAssignments[0].advisorId).toBe('ADV002')
  })

  it('performs store batch import in Replace mode replacing all active entries', async () => {
    let storeRef: any
    function TestComponent() {
      storeRef = useStore()
      return <div data-testid="replace-count">{storeRef.roster.filter((r: any) => r.isActive).length}</div>
    }

    renderWithProviders(<TestComponent />)

    const singlePairPayload = [
      { studentCode: '6631503001', advisorCodeOrEmail: 'ADV001', notes: 'Sole survivor' },
    ]

    let result: any
    await act(async () => {
      result = storeRef.batchImportRoster(singlePairPayload, 'replace')
    })

    expect(result.mode).toBe('replace')
    const activeRoster = storeRef.roster.filter((r: any) => r.isActive)
    expect(activeRoster.length).toBe(1)
    expect(activeRoster[0].studentId).toBe('STU001')
  })

})
