import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, StatusBadge, Button } from '@/components/ui'
import type { StudentDocument } from '@/types'
import { FileText, Upload } from 'lucide-react'

export default function Documents() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t } = useLanguage()
  if (!currentUser) return null

  const myDocs = store.documents.filter(d => d.studentId === currentUser.id)

  const columns = [
    {
      key: 'name',
      header: t('ชื่อเอกสาร', 'Document Name'),
      render: (d: StudentDocument) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-900">{d.documentName}</span>
        </div>
      ),
    },
    {
      key: 'method',
      header: t('รูปแบบการลงนาม', 'Signature Type'),
      render: (d: StudentDocument) => (
        <span className="text-xs text-slate-600 font-medium">
          {d.signatureMethod === 'wet_signature' ? t('ลงนามด้วยตนเอง (กระดาษ)', 'Wet Signature (Physical)') : t('ลงนามอิเล็กทรอนิกส์ (ดิจิทัล)', 'E-Signature (Digital)')}
        </span>
      ),
    },
    {
      key: 'file',
      header: t('ชื่อไฟล์', 'File Name'),
      render: (d: StudentDocument) => <span className="text-xs text-slate-500 font-mono">{d.fileName || '—'}</span>,
    },
    {
      key: 'status',
      header: t('สถานะ', 'Status'),
      render: (d: StudentDocument) => <StatusBadge status={d.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (d: StudentDocument) => d.status === 'required' ? (
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            store.updateDocumentStatus(d.id, 'uploaded')
            store.addAuditLog({ userId: currentUser.id, userName: currentUser.name, userRole: 'student', action: 'document_uploaded', description: `Uploaded ${d.documentName}`, targetId: d.id })
            addToast('success', t('อัปโหลดเอกสารสำเร็จ', 'Document Uploaded'), `${d.documentName} ${t('ได้รับการอัปโหลดเรียบร้อย', 'has been uploaded.')}`)
          }}
        >
          <Upload className="h-3 w-3 mr-1" /> {t('อัปโหลด', 'Upload')}
        </Button>
      ) : null,
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('เอกสารประกอบการศึกษา', 'Student Documents')}
        description={t('ตรวจสอบรายการแบบฟอร์ม เอกสารที่ต้องลงนาม และสถานะการจัดส่งเอกสาร', 'View required forms, signed paperwork, and submission status.')}
      />
      <DataTable columns={columns} data={myDocs} emptyMessage={t('ไม่มีรายการเอกสารที่ต้องส่งในขณะนี้', 'No documents assigned to your profile.')} />
    </div>
  )
}

