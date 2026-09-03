// QA / Program Chair — Dashboard
import { useStore } from '@/data/mock-store'
import { PageHeader, StatCard, Card } from '@/components/ui'
import { ADVISING_CATEGORIES, EXIT_REASON_CODES } from '@/types'
import { BarChart3, CalendarClock, UserX, ListChecks, AlertTriangle, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useToast } from '@/contexts/ToastContext'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#64748b']

export default function QADashboard() {
  const store = useStore()
  const { addToast } = useToast()

  const totalSessions = store.sessions.length
  const totalRequests = store.requests.length
  const totalFollowUps = store.followUps.length
  const totalExitCases = store.exitCases.length
  const totalWarnings = store.earlyWarnings.length
  

  // Category distribution
  const categoryData = ADVISING_CATEGORIES.map(c => ({
    name: c.label.length > 20 ? c.label.substring(0, 20) + '...' : c.label,
    count: store.requests.filter(r => r.category === c.value).length,
  })).filter(d => d.count > 0)

  // Exit reason distribution
  const exitData = EXIT_REASON_CODES.map(r => ({
    name: r.label,
    value: store.exitCases.filter(e => e.reasonCode === r.value).length,
  })).filter(d => d.value > 0)

  // Advisor workload
  const advisorWorkload = store.users.filter(u => u.role === 'advisor').map(a => ({
    name: a.name.split(' ').pop() || a.name,
    requests: store.requests.filter(r => r.advisorId === a.id).length,
    sessions: store.sessions.filter(s => s.advisorId === a.id).length,
    students: store.roster.filter(r => r.advisorId === a.id && r.isActive).length,
  }))

  // Follow-up completion rate
  const completedFU = store.followUps.filter(f => f.status === 'completed').length
  const fuRate = totalFollowUps > 0 ? Math.round((completedFU / totalFollowUps) * 100) : 0

  function handleExport() {
    store.addAuditLog({ userId: 'QA001', userName: 'QA Coordinator', userRole: 'qa_chair', action: 'qa_exported_data', description: 'Exported QA statistics report' })
    addToast('info', 'Export Simulated', 'Report data exported (simulated)')
  }

  return (
    <div>
      <PageHeader title="QA Dashboard" description="Aggregate advising statistics and reporting." actions={
        <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50">
          <Download className="h-4 w-4" /> Export Report
        </button>
      } />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total Requests" value={totalRequests} icon={<BarChart3 className="h-5 w-5" />} color="indigo" />
        <StatCard label="Sessions" value={totalSessions} icon={<CalendarClock className="h-5 w-5" />} color="blue" />
        <StatCard label="Follow-ups" value={totalFollowUps} icon={<ListChecks className="h-5 w-5" />} color="emerald" />
        <StatCard label="FU Completion" value={`${fuRate}%`} icon={<ListChecks className="h-5 w-5" />} color="purple" />
        <StatCard label="Exit Cases" value={totalExitCases} icon={<UserX className="h-5 w-5" />} color="red" />
        <StatCard label="Warnings" value={totalWarnings} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Advising by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={130} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Exit Reason Distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Exit Cases by Reason</h3>
          <div className="h-64">
            {exitData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={exitData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 10 }}>
                    {exitData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-400">No exit case data</div>
            )}
          </div>
        </Card>
      </div>

      {/* Advisor Workload */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Advisor Workload</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={advisorWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="students" fill="#6366f1" name="Students" radius={[4, 4, 0, 0]} />
              <Bar dataKey="requests" fill="#8b5cf6" name="Requests" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" fill="#06b6d4" name="Sessions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
