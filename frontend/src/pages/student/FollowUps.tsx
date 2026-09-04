// Student — Follow-ups
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { PageHeader, DataTable, StatusBadge } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import type { FollowUp } from '@/types'

export default function FollowUps() {
  const { currentUser } = useAuth()
  const store = useStore()
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
    },
  ]

  return (
    <div>
      <PageHeader title="Follow-ups" description="View your assigned follow-up tasks." />
      <DataTable columns={columns} data={myFollowUps} emptyMessage="No follow-up tasks assigned." />
    </div>
  )
}
