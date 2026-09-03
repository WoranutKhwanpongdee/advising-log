// Advisor — Early Warning
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import { EARLY_WARNING_TYPES } from '@/types'
import type { EarlyWarningCase, EarlyWarningType, EarlyWarningSeverity } from '@/types'

export default function EarlyWarning() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const [showCreate, setShowCreate] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [warningType, setWarningType] = useState<EarlyWarningType | ''>('')
  const [severity, setSeverity] = useState<EarlyWarningSeverity | ''>('')
  const [description, setDescription] = useState('')
  const [recommendedAction, setRecommendedAction] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  if (!currentUser) return null
  const myWarnings = store.earlyWarnings.filter(w => w.advisorId === currentUser.id)
  const myStudents = store.roster.filter(r => r.advisorId === currentUser.id && r.isActive).map(r => store.users.find(u => u.id === r.studentId)!).filter(Boolean)

  function handleCreate() {
    if (!studentId || !warningType || !severity || !description) { addToast('error', 'Validation Error', 'Fill required fields.'); return }
    const ew = store.addEarlyWarning({ studentId, advisorId: currentUser!.id, warningType: warningType as EarlyWarningType, severity: severity as EarlyWarningSeverity, description, dateDetected: new Date().toISOString().split('T')[0], recommendedAction, followUpDate, status: 'active' })
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'warning_created', description: `Created early warning for ${store.users.find(u => u.id === studentId)?.name}`, targetId: ew.id })
    addToast('success', 'Early Warning Created')
    setShowCreate(false); setStudentId(''); setWarningType(''); setSeverity(''); setDescription(''); setRecommendedAction(''); setFollowUpDate('')
  }

  const columns = [
    { key: 'student', header: 'Student', render: (w: EarlyWarningCase) => { const s = store.users.find(u => u.id === w.studentId); return <span className="text-xs font-medium">{s?.name}</span> }},
    { key: 'type', header: 'Type', render: (w: EarlyWarningCase) => <span className="text-xs">{EARLY_WARNING_TYPES.find(t => t.value === w.warningType)?.label}</span> },
    { key: 'severity', header: 'Severity', render: (w: EarlyWarningCase) => <StatusBadge status={w.severity} /> },
    { key: 'detected', header: 'Detected', render: (w: EarlyWarningCase) => <span className="text-xs">{w.dateDetected}</span> },
    { key: 'followup', header: 'Follow-up', render: (w: EarlyWarningCase) => <span className="text-xs">{w.followUpDate || '-'}</span> },
    { key: 'status', header: 'Status', render: (w: EarlyWarningCase) => <StatusBadge status={w.status} /> },
    { key: 'actions', header: '', render: (w: EarlyWarningCase) => w.status === 'active' ? (
      <div className="flex gap-1">
        <Button size="sm" variant="secondary" onClick={() => { store.updateEarlyWarningStatus(w.id, 'monitoring'); addToast('info', 'Status updated to Monitoring') }}>Monitor</Button>
        <Button size="sm" variant="secondary" onClick={() => { store.updateEarlyWarningStatus(w.id, 'resolved'); addToast('success', 'Warning Resolved') }}>Resolve</Button>
      </div>
    ) : null },
  ]

  return (
    <div>
      <PageHeader title="Early Warning" description="Create and manage student early warning cases." actions={<Button onClick={() => setShowCreate(true)}>Create Warning</Button>} />
      <DataTable columns={columns} data={myWarnings} emptyMessage="No early warning cases." />

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Early Warning" size="md">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Student *</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md"><option value="">Select</option>{myStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Warning Type *</label>
            <select value={warningType} onChange={e => setWarningType(e.target.value as EarlyWarningType)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md"><option value="">Select</option>{EARLY_WARNING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Severity *</label>
            <select value={severity} onChange={e => setSeverity(e.target.value as EarlyWarningSeverity)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md"><option value="">Select</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md resize-none" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Recommended Action</label>
            <textarea value={recommendedAction} onChange={e => setRecommendedAction(e.target.value)} rows={2} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md resize-none" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Follow-up Date</label>
            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md" /></div>
          <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button><Button onClick={handleCreate}>Create</Button></div>
        </div>
      </Modal>
    </div>
  )
}
