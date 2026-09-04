// ============================================================
// AdvisingLog — Auth Context
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { mockUsers } from '@/data/mock-data'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  loginWithCredentials: (username: string, password: string) => Promise<User | null>
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

  const loginWithCredentials = useCallback(async (username: string, password: string): Promise<User | null> => {
    // Demo authentication: accept any valid user ID with any password
    // For testing, you can use any user ID like STU001, ADV001, QA001, ADM001, etc.
    const user = mockUsers.find(u => u.id.toLowerCase() === username.toLowerCase())
    
    if (user) {
      // Accept any password for demo purposes
      setCurrentUser(user)
      return user
    }
    
    return null
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      loginWithCredentials,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
