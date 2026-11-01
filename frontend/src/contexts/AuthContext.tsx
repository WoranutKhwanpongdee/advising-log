// ============================================================
// AdvisingLog — Auth Context (Fake SSO with LocalStorage Persistence)
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { mockUsers } from '@/data/mock-data'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  /** Returns true on success, false if userId not found */
  login: (userId: string, _password: string) => boolean
  logout: () => void
}

const AUTH_STORAGE_KEY = 'advising_log_current_user'

function getInitialUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    const exists = mockUsers.find(u => u.id === parsed.id)
    return exists || parsed
  } catch (err) {
    console.warn('Failed to restore auth session from localStorage:', err)
    return null
  }
}

const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(getInitialUser)

  // Password is ignored for now — any value works
  const login = useCallback((userId: string, _password: string): boolean => {
    const user = mockUsers.find(u => u.id === userId.toUpperCase())
    if (user) {
      setCurrentUser(user)
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } catch (err) {
        console.warn('Failed to save auth to localStorage:', err)
      }
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (err) {
      console.warn('Failed to remove auth from localStorage:', err)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
