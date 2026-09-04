import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { StoreProvider } from '@/data/mock-store'
import { ToastProvider } from '@/contexts/ToastContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import StudentVoiceSurvey from '@/pages/student/StudentVoiceSurvey'
import QADashboard from '@/pages/qa/QADashboard'

// Mock currentUser as student STU001
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('@/contexts/AuthContext')>('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      currentUser: {
        id: 'STU001',
        code: '6631503001',
        name: 'Somchai Jaidee',
        email: 'somchai.j@student.mfu.ac.th',
        role: 'student',
        department: 'School of Applied Digital Technology (ADT)',
        isActive: true,
        createdAt: '2024-06-01',
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
            <ToastProvider>
              {ui}
            </ToastProvider>
          </StoreProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('Student Voice Feature', () => {
  it('renders the Student Voice voluntary survey page with all core sections and AUN-QA banner', () => {
    renderWithProviders(<StudentVoiceSurvey />)

    // Heading and voluntary disclaimer
    expect(screen.getByRole('heading', { name: /เสียงของนักศึกษา/i })).toBeInTheDocument()
    expect(screen.getByText(/AUN-QA Criteria 6 & 8/i)).toBeInTheDocument()
    expect(screen.getByText(/แบบสอบถามโดยสมัครใจ/i)).toBeInTheDocument()

    // Core sections
    expect(screen.getByRole('heading', { name: /ข้อมูลสถานะและการไม่ระบุตัวตน/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /ปัจจัยสำคัญที่มีผลต่อการตัดสินใจ/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /การประเมินประสบการณ์การเรียนรู้/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /เล่าด้วยคำพูดของตนเอง/i })).toBeInTheDocument()
  })

  it('allows student to toggle anonymous mode and select factors', async () => {
    renderWithProviders(<StudentVoiceSurvey />)

    const anonButton = screen.getByText(/ระบุตัวตนนักศึกษา/i)
    act(() => {
      fireEvent.click(anonButton)
    })
    expect(screen.getByText(/โหมดไม่ระบุตัวตน/i)).toBeInTheDocument()

    // Select a factor
    const factorBtn = screen.getByText(/ปัญหาทางการเงินและค่าครองชีพ/i)
    act(() => {
      fireEvent.click(factorBtn)
    })

    // Type open feedback
    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThanOrEqual(3)
    act(() => {
      fireEvent.change(textareas[0], { target: { value: 'อยากให้มีทุนสนับสนุนฉุกเฉิน' } })
    })
    expect(textareas[0]).toHaveValue('อยากให้มีทุนสนับสนุนฉุกเฉิน')

    // Submit survey
    const submitBtn = screen.getByRole('button', { name: /ส่งแบบสอบถามเสียงของนักศึกษา/i })
    act(() => {
      fireEvent.click(submitBtn)
    })

    // Expect success thank you screen
    expect(screen.getByText(/ขอบคุณสำหรับทุกเสียงสะท้อนของคุณ/i)).toBeInTheDocument()
  })

  it('renders Student Voice tab and metrics in QA Dashboard', () => {
    renderWithProviders(<QADashboard />)

    // Check tab button exists
    const tabBtn = screen.getByRole('button', { name: /เสียงของนักศึกษา/i })
    expect(tabBtn).toBeInTheDocument()

    // Switch to Student Voice tab
    act(() => {
      fireEvent.click(tabBtn)
    })

    // Check qualitative analysis view
    expect(screen.getByText(/ข้อมูลเชิงคุณภาพเสียงของนักศึกษา/i)).toBeInTheDocument()
    expect(screen.getByText(/ความพึงพอใจต่อหลักสูตร/i)).toBeInTheDocument()
    expect(screen.getByText(/เสียงสะท้อนและความคิดเห็นของนักศึกษา/i)).toBeInTheDocument()
  })
})
