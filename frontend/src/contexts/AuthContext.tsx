// ============================================================
// AdvisingLog — Auth Context (Google OAuth & Demo Switcher)
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { mockUsers } from '@/data/mock-data'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  /** Returns true on success, false if userId not found */
  login: (userId: string, _password?: string) => boolean
  /** Login with Google ID Token credential */
  loginWithGoogle: (credential: string) => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('advising_log_auth_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {}
    }
    return null
  })

  const login = useCallback((userId: string, _password?: string): boolean => {
    const user = mockUsers.find(u => u.id === userId.toUpperCase())
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('advising_log_auth_user', JSON.stringify(user))
      return true
    }
    return false
  }, [])

  const loginWithGoogle = useCallback(async (credential: string): Promise<User | null> => {
    try {
      // 1. Try calling Backend Hono API
      const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8787'
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })

      if (res.ok) {
        const data = await res.json() as { success: boolean; user?: User }
        if (data.success && data.user) {
          setCurrentUser(data.user)
          localStorage.setItem('advising_log_auth_user', JSON.stringify(data.user))
          return data.user
        }
      }
    } catch (_err) {
      // Backend offline fallback: Decode client-side directly
    }

    try {
      const parts = credential.split('.')
      if (parts.length >= 2) {
        const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const decoded = JSON.parse(atob(payloadBase64))
        const email = decoded.email || ''
        const name = decoded.name || 'Google User'
        const googleId = decoded.sub || `${Date.now()}`

        let role: User['role'] = 'advisor'
        if (email.includes('student') || /^\d/.test(email)) {
          role = 'student'
        } else if (email.includes('admin') || email.includes('affairs')) {
          role = 'admin'
        } else if (email.includes('qa') || email.includes('chair') || email.includes('dean')) {
          role = 'qa_chair'
        }

        const newUser: User = {
          id: `${role === 'student' ? 'STU' : role === 'admin' ? 'ADM' : role === 'qa_chair' ? 'QA' : 'ADV'}_${googleId.substring(0, 6)}`,
          code: email.split('@')[0].toUpperCase(),
          name,
          email,
          role,
          department: 'School of Applied Digital Technology (ADT)',
          isActive: true,
          hasAiAccess: role === 'advisor' || role === 'qa_chair' || role === 'admin',
          createdAt: new Date().toISOString().split('T')[0],
        }

        setCurrentUser(newUser)
        localStorage.setItem('advising_log_auth_user', JSON.stringify(newUser))
        return newUser
      }
    } catch {}

    return null
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem('advising_log_auth_user')
  }, [])

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      loginWithGoogle,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
