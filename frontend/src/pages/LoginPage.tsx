// ============================================================
// AdvisingLog — Login Page (Username + Password)
// ============================================================

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { ThemeToggle } from '@/components/ui'
import { GraduationCap, Sparkles, Eye, EyeOff, LogIn } from 'lucide-react'

// Map each role to its default route
const ROLE_REDIRECT: Record<string, string> = {
  student: '/student',
  advisor: '/advisor',
  qa_chair: '/qa',
  admin: '/admin',
}

export default function LoginPage() {
  const { login } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError(t('กรุณากรอกชื่อผู้ใช้', 'Please enter your username'))
      return
    }
    if (!password) {
      setError(t('กรุณากรอกรหัสผ่าน', 'Please enter your password'))
      return
    }

    setLoading(true)
    const success = login(username.trim(), password)
    setLoading(false)

    if (success) {
      // Determine role from logged-in user — re-read from context after login
      // We navigate based on username prefix as a quick heuristic; the
      // AuthContext already resolved the actual user object.
      const id = username.trim().toUpperCase()
      if (id.startsWith('STU')) navigate(ROLE_REDIRECT.student)
      else if (id.startsWith('ADV')) navigate(ROLE_REDIRECT.advisor)
      else if (id.startsWith('QA')) navigate(ROLE_REDIRECT.qa_chair)
      else if (id.startsWith('ADM')) navigate(ROLE_REDIRECT.admin)
      else navigate('/')
    } else {
      setError(t('ไม่พบผู้ใช้งาน กรุณาตรวจสอบชื่อผู้ใช้', 'User not found. Please check your username.'))
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] bg-dot-pattern flex flex-col items-center justify-center p-4 sm:p-6 relative">

      {/* Top-right: language switch + theme toggle */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <div className="flex items-center text-[11px] font-bold bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage('th')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              language === 'th' ? 'bg-sky-600 text-white shadow-xs font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            ภาษาไทย
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              language === 'en' ? 'bg-sky-600 text-white shadow-xs font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            English
          </button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-0.5">
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-sm z-10">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            {t('ระบบอาจารย์ที่ปรึกษาและประกันคุณภาพการศึกษา', 'University Academic Advising System')}
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-600/20 ring-4 ring-sky-100 dark:ring-sky-950">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans" aria-label="AdvisingLog">
              Advising<span className="text-sky-600 dark:text-sky-400">Log</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t('ระบบบริหารจัดการการให้คำปรึกษาและติดตามคุณภาพนักศึกษา', 'Institutional Student Success & Quality Assurance Platform')}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl dark:shadow-none overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/50">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('เข้าสู่ระบบ', 'Sign In')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('กรุณากรอกชื่อผู้ใช้และรหัสผ่านของคุณ', 'Enter your username and password to continue')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('ชื่อผู้ใช้', 'Username')}
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder={t('เช่น STU001, ADV001', 'e.g. STU001, ADV001')}
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('รหัสผ่าน', 'Password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder={t('รหัสผ่าน (ใส่อะไรก็ได้)', 'Any value accepted for now')}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-sm font-bold shadow-md shadow-sky-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              <LogIn className="h-4 w-4" />
              {loading ? t('กำลังเข้าสู่ระบบ…', 'Signing in…') : t('เข้าสู่ระบบ', 'Sign In')}
            </button>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-4 bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 rounded-2xl px-4 py-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
          <p className="font-semibold text-slate-600 dark:text-slate-300">{t('บัญชีทดสอบ', 'Demo accounts')}</p>
          <p>{t('นักศึกษา:', 'Students:')} STU001 – STU010</p>
          <p>{t('อาจารย์:', 'Advisors:')} ADV001 – ADV003</p>
          <p>{t('ประกันคุณภาพ:', 'QA Chair:')} QA001</p>
          <p>{t('ผู้ดูแล:', 'Admin:')} ADM001</p>
          <p className="mt-1 italic">{t('รหัสผ่าน: ใส่อะไรก็ได้', 'Password: anything works')}</p>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-4 font-medium">
          {t('ระบบจำลองการยืนยันตัวตน · ข้อมูลความลับทางการศึกษา', 'Protected Student Information · Local Authentication Simulation')}
        </p>
      </div>
    </div>
  )
}
