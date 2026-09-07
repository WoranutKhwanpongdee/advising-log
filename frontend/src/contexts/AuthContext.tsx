// ============================================================
// AdvisingLog — Auth Context (Fake SSO)
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, UserRole } from '@/types'
import { mockUsers } from '@/data/mock-data'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  login: (userId: string) => void
  logout: () => void
  getDemoUsers: () => { role: UserRole; users: User[] }[]
}

const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const login = useCallback((userId: string) => {
    const user = mockUsers.find(u => u.id === userId)
    if (user) setCurrentUser(user)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const getDemoUsers = useCallback(() => {
    const roles: UserRole[] = ['student', 'advisor', 'qa_chair', 'admin']
    return roles.map(role => ({
      role,
      users: mockUsers.filter(u => u.role === role),
    }))
  }, [])

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      logout,
      getDemoUsers,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
