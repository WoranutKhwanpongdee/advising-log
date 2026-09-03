// Admin — Roster
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, Button, SearchInput, Modal } from '@/components/ui'
import { Upload } from 'lucide-react'
import type { StudentAdvisorAssignment } from '@/types'

export default function Roster() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
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
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'roster_updated', description: `Assigned student ${selectedStudent} to advisor ${selectedAdvisor}` })
    addToast('success', 'Roster Updated', 'Student assigned to new advisor.')
    setShowAssign(false); setSelectedStudent(''); setSelectedAdvisor('')
  }

  function handleImport() {
    store.addAuditLog({ userId: currentUser!.id, userName: currentUser!.name, userRole: currentUser!.role, action: 'roster_updated', description: `Imported roster data from CSV` })
    addToast('success', 'Roster Imported', 'CSV import simulated successfully.')
  }

  const columns = [
    { key: 'studentCode', header: 'Student ID', render: (r: StudentAdvisorAssignment) => <span className="text-xs">{store.users.find(u => u.id === r.studentId)?.code}</span> },
    { key: 'studentName', header: 'Student Name', render: (r: StudentAdvisorAssignment) => <span className="text-sm font-medium">{store.users.find(u => u.id === r.studentId)?.name}</span> },
    { key: 'advisor', header: 'Assigned Advisor', render: (r: StudentAdvisorAssignment) => <span className="text-xs text-slate-700">{store.users.find(u => u.id === r.advisorId)?.name}</span> },
    { key: 'date', header: 'Assigned Date', render: (r: StudentAdvisorAssignment) => <span className="text-xs text-slate-500">{r.assignedAt}</span> },
    { key: 'actions', header: '', render: (r: StudentAdvisorAssignment) => (
      <Button size="sm" variant="secondary" onClick={() => { setSelectedStudent(r.studentId); setSelectedAdvisor(r.advisorId); setShowAssign(true) }}>Change Advisor</Button>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Student-Advisor Roster" description="Manage advisor assignments for students." actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleImport} className="gap-1.5"><Upload className="h-4 w-4" /> Import CSV</Button>
          <Button onClick={() => { setSelectedStudent(''); setSelectedAdvisor(''); setShowAssign(true) }}>Assign Advisor</Button>
        </div>
      } />
      <div className="mb-4 max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search by student or advisor name..." /></div>
      <DataTable columns={columns} data={activeRoster} emptyMessage="No roster assignments found." />

      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Advisor" size="sm">
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Student</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white">
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Advisor</label>
            <select value={selectedAdvisor} onChange={e => setSelectedAdvisor(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white">
              <option value="">Select advisor</option>
              {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => setShowAssign(false)}>Cancel</Button><Button onClick={handleAssign}>Save Assignment</Button></div>
        </div>
      </Modal>
    </div>
  )
}
