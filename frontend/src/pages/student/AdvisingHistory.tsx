// ============================================================
// Student — Advising History (Minimal White & Sky Blue)
// ============================================================

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { PageHeader, DataTable, StatusBadge, SearchInput, Button } from '@/components/ui'
import type { AdvisingRequest } from '@/types'
import { useState } from 'react'
import { FileEdit } from 'lucide-react'

export default function AdvisingHistory() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { t, getCategoryLabel } = useLanguage()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  if (!currentUser) return null

  const myRequests = store.requests
    .filter(r => r.studentId === currentUser.id)
    .filter(r => {
      if (!search) return true
      const cat = getCategoryLabel(r.category)
      return cat.toLowerCase().includes(search.toLowerCase()) || r.details.toLowerCase().includes(search.toLowerCase())
    })

  const columns = [
    { key: 'date', header: t('วันที่ยื่น', 'Date'), render: (r: AdvisingRequest) => <span className="text-xs text-slate-500 font-medium">{r.createdAt}</span> },
    { key: 'category', header: t('หมวดหมู่', 'Category'), render: (r: AdvisingRequest) => <span className="text-xs sm:text-sm font-semibold text-slate-900">{getCategoryLabel(r.category)}</span> },
    { key: 'advisor', header: t('อาจารย์ที่ปรึกษา', 'Faculty Advisor'), render: (r: AdvisingRequest) => <span className="text-xs text-slate-600">{store.users.find(u => u.id === r.advisorId)?.name || '-'}</span> },
    { key: 'appointment', header: t('เวลานัดหมาย', 'Appointment'), render: (r: AdvisingRequest) => {
      const apt = store.appointments.find(a => a.requestId === r.id)
      return <span className="text-xs text-slate-500">{apt ? `${apt.scheduledDate} · ${apt.scheduledTime}` : '—'}</span>
    }},
    { key: 'status', header: t('สถานะ', 'Status'), render: (r: AdvisingRequest) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title={t('ประวัติคำร้องขอรับคำปรึกษา', 'Advising History')}
        description={t('ติดตามและตรวจสอบประวัติการขอคำปรึกษา บันทึก และตารางนัดหมายทั้งหมด', 'Review all past and ongoing advising requests, notes, and session logs.')}
        actions={
          <Button onClick={() => navigate('/student/request')}>
            <FileEdit className="h-4 w-4 mr-1.5" />
            {t('ยื่นคำร้องขอเข้าพบ', 'Request Advising')}
          </Button>
        }
      />
      <div className="mb-5 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder={t('ค้นหาตามหมวดหมู่ หรือคำสำคัญ...', 'Search by category or keyword...')} />
      </div>
      <DataTable
        columns={columns}
        data={myRequests}
        onRowClick={r => navigate(`/student/history/${r.id}`)}
        emptyMessage={t('ไม่พบประวัติคำร้องขอรับคำปรึกษา', 'No advising records found matching your search.')}
      />
    </div>
  )
}

