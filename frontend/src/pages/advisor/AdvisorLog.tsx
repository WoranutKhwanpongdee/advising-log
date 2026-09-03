// Advisor — Advisor Log (write after session)
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, Card, Button, EmptyState } from '@/components/ui'

export default function AdvisorLog() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()

  const [selectedRequestId, setSelectedRequestId] = useState('')
  const [summary, setSummary] = useState('')
  const [problem, setProblem] = useState('')
  const [advice, setAdvice] = useState('')
  const [actionsTaken, setActionsTaken] = useState('')
  const [outcome, setOutcome] = useState('')
  const [followUpTask, setFollowUpTask] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  if (!currentUser) return null

  // Completed requests that don't have a session log yet
  const completedRequests = store.requests.filter(r =>
    r.advisorId === currentUser.id && r.status === 'completed' &&
    !store.sessions.find(s => s.requestId === r.id)
  )

  const selectedReq = store.requests.find(r => r.id === selectedRequestId)
  const student = selectedReq ? store.users.find(u => u.id === selectedReq.studentId) : null
  const appointment = selectedReq ? store.appointments.find(a => a.requestId === selectedReq.id) : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRequestId || !summary || !problem || !advice) {
      addToast('error', 'Validation Error', 'Please fill in required fields.')
      return
    }
    const session = store.addSession({
      requestId: selectedRequestId,
      appointmentId: appointment?.id || '',
      studentId: selectedReq!.studentId,
      advisorId: currentUser!.id,
      sessionDate: new Date().toISOString().split('T')[0],
      summary, problem, advice, actionsTaken, outcome,
    })
    store.updateRequestStatus(selectedRequestId, 'closed')
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'log_created', description: `Created advising log for ${student?.name}`, targetId: session.id })

    // Create follow-up if specified
    if (followUpTask && followUpDate) {
      const fu = store.addFollowUp({ sessionId: session.id, requestId: selectedRequestId, studentId: selectedReq!.studentId, advisorId: currentUser!.id, task: followUpTask, dueDate: followUpDate, status: 'pending' })
      store.addNotification({ userId: selectedReq!.studentId, type: 'action_required', title: 'New Follow-up', message: `Your advisor has assigned a follow-up: ${followUpTask}`, relatedId: fu.id, isRead: false })
      store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'followup_created', description: `Created follow-up for ${student?.name}: ${followUpTask}`, targetId: fu.id })
    }

    addToast('success', 'Advising Log Saved', 'The session record has been created.')
    setSelectedRequestId(''); setSummary(''); setProblem(''); setAdvice(''); setActionsTaken(''); setOutcome(''); setFollowUpTask(''); setFollowUpDate('')
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Advisor Log" description="Write an advising log after completing a session." />

      {completedRequests.length === 0 && !selectedRequestId ? (
        <Card><EmptyState title="No sessions to log" description="Complete an advising session first before writing a log." /></Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Session <span className="text-red-500">*</span></label>
              <select value={selectedRequestId} onChange={e => setSelectedRequestId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select a completed session</option>
                {completedRequests.map(r => {
                  const s = store.users.find(u => u.id === r.studentId)
                  return <option key={r.id} value={r.id}>{s?.name} ({s?.code}) - {r.category.replace(/_/g, ' ')}</option>
                })}
              </select>
            </div>

            {selectedReq && (
              <div className="p-3 bg-slate-50 rounded-md text-xs">
                <p><span className="text-slate-400">Student:</span> <span className="font-medium">{student?.name}</span></p>
                <p><span className="text-slate-400">Details:</span> {selectedReq.details}</p>
              </div>
            )}

            <div><label className="block text-sm font-medium text-slate-700 mb-1">Summary <span className="text-red-500">*</span></label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md resize-none" /></div>

            <div><label className="block text-sm font-medium text-slate-700 mb-1">Student Problem <span className="text-red-500">*</span></label>
            <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md resize-none" /></div>

            <div><label className="block text-sm font-medium text-slate-700 mb-1">Advice Provided <span className="text-red-500">*</span></label>
            <textarea value={advice} onChange={e => setAdvice(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md resize-none" /></div>

            <div><label className="block text-sm font-medium text-slate-700 mb-1">Actions Taken</label>
            <textarea value={actionsTaken} onChange={e => setActionsTaken(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md resize-none" /></div>

            <div><label className="block text-sm font-medium text-slate-700 mb-1">Outcome / Resolution</label>
            <textarea value={outcome} onChange={e => setOutcome(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md resize-none" /></div>

            {/* Follow-up section */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Create Follow-up (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Task</label>
                <input type="text" value={followUpTask} onChange={e => setFollowUpTask(e.target.value)} placeholder="Follow-up task description" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md" /></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="submit" variant="primary">Save Advising Log</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
