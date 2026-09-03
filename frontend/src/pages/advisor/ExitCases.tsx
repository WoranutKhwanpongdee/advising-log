// Advisor — Exit Cases
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, StatusBadge, Button, Modal, Timeline } from '@/components/ui'
import { EXIT_REASON_CODES, ADVISING_CATEGORIES } from '@/types'
import type { ExitCase } from '@/types'

export default function ExitCases() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const [selectedCase, setSelectedCase] = useState<ExitCase | null>(null)
  const [showAssessment, setShowAssessment] = useState(false)
  const [assessment, setAssessment] = useState('')
  const [factors, setFactors] = useState('')
  const [actions, setActions] = useState('')
  const [recommendation, setRecommendation] = useState('')

  if (!currentUser) return null
  const myCases = store.exitCases.filter(e => e.advisorId === currentUser.id)

  const columns = [
    { key: 'student', header: 'Student', render: (e: ExitCase) => <span className="text-xs font-medium">{store.users.find(u => u.id === e.studentId)?.name}</span> },
    { key: 'type', header: 'Exit Type', render: (e: ExitCase) => <span className="text-xs capitalize">{e.exitType.replace(/_/g, ' ')}</span> },
    { key: 'reason', header: 'Reason', render: (e: ExitCase) => <span className="text-xs">{EXIT_REASON_CODES.find(r => r.value === e.reasonCode)?.label}</span> },
    { key: 'date', header: 'Effective Date', render: (e: ExitCase) => <span className="text-xs">{e.preferredEffectiveDate}</span> },
    { key: 'status', header: 'Status', render: (e: ExitCase) => <StatusBadge status={e.status} /> },
    { key: 'actions', header: '', render: (e: ExitCase) => (
      <div className="flex gap-1">
        <Button size="sm" variant="secondary" onClick={() => setSelectedCase(e)}>View</Button>
        {e.status !== 'closed' && <Button size="sm" variant="secondary" onClick={() => { setSelectedCase(e); setShowAssessment(true) }}>Assess</Button>}
      </div>
    )},
  ]

  function handleAssessment() {
    if (!selectedCase || !assessment) return
    store.addAdvisorAssessment({ exitCaseId: selectedCase.id, advisorId: currentUser!.id, assessment, contributingFactors: factors, actionsTaken: actions, referralsMade: '', followUpAttempts: '', recommendation, resolution: '' })
    store.updateExitCaseStatus(selectedCase.id, 'under_review')
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'exit_case_updated', description: `Submitted assessment for exit case ${selectedCase.id}`, targetId: selectedCase.id })
    addToast('success', 'Assessment Submitted')
    setShowAssessment(false); setSelectedCase(null); setAssessment(''); setFactors(''); setActions(''); setRecommendation('')
  }

  // Build timeline for selected case
  const caseTimeline = selectedCase ? (() => {
    
    const items = [{ date: selectedCase.createdAt, title: 'Exit Case Created', description: `${selectedCase.exitType.replace(/_/g, ' ')} - ${EXIT_REASON_CODES.find(r => r.value === selectedCase.reasonCode)?.label}`, status: 'open' }]
    // Add related advising history
    store.requests.filter(r => r.studentId === selectedCase.studentId).forEach(r => {
      items.push({ date: r.createdAt, title: `Advising: ${ADVISING_CATEGORIES.find(c => c.value === r.category)?.label}`, description: r.details.substring(0, 80), status: r.status })
    })
    return items.sort((a, b) => a.date.localeCompare(b.date))
  })() : []

  return (
    <div>
      <PageHeader title="Exit / Dropout Cases" description="Manage student exit, leave, and dropout cases." />
      <DataTable columns={columns} data={myCases} emptyMessage="No exit cases." />

      {/* View Case Modal */}
      {selectedCase && !showAssessment && (
        <Modal isOpen={!!selectedCase} onClose={() => setSelectedCase(null)} title="Exit Case Detail" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400">Student</span><p className="font-medium">{store.users.find(u => u.id === selectedCase.studentId)?.name}</p></div>
              <div><span className="text-slate-400">Type</span><p className="font-medium capitalize">{selectedCase.exitType.replace(/_/g, ' ')}</p></div>
              <div><span className="text-slate-400">Reason</span><p className="font-medium">{EXIT_REASON_CODES.find(r => r.value === selectedCase.reasonCode)?.label}</p></div>
              <div><span className="text-slate-400">Status</span><div className="mt-0.5"><StatusBadge status={selectedCase.status} /></div></div>
            </div>
            <div className="text-xs"><span className="text-slate-400">Details</span><p className="text-slate-700 mt-0.5">{selectedCase.details}</p></div>
            <div className="border-t pt-3"><h4 className="text-xs font-semibold text-slate-900 mb-2">Student Advising Timeline</h4><Timeline items={caseTimeline} /></div>
          </div>
        </Modal>
      )}

      {/* Assessment Modal */}
      <Modal isOpen={showAssessment} onClose={() => { setShowAssessment(false); setSelectedCase(null) }} title="Advisor Exit Assessment" size="md">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Assessment *</label>
            <textarea value={assessment} onChange={e => setAssessment(e.target.value)} rows={3} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md resize-none" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Contributing Factors</label>
            <textarea value={factors} onChange={e => setFactors(e.target.value)} rows={2} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md resize-none" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Actions Already Taken</label>
            <textarea value={actions} onChange={e => setActions(e.target.value)} rows={2} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md resize-none" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Recommendation</label>
            <textarea value={recommendation} onChange={e => setRecommendation(e.target.value)} rows={2} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md resize-none" /></div>
          <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => { setShowAssessment(false); setSelectedCase(null) }}>Cancel</Button><Button onClick={handleAssessment}>Submit Assessment</Button></div>
        </div>
      </Modal>
    </div>
  )
}
