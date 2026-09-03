// Admin — Document Types
import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { PageHeader, DataTable, StatusBadge, Button, SearchInput } from '@/components/ui'
import type { DocumentType } from '@/types'

export default function DocumentTypes() {
  const store = useStore()
  const [search, setSearch] = useState('')

  const docTypes = store.documentTypes.filter(d => {
    if (!search) return true
    return d.name.toLowerCase().includes(search.toLowerCase())
  })

  const columns = [
    { key: 'name', header: 'Document Name', render: (d: DocumentType) => <span className="text-sm font-medium">{d.name}</span> },
    { key: 'signature', header: 'Signature Method', render: (d: DocumentType) => <span className="text-xs">{d.signatureMethod === 'wet_signature' ? 'Wet Signature' : 'E-Signature'}</span> },
    { key: 'status', header: 'Status', render: (d: DocumentType) => <StatusBadge status={d.isActive ? 'active' : 'inactive'} className={d.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'} /> },
    { key: 'actions', header: 'Actions', render: (d: DocumentType) => (
      <Button size="sm" variant="secondary" onClick={() => store.updateDocumentType(d.id, { isActive: !d.isActive })}>
        {d.isActive ? 'Disable' : 'Enable'}
      </Button>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Document Types" description="Configure required document types and signature methods." actions={<Button>Add Document Type</Button>} />
      <div className="mb-4 max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search documents..." /></div>
      <DataTable columns={columns} data={docTypes} emptyMessage="No document types found." />
    </div>
  )
}
