// QA / Program Chair — Exit Case Review
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import { EXIT_REASON_CODES } from '@/types'
import type { ExitCase } from '@/types'

export default function ExitCaseReview() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const [selectedCase, setSelectedCase] = useState<ExitCase | null>(null)

  if (!currentUser) return null

  // QA can see cases under review or resolved
  const reviewCases = store.exitCases.filter(e => e.status !== 'open')

  const columns = [
    { key: 'student', header: 'Student', render: (e: ExitCase) => <span className="text-xs font-medium">{store.users.find(u => u.id === e.studentId)?.name}</span> },
    { key: 'advisor', header: 'Advisor', render: (e: ExitCase) => <span className="text-xs">{store.users.find(u => u.id === e.advisorId)?.name}</span> },
    { key: 'type', header: 'Exit Type', render: (e: ExitCase) => <span className="text-xs capitalize">{e.exitType.replace(/_/g, ' ')}</span> },
    { key: 'reason', header: 'Reason', render: (e: ExitCase) => <span className="text-xs">{EXIT_REASON_CODES.find(r => r.value === e.reasonCode)?.label}</span> },
    { key: 'status', header: 'Status', render: (e: ExitCase) => <StatusBadge status={e.status} /> },
    { key: 'actions', header: '', render: (e: ExitCase) => (
      <Button size="sm" variant="secondary" onClick={() => handleView(e)}>Review</Button>
    )},
  ]

  function handleView(e: ExitCase) {
    setSelectedCase(e)
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'qa_viewed_case', description: `QA viewed exit case ${e.id}`, targetId: e.id })
  }

  function handleCloseCase() {
    if (!selectedCase) return
    store.updateExitCaseStatus(selectedCase.id, 'closed')
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'exit_case_updated', description: `QA closed exit case ${selectedCase.id}`, targetId: selectedCase.id })
    addToast('success', 'Case Closed', 'The exit case has been finalized.')
    setSelectedCase(null)
  }

  const assessment = selectedCase ? store.advisorAssessments.find(a => a.exitCaseId === selectedCase.id) : null

  return (
    <div>
      <PageHeader title="Exit Case Review" description="Review student exit cases and advisor assessments." />
      <DataTable columns={columns} data={reviewCases} emptyMessage="No cases require review." />

      {selectedCase && (
        <Modal isOpen={!!selectedCase} onClose={() => setSelectedCase(null)} title="Exit Case Review" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400">Student</span><p className="font-medium">{store.users.find(u => u.id === selectedCase.studentId)?.name}</p></div>
              <div><span className="text-slate-400">Advisor</span><p className="font-medium">{store.users.find(u => u.id === selectedCase.advisorId)?.name}</p></div>
              <div><span className="text-slate-400">Reason</span><p className="font-medium">{EXIT_REASON_CODES.find(r => r.value === selectedCase.reasonCode)?.label}</p></div>
              <div><span className="text-slate-400">Effective Date</span><p className="font-medium">{selectedCase.preferredEffectiveDate}</p></div>
            </div>
            
            <div className="text-xs"><span className="text-slate-400">Student Reason Details</span><p className="text-slate-700 mt-0.5 p-2 bg-slate-50 rounded">{selectedCase.details}</p></div>

            {assessment ? (
              <div className="border-t pt-3">
                <h4 className="text-xs font-semibold text-slate-900 mb-2">Advisor Assessment</h4>
                <div className="space-y-2 text-xs">
                  <div><span className="text-slate-400">Assessment</span><p className="text-slate-700">{assessment.assessment}</p></div>
                  {assessment.contributingFactors && <div><span className="text-slate-400">Contributing Factors</span><p className="text-slate-700">{assessment.contributingFactors}</p></div>}
                  {assessment.actionsTaken && <div><span className="text-slate-400">Actions Taken</span><p className="text-slate-700">{assessment.actionsTaken}</p></div>}
                  {assessment.recommendation && <div><span className="text-slate-400">Recommendation</span><p className="text-slate-700">{assessment.recommendation}</p></div>}
                </div>
              </div>
            ) : (
              <div className="border-t pt-3 text-xs text-slate-500 italic">No advisor assessment provided yet.</div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedCase(null)}>Close</Button>
              {selectedCase.status !== 'closed' && <Button onClick={handleCloseCase}>Finalize & Close Case</Button>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
