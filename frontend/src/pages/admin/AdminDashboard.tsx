// ============================================================
// AdvisingLog — Admin Dashboard (Ultra-Modern, High-End SaaS)
// ============================================================

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { PageHeader, Card, Button } from '@/components/ui'
import {
  Users,
  BookOpen,
  Shield,
  FolderCog,
  ScrollText,
  ShieldCheck,
  Database,
  Server,
  FileCog,
  Tag,
  ArrowRight,
  Activity,
  Sparkles,
  Clock,
  CloudLightning,
  UserCheck,
  ChevronRight,
  CheckCircle2,
  HardDrive,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '@/types'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [auditFilter, setAuditFilter] = useState<'all' | 'login' | 'roster' | 'request'>('all')

  if (!currentUser) return null

  // User breakdown
  const totalUsers = store.users.length
  const totalStudents = store.users.filter(u => u.role === 'student').length
  const totalAdvisors = store.users.filter(u => u.role === 'advisor').length
  const totalQAChairs = store.users.filter(u => u.role === 'qa_chair').length
  const totalAdmins = store.users.filter(u => u.role === 'admin').length

  // Roster & Configuration stats
  const activeRosterCount = store.roster.filter(r => r.isActive).length
  const totalCategories = store.categoryConfigs.length
  const totalDocTypes = store.documentTypes.length

  // Percentages for role distribution bar
  const studentPct = totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 100) : 0
  const advisorPct = totalUsers > 0 ? Math.round((totalAdvisors / totalUsers) * 100) : 0
  const qaPct = totalUsers > 0 ? Math.round((totalQAChairs / totalUsers) * 100) : 0
  const adminPct = totalUsers > 0 ? Math.max(0, 100 - studentPct - advisorPct - qaPct) : 0

  // Chart Theme configuration for dark/light
  const chartTheme = {
    tooltipBg: isDark ? '#0e1424' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    tooltipText: isDark ? '#f8fafc' : '#0f172a',
  }

  // Role chart data for Donut Pie
  const roleChartData = [
    { name: t('นักศึกษา', 'Students'), value: totalStudents, color: '#0284c7' },
    { name: t('อาจารย์ที่ปรึกษา', 'Advisors'), value: totalAdvisors, color: '#10b981' },
    { name: t('ประกันคุณภาพ', 'QA Chairs'), value: totalQAChairs, color: '#a855f7' },
    { name: t('ผู้ดูแลระบบ', 'Admins'), value: totalAdmins, color: '#6366f1' },
  ].filter(d => d.value > 0)

  // Filtered audit logs
  const filteredLogs = store.auditLogs
    .filter(log => {
      if (auditFilter === 'login') return log.action.toLowerCase().includes('login')
      if (auditFilter === 'roster') return log.action.toLowerCase().includes('roster')
      if (auditFilter === 'request') {
        return (
          log.action.toLowerCase().includes('request') ||
          log.action.toLowerCase().includes('session') ||
          log.action.toLowerCase().includes('document')
        )
      }
      return true
    })
    .slice(0, 6)

  // Recent 5 Users
  const recentUsers = store.users.slice(0, 5)

  // Role metadata helper
  const roleMeta: Record<UserRole, { labelTh: string; labelEn: string; color: string; bg: string }> = {
    student: {
      labelTh: 'นักศึกษา',
      labelEn: 'Student',
      color: 'text-sky-700 dark:text-sky-300',
      bg: 'bg-sky-50 dark:bg-sky-500/12 border-sky-200/70 dark:border-sky-500/25',
    },
    advisor: {
      labelTh: 'อาจารย์ที่ปรึกษา',
      labelEn: 'Faculty Advisor',
      color: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200/70 dark:border-emerald-500/25',
    },
    qa_chair: {
      labelTh: 'ประกันคุณภาพ',
      labelEn: 'QA Chair',
      color: 'text-purple-700 dark:text-purple-300',
      bg: 'bg-purple-50 dark:bg-purple-500/12 border-purple-200/70 dark:border-purple-500/25',
    },
    admin: {
      labelTh: 'ผู้ดูแลระบบ',
      labelEn: 'System Admin',
      color: 'text-indigo-700 dark:text-indigo-300',
      bg: 'bg-indigo-50 dark:bg-indigo-500/12 border-indigo-200/70 dark:border-indigo-500/25',
    },
  }

  // Quick module hub cards with top gradient lines
  const adminModules = [
    {
      title: t('จัดการผู้ใช้งาน', 'User Management'),
      desc: t('ตรวจสอบบัญชี กำหนดบทบาท และจัดการข้อมูลผู้ใช้งาน', 'Manage accounts, roles, and user authentications.'),
      count: `${totalUsers} ${t('บัญชี', 'Accounts')}`,
      icon: <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
      topGradient: 'from-sky-500 to-blue-600',
      tagColor: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/12 border-sky-200/60 dark:border-sky-500/30',
      borderColor: 'hover:border-sky-300 dark:hover:border-sky-500/50',
      to: '/admin/users',
    },
    {
      title: t('จัดสรรอาจารย์ที่ปรึกษา', 'Student-Advisor Roster'),
      desc: t('จับคู่อาจารย์ที่ปรึกษากับนักศึกษา และดูแลความครอบคลุม', 'Pair advisors with advisees and track caseload distribution.'),
      count: `${activeRosterCount} ${t('คู่ในระบบ', 'Pairings')}`,
      icon: <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      topGradient: 'from-emerald-500 to-teal-600',
      tagColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200/60 dark:border-emerald-500/30',
      borderColor: 'hover:border-emerald-300 dark:hover:border-emerald-500/50',
      to: '/admin/roster',
    },
    {
      title: t('หมวดหมู่คำปรึกษา', 'Categories Configuration'),
      desc: t('ปรับแต่ง taxonomy หัวข้อการให้คำปรึกษา และระยะเวลาบริการ', 'Configure advising topics, subcategories, and service metrics.'),
      count: `${totalCategories} ${t('หมวดหมู่', 'Categories')}`,
      icon: <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      topGradient: 'from-purple-500 to-indigo-600',
      tagColor: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/12 border-purple-200/60 dark:border-purple-500/30',
      borderColor: 'hover:border-purple-300 dark:hover:border-purple-500/50',
      to: '/admin/categories',
    },
    {
      title: t('ประเภทเอกสาร', 'Document Types'),
      desc: t('ตั้งค่าแบบฟอร์มคำร้อง ประเภทไฟล์ และรูปแบบการลงนาม', 'Define request forms, allowed file formats, and signatures.'),
      count: `${totalDocTypes} ${t('ประเภท', 'Types')}`,
      icon: <FileCog className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      topGradient: 'from-amber-500 to-orange-600',
      tagColor: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/12 border-amber-200/60 dark:border-amber-500/30',
      borderColor: 'hover:border-amber-300 dark:hover:border-amber-500/50',
      to: '/admin/document-types',
    },
    {
      title: t('ประวัติการทำงานระบบ', 'Security Audit Logs'),
      desc: t('บันทึกความปลอดภัย ตรวจสอบการทำรายการ และการเข้าถึงระบบ', 'Trace administrative actions, user logins, and data changes.'),
      count: `${store.auditLogs.length} ${t('เหตุการณ์', 'Events')}`,
      icon: <ScrollText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      topGradient: 'from-indigo-500 to-sky-600',
      tagColor: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/12 border-indigo-200/60 dark:border-indigo-500/30',
      borderColor: 'hover:border-indigo-300 dark:hover:border-indigo-500/50',
      to: '/admin/audit-logs',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title={t('ระบบบริหารจัดการผู้ดูแลระบบ', 'System Administration')}
        description={t(
          'จัดการสิทธิ์ผู้ใช้งาน จัดสรรคู่ที่ปรึกษา ตรวจสอบหมวดหมู่ และติดตามความปลอดภัยของระบบ',
          'Manage user permissions, student-advisor roster mapping, system configuration, and infrastructure telemetry.'
        )}
        actions={
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>
              <Users className="h-4 w-4 mr-1.5" />
              {t('จัดการผู้ใช้', 'Users')}
            </Button>
            <Button onClick={() => navigate('/admin/roster')}>
              <FolderCog className="h-4 w-4 mr-1.5" />
              {t('จัดสรรคู่ที่ปรึกษา', 'Manage Roster')}
            </Button>
          </div>
        }
      />

      {/* Hero Welcome & Live Telemetry Banner */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-blue-50/50 dark:from-[#0e1424] dark:via-[#10182b] dark:to-[#0c1222] border border-sky-200/80 dark:border-slate-800/90 shadow-sm dark:shadow-premium transition-all">
        {/* Ambient decorative glow orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sky-500/10 dark:bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-52 h-52 rounded-full bg-indigo-500/10 dark:bg-indigo-500/12 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-600/30 ring-4 ring-sky-100 dark:ring-sky-400/20">
              <Shield className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {t('ยินดีต้อนรับ ผู้ดูแลระบบ (Admin Console)', 'Welcome to Admin Console')}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-500/25 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20" />
                  {t('ระบบทำงานปกติ 100%', 'All Systems Operational')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 max-w-2xl leading-relaxed">
                {t(
                  'ควบคุมและดูแลแพลตฟอร์มคำปรึกษาทางวิชาการ มหาวิทยาลัยแม่ฟ้าหลวง ภาคการศึกษา 1/2569 ข้อมูลทั้งหมดได้รับการเข้ารหัสและซิงค์กับ Cloudflare Edge',
                  'Supervise and control MFU Academic Advisory Platform for Semester 1/2026. All data is encrypted and synced with Cloudflare Edge services.'
                )}
              </p>
            </div>
          </div>

          {/* Quick Telemetry Pills */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-white/80 dark:bg-slate-800/80 border border-sky-200/70 dark:border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-2xs backdrop-blur-xs">
              <CloudLightning className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Cloudflare D1 & Hono Edge</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 px-3 py-1 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Bangkok Edge Node · 12ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid (Enhanced with Visual Trends) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-premium dark:hover:border-sky-500/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-xl bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-300 flex items-center justify-center ring-1 ring-sky-200/60 dark:ring-sky-500/25 shadow-2xs group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/12 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-500/25">
              100% {t('เปิดใช้งาน', 'Active')}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">{totalUsers}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('ผู้ใช้งานทั้งหมดในระบบ', 'Total Registered Users')}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{totalStudents} {t('นักศึกษา', 'Students')}</span>
            <span>·</span>
            <span>{totalAdvisors} {t('อาจารย์', 'Advisors')}</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-premium dark:hover:border-sky-500/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-xl bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-300 flex items-center justify-center ring-1 ring-sky-200/60 dark:ring-sky-500/25 shadow-2xs group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/12 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-500/25">
              {studentPct}% {t('สัดส่วนผู้ใช้', 'Share')}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">{totalStudents}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('นักศึกษาที่ลงทะเบียน', 'Active Students')}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{t('สำนักวิชา ADT', 'School of ADT')}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('ปกติ', 'Good')}</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-premium dark:hover:border-sky-500/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/12 text-emerald-600 dark:text-emerald-300 flex items-center justify-center ring-1 ring-emerald-200/60 dark:ring-emerald-500/25 shadow-2xs group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/25">
              {advisorPct}% {t('สัดส่วนผู้ใช้', 'Share')}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">{totalAdvisors}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('อาจารย์ที่ปรึกษา', 'Faculty Advisors')}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{t('อัตราส่วนเฉลี่ย', 'Avg Load')}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">~15 {t('คน/ท่าน', 'advisees')}</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-premium dark:hover:border-sky-500/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/12 text-emerald-600 dark:text-emerald-300 flex items-center justify-center ring-1 ring-emerald-200/60 dark:ring-emerald-500/25 shadow-2xs group-hover:scale-105 transition-transform">
              <FolderCog className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/25">
              {t('จับคู่สมบูรณ์', 'Mapped')}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">{activeRosterCount}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('คู่ที่ปรึกษาที่จัดสรรแล้ว', 'Roster Pairings')}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{t('ความครอบคลุม', 'Coverage')}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">100%</span>
          </div>
        </div>
      </div>

      {/* Admin Modules Quick Launch Panel */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            {t('ศูนย์รวมการจัดการระบบ (Admin Modules)', 'Administrative Modules & Hub')}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {adminModules.length} {t('โมดูลหลัก', 'Core Modules')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {adminModules.map(mod => (
            <div
              key={mod.to}
              onClick={() => navigate(mod.to)}
              className={`group relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800/80 ${mod.borderColor} shadow-xs hover:shadow-premium hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between`}
            >
              {/* Subtle top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mod.topGradient} opacity-90 group-hover:h-1.5 transition-all`} />

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {mod.icon}
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${mod.tagColor}`}>
                    {mod.count}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300">
                <span>{t('เปิดจัดการ', 'Access module')}</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Left (Audit Trail with Filters) & Right (Donut Chart + Infra Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Audit Trail (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <ScrollText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t('ประวัติการทำงานล่าสุดของระบบ', 'Recent System Audit Activity')}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {t('บันทึกการกระทำและเหตุการณ์ความปลอดภัยแบบเรียลไทม์', 'Real-time security and administrative events log')}
                    </p>
                  </div>
                </div>

                {/* Audit Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold">
                  <button
                    onClick={() => setAuditFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      auditFilter === 'all'
                        ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-2xs font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t('ทั้งหมด', 'All')}
                  </button>
                  <button
                    onClick={() => setAuditFilter('login')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      auditFilter === 'login'
                        ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-2xs font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t('ล็อกอิน', 'Logins')}
                  </button>
                  <button
                    onClick={() => setAuditFilter('roster')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      auditFilter === 'roster'
                        ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-2xs font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t('คู่ที่ปรึกษา', 'Roster')}
                  </button>
                  <button
                    onClick={() => setAuditFilter('request')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      auditFilter === 'request'
                        ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-2xs font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t('คำร้อง', 'Requests')}
                  </button>
                </div>
              </div>

              {/* Audit Event Items */}
              <div className="space-y-2.5">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => {
                    const role = roleMeta[log.userRole as UserRole] || roleMeta.admin
                    return (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800/70 hover:shadow-xs transition-all flex items-start gap-3"
                      >
                        {/* User Avatar */}
                        <div className="h-9 w-9 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200/70 dark:border-slate-600/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs mt-0.5">
                          {log.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {log.description}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex-shrink-0 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.createdAt.replace('T', ' ').substring(11, 16)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                              {log.userName}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${role.bg} ${role.color}`}>
                              {t(role.labelTh, role.labelEn)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">
                              · {log.action.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    {t('ไม่พบประวัติรายการในหมวดนี้', 'No log entries matching this filter')}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                {t('เก็บบันทึกตาม พ.ร.บ. PDPA และ AUN-QA', 'Complies with PDPA & AUN-QA audit standards')}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/admin/audit-logs')}
                className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
              >
                {t('ดูทั้งหมด', 'View all')} <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: User Demographics (Donut Chart) + Infra Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* User Role Distribution Card with Donut Chart */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                {t('สัดส่วนบทบาทผู้ใช้งาน (User Breakdown)', 'User Role Demographics')}
              </h3>
              <span className="text-xs font-extrabold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/12 px-2.5 py-0.5 rounded-full border border-sky-100 dark:border-sky-500/25">
                {totalUsers} {t('คน', 'total')}
              </span>
            </div>

            {/* Donut Chart with Center Label */}
            <div className="relative h-44 flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      color: chartTheme.tooltipText,
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.25)',
                    }}
                    itemStyle={{ color: chartTheme.tooltipText }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-sans">{totalUsers}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ผู้ใช้ทั้งหมด', 'Users')}</span>
              </div>
            </div>

            {/* Role breakdown grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    {t('นักศึกษา', 'Students')}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{totalStudents}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{studentPct}% {t('ของระบบ', 'share')}</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {t('อาจารย์', 'Advisors')}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{totalAdvisors}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{advisorPct}% {t('ของระบบ', 'share')}</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    {t('ประกันคุณภาพ', 'QA Chairs')}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{totalQAChairs}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{qaPct}% {t('ของระบบ', 'share')}</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {t('ผู้ดูแลระบบ', 'Admins')}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{totalAdmins}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{adminPct}% {t('ของระบบ', 'share')}</p>
              </div>
            </div>
          </Card>

          {/* Infrastructure Health Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {t('สถานะโครงสร้างพื้นฐานระบบ', 'Infrastructure & Telemetry')}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/25">
                <Activity className="h-3 w-3 animate-pulse" /> Live Telemetry
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Cloudflare D1 */}
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Cloudflare D1 Database
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      SQLite Edge Engine · 12ms
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('ปกติ', 'Healthy')}
                </span>
              </div>

              {/* Workers API Gateway */}
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Workers API Gateway (Hono)
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      Edge Routing · 99.98% Uptime
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('ออนไลน์', 'Online')}
                </span>
              </div>

              {/* Cloudinary Media Pipeline */}
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Cloudinary Media Pipeline
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      Signed URLs · PDPA Encrypted
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t('พร้อมใช้งาน', 'Ready')}
                </span>
              </div>

              {/* React Context State */}
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      In-Memory React State
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      Client Store Hydrated
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/12 px-2.5 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-500/25">
                  {t('ซิงค์แล้ว', 'Synced')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Recently Registered Users */}
      <Card>
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-50 dark:bg-sky-500/12 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t('ผู้ใช้งานล่าสุดในระบบ', 'Recently Registered / Active Users')}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {t('บัญชีผู้ใช้งานที่เปิดใช้งานและเข้าใช้งานล่าสุดในระบบ', 'Active accounts and role credentials')}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/admin/users')}
            className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
          >
            {t('จัดการผู้ใช้ทั้งหมด', 'Manage all users')} <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {recentUsers.map(user => {
            const role = roleMeta[user.role] || roleMeta.student
            return (
              <div
                key={user.id}
                className="group p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800/80 hover:border-sky-300/80 dark:hover:border-sky-500/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="h-9 w-9 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200/70 dark:border-slate-600/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${role.bg} ${role.color}`}>
                    {t(role.labelTh, role.labelEn)}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                    {user.code}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1">
                    {user.email}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
