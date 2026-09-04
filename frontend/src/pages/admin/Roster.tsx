import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, Button, SearchInput, Modal } from '@/components/ui'
import { Upload, Plus } from 'lucide-react'
import type { StudentAdvisorAssignment } from '@/types'

export default function Roster() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [showAssign, setShowAssign] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedAdvisor, setSelectedAdvisor] = useState('')

  const activeRoster = store.roster.filter(r => r.isActive).filter(r => {
    if (!search) return true
    const student = store.users.find(u => u.id === r.studentId)
    const advisor = store.users.find(u => u.id === r.advisorId)
    const s = search.toLowerCase()
    return student?.name.toLowerCase().includes(s) || student?.code.toLowerCase().includes(s) || advisor?.name.toLowerCase().includes(s)
  })

  const students = store.users.filter(u => u.role === 'student' && u.isActive)
  const advisors = store.users.filter(u => u.role === 'advisor' && u.isActive)

  function handleAssign() {
    if (!selectedStudent || !selectedAdvisor) return
    store.updateRosterEntry(selectedStudent, selectedAdvisor)
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'admin',
      action: 'roster_updated',
      description: `Assigned student ${selectedStudent} to advisor ${selectedAdvisor}`,
    })
    addToast('success', t('อัปเดตคู่ที่ปรึกษาสำเร็จ', 'Roster Updated'), t('กำหนดอาจารย์ที่ปรึกษาให้นักศึกษาเรียบร้อย', 'Student assigned to advisor successfully.'))
    setShowAssign(false); setSelectedStudent(''); setSelectedAdvisor('')
  }

  function handleImport() {
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'admin',
      action: 'roster_updated',
      description: `Imported roster data from CSV`,
    })
    addToast('success', t('นำเข้าข้อมูลสำเร็จ', 'Roster Imported'), t('จำลองการนำเข้าไฟล์ CSV รายชื่อคู่ที่ปรึกษาเรียบร้อย', 'CSV roster batch import simulated successfully.'))
  }

  const columns = [
    {
      key: 'studentCode',
      header: t('รหัสนักศึกษา', 'Student ID'),
      render: (r: StudentAdvisorAssignment) => (
        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
          {store.users.find(u => u.id === r.studentId)?.code}
        </span>
      ),
    },
    {
      key: 'studentName',
      header: t('ชื่อ-นามสกุล นักศึกษา', 'Student Name'),
      render: (r: StudentAdvisorAssignment) => (
        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
          {store.users.find(u => u.id === r.studentId)?.name}
        </span>
      ),
    },
    {
      key: 'advisor',
      header: t('อาจารย์ที่ปรึกษาที่ดูแล', 'Assigned Faculty Advisor'),
      render: (r: StudentAdvisorAssignment) => (
        <span className="text-xs text-sky-800 dark:text-sky-300 font-medium bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-md border border-sky-100 dark:border-sky-800">
          {store.users.find(u => u.id === r.advisorId)?.name}
        </span>
      ),
    },
    {
      key: 'date',
      header: t('วันที่มอบหมาย', 'Assignment Date'),
      render: (r: StudentAdvisorAssignment) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{r.assignedAt}</span>
      ),
    },
    {
      key: 'actions',
      header: t('การจัดการ', 'Action'),
      render: (r: StudentAdvisorAssignment) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => { setSelectedStudent(r.studentId); setSelectedAdvisor(r.advisorId); setShowAssign(true) }}
        >
          {t('เปลี่ยนอาจารย์', 'Change Advisor')}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('บัญชีคู่ที่ปรึกษาทางวิชาการ', 'Student-Advisor Roster')}
        description={t('กำหนดกลุ่มนักศึกษาและจับคู่นักศึกษากับอาจารย์ที่ปรึกษาประจำสาขา', 'Configure advising cohorts and map students to designated faculty advisors.')}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-1.5 text-slate-500 dark:text-slate-400" /> {t('นำเข้าไฟล์ CSV', 'Import CSV')}
            </Button>
            <Button onClick={() => { setSelectedStudent(''); setSelectedAdvisor(''); setShowAssign(true) }}>
              <Plus className="h-4 w-4 mr-1.5" /> {t('กำหนดที่ปรึกษา', 'Assign Advisor')}
            </Button>
          </div>
        }
      />
      <div className="mb-5 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder={t('ค้นหาตามรหัสนักศึกษา หรือชื่ออาจารย์...', 'Search by student code or advisor...')} />
      </div>
      <DataTable columns={columns} data={activeRoster} emptyMessage={t('ไม่พบข้อมูลการจับคู่ที่ปรึกษาที่ตรงกับคำค้นหา', 'No roster assignments match search query.')} />

      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title={t('จับคู่นักศึกษากับอาจารย์ที่ปรึกษา', 'Assign Student to Advisor')} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">{t('นักศึกษา', 'Student')} *</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="">{t('-- เลือกนักศึกษา --', 'Select student')}</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">{t('อาจารย์ที่ปรึกษา', 'Assigned Faculty Advisor')} *</label>
            <select
              value={selectedAdvisor}
              onChange={e => setSelectedAdvisor(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="">{t('-- เลือกอาจารย์ที่ปรึกษา --', 'Select advisor')}</option>
              {advisors.map(a => <option key={a.id} value={a.id}>{a.name} ({a.department})</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setShowAssign(false)}>{t('ยกเลิก', 'Cancel')}</Button>
            <Button variant="primary" onClick={handleAssign}>{t('บันทึกการจับคู่', 'Save Assignment')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

