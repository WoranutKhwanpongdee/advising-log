// ============================================================
// Student — Advising History
// ============================================================

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useNavigate } from 'react-router-dom'
import { PageHeader, DataTable, StatusBadge, SearchInput } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import type { AdvisingRequest } from '@/types'
import { useState } from 'react'

export default function AdvisingHistory() {
  const { currentUser } = useAuth()
  const store = useStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  if (!currentUser) return null

  const myRequests = store.requests
    .filter(r => r.studentId === currentUser.id)
    .filter(r => {
      if (!search) return true
      const cat = ADVISING_CATEGORIES.find(c => c.value === r.category)?.label || ''
      return cat.toLowerCase().includes(search.toLowerCase()) || r.details.toLowerCase().includes(search.toLowerCase())
    })

  const columns = [
    { key: 'date', header: 'Date', render: (r: AdvisingRequest) => <span className="text-xs">{r.createdAt}</span> },
    { key: 'category', header: 'Category', render: (r: AdvisingRequest) => <span className="text-xs">{ADVISING_CATEGORIES.find(c => c.value === r.category)?.label}</span> },
    { key: 'advisor', header: 'Advisor', render: (r: AdvisingRequest) => <span className="text-xs">{store.users.find(u => u.id === r.advisorId)?.name || '-'}</span> },
    { key: 'appointment', header: 'Appointment', render: (r: AdvisingRequest) => {
      const apt = store.appointments.find(a => a.requestId === r.id)
      return <span className="text-xs">{apt ? `${apt.scheduledDate} ${apt.scheduledTime}` : '-'}</span>
    }},
    { key: 'status', header: 'Status', render: (r: AdvisingRequest) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Advising History" description="View your past and current advising requests." />
      <div className="mb-4 max-w-xs">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by category or details..." />
      </div>
      <DataTable
        columns={columns}
        data={myRequests}
        onRowClick={r => navigate(`/student/history/${r.id}`)}
        emptyMessage="No advising records found."
      />
    </div>
  )
}
