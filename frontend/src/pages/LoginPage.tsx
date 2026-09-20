// ============================================================
// AdvisingLog — Premium University Login Page
// Modern Split-Screen Glassmorphism with Google SSO & Security Badges
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { ThemeToggle } from '@/components/ui'
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
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
  const { login, loginWithGoogle } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDemoSection, setShowDemoSection] = useState(false)

  function redirectForRole(role: string) {
    if (role === 'student') navigate(ROLE_REDIRECT.student)
    else if (role === 'advisor') navigate(ROLE_REDIRECT.advisor)
    else if (role === 'qa_chair') navigate(ROLE_REDIRECT.qa_chair)
    else if (role === 'admin') navigate(ROLE_REDIRECT.admin)
    else navigate('/')
  }

  async function handleGoogleSuccess(credentialResponse: any) {
    if (!credentialResponse?.credential) return
    setError('')
    setLoading(true)
    try {
      const result = await loginWithGoogle(credentialResponse.credential)
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
  }

  function handleDemoQuickLogin(id: string) {
    setError('')
    setLoading(true)
    const success = login(id, 'demo')
    setLoading(false)
    if (success) {
      if (id.startsWith('STU')) navigate(ROLE_REDIRECT.student)
      else if (id.startsWith('ADV')) navigate(ROLE_REDIRECT.advisor)
      else if (id.startsWith('QA')) navigate(ROLE_REDIRECT.qa_chair)
      else if (id.startsWith('ADM')) navigate(ROLE_REDIRECT.admin)
    }
  }

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
            <div className="flex justify-center py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl relative">
              {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 rounded-2xl flex items-center justify-center z-10">
                  <div className="h-5 w-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError(t('การยืนยันตัวตนกับ Google ล้มเหลว', 'Google Authentication Failed'))}
                useOneTap={false}
                theme="outline"
                shape="pill"
                size="large"
                text="signin_with"
              />
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

          {/* Divider with Secondary / Quick Demo Switcher */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowDemoSection(v => !v)}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer border-b border-dashed border-slate-200 dark:border-slate-800"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5 text-sky-500" />
                <span>{t('ทดสอบระบบด่วน (1-Click Quick Demo Preview)', '1-Click Quick Demo Role Switcher')}</span>
              </span>
              {showDemoSection ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {/* Collapsible 1-Click Demo Pills */}
            {showDemoSection && (
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {t('เลือกบทบาทเพื่อเข้าชมตัวอย่าง', 'Select Role to Preview')}
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">{t('คลิกเพื่อเข้าใช้งานทันที', 'Click to switch instantly')}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDemoQuickLogin('STU001')}
                    className="p-3 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                  >
                    <span className="block text-sky-600 dark:text-sky-400 text-[10px] uppercase font-mono font-extrabold group-hover:scale-105 transition-transform">Student</span>
                    <span className="truncate block font-semibold text-slate-800 dark:text-slate-100 mt-0.5">Somchai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoQuickLogin('ADV001')}
                    className="p-3 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                  >
                    <span className="block text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-mono font-extrabold group-hover:scale-105 transition-transform">Advisor</span>
                    <span className="truncate block font-semibold text-slate-800 dark:text-slate-100 mt-0.5">Dr. Prasit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoQuickLogin('QA001')}
                    className="p-3 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                  >
                    <span className="block text-violet-600 dark:text-violet-400 text-[10px] uppercase font-mono font-extrabold group-hover:scale-105 transition-transform">QA Chair</span>
                    <span className="truncate block font-semibold text-slate-800 dark:text-slate-100 mt-0.5">Assoc. Rattana</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoQuickLogin('ADM001')}
                    className="p-3 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                  >
                    <span className="block text-rose-600 dark:text-rose-400 text-[10px] uppercase font-mono font-extrabold group-hover:scale-105 transition-transform">Admin</span>
                    <span className="truncate block font-semibold text-slate-800 dark:text-slate-100 mt-0.5">Supattra</span>
                  </button>
                </div>
              </div>
            )}
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
