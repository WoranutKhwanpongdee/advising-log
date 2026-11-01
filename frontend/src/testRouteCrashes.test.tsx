import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoreProvider } from '@/data/mock-store'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ErrorBoundary } from '@/components/ui'
import { useEffect } from 'react'

import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import App from '@/App'

import StudentDashboard from '@/pages/student/StudentDashboard'
import RequestAdvising from '@/pages/student/RequestAdvising'
import AdvisingHistory from '@/pages/student/AdvisingHistory'
import AdvisingDetail from '@/pages/student/AdvisingDetail'
import Documents from '@/pages/student/Documents'
import FollowUps from '@/pages/student/FollowUps'
import ExitForm from '@/pages/student/ExitForm'
import StudentVoiceSurvey from '@/pages/student/StudentVoiceSurvey'

import AdvisorDashboard from '@/pages/advisor/AdvisorDashboard'
import AdvisingSessions from '@/pages/advisor/AdvisingSessions'
import AdvisorLog from '@/pages/advisor/AdvisorLog'
import EarlyWarning from '@/pages/advisor/EarlyWarning'
import Referrals from '@/pages/advisor/Referrals'
import ExitCases from '@/pages/advisor/ExitCases'

import QADashboard from '@/pages/qa/QADashboard'
import ExitCaseReview from '@/pages/qa/ExitCaseReview'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import UserManagement from '@/pages/admin/UserManagement'
import Roster from '@/pages/admin/Roster'
import Categories from '@/pages/admin/Categories'
import DocumentTypes from '@/pages/admin/DocumentTypes'
import AuditLogs from '@/pages/admin/AuditLogs'

function WithProviders({ children, userId }: { children: React.ReactNode; userId?: string }) {
  function LoginHelper() {
    const { login } = useAuth()
    useEffect(() => {
      if (userId) {
        login(userId, 'pass')
      }
    }, [login])
    return <>{children}</>
  }

  return (
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <StoreProvider>
            <AuthProvider>
              <ToastProvider>
                <LoginHelper />
              </ToastProvider>
            </AuthProvider>
          </StoreProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

function CrashComponent(): React.ReactNode {
  throw new Error('Test forced crash during render')
}

describe('Test All Pages For Crash', () => {
  it('renders App root without crashing', () => {
    expect(() => render(<App />)).not.toThrow()
  })

  it('renders LoginPage', () => {
    expect(() => render(<WithProviders><LoginPage /></WithProviders>)).not.toThrow()
  })

  it('renders NotFoundPage without crashing', () => {
    render(<WithProviders><NotFoundPage /></WithProviders>)
    expect(screen.getByText(/404/i)).toBeInTheDocument()
  })

  // Student
  it('renders StudentDashboard', () => {
    expect(() => render(<WithProviders userId="STU001"><StudentDashboard /></WithProviders>)).not.toThrow()
  })
  it('renders RequestAdvising', () => {
    expect(() => render(<WithProviders userId="STU001"><RequestAdvising /></WithProviders>)).not.toThrow()
  })
  it('renders AdvisingHistory', () => {
    expect(() => render(<WithProviders userId="STU001"><AdvisingHistory /></WithProviders>)).not.toThrow()
  })
  it('renders AdvisingDetail', () => {
    expect(() => render(<WithProviders userId="STU001"><AdvisingDetail /></WithProviders>)).not.toThrow()
  })
  it('renders Documents', () => {
    expect(() => render(<WithProviders userId="STU001"><Documents /></WithProviders>)).not.toThrow()
  })
  it('renders FollowUps', () => {
    expect(() => render(<WithProviders userId="STU001"><FollowUps /></WithProviders>)).not.toThrow()
  })
  it('renders ExitForm', () => {
    expect(() => render(<WithProviders userId="STU001"><ExitForm /></WithProviders>)).not.toThrow()
  })
  it('renders StudentVoiceSurvey', () => {
    expect(() => render(<WithProviders userId="STU001"><StudentVoiceSurvey /></WithProviders>)).not.toThrow()
  })

  // Advisor
  it('renders AdvisorDashboard', () => {
    expect(() => render(<WithProviders userId="ADV001"><AdvisorDashboard /></WithProviders>)).not.toThrow()
  })
  it('renders AdvisingSessions', () => {
    expect(() => render(<WithProviders userId="ADV001"><AdvisingSessions /></WithProviders>)).not.toThrow()
  })
  it('renders AdvisorLog', () => {
    expect(() => render(<WithProviders userId="ADV001"><AdvisorLog /></WithProviders>)).not.toThrow()
  })
  it('renders EarlyWarning', () => {
    expect(() => render(<WithProviders userId="ADV001"><EarlyWarning /></WithProviders>)).not.toThrow()
  })
  it('renders Referrals', () => {
    expect(() => render(<WithProviders userId="ADV001"><Referrals /></WithProviders>)).not.toThrow()
  })
  it('renders ExitCases', () => {
    expect(() => render(<WithProviders userId="ADV001"><ExitCases /></WithProviders>)).not.toThrow()
  })

  // QA
  it('renders QADashboard', () => {
    expect(() => render(<WithProviders userId="QA001"><QADashboard /></WithProviders>)).not.toThrow()
  })
  it('renders ExitCaseReview', () => {
    expect(() => render(<WithProviders userId="QA001"><ExitCaseReview /></WithProviders>)).not.toThrow()
  })

  // Admin
  it('renders AdminDashboard', () => {
    expect(() => render(<WithProviders userId="ADM001"><AdminDashboard /></WithProviders>)).not.toThrow()
  })
  it('renders UserManagement', () => {
    expect(() => render(<WithProviders userId="ADM001"><UserManagement /></WithProviders>)).not.toThrow()
  })
  it('renders Roster', () => {
    expect(() => render(<WithProviders userId="ADM001"><Roster /></WithProviders>)).not.toThrow()
  })
  it('renders Categories', () => {
    expect(() => render(<WithProviders userId="ADM001"><Categories /></WithProviders>)).not.toThrow()
  })
  it('renders DocumentTypes', () => {
    expect(() => render(<WithProviders userId="ADM001"><DocumentTypes /></WithProviders>)).not.toThrow()
  })
  it('renders AuditLogs', () => {
    expect(() => render(<WithProviders userId="ADM001"><AuditLogs /></WithProviders>)).not.toThrow()
  })

  // ErrorBoundary tests
  it('ErrorBoundary catches render crashes and renders friendly recovery UI instead of blank screen', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <CrashComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText(/เกิดข้อผิดพลาดในการแสดงผลหน้านี้/i)).toBeInTheDocument()
    expect(screen.getByText(/ลองใหม่อีกครั้ง/i)).toBeInTheDocument()
    expect(screen.getByText(/กลับหน้าหลัก/i)).toBeInTheDocument()
    spy.mockRestore()
  })

  // AuthContext persistence test
  it('persists and restores authenticated user in localStorage', () => {
    localStorage.clear()
    function AuthTester() {
      const { currentUser, login, logout } = useAuth()
      return (
        <div>
          <span data-testid="user">{currentUser?.id || 'none'}</span>
          <button onClick={() => login('STU001', 'pass')}>Login</button>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )
    }

    const { unmount } = render(
      <AuthProvider>
        <AuthTester />
      </AuthProvider>
    )

    expect(screen.getByTestId('user').textContent).toBe('none')

    fireEvent.click(screen.getByText('Login'))
    expect(screen.getByTestId('user').textContent).toBe('STU001')
    expect(localStorage.getItem('advising_log_current_user')).toContain('STU001')

    unmount()

    // Re-mount to simulate page refresh
    render(
      <AuthProvider>
        <AuthTester />
      </AuthProvider>
    )
    expect(screen.getByTestId('user').textContent).toBe('STU001')

    fireEvent.click(screen.getByText('Logout'))
    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(localStorage.getItem('advising_log_current_user')).toBeNull()
  })
})
