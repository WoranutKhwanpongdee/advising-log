// ============================================================
// AdvisingLog — Auth Context (Fake SSO)
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

const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Password is ignored for now — any value works
  const login = useCallback((userId: string, _password: string): boolean => {
    const user = mockUsers.find(u => u.id === userId.toUpperCase())
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
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
