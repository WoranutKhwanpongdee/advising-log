// ============================================================
// Advisor Dashboard — REG MFU Academic Information Style
// ============================================================

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { PageHeader, StatCard, Card, StatusBadge, EmptyState, Button, AdvisorCohortBanner } from '@/components/ui'
import { FileEdit, CalendarClock, ListChecks, UserX, AlertTriangle, Clock, ArrowRight } from 'lucide-react'

export default function AdvisorDashboard() {
  const { currentUser } = useAuth()
  const { t, language, getCategoryLabel } = useLanguage()
  const store = useStore()
  const navigate = useNavigate()
  if (!currentUser) return null

  const myAdvisees = store.roster.filter(r => r.advisorId === currentUser.id && r.isActive)
  const myRequests = store.requests.filter(r => r.advisorId === currentUser.id)
  const pendingRequests = myRequests.filter(r => r.status === 'requested' || r.status === 'pending')
  const upcomingApts = store.appointments.filter(a => a.advisorId === currentUser.id && a.status === 'scheduled')
  const myFollowUps = store.followUps.filter(f => f.advisorId === currentUser.id && f.status !== 'completed')
  const myExitCases = store.exitCases.filter(e => e.advisorId === currentUser.id && e.status !== 'closed')
  const myWarnings = store.earlyWarnings.filter(w => w.advisorId === currentUser.id && w.status === 'active')
  const recentSessions = store.sessions.filter(s => s.advisorId === currentUser.id).slice(0, 5)

  return (
    <div>
      {/* Advisor Cohort Banner (REG MFU Academic Portal Style) */}
      <AdvisorCohortBanner
        advisor={currentUser}
        adviseeCount={myAdvisees.length || 18}
        school={currentUser.department ? (language === 'th' ? 'สำนักวิชาเทคโนโลยีสารสนเทศ' : 'School of Information Technology') : undefined}
        semester={t('1/2569', 'Semester 1 / Academic Year 2026')}
      />

      <PageHeader
        title={t('ระบบบริหารการให้คำปรึกษาทางวิชาการ', 'Advisor Academic Console')}
        description={t('ภาพรวมคำร้องขอเข้าพบ ตารางนัดหมาย และการติดตามผลนักศึกษาในความดูแล ภาคการศึกษา 1/2569', 'Overview of advising petitions, upcoming sessions, and advisee academic tracking for Semester 1/2026.')}
        actions={
          <Button onClick={() => navigate('/advisor/sessions')}>
            <CalendarClock className="h-4 w-4 mr-1.5" />
            {t('จัดการการให้คำปรึกษา', 'Manage Sessions')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label={t('คำร้องรอการตอบรับ', 'Pending Requests')} value={pendingRequests.length} icon={<FileEdit className="h-5 w-5" />} color="amber" />
        <StatCard label={t('นัดหมายที่ยืนยันแล้ว', 'Upcoming Sessions')} value={upcomingApts.length} icon={<CalendarClock className="h-5 w-5" />} color="sky" />
        <StatCard label={t('งานติดตามผลค้างอยู่', 'Open Follow-ups')} value={myFollowUps.length} icon={<ListChecks className="h-5 w-5" />} color="sky" />
        <StatCard label={t('เคสขอลาพัก/ลาออก', 'Active Exit Cases')} value={myExitCases.length} icon={<UserX className="h-5 w-5" />} color="red" />
        <StatCard label={t('เคสเตือนภัยวิชาการ', 'Early Warnings')} value={myWarnings.length} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <Card>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileEdit className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('คำร้องขอรับคำปรึกษาที่รอดำเนินการ', 'Pending Advising Requests')}
            </h3>
            {pendingRequests.length > 0 && (
              <button onClick={() => navigate('/advisor/sessions')} className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer">
                {t('ดูทั้งหมด', 'View all')} <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
          {pendingRequests.length > 0 ? (
            <div className="space-y-2">
              {pendingRequests.map(r => {
                const student = store.users.find(u => u.id === r.studentId)
                const catLabel = getCategoryLabel(r.category)
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-xl cursor-pointer hover:bg-sky-50/40 dark:hover:bg-slate-800/80 hover:border-sky-200/60 dark:hover:border-sky-500/30 transition-all duration-150"
                    onClick={() => navigate('/advisor/sessions')}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{student?.name} <span className="text-slate-400 dark:text-slate-400 font-normal">({student?.code})</span></p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{catLabel}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState title={t('ไม่มีคำร้องที่รอดำเนินการ', 'No pending requests')} description={t('คำร้องขอคำปรึกษาของนักศึกษาทั้งหมดได้รับการดำเนินการแล้ว', 'All submitted student requests have been processed.')} />
          )}
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3.5 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('ตารางนัดหมายที่กำลังจะมาถึง', 'Upcoming Appointments')}
          </h3>
          {upcomingApts.length > 0 ? (
            <div className="space-y-2">
              {upcomingApts.map(a => {
                const student = store.users.find(u => u.id === a.studentId)
                return (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{student?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3 w-3 text-sky-600 dark:text-sky-400" /> {a.scheduledDate} · {a.scheduledTime} · {a.location}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState title={t('ไม่มีนัดหมายในเร็วๆ นี้', 'No upcoming appointments')} description={t('ไม่มีตารางนัดหมายที่กำหนดไว้สำหรับช่วงเวลานี้', 'No scheduled appointments for the upcoming days.')} />
          )}
        </Card>

        {/* Active Early Warnings */}
        <Card>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" /> {t('รายการเตือนภัยวิชาการที่กำลังติดตาม', 'Active Early Warnings')}
            </h3>
            {myWarnings.length > 0 && (
              <button onClick={() => navigate('/advisor/warnings')} className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer">
                {t('ดูทั้งหมด', 'View all')} <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
          {myWarnings.length > 0 ? (
            <div className="space-y-2">
              {myWarnings.map(w => {
                const student = store.users.find(u => u.id === w.studentId)
                return (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-xl cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors"
                    onClick={() => navigate('/advisor/warnings')}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{student?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize mt-0.5">{w.warningType.replace(/_/g, ' ')}</p>
                    </div>
                    <StatusBadge status={w.severity} />
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState title={t('ไม่มีเคสเตือนภัยวิชาการ', 'No active warnings')} description={t('นักศึกษาทุกคนมีสถานภาพทางวิชาการและการเข้าเรียนเป็นปกติ', 'All student early warning cases are resolved.')} />
          )}
        </Card>

        {/* Recent Sessions */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3.5 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('ประวัติการให้คำปรึกษาล่าสุด', 'Recent Advising Sessions')}
          </h3>
          {recentSessions.length > 0 ? (
            <div className="space-y-2">
              {recentSessions.map(s => {
                const student = store.users.find(u => u.id === s.studentId)
                return (
                  <div key={s.id} className="p-3 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{student?.name}</p>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">{s.sessionDate}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-relaxed">{s.summary}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState title={t('ไม่มีประวัติการให้คำปรึกษา', 'No recent sessions')} description={t('บันทึกการให้คำปรึกษาที่เสร็จสิ้นจะปรากฏที่นี่', 'Completed session records will be listed here.')} />
          )}
        </Card>
      </div>
    </div>
  )
}


