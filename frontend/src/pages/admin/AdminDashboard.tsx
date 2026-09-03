// ============================================================
// Admin — Dashboard (Minimal White & Sky Blue)
// ============================================================

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, StatCard, Card, Timeline, Button } from '@/components/ui'
import { Users, BookOpen, Shield, FolderCog, ScrollText, ShieldCheck, Database, Server, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { t } = useLanguage()
  const navigate = useNavigate()
  if (!currentUser) return null

  const totalUsers = store.users.length
  const totalStudents = store.users.filter(u => u.role === 'student').length
  const totalAdvisors = store.users.filter(u => u.role === 'advisor').length
  const activeRosterCount = store.roster.filter(r => r.isActive).length

  const recentActivity = store.auditLogs.slice(0, 8).map(log => ({
    date: log.createdAt.replace('T', ' ').substring(0, 16),
    title: log.description,
    description: `${log.userName} (${log.userRole.replace('_', ' ')})`,
  }))

  return (
    <div>
      <PageHeader
        title={t('ระบบบริหารจัดการผู้ดูแลระบบ', 'System Administration')}
        description={t('จัดการสิทธิ์ผู้ใช้งาน ตรวจสอบคู่ที่ปรึกษา-นักศึกษา และติดตามสถานะระบบ', 'User permissions, student-advisor roster mapping, and system health overview.')}
        actions={
          <Button onClick={() => navigate('/admin/roster')}>
            <FolderCog className="h-4 w-4 mr-1.5" /> {t('จัดการบัญชีคู่ที่ปรึกษา', 'Manage Roster')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label={t('ผู้ใช้งานทั้งหมดในระบบ', 'Total Registered Users')} value={totalUsers} icon={<Users className="h-5 w-5" />} color="sky" />
        <StatCard label={t('นักศึกษาที่ลงทะเบียน', 'Active Students')} value={totalStudents} icon={<BookOpen className="h-5 w-5" />} color="sky" />
        <StatCard label={t('อาจารย์ที่ปรึกษา', 'Faculty Advisors')} value={totalAdvisors} icon={<Shield className="h-5 w-5" />} color="sky" />
        <StatCard label={t('คู่ที่ปรึกษาที่จับคู่แล้ว', 'Roster Pairings')} value={activeRosterCount} icon={<FolderCog className="h-5 w-5" />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-sky-600" /> {t('ประวัติการทำงานล่าสุดของระบบ', 'Recent System Audit Activity')}
          </h3>
          <Timeline items={recentActivity} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> {t('สถานะโครงสร้างพื้นฐานระบบ', 'Infrastructure & Integration Health')}
            </h3>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-2.5">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <Database className="h-4 w-4 text-sky-600" /> Cloudflare D1 Database
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-xs border border-emerald-100">
                  {t('ปกติ (Healthy)', 'Healthy')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-2.5">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <Server className="h-4 w-4 text-sky-600" /> In-Memory State & React Store
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-xs border border-emerald-100">
                  {t('ซิงค์ข้อมูลแล้ว', 'Synchronized')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-2.5">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <Server className="h-4 w-4 text-sky-600" /> Workers API Gateway (Hono)
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-xs border border-emerald-100">
                  {t('ออนไลน์', 'Online')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm pt-1">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-600" /> Notification Queue (Simulated)
                </span>
                <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-full text-xs border border-sky-100">
                  {t('ทำงานอยู่', 'Active')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

