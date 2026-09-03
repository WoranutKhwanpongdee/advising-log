// Admin — Categories
import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { PageHeader, DataTable, StatusBadge, Button, SearchInput } from '@/components/ui'
import type { AdvisingCategoryConfig } from '@/types'

export default function Categories() {
  const store = useStore()
  const [search, setSearch] = useState('')

  const categories = store.categoryConfigs.filter(c => {
    if (!search) return true
    return c.label.toLowerCase().includes(search.toLowerCase()) || c.value.toLowerCase().includes(search.toLowerCase())
  })

  const columns = [
    { key: 'label', header: 'Category Label', render: (c: AdvisingCategoryConfig) => <span className="text-sm font-medium">{c.label}</span> },
    { key: 'value', header: 'Internal ID', render: (c: AdvisingCategoryConfig) => <span className="text-xs text-slate-500">{c.value}</span> },
    { key: 'sub', header: 'Sub-categories', render: (c: AdvisingCategoryConfig) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {c.subCategories.slice(0, 3).map((sc, i) => <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">{sc}</span>)}
        {c.subCategories.length > 3 && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500">+{c.subCategories.length - 3}</span>}
        {c.subCategories.length === 0 && <span className="text-xs text-slate-400">None</span>}
      </div>
    ) },
    { key: 'status', header: 'Status', render: (c: AdvisingCategoryConfig) => <StatusBadge status={c.isActive ? 'active' : 'inactive'} className={c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'} /> },
    { key: 'actions', header: 'Actions', render: (c: AdvisingCategoryConfig) => (
      <Button size="sm" variant="secondary" onClick={() => store.updateCategory(c.id, { isActive: !c.isActive })}>
        {c.isActive ? 'Disable' : 'Enable'}
      </Button>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Advising Categories" description="Manage advising categories and sub-categories." actions={<Button>Add Category</Button>} />
      <div className="mb-4 max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search categories..." /></div>
      <DataTable columns={columns} data={categories} emptyMessage="No categories found." />
    </div>
  )
}
