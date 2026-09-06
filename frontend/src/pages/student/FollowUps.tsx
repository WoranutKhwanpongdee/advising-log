import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { PageHeader, DataTable, StatusBadge } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, StatusBadge, Button } from '@/components/ui'
import type { FollowUp } from '@/types'
import { CheckCircle2, ListChecks } from 'lucide-react'

export default function FollowUps() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t } = useLanguage()
  if (!currentUser) return null

  const myFollowUps = store.followUps.filter(f => f.studentId === currentUser.id)

  const columns = [
    { 
      key: 'category', 
      header: 'Category', 
      render: (f: FollowUp) => {
        const request = store.requests.find(r => r.id === f.requestId)
        const categoryLabel = request ? ADVISING_CATEGORIES.find(c => c.value === request.category)?.label : '-'
        return <span className="text-xs">{categoryLabel}</span>
      }
    },
    { 
      key: 'teacher', 
      header: 'Teacher', 
      render: (f: FollowUp) => {
        const advisor = store.users.find(u => u.id === f.advisorId)
        return <span className="text-xs">{advisor?.name || '-'}</span>
      }
    },
    { 
      key: 'reason', 
      header: 'Reason', 
      render: (f: FollowUp) => <span className="text-xs font-medium">{f.task}</span>
    },
    { 
      key: 'meetupTime', 
      header: 'Meet-up Time', 
      render: (f: FollowUp) => {
        const appointment = store.appointments.find(a => a.requestId === f.requestId)
        return <span className="text-xs">{appointment ? `${appointment.scheduledDate} ${appointment.scheduledTime}` : '-'}</span>
      }
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (f: FollowUp) => <StatusBadge status={f.status} />
    {
      key: 'task',
      header: t('งานที่ได้รับมอบหมาย', 'Assigned Task'),
      render: (f: FollowUp) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
            <ListChecks className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{f.task}</span>
        </div>
      ),
    },
    { key: 'session', header: t('รหัสคำร้องอ้างอิง', 'Request Reference'), render: (f: FollowUp) => <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{f.requestId}</span> },
    { key: 'due', header: t('กำหนดส่ง', 'Due Date'), render: (f: FollowUp) => <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{f.dueDate}</span> },
    { key: 'status', header: t('สถานะ', 'Status'), render: (f: FollowUp) => <StatusBadge status={f.status} /> },
    {
      key: 'actions',
      header: '',
      render: (f: FollowUp) => f.status !== 'completed' ? (
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            store.updateFollowUpStatus(f.id, 'completed')
            store.addAuditLog({ userId: currentUser.id, userName: currentUser.name, userRole: 'student', action: 'followup_completed', description: `Completed follow-up: ${f.task}`, targetId: f.id })
            addToast('success', t('ดำเนินการเสร็จสิ้น', 'Follow-up Completed'), f.task)
          }}
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> {t('ทำเสร็จแล้ว', 'Mark Complete')}
        </Button>
      ) : null,
    },
  ]

  return (
    <div>
      <PageHeader title="Follow-ups" description="View your assigned follow-up tasks." />
      <DataTable columns={columns} data={myFollowUps} emptyMessage="No follow-up tasks assigned." />
    </div>
  )
}

