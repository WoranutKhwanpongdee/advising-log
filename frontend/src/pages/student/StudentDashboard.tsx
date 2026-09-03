// ============================================================
// Student Dashboard
// ============================================================

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { PageHeader, StatCard, Card, StatusBadge, EmptyState } from '@/components/ui'
import { Calendar, Clock, User, ListChecks, Bell, FileEdit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ADVISING_CATEGORIES } from '@/types'

export default function StudentDashboard() {
  const { currentUser } = useAuth()
  const store = useStore()
  const navigate = useNavigate()

  if (!currentUser) return null

  // Find advisor
  const rosterEntry = store.roster.find(r => r.studentId === currentUser.id && r.isActive)
  const advisor = rosterEntry ? store.users.find(u => u.id === rosterEntry.advisorId) : null

  // My data
  const myRequests = store.requests.filter(r => r.studentId === currentUser.id)
  const myAppointments = store.appointments.filter(a => a.studentId === currentUser.id && a.status === 'scheduled')
  const myFollowUps = store.followUps.filter(f => f.studentId === currentUser.id && f.status !== 'completed')
  const myNotifications = store.notifications.filter(n => n.userId === currentUser.id && !n.isRead)

  const upcomingAppointment = myAppointments[0]
  const latestRequest = myRequests[0]

  return (
    <div>
      <PageHeader
        title={`Welcome, ${currentUser.name.split(' ')[0]}`}
        description="Your advising overview"
        actions={
          <button
            onClick={() => navigate('/student/request')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FileEdit className="h-4 w-4" />
            Request Advising
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Requests" value={myRequests.length} icon={<FileEdit className="h-5 w-5" />} color="indigo" />
        <StatCard label="Upcoming" value={myAppointments.length} icon={<Calendar className="h-5 w-5" />} color="blue" />
        <StatCard label="Pending Follow-ups" value={myFollowUps.length} icon={<ListChecks className="h-5 w-5" />} color="amber" />
        <StatCard label="Unread Notifications" value={myNotifications.length} icon={<Bell className="h-5 w-5" />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Advisor */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">My Advisor</h3>
            {advisor ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{advisor.name}</p>
                  <p className="text-xs text-slate-500">{advisor.department}</p>
                  <p className="text-xs text-slate-500">{advisor.email} {advisor.phone ? `/ ${advisor.phone}` : ''}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No advisor assigned yet. Please contact the admin office.</p>
            )}
          </Card>

          {/* Upcoming Appointment */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Upcoming Appointment</h3>
            {upcomingAppointment ? (
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{upcomingAppointment.scheduledDate}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {upcomingAppointment.scheduledTime}
                    </span>
                    <span className="text-xs text-slate-500">{upcomingAppointment.location}</span>
                  </div>
                  <StatusBadge status={upcomingAppointment.status} className="mt-1.5" />
                </div>
              </div>
            ) : (
              <EmptyState title="No upcoming appointments" description="Submit a new advising request to schedule one." />
            )}
          </Card>

          {/* Latest Advising */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Latest Advising Request</h3>
            {latestRequest ? (
              <div
                className="cursor-pointer hover:bg-slate-50 -m-2 p-2 rounded-md transition-colors"
                onClick={() => navigate(`/student/history/${latestRequest.id}`)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">
                    {ADVISING_CATEGORIES.find(c => c.value === latestRequest.category)?.label}
                  </p>
                  <StatusBadge status={latestRequest.status} />
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{latestRequest.details}</p>
                <p className="text-xs text-slate-400 mt-1">{latestRequest.createdAt}</p>
              </div>
            ) : (
              <EmptyState title="No advising records" description="You haven't submitted any advising requests yet." />
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Pending Follow-ups */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Pending Follow-ups</h3>
            {myFollowUps.length > 0 ? (
              <div className="space-y-2">
                {myFollowUps.slice(0, 5).map(fu => (
                  <div key={fu.id} className="p-2 bg-slate-50 rounded-md">
                    <p className="text-xs font-medium text-slate-900">{fu.task}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-slate-400">Due: {fu.dueDate}</span>
                      <StatusBadge status={fu.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No pending follow-ups</p>
            )}
          </Card>

          {/* Recent Notifications */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Notifications</h3>
            {myNotifications.length > 0 ? (
              <div className="space-y-2">
                {myNotifications.slice(0, 5).map(n => (
                  <div key={n.id} className="p-2 bg-slate-50 rounded-md">
                    <p className="text-xs font-medium text-slate-900">{n.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No new notifications</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
