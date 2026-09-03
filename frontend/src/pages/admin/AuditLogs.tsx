// Admin — Audit Logs
import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { PageHeader, DataTable, StatusBadge, SearchInput, Pagination } from '@/components/ui'
import type { AuditLog } from '@/types'

export default function AuditLogs() {
  const store = useStore()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 15

  const logs = store.auditLogs.filter(l => {
    if (!search) return true
    const s = search.toLowerCase()
    return l.userName.toLowerCase().includes(s) || l.action.toLowerCase().includes(s) || l.description.toLowerCase().includes(s)
  })

  const totalPages = Math.ceil(logs.length / pageSize)
  const paginatedLogs = logs.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    { key: 'date', header: 'Timestamp', render: (l: AuditLog) => <span className="text-xs text-slate-500">{l.createdAt.replace('T', ' ').substring(0, 19)}</span> },
    { key: 'user', header: 'User', render: (l: AuditLog) => <div><p className="text-xs font-medium">{l.userName}</p><p className="text-[10px] text-slate-400 capitalize">{l.userRole.replace('_', ' ')}</p></div> },
    { key: 'action', header: 'Action', render: (l: AuditLog) => <StatusBadge status={l.action} className="bg-slate-100 text-slate-600 font-mono text-[10px]" /> },
    { key: 'desc', header: 'Description', render: (l: AuditLog) => <span className="text-xs">{l.description}</span> },
    { key: 'target', header: 'Target ID', render: (l: AuditLog) => <span className="text-xs text-slate-400 font-mono">{l.targetId || '-'}</span> },
  ]

  return (
    <div>
      <PageHeader title="Audit Logs" description="View system activity and security logs." />
      <div className="mb-4 max-w-sm"><SearchInput value={search} onChange={e => { setSearch(e); setPage(1) }} placeholder="Search logs..." /></div>
      <DataTable columns={columns} data={paginatedLogs} emptyMessage="No logs found." />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
