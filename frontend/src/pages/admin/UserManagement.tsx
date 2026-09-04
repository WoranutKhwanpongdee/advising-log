// Admin — User Management
import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { PageHeader, DataTable, StatusBadge, Button, SearchInput } from '@/components/ui'
import type { User, UserRole } from '@/types'
import { ChevronDown } from 'lucide-react'

export default function UserManagement() {
  const store = useStore()
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
    { key: 'name', header: 'Name', render: (u: User) => <span className="text-sm font-medium">{u.name}</span> },
    { key: 'code', header: 'Code/ID', render: (u: User) => <span className="text-xs">{u.code}</span> },
    { key: 'role', header: 'Role', render: (u: User) => <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">{u.role.replace('_', ' ')}</span> },
    { key: 'email', header: 'Email', render: (u: User) => <span className="text-xs text-slate-500">{u.email}</span> },
    { key: 'status', header: 'Status', render: (u: User) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} className={u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'} /> },
    { key: 'actions', header: 'Actions', render: (u: User) => (
      <Button size="sm" variant="secondary" onClick={() => store.updateUser(u.id, { isActive: !u.isActive })}>
        {u.isActive ? 'Deactivate' : 'Activate'}
      </Button>
    ) },
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
