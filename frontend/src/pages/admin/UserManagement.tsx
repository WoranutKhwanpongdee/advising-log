import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, StatusBadge, Button, SearchInput } from '@/components/ui'
import type { User, UserRole } from '@/types'
import { ChevronDown } from 'lucide-react'

export default function UserManagement() {
  const store = useStore()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  const roleOptions: { value: UserRole | 'all'; label: string }[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'student', label: 'Student' },
    { value: 'advisor', label: 'Advisor' },
    { value: 'qa_chair', label: 'QA Chair' },
    { value: 'admin', label: 'Admin' },
  ]

  const users = store.users.filter(u => {
    // Apply role filter
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    
    // Apply search filter
    if (!search) return true
    const s = search.toLowerCase()
    return u.name.toLowerCase().includes(s) || u.code.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
  })

  const columns = [
    {
      key: 'name',
      header: t('ชื่อ-นามสกุล', 'Full Name'),
      render: (u: User) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-mono">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'code', header: t('รหัสประจำตัว', 'User ID / Code'), render: (u: User) => <span className="text-xs font-mono text-slate-600 dark:text-slate-300 font-medium">{u.code}</span> },
    {
      key: 'role',
      header: t('บทบาทในระบบ', 'System Role'),
      render: (u: User) => {
        const roleLabels: Record<string, { th: string; en: string }> = {
          student: { th: 'นักศึกษา', en: 'Student' },
          advisor: { th: 'อาจารย์ที่ปรึกษา', en: 'Faculty Advisor' },
          qa_chair: { th: 'ประกันคุณภาพ/ประธานหลักสูตร', en: 'QA / Program Chair' },
          admin: { th: 'ผู้ดูแลระบบ', en: 'Admin' },
        }
        const r = roleLabels[u.role] || { th: u.role, en: u.role }
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-200">
            {t(r.th, r.en)}
          </span>
        )
      },
    },
    { key: 'dept', header: t('สำนักวิชา / ส่วนงาน', 'Department'), render: (u: User) => <span className="text-xs text-slate-600 dark:text-slate-300">{u.department || '—'}</span> },
    { key: 'status', header: t('สถานะ', 'Status'), render: (u: User) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} /> },
    {
      key: 'actions',
      header: t('การจัดการ', 'Actions'),
      render: (u: User) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => store.updateUser(u.id, { isActive: !u.isActive })}
        >
          {u.isActive ? t('ปิดการใช้งาน', 'Deactivate') : t('เปิดใช้งาน', 'Activate')}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="User Management" description="Manage system users and access roles." actions={<Button>Add User</Button>} />
      <div className="mb-4 flex gap-4 items-end">
        <div className="max-w-sm flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search users by name, ID, or email..." />
        </div>
        
        {/* Role Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {roleOptions.find(r => r.value === roleFilter)?.label}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* Dropdown menu */}
          {showRoleDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
              <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {roleOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setRoleFilter(option.value as UserRole | 'all')
                        setShowRoleDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        roleFilter === option.value
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <DataTable columns={columns} data={users} emptyMessage="No users found." />
    </div>
  )
}

