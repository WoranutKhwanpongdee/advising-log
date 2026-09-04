// ============================================================
// AdvisingLog — Login Page
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { GraduationCap } from 'lucide-react'

const roleRoutes: Record<string, string> = {
  student: '/student',
  advisor: '/advisor',
  qa_chair: '/qa',
  admin: '/admin',
}

export default function LoginPage() {
  const { loginWithCredentials } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await loginWithCredentials(username, password)
      if (user) {
        const route = roleRoutes[user.role] || '/'
        navigate(route)
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your credentials to continue</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo info */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Demo mode: Use any user ID (e.g., <code className="bg-slate-100 px-1 rounded">STU001</code>, <code className="bg-slate-100 px-1 rounded">ADV001</code>, <code className="bg-slate-100 px-1 rounded">QA001</code>, <code className="bg-slate-100 px-1 rounded">ADM001</code>) with any password
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
