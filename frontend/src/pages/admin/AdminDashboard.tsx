// Admin — Dashboard
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { PageHeader, StatCard, Card, Timeline } from '@/components/ui'
import { Users, BookOpen, Shield, FolderCog, ScrollText } from 'lucide-react'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const store = useStore()
  if (!currentUser) return null

  const totalUsers = store.users.length
  const totalStudents = store.users.filter(u => u.role === 'student').length
  const totalAdvisors = store.users.filter(u => u.role === 'advisor').length
  const activeRosterCount = store.roster.filter(r => r.isActive).length
  
  const recentActivity = store.auditLogs.slice(0, 8).map(log => ({
    date: log.createdAt.replace('T', ' ').substring(0, 16),
    title: log.description,
    description: `${log.userName} (${log.userRole})`,
  }))

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="System configuration and overview." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={totalUsers} icon={<Users className="h-5 w-5" />} color="indigo" />
        <StatCard label="Students" value={totalStudents} icon={<BookOpen className="h-5 w-5" />} color="blue" />
        <StatCard label="Advisors" value={totalAdvisors} icon={<Shield className="h-5 w-5" />} color="emerald" />
        <StatCard label="Roster Entries" value={activeRosterCount} icon={<FolderCog className="h-5 w-5" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><ScrollText className="h-4 w-4 text-slate-400" /> Recent System Activity</h3>
          <Timeline items={recentActivity} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">Database Connection</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">Connected</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">Mock Data Store</span>
                <span className="text-emerald-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">API Gateway</span>
                <span className="text-emerald-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">Email Service (Simulated)</span>
                <span className="text-indigo-600 font-medium">Ready</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
