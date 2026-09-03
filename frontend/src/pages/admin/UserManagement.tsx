// Admin — User Management
import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { PageHeader, DataTable, StatusBadge, Button, SearchInput } from '@/components/ui'
import type { User } from '@/types'

export default function UserManagement() {
  const store = useStore()
  const [search, setSearch] = useState('')

  const users = store.users.filter(u => {
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
      <div className="mb-4 max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search users by name, ID, or email..." /></div>
      <DataTable columns={columns} data={users} emptyMessage="No users found." />
    </div>
  )
}
