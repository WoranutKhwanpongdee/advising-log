// Advisor Dashboard
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useNavigate } from 'react-router-dom'
import { PageHeader, StatCard, Card, StatusBadge, EmptyState } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import { FileEdit, CalendarClock, ListChecks, UserX, AlertTriangle, Clock } from 'lucide-react'

export default function AdvisorDashboard() {
  const { currentUser } = useAuth()
  const store = useStore()
  const navigate = useNavigate()
  if (!currentUser) return null

  const myRequests = store.requests.filter(r => r.advisorId === currentUser.id)
  const pendingRequests = myRequests.filter(r => r.status === 'requested' || r.status === 'pending')
  const upcomingApts = store.appointments.filter(a => a.advisorId === currentUser.id && a.status === 'scheduled')
  const myFollowUps = store.followUps.filter(f => f.advisorId === currentUser.id && f.status !== 'completed')
  const myExitCases = store.exitCases.filter(e => e.advisorId === currentUser.id && e.status !== 'closed')
  const myWarnings = store.earlyWarnings.filter(w => w.advisorId === currentUser.id && w.status === 'active')
  const recentSessions = store.sessions.filter(s => s.advisorId === currentUser.id).slice(0, 5)

  return (
    <div>
      <PageHeader title={`Advisor Dashboard`} description={`Welcome, ${currentUser.name}`} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Pending Requests" value={pendingRequests.length} icon={<FileEdit className="h-5 w-5" />} color="amber" />
        <StatCard label="Upcoming" value={upcomingApts.length} icon={<CalendarClock className="h-5 w-5" />} color="blue" />
        <StatCard label="Follow-ups" value={myFollowUps.length} icon={<ListChecks className="h-5 w-5" />} color="indigo" />
        <StatCard label="Exit Cases" value={myExitCases.length} icon={<UserX className="h-5 w-5" />} color="red" />
        <StatCard label="Warnings" value={myWarnings.length} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Pending Advising Requests</h3>
          {pendingRequests.length > 0 ? (
            <div className="space-y-2">
              {pendingRequests.map(r => {
                const student = store.users.find(u => u.id === r.studentId)
                return (
                  <div key={r.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md cursor-pointer hover:bg-slate-100" onClick={() => navigate('/advisor/sessions')}>
                    <div>
                      <p className="text-xs font-medium text-slate-900">{student?.name} ({student?.code})</p>
                      <p className="text-[11px] text-slate-500">{ADVISING_CATEGORIES.find(c => c.value === r.category)?.label}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                )
              })}
            </div>
          ) : <EmptyState title="No pending requests" />}
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Upcoming Appointments</h3>
          {upcomingApts.length > 0 ? (
            <div className="space-y-2">
              {upcomingApts.map(a => {
                const student = store.users.find(u => u.id === a.studentId)
                return (
                  <div key={a.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
                    <div>
                      <p className="text-xs font-medium text-slate-900">{student?.name}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {a.scheduledDate} {a.scheduledTime} - {a.location}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                )
              })}
            </div>
          ) : <EmptyState title="No upcoming appointments" />}
        </Card>

        {/* Active Early Warnings */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Active Early Warnings</h3>
          {myWarnings.length > 0 ? (
            <div className="space-y-2">
              {myWarnings.map(w => {
                const student = store.users.find(u => u.id === w.studentId)
                return (
                  <div key={w.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md cursor-pointer hover:bg-slate-100" onClick={() => navigate('/advisor/warnings')}>
                    <div>
                      <p className="text-xs font-medium text-slate-900">{student?.name}</p>
                      <p className="text-[11px] text-slate-500">{w.warningType.replace(/_/g, ' ')}</p>
                    </div>
                    <StatusBadge status={w.severity} />
                  </div>
                )
              })}
            </div>
          ) : <EmptyState title="No active warnings" />}
        </Card>

        {/* Recent Sessions */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Advising Sessions</h3>
          {recentSessions.length > 0 ? (
            <div className="space-y-2">
              {recentSessions.map(s => {
                const student = store.users.find(u => u.id === s.studentId)
                return (
                  <div key={s.id} className="p-2.5 bg-slate-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-900">{student?.name}</p>
                      <span className="text-[11px] text-slate-400">{s.sessionDate}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{s.summary}</p>
                  </div>
                )
              })}
            </div>
          ) : <EmptyState title="No recent sessions" />}
        </Card>
      </div>
    </div>
  )
}
