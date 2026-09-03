// ============================================================
// AdvisingLog — Fake SSO Login Page
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types'
import { GraduationCap, Users, BarChart3, Shield, ChevronRight } from 'lucide-react'

const roleConfig: Record<UserRole, { label: string; description: string; icon: React.ReactNode; redirect: string }> = {
  student: { label: 'Student', description: 'View advising dashboard, submit requests, track follow-ups', icon: <GraduationCap className="h-5 w-5" />, redirect: '/student' },
  advisor: { label: 'Advisor', description: 'Manage sessions, write logs, create referrals and early warnings', icon: <Users className="h-5 w-5" />, redirect: '/advisor' },
  qa_chair: { label: 'Program Chair / QA', description: 'View aggregate statistics, review exit cases, generate reports', icon: <BarChart3 className="h-5 w-5" />, redirect: '/qa' },
  admin: { label: 'Admin', description: 'Manage users, roster, categories, and system configuration', icon: <Shield className="h-5 w-5" />, redirect: '/admin' },
}

export default function LoginPage() {
  const { login, getDemoUsers } = useAuth()
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const demoGroups = getDemoUsers()
  const selectedGroup = demoGroups.find(g => g.role === selectedRole)

  function handleLogin(userId: string) {
    login(userId)
    if (selectedRole) {
      navigate(roleConfig[selectedRole].redirect)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 bg-indigo-600 text-white rounded-xl mb-4">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">AdvisingLog</h1>
          <p className="text-sm text-slate-500 mt-1">Student Advising System</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              {selectedRole ? 'Select Demo User' : 'Select Role to Sign In'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedRole
                ? `Choose a ${roleConfig[selectedRole].label} account to continue`
                : 'This is a prototype using simulated SSO authentication'}
            </p>
          </div>

          {/* Role selection */}
          {!selectedRole && (
            <div className="divide-y divide-slate-100">
              {(Object.keys(roleConfig) as UserRole[]).map(role => {
                const config = roleConfig[role]
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{config.label}</p>
                      <p className="text-xs text-slate-500 truncate">{config.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          )}

          {/* User selection */}
          {selectedRole && selectedGroup && (
            <div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {selectedGroup.users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleLogin(user.id)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0 text-xs font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.code}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Back to role selection
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Prototype environment. No real authentication is performed.
        </p>
      </div>
    </div>
  )
}
