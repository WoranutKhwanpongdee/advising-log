// ============================================================
// AdvisingLog — Premium University Login Page
// Modern Split-Screen Glassmorphism with Google SSO & Security Badges
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { ThemeToggle } from '@/components/ui'
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Lock,
  AlertCircle,
  Building2,
  Users2,
  TrendingUp,
} from 'lucide-react'

// Map each role to its default route
const ROLE_REDIRECT: Record<string, string> = {
  student: '/student',
  advisor: '/advisor',
  qa_chair: '/qa',
  admin: '/admin',
}

export default function LoginPage() {
  const { loginWithGoogle } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function redirectForRole(role: string) {
    if (role === 'student') navigate(ROLE_REDIRECT.student)
    else if (role === 'advisor') navigate(ROLE_REDIRECT.advisor)
    else if (role === 'qa_chair') navigate(ROLE_REDIRECT.qa_chair)
    else if (role === 'admin') navigate(ROLE_REDIRECT.admin)
    else navigate('/')
  }

  // Account-Chooser Sign In (forces Google Account Picker every time via prompt: select_account)
  const handleGoogleSelectAccount = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('')
      setLoading(true)
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        if (!userInfoRes.ok) {
          throw new Error('Failed to fetch user profile')
        }
        const userInfo = await userInfoRes.json()

        // Escape unicode characters to ASCII sequences so btoa / atob decode cleanly without Latin1 errors
        const safeJson = JSON.stringify(userInfo).replace(/[\u007f-\uffff]/g, c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4))
        const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
        const payload = btoa(safeJson)
        const syntheticJwt = `${header}.${payload}.signature`

        const result = await loginWithGoogle(syntheticJwt)
        setLoading(false)
        if (result.success && result.user) {
          redirectForRole(result.user.role)
        } else {
          setError(result.message || t('ไม่สามารถเข้าสู่ระบบด้วย Google ได้', 'Failed to sign in with Google account.'))
        }
      } catch {
        setLoading(false)
        setError(t('เกิดข้อผิดพลาดในการเชื่อมต่อ Google', 'Error connecting to Google OAuth service.'))
      }
    },
    onError: () => {
      setLoading(false)
      setError(t('การยืนยันตัวตนกับ Google ล้มเหลว', 'Google Authentication Failed'))
    },
    prompt: 'select_account',
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060a12] flex flex-col lg:flex-row text-slate-900 dark:text-slate-100 selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-200">
      
      {/* ------------------------------------------------------------- */}
      {/* Left / Hero Showcase Panel (Desktop) */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden bg-gradient-to-br from-[#060c18] via-[#09152e] to-[#0f244a] text-white p-12 xl:p-16 flex-col justify-between border-r border-sky-900/30">
        {/* Background glow orbs & geometric elements */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

        {/* Top brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 ring-4 ring-sky-500/20">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white block leading-none" aria-label="AdvisingLog">
                Advising<span className="text-sky-400">Log</span>
              </h1>
              <span className="text-[11px] font-semibold text-sky-200/70 uppercase tracking-widest mt-1 block">
                Academic Advisory & Quality Assurance
              </span>
            </div>
          </div>
        </div>

        {/* Center: Value Propositions & High-Impact Cards */}
        <div className="relative z-10 my-auto py-12 max-w-xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold backdrop-blur-md shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>{t('ระบบบริหารการให้คำปรึกษาทางวิชาการ มฟล.', 'Mae Fah Luang University Academic Portal')}</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
              {t(
                'ยกระดับการดูแลนักศึกษา และการประกันคุณภาพการศึกษาแบบครบวงจร',
                'Empowering Student Success, Faculty Advisory & AUN-QA Quality Assurance'
              )}
            </h2>
            <p className="text-sm xl:text-base text-sky-100/75 leading-relaxed font-normal">
              {t(
                'แพลตฟอร์มศูนย์กลางสำหรับการนัดหมาย ให้คำปรึกษา ติดตามผลนักศึกษา และวิเคราะห์สถิติการคงอยู่ของนักศึกษาด้วยระบบ AI อัจฉริยะ',
                'Institutional platform for academic advising records, follow-up tracking, early risk interventions, and qualitative AI retention insights.'
              )}
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                  <Users2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('จัดสรรอาจารย์ที่ปรึกษา', 'Advisor Cohorts')}</h4>
                  <p className="text-[11px] text-sky-200/60 mt-0.5">{t('จัดการรายชื่อ นศ. ในความดูแล', 'Direct advisee roster management')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('ประกันคุณภาพ AUN-QA', 'AUN-QA Criteria')}</h4>
                  <p className="text-[11px] text-sky-200/60 mt-0.5">{t('วิเคราะห์สถิติและการคงอยู่', 'Retention & student voice analytics')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Institutional Info */}
        <div className="relative z-10 pt-6 border-t border-sky-900/40 flex items-center justify-between text-xs text-sky-200/60 font-medium">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-sky-400" />
            <span>School of Applied Digital Technology (ADT)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{t('ความปลอดภัยมาตรฐาน PDPA', 'PDPA & SIS Compliant')}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Right / Interactive Auth Panel */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto w-full relative">
        
        {/* Top Actions: Language switcher & Theme toggle */}
        <div className="flex items-center justify-between pb-6 sm:pb-8">
          {/* Mobile Logo Branding (Shown on small screens) */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
              Advising<span className="text-sky-600 dark:text-sky-400">Log</span>
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Language switch */}
            <div className="flex items-center text-[11px] font-bold bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('th')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'th'
                    ? 'bg-sky-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                ไทย
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-sky-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme toggle */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-0.5">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="my-auto space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {t('เข้าสู่ระบบ', 'Sign in to AdvisingLog')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t(
                'กรุณาใช้บัญชี Google สถาบันเพื่อเข้าสู่ระบบงานให้คำปรึกษา',
                'Please use your institutional university account to access academic advising.'
              )}
            </p>
          </div>

          {/* Primary Google SSO Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-none space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-indigo-500" />
            
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {t('ยืนยันตัวตนด้วย Google Single Sign-On', 'Institutional Google SSO')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('รองรับอีเมล @mfu.ac.th และ @lamduan.mfu.ac.th', 'Accepts @mfu.ac.th, @student.mfu.ac.th, @lamduan.mfu.ac.th')}
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950/60" />
            </div>

            {/* Google OAuth Button Container */}
            <div className="space-y-3">
              {/* Primary Account-Chooser Button: Always prompts Google to let user select any account */}
              <button
                type="button"
                onClick={() => handleGoogleSelectAccount()}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 active:bg-slate-100 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {t('ลงชื่อเข้าใช้ด้วย Google (เลือกบัญชีได้)', 'Sign in with Google (Choose Account)')}
                </span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{t('เปิดหน้าต่างให้เลือกบัญชี Google ทุกครั้ง ไม่ล็อคบัญชีเริ่มต้น', 'Opens account chooser every time so you can pick any account')}</span>
              </div>
            </div>

            {/* Error Alert Box */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/80 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold">{t('ไม่สามารถเข้าสู่ระบบได้', 'Authentication Denied')}</p>
                  <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-300/90">{error}</p>
                </div>
              </div>
            )}

            {/* Policy badge */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-slate-400" />
                {t('ระบบความปลอดภัยระดับสถาบัน', 'Secure Encrypted SSO')}
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold">
                OAuth 2.0 / OIDC
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center text-[11px] text-slate-400 dark:text-slate-500 space-y-1 font-medium">
          <p>© 2026 Mae Fah Luang University · School of Applied Digital Technology</p>
          <p>{t('ระบบงานให้คำปรึกษาและประกันคุณภาพการศึกษาตามเกณฑ์ AUN-QA', 'University Academic Advisory & AUN-QA Quality Assurance System')}</p>
        </div>
      </div>
    </div>
  )
}
