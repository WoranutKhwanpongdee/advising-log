// ============================================================
// AdvisingLog — Fake SSO Login Page (Elevated Minimal White & Sky Blue)
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import type { UserRole } from '@/types'
import { GraduationCap, Users, BarChart3, Shield, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { login, getDemoUsers } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const roleConfig: Record<UserRole, { label: string; description: string; icon: React.ReactNode; redirect: string; tag: string }> = {
    student: {
      label: t('ระบบนักศึกษา', 'Student Portal'),
      description: t('ยื่นคำร้องขอคำปรึกษา ติดตามบันทึก และจัดการงานที่ได้รับมอบหมาย', 'Submit advising petitions, track logs & complete action items'),
      icon: <GraduationCap className="h-5 w-5" />,
      redirect: '/student',
      tag: t('นักศึกษา', 'Advisees'),
    },
    advisor: {
      label: t('ระบบอาจารย์ที่ปรึกษา', 'Faculty Advisor Portal'),
      description: t('จัดการนัดหมาย บันทึกผลการเข้าพบ ส่งต่อหน่วยงาน และแจ้งเตือนวิชาการ', 'Schedule sessions, record notes, dispatch referrals & warnings'),
      icon: <Users className="h-5 w-5" />,
      redirect: '/advisor',
      tag: t('อาจารย์', 'Faculty'),
    },
    qa_chair: {
      label: t('ระบบประกันคุณภาพ & ประธานหลักสูตร', 'QA & Program Chair'),
      description: t('รายงานผลการให้คำปรึกษา สถิติแนวโน้ม และทบทวนเคสขอลาออก', 'Accreditation reporting, persistence metrics & exit reviews'),
      icon: <BarChart3 className="h-5 w-5" />,
      redirect: '/qa',
      tag: t('ผู้บริหาร', 'Leadership'),
    },
    admin: {
      label: t('ระบบผู้ดูแลระบบ', 'System Administration'),
      description: t('จัดการสิทธิ์ผู้ใช้ จัดสรรคู่ที่ปรึกษา และตรวจสอบประวัติระบบ', 'User access tiers, roster cohort mapping & audit trails'),
      icon: <Shield className="h-5 w-5" />,
      redirect: '/admin',
      tag: t('ผู้ดูแล', 'Operations'),
    },
  }

  const demoGroups = getDemoUsers()
  const selectedGroup = demoGroups.find(g => g.role === selectedRole)

  function handleLogin(userId: string) {
    login(userId)
    if (selectedRole) {
      navigate(roleConfig[selectedRole].redirect)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-dot-pattern flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Top right language switch */}
      <div className="absolute top-6 right-6 z-20 flex items-center text-[11px] font-bold bg-white p-1 rounded-xl border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setLanguage('th')}
          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
            language === 'th' ? 'bg-sky-600 text-white shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          ภาษาไทย
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
            language === 'en' ? 'bg-sky-600 text-white shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          English
        </button>
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-semibold mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" /> {t('ระบบอาจารย์ที่ปรึกษาและประกันคุณภาพการศึกษา', 'University Academic Advising System')}
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-600/20 ring-4 ring-sky-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              Advising<span className="text-sky-600">Log</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t('ระบบบริหารจัดการการให้คำปรึกษาและติดตามคุณภาพนักศึกษา', 'Institutional Student Success & Quality Assurance Platform')}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {selectedRole
                  ? t(`เข้าสู่ระบบในบทบาท ${roleConfig[selectedRole].label}`, `Sign in as ${roleConfig[selectedRole].label}`)
                  : t('เลือกบทบาทในการเข้าใช้งาน', 'Select Access Workspace')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedRole
                  ? t('คลิกเลือกบัญชีตัวอย่างเพื่อเข้าสู่ระบบ', 'Click a demo persona below to enter the role workspace')
                  : t('เลือกประเภทผู้ใช้งานเพื่อจำลองการยืนยันตัวตน SSO', 'Select an institutional persona to authenticate via mock SSO')}
              </p>
            </div>
            {selectedRole && (
              <button
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {t('ย้อนกลับ', 'Back')}
              </button>
            )}
          </div>

          {/* Role selection */}
          {!selectedRole && (
            <div className="p-3 sm:p-4 space-y-2">
              {(Object.keys(roleConfig) as UserRole[]).map(role => {
                const config = roleConfig[role]
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left border border-slate-100 hover:border-sky-300/80 hover:bg-sky-50/30 hover:shadow-xs transition-all duration-200 group cursor-pointer"
                  >
                    <div className="h-11 w-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/80 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all duration-200 shadow-2xs">
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-sky-950 transition-colors">{config.label}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-sky-100 group-hover:text-sky-800 transition-colors">
                          {config.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{config.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          )}

          {/* User selection */}
          {selectedRole && selectedGroup && (
            <div className="p-3 sm:p-4 space-y-2 max-h-96 overflow-y-auto">
              {selectedGroup.users.map(user => {
                const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                return (
                  <button
                    key={user.id}
                    onClick={() => handleLogin(user.id)}
                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-100 text-left hover:bg-sky-50/40 hover:border-sky-300/70 transition-all duration-200 group cursor-pointer shadow-2xs"
                  >
                    <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-xs font-bold text-sky-700 flex-shrink-0 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all duration-200 shadow-2xs">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight group-hover:text-sky-950 transition-colors">{user.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{user.code} {user.department ? `· ${user.department}` : ''}</p>
                    </div>
                    <span className="text-xs font-semibold text-sky-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-2xs">
                      {t('เข้าสู่ระบบ', 'Enter')} <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-5 font-medium">
          {t('ระบบจำลองการยืนยันตัวตน · ข้อมูลความลับทางการศึกษา', 'Protected Student Information · Local Authentication Simulation')}
        </p>
      </div>
    </div>
  )
}



