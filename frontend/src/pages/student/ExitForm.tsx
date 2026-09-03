// Student — Exit Form
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, Button, Card } from '@/components/ui'
import { EXIT_REASON_CODES } from '@/types'
import type { ExitType, ExitReasonCode } from '@/types'

export default function ExitForm() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [exitType, setExitType] = useState<ExitType | ''>('')
  const [reasonCode, setReasonCode] = useState<ExitReasonCode | ''>('')
  const [details, setDetails] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')

  if (!currentUser) return null

  const rosterEntry = store.roster.find(r => r.studentId === currentUser!.id && r.isActive)
  const advisor = rosterEntry ? store.users.find(u => u.id === rosterEntry.advisorId) : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!exitType || !reasonCode || !details || !effectiveDate) {
      addToast('error', 'Validation Error', 'Please fill in all required fields.')
      return
    }
    if (!advisor) {
      addToast('error', 'No Advisor', 'You do not have an assigned advisor.')
      return
    }
    const exitCase = store.addExitCase({ studentId: currentUser!.id, advisorId: advisor.id, exitType: exitType as ExitType, reasonCode: reasonCode as ExitReasonCode, details, preferredEffectiveDate: effectiveDate, status: 'open' })
    store.addNotification({ userId: advisor.id, type: 'action_required', title: 'New Exit Case', message: `${currentUser!.name} has submitted an exit request (${exitType.replace(/_/g, ' ')}).`, relatedId: exitCase.id, isRead: false })
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'exit_case_created', description: `Created exit case: ${exitType.replace(/_/g, ' ')}`, targetId: exitCase.id })
    addToast('success', 'Exit Form Submitted', 'Your request has been sent to your advisor for review.')
    navigate('/student')
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Exit / Leave Request" description="Submit a withdrawal, leave of absence, or transfer request." />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Exit Type <span className="text-red-500">*</span></label>
            <select value={exitType} onChange={e => setExitType(e.target.value as ExitType)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select type</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="leave_of_absence">Leave of Absence</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason <span className="text-red-500">*</span></label>
            <select value={reasonCode} onChange={e => setReasonCode(e.target.value as ExitReasonCode)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select reason</option>
              {EXIT_REASON_CODES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Details <span className="text-red-500">*</span></label>
            <textarea value={details} onChange={e => setDetails(e.target.value)} rows={4} placeholder="Explain your situation..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Effective Date <span className="text-red-500">*</span></label>
            <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => navigate('/student')}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Request</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
