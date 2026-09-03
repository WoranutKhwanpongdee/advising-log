import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, StatusBadge, Button, SearchInput } from '@/components/ui'
import type { DocumentType } from '@/types'
import { FileText } from 'lucide-react'

export default function DocumentTypes() {
  const store = useStore()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')

  const docTypes = store.documentTypes.filter(d => {
    if (!search) return true
    return d.name.toLowerCase().includes(search.toLowerCase())
  })

  const columns = [
    {
      key: 'name',
      header: t('ชื่อเอกสาร / แบบฟอร์ม', 'Document Name'),
      render: (d: DocumentType) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-900">{d.name}</span>
        </div>
      ),
    },
    {
      key: 'signature',
      header: t('รูปแบบการลงนาม', 'Validation Method'),
      render: (d: DocumentType) => (
        <span className="text-xs font-medium text-slate-700">
          {d.signatureMethod === 'wet_signature' ? t('ลงนามด้วยตนเอง (ส่งเอกสารฉบับจริง)', 'Wet Signature (Physical Submission)') : t('ลงนามดิจิทัล (ยืนยันผ่านระบบ)', 'E-Signature (Digital Confirmation)')}
        </span>
      ),
    },
    { key: 'status', header: t('สถานะ', 'Status'), render: (d: DocumentType) => <StatusBadge status={d.isActive ? 'active' : 'inactive'} /> },
    {
      key: 'actions',
      header: t('การจัดการ', 'Action'),
      render: (d: DocumentType) => (
        <Button size="sm" variant="secondary" onClick={() => store.updateDocumentType(d.id, { isActive: !d.isActive })}>
          {d.isActive ? t('ปิดใช้งาน', 'Disable') : t('เปิดใช้งาน', 'Enable')}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('การกำหนดแบบฟอร์มและเอกสาร', 'Document Types & Templates')}
        description={t('จัดการแบบฟอร์มการให้คำปรึกษาที่จำเป็น รูปแบบการลงนาม และเอกสารระเบียบข้อบังคับ', 'Configure mandatory advising forms, signoff methods, and compliance documentation.')}
      />
      <div className="mb-5 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder={t('ค้นหาแบบฟอร์มเอกสาร...', 'Search documents...')} />
      </div>
      <DataTable columns={columns} data={docTypes} emptyMessage={t('ไม่พบข้อมูลแบบฟอร์มเอกสาร', 'No document types found.')} />
    </div>
  )
}

