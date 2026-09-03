// Student — Documents
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, StatusBadge, Button } from '@/components/ui'
import type { StudentDocument } from '@/types'

export default function Documents() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  if (!currentUser) return null

  const myDocs = store.documents.filter(d => d.studentId === currentUser.id)
  

  const columns = [
    { key: 'name', header: 'Document', render: (d: StudentDocument) => <span className="text-xs font-medium">{d.documentName}</span> },
    { key: 'method', header: 'Signature', render: (d: StudentDocument) => <span className="text-xs">{d.signatureMethod === 'wet_signature' ? 'Wet Signature' : 'E-Signature'}</span> },
    { key: 'file', header: 'File', render: (d: StudentDocument) => <span className="text-xs text-slate-500">{d.fileName || '-'}</span> },
    { key: 'status', header: 'Status', render: (d: StudentDocument) => <StatusBadge status={d.status} /> },
    { key: 'actions', header: '', render: (d: StudentDocument) => d.status === 'required' ? (
      <Button size="sm" variant="secondary" onClick={() => {
        store.updateDocumentStatus(d.id, 'uploaded')
        store.addAuditLog({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'document_uploaded', description: `Uploaded ${d.documentName}`, targetId: d.id })
        addToast('success', 'Document Uploaded', `${d.documentName} uploaded (simulated)`)
      }}>Upload</Button>
    ) : null },
  ]

  return (
    <div>
      <PageHeader title="Documents" description="Manage required and uploaded documents." />
      <DataTable columns={columns} data={myDocs} emptyMessage="No documents assigned to you." />
    </div>
  )
}
