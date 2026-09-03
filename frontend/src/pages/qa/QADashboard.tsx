// ============================================================
// QA / Program Chair — Dashboard (Minimal White & Sky Blue)
// ============================================================

import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { PageHeader, Card, StatCard, Button } from '@/components/ui'
import { ADVISING_CATEGORIES, EXIT_REASON_CODES } from '@/types'
import { BarChart3, TrendingUp, AlertTriangle, UserX, CalendarClock, ListChecks, Download } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = ['#0284c7', '#38bdf8', '#7dd3fc', '#cbd5e1', '#94a3b8', '#64748b', '#f59e0b', '#ef4444']

export default function QADashboard() {
  const store = useStore()
  const { addToast } = useToast()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()

  const chartTheme = {
    grid: isDark ? '#1e293b' : '#f1f5f9',
    axis: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    tooltipText: isDark ? '#f8fafc' : '#0f172a',
  }

  const totalRequests = store.requests.length
  const totalSessions = store.sessions.length
  const totalFollowUps = store.followUps.length
  const totalExitCases = store.exitCases.length
  const totalWarnings = store.earlyWarnings.length

  // Category distribution
  const categoryData = ADVISING_CATEGORIES.map(c => {
    const rawName = language === 'th' ? c.labelTh : c.labelEn
    const name = rawName.length > 24 ? rawName.substring(0, 24) + '...' : rawName
    return {
      name,
      count: store.requests.filter(r => r.category === c.value).length,
    }
  }).filter(d => d.count > 0)

  // Exit reason distribution
  const exitData = EXIT_REASON_CODES.map(r => ({
    name: language === 'th' ? r.labelTh : r.labelEn,
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
    store.addAuditLog({
      userId: 'QA001',
      userName: 'QA Coordinator',
      userRole: 'qa_chair',
      action: 'qa_exported_data',
      description: 'Exported QA statistics report',
    })
    addToast('info', t('ส่งออกรายงานแล้ว', 'Export Generated'), t('ข้อมูลรายงานการประกันคุณภาพถูกดาวน์โหลดเรียบร้อย (จำลอง)', 'Report data exported successfully (simulated).'))
  }

  return (
    <div>
      <PageHeader
        title={t('แดชบอร์ดประกันคุณภาพ & การประเมินผล', 'QA & Accreditation Dashboard')}
        description={t('ตัวชี้วัดการให้คำปรึกษาของอาจารย์ อัตราคงอยู่ของนักศึกษา และสถิติเพื่อการประกันคุณภาพการศึกษา', 'Faculty advising metrics, student persistence analytics, and accreditation data.')}
        actions={
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5 text-slate-500" /> {t('ส่งออกรายงานสรุป', 'Export Summary Report')}
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label={t('คำร้องทั้งหมด', 'Total Requests')} value={totalRequests} icon={<BarChart3 className="h-5 w-5" />} color="sky" />
        <StatCard label={t('ให้คำปรึกษาสำเร็จ', 'Completed Sessions')} value={totalSessions} icon={<CalendarClock className="h-5 w-5" />} color="sky" />
        <StatCard label={t('งานติดตามผลทั้งหมด', 'Total Follow-ups')} value={totalFollowUps} icon={<ListChecks className="h-5 w-5" />} color="sky" />
        <StatCard label={t('อัตราสำเร็จของงาน', 'Completion Rate')} value={`${fuRate}%`} icon={<TrendingUp className="h-5 w-5" />} color="sky" />
        <StatCard label={t('เคสขอลาออก/ลาพัก', 'Exit & Leaves')} value={totalExitCases} icon={<UserX className="h-5 w-5" />} color="red" />
        <StatCard label={t('เคสเตือนภัยวิชาการ', 'Early Warnings')} value={totalWarnings} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Distribution */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-sky-600" /> {t('สัดส่วนหัวข้อการขอคำปรึกษา', 'Advising Distribution by Topic')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis type="number" tick={{ fontSize: 11, fill: chartTheme.axis }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: chartTheme.axis }} width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    color: chartTheme.tooltipText,
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ color: chartTheme.tooltipText }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Exit Reason Distribution */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <UserX className="h-4 w-4 text-rose-600" /> {t('สัดส่วนสาเหตุการขอลาออกและลาพัก', 'Exit & Leave Cases by Category')}
          </h3>
          <div className="h-64">
            {exitData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exitData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={{ fontSize: 10, fill: chartTheme.axis }}
                  >
                    {exitData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      color: chartTheme.tooltipText,
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    itemStyle={{ color: chartTheme.tooltipText }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: chartTheme.axis }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">{t('ไม่มีข้อมูลเคสขอลาออกบันทึกไว้', 'No exit case data recorded')}</div>
            )}
          </div>
        </Card>
      </div>

      {/* Advisor Workload */}
      <Card>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-sky-600" /> {t('ภาระงานอาจารย์ที่ปรึกษาและการมีส่วนร่วม', 'Faculty Advisor Workload & Engagement')}
        </h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={advisorWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartTheme.axis }} />
              <YAxis tick={{ fontSize: 11, fill: chartTheme.axis }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartTheme.tooltipBg,
                  borderColor: chartTheme.tooltipBorder,
                  color: chartTheme.tooltipText,
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                itemStyle={{ color: chartTheme.tooltipText }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: chartTheme.axis }} />
              <Bar dataKey="students" fill="#0284c7" name={t('นักศึกษาในความดูแล', 'Assigned Advisees')} radius={[4, 4, 0, 0]} />
              <Bar dataKey="requests" fill="#38bdf8" name={t('คำร้องที่ได้รับ', 'Student Requests')} radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" fill="#64748b" name={t('ครั้งที่ให้คำปรึกษาสำเร็จ', 'Completed Sessions')} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
