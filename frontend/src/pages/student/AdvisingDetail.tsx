// ============================================================
// Student — Advising Detail
// ============================================================

import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/data/mock-store'
import { PageHeader, Card, StatusBadge, Timeline, EmptyState } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function AdvisingDetail() {
  const { id } = useParams<{ id: string }>()
  const store = useStore()
  const navigate = useNavigate()

  const request = store.requests.find(r => r.id === id)
  if (!request) return <EmptyState title="Request not found" />

  const advisor = store.users.find(u => u.id === request.advisorId)
  const appointment = store.appointments.find(a => a.requestId === request.id)
  const session = store.sessions.find(s => s.requestId === request.id)
  const followUps = store.followUps.filter(f => f.requestId === request.id)
  const catLabel = ADVISING_CATEGORIES.find(c => c.value === request.category)?.label || request.category

  // Build timeline
  const timelineItems = [
    { date: request.createdAt, title: 'Request Submitted', description: catLabel, status: 'requested' },
  ]
  if (appointment) {
    timelineItems.push({ date: appointment.createdAt, title: `Appointment ${appointment.status === 'scheduled' ? 'Scheduled' : appointment.status}`, description: `${appointment.scheduledDate} at ${appointment.scheduledTime}, ${appointment.location}`, status: appointment.status })
  }
  if (session) {
    timelineItems.push({ date: session.sessionDate, title: 'Session Completed', description: session.summary, status: 'completed' })
  }
  followUps.forEach(fu => {
    timelineItems.push({ date: fu.createdAt, title: `Follow-up: ${fu.task}`, description: `Due: ${fu.dueDate}`, status: fu.status })
  })

  return (
    <div className="max-w-3xl">
      <div className="mb-4">
        <button onClick={() => navigate('/student/history')} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to History
        </button>
      </div>

      <PageHeader title={catLabel} actions={<StatusBadge status={request.status} />} />

      <div className="space-y-5">
        {/* Request details */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Request Details</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-slate-400">Request ID</span><p className="font-medium text-slate-900">{request.id}</p></div>
            <div><span className="text-slate-400">Advisor</span><p className="font-medium text-slate-900">{advisor?.name || '-'}</p></div>
            <div><span className="text-slate-400">Preferred Date</span><p className="font-medium text-slate-900">{request.preferredDate}</p></div>
            <div><span className="text-slate-400">Preferred Time</span><p className="font-medium text-slate-900">{request.preferredTime}</p></div>
          </div>
          <div className="mt-3">
            <span className="text-xs text-slate-400">Details</span>
            <p className="text-sm text-slate-700 mt-0.5">{request.details}</p>
          </div>
          {request.attachments.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-slate-400">Attachments</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.attachments.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">{f}</span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Session log */}
        {session && (
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Advising Session Log</h3>
            <div className="space-y-2 text-xs">
              <div><span className="text-slate-400">Summary</span><p className="text-slate-700">{session.summary}</p></div>
              <div><span className="text-slate-400">Advice Provided</span><p className="text-slate-700">{session.advice}</p></div>
              <div><span className="text-slate-400">Outcome</span><p className="text-slate-700">{session.outcome}</p></div>
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Timeline</h3>
          <Timeline items={timelineItems} />
        </Card>

        {/* Follow-ups */}
        {followUps.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Follow-ups</h3>
            <div className="space-y-2">
              {followUps.map(fu => (
                <div key={fu.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                  <div>
                    <p className="text-xs font-medium text-slate-900">{fu.task}</p>
                    <p className="text-[11px] text-slate-400">Due: {fu.dueDate}</p>
                  </div>
                  <StatusBadge status={fu.status} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
