// Student — Follow-ups
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, StatusBadge, Button } from '@/components/ui'
import type { FollowUp } from '@/types'

export default function FollowUps() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  if (!currentUser) return null

  const myFollowUps = store.followUps.filter(f => f.studentId === currentUser.id)

  const columns = [
    { key: 'task', header: 'Task', render: (f: FollowUp) => <span className="text-xs font-medium">{f.task}</span> },
    { key: 'session', header: 'Session', render: (f: FollowUp) => <span className="text-xs text-slate-500">{f.requestId}</span> },
    { key: 'due', header: 'Due Date', render: (f: FollowUp) => <span className="text-xs">{f.dueDate}</span> },
    { key: 'status', header: 'Status', render: (f: FollowUp) => <StatusBadge status={f.status} /> },
    { key: 'actions', header: '', render: (f: FollowUp) => f.status !== 'completed' ? (
      <Button size="sm" variant="secondary" onClick={() => {
        store.updateFollowUpStatus(f.id, 'completed')
        store.addAuditLog({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'followup_completed', description: `Completed follow-up: ${f.task}`, targetId: f.id })
        addToast('success', 'Follow-up Completed', f.task)
      }}>Complete</Button>
    ) : null },
  ]

  return (
    <div>
      <PageHeader title="Follow-ups" description="Track and complete your assigned follow-up tasks." />
      <DataTable columns={columns} data={myFollowUps} emptyMessage="No follow-up tasks assigned." />
    </div>
  )
}
