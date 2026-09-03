// Advisor — Referrals
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import { REFERRAL_DESTINATIONS } from '@/types'
import type { Referral, ReferralDestination } from '@/types'

export default function Referrals() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const [showCreate, setShowCreate] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [reason, setReason] = useState('')
  const [destination, setDestination] = useState<ReferralDestination | ''>('')

  if (!currentUser) return null
  const myReferrals = store.referrals.filter(r => r.advisorId === currentUser.id)
  const myStudents = store.roster.filter(r => r.advisorId === currentUser.id && r.isActive).map(r => store.users.find(u => u.id === r.studentId)!).filter(Boolean)

  function handleCreate() {
    if (!studentId || !reason || !destination) { addToast('error', 'Validation Error', 'Fill required fields.'); return }
    const ref = store.addReferral({ sessionId: '', studentId, advisorId: currentUser!.id, reason, destination: destination as ReferralDestination, status: 'pending', referredAt: new Date().toISOString().split('T')[0] })
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'referral_created', description: `Referred ${store.users.find(u => u.id === studentId)?.name} to ${REFERRAL_DESTINATIONS.find(d => d.value === destination)?.label}`, targetId: ref.id })
    addToast('success', 'Referral Created')
    setShowCreate(false); setStudentId(''); setReason(''); setDestination('')
  }

  const columns = [
    { key: 'student', header: 'Student', render: (r: Referral) => <span className="text-xs font-medium">{store.users.find(u => u.id === r.studentId)?.name}</span> },
    { key: 'dest', header: 'Destination', render: (r: Referral) => <span className="text-xs">{REFERRAL_DESTINATIONS.find(d => d.value === r.destination)?.label}</span> },
    { key: 'reason', header: 'Reason', render: (r: Referral) => <span className="text-xs text-slate-500 line-clamp-1">{r.reason}</span> },
    { key: 'date', header: 'Date', render: (r: Referral) => <span className="text-xs">{r.referredAt}</span> },
    { key: 'status', header: 'Status', render: (r: Referral) => <StatusBadge status={r.status} /> },
    { key: 'actions', header: '', render: (r: Referral) => r.status !== 'completed' ? (
      <Button size="sm" variant="secondary" onClick={() => { store.updateReferralStatus(r.id, r.status === 'pending' ? 'referred' : r.status === 'referred' ? 'in_progress' : 'completed'); addToast('info', 'Status Updated') }}>
        {r.status === 'pending' ? 'Mark Referred' : r.status === 'referred' ? 'In Progress' : 'Complete'}
      </Button>
    ) : null },
  ]

  return (
    <div>
      <PageHeader title="Referrals" description="Manage student referrals to university units." actions={<Button onClick={() => setShowCreate(true)}>Create Referral</Button>} />
      <DataTable columns={columns} data={myReferrals} emptyMessage="No referrals." />

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Referral" size="sm">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Student *</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md"><option value="">Select</option>{myStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Destination *</label>
            <select value={destination} onChange={e => setDestination(e.target.value as ReferralDestination)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md"><option value="">Select</option>{REFERRAL_DESTINATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Reason *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md resize-none" /></div>
          <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button><Button onClick={handleCreate}>Create</Button></div>
        </div>
      </Modal>
    </div>
  )
}
