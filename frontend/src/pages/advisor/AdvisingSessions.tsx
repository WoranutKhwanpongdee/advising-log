// Advisor — Advising Sessions
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, Tabs, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import type { AdvisingRequest } from '@/types'

export default function AdvisingSessions() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const [tab, setTab] = useState('pending')
  const [selectedReq, setSelectedReq] = useState<AdvisingRequest | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [schedDate, setSchedDate] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [schedLoc, setSchedLoc] = useState('')

  if (!currentUser) return null

  const myRequests = store.requests.filter(r => r.advisorId === currentUser.id)
  const filterMap: Record<string, string[]> = {
    pending: ['requested', 'pending'],
    upcoming: ['scheduled'],
    completed: ['completed', 'closed'],
    cancelled: ['cancelled'],
  }
  const filtered = myRequests.filter(r => filterMap[tab]?.includes(r.status))

  const tabs = [
    { value: 'pending', label: 'Pending', count: myRequests.filter(r => ['requested', 'pending'].includes(r.status)).length },
    { value: 'upcoming', label: 'Upcoming', count: myRequests.filter(r => r.status === 'scheduled').length },
    { value: 'completed', label: 'Completed', count: myRequests.filter(r => ['completed', 'closed'].includes(r.status)).length },
    { value: 'cancelled', label: 'Cancelled', count: myRequests.filter(r => r.status === 'cancelled').length },
  ]

  function handleAccept(req: AdvisingRequest) {
    store.updateRequestStatus(req.id, 'pending')
    addToast('success', 'Request Accepted', 'You can now schedule an appointment.')
  }

  function handleSchedule() {
    if (!selectedReq || !schedDate || !schedTime || !schedLoc) return
    const apt = store.addAppointment({ requestId: selectedReq.id, studentId: selectedReq.studentId, advisorId: currentUser!.id, scheduledDate: schedDate, scheduledTime: schedTime, location: schedLoc, status: 'scheduled' })
    store.updateRequestStatus(selectedReq.id, 'scheduled')
    store.addNotification({ userId: selectedReq.studentId, type: 'info', title: 'Appointment Scheduled', message: `Your advising appointment has been scheduled for ${schedDate} at ${schedTime} in ${schedLoc}.`, relatedId: apt.id, isRead: false })
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'appointment_scheduled', description: `Scheduled appointment for ${store.users.find(u => u.id === selectedReq.studentId)?.name}`, targetId: apt.id })
    addToast('success', 'Appointment Scheduled')
    setShowSchedule(false)
    setSelectedReq(null)
    setSchedDate(''); setSchedTime(''); setSchedLoc('')
  }

  function handleCancel(req: AdvisingRequest) {
    store.updateRequestStatus(req.id, 'cancelled')
    const apt = store.appointments.find(a => a.requestId === req.id && a.status === 'scheduled')
    if (apt) store.updateAppointmentStatus(apt.id, 'cancelled')
    addToast('info', 'Request Cancelled')
  }

  function handleComplete(req: AdvisingRequest) {
    store.updateRequestStatus(req.id, 'completed')
    const apt = store.appointments.find(a => a.requestId === req.id && a.status === 'scheduled')
    if (apt) store.updateAppointmentStatus(apt.id, 'completed')
    addToast('success', 'Marked as Completed', 'You can now write an advising log.')
  }

  const columns = [
    { key: 'student', header: 'Student', render: (r: AdvisingRequest) => {
      const s = store.users.find(u => u.id === r.studentId)
      return <div><p className="text-xs font-medium">{s?.name}</p><p className="text-[11px] text-slate-400">{s?.code}</p></div>
    }},
    { key: 'category', header: 'Category', render: (r: AdvisingRequest) => <span className="text-xs">{ADVISING_CATEGORIES.find(c => c.value === r.category)?.label}</span> },
    { key: 'date', header: 'Requested', render: (r: AdvisingRequest) => <span className="text-xs">{r.createdAt}</span> },
    { key: 'preferred', header: 'Preferred', render: (r: AdvisingRequest) => <span className="text-xs">{r.preferredDate} {r.preferredTime}</span> },
    { key: 'status', header: 'Status', render: (r: AdvisingRequest) => <StatusBadge status={r.status} /> },
    { key: 'actions', header: 'Actions', render: (r: AdvisingRequest) => (
      <div className="flex gap-1">
        {r.status === 'requested' && <Button size="sm" onClick={() => handleAccept(r)}>Accept</Button>}
        {(r.status === 'requested' || r.status === 'pending') && <Button size="sm" variant="secondary" onClick={() => { setSelectedReq(r); setShowSchedule(true) }}>Schedule</Button>}
        {r.status === 'scheduled' && <Button size="sm" onClick={() => handleComplete(r)}>Complete</Button>}
        {r.status !== 'completed' && r.status !== 'cancelled' && r.status !== 'closed' && <Button size="sm" variant="ghost" onClick={() => handleCancel(r)}>Cancel</Button>}
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Advising Sessions" description="Manage student advising requests and appointments." />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <DataTable columns={columns} data={filtered} emptyMessage={`No ${tab} sessions.`} />

      {/* Schedule Modal */}
      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule Appointment" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
            <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
            <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
            <input type="text" value={schedLoc} onChange={e => setSchedLoc(e.target.value)} placeholder="e.g. Room S2-301" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowSchedule(false)}>Cancel</Button>
            <Button onClick={handleSchedule}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
