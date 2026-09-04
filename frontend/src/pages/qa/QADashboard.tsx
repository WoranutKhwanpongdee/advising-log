// ============================================================
// QA / Program Chair — Dashboard (Minimal White & Sky Blue)
// ============================================================

import { useState } from 'react'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { PageHeader, Card, StatCard, Button } from '@/components/ui'
import { ADVISING_CATEGORIES, EXIT_REASON_CODES } from '@/types'
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  UserX,
  CalendarClock,
  ListChecks,
  Download,
  MessageSquareHeart,
  Sparkles,
  Quote,
  Star,
  ShieldCheck,
} from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'overview' | 'student_voice'>('overview')

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
  const totalVoiceResponses = store.studentVoiceResponses.length

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

  // Student Voice Statistics
  const avgCurriculum = totalVoiceResponses > 0
    ? (store.studentVoiceResponses.reduce((acc, r) => acc + r.ratings.curriculumRelevance, 0) / totalVoiceResponses).toFixed(1)
    : '0'
  const avgTeaching = totalVoiceResponses > 0
    ? (store.studentVoiceResponses.reduce((acc, r) => acc + r.ratings.teachingQuality, 0) / totalVoiceResponses).toFixed(1)
    : '0'
  const avgAdvisor = totalVoiceResponses > 0
    ? (store.studentVoiceResponses.reduce((acc, r) => acc + r.ratings.advisorSupport, 0) / totalVoiceResponses).toFixed(1)
    : '0'
  const avgOverall = totalVoiceResponses > 0
    ? (store.studentVoiceResponses.reduce((acc, r) => acc + r.ratings.overallExperience, 0) / totalVoiceResponses).toFixed(1)
    : '0'

  // Student Voice factor frequency
  const factorCounts: Record<string, number> = {}
  store.studentVoiceResponses.forEach(r => {
    r.primaryFactors.forEach(f => {
      factorCounts[f] = (factorCounts[f] || 0) + 1
    })
  })
  const voiceFactorData = Object.entries(factorCounts).map(([name, count]) => {
    const truncated = name.length > 28 ? name.substring(0, 28) + '...' : name
    return { name: truncated, fullName: name, count }
  }).sort((a, b) => b.count - a.count)

  function handleExport() {
    store.addAuditLog({
      userId: 'QA001',
      userName: 'QA Coordinator',
      userRole: 'qa_chair',
      action: 'qa_exported_data',
      description: 'Exported QA statistics and Student Voice report',
    })
    addToast(
      'info',
      t('ส่งออกรายงานแล้ว', 'Export Generated'),
      t('ข้อมูลรายงานการประกันคุณภาพและเสียงสะท้อนนักศึกษา (AUN-QA) ถูกดาวน์โหลดเรียบร้อย', 'QA and Student Voice accreditation report exported successfully.')
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('แดชบอร์ดประกันคุณภาพ & การประเมินผล', 'QA & Accreditation Dashboard')}
        description={t('ตัวชี้วัดการให้คำปรึกษาของอาจารย์ อัตราคงอยู่ของนักศึกษา และสถิติเพื่อการประกันคุณภาพการศึกษา (AUN-QA)', 'Faculty advising metrics, student persistence analytics, and accreditation evidence.')}
        actions={
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5 text-slate-500" /> {t('ส่งออกรายงาน AUN-QA', 'Export AUN-QA Report')}
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>{t('ภาพรวมระบบและตัวชี้วัด', 'General Metrics & Workload')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('student_voice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'student_voice'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquareHeart className="h-4 w-4" />
          <span>{t('เสียงของนักศึกษา (กรณีลาออก/พักการศึกษา)', 'Student Voice — Resignation/Leave')}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-sky-200/40 text-sky-900 dark:text-sky-100 font-extrabold">
            {totalVoiceResponses}
          </span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label={t('คำร้องทั้งหมด', 'Total Requests')} value={totalRequests} icon={<BarChart3 className="h-5 w-5" />} color="sky" />
            <StatCard label={t('ให้คำปรึกษาสำเร็จ', 'Completed Sessions')} value={totalSessions} icon={<CalendarClock className="h-5 w-5" />} color="sky" />
            <StatCard label={t('งานติดตามผลทั้งหมด', 'Total Follow-ups')} value={totalFollowUps} icon={<ListChecks className="h-5 w-5" />} color="sky" />
            <StatCard label={t('อัตราสำเร็จของงาน', 'Completion Rate')} value={`${fuRate}%`} icon={<TrendingUp className="h-5 w-5" />} color="sky" />
            <StatCard label={t('เคสขอลาออก/ลาพัก', 'Exit & Leaves')} value={totalExitCases} icon={<UserX className="h-5 w-5" />} color="red" />
            <StatCard label={t('เคสเตือนภัยวิชาการ', 'Early Warnings')} value={totalWarnings} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('สัดส่วนหัวข้อการขอคำปรึกษา', 'Advising Distribution by Topic')}
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
                <UserX className="h-4 w-4 text-rose-600 dark:text-rose-400" /> {t('สัดส่วนสาเหตุการขอลาออกและลาพัก', 'Exit & Leave Cases by Category')}
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
              <CalendarClock className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('ภาระงานอาจารย์ที่ปรึกษาและการมีส่วนร่วม', 'Faculty Advisor Workload & Engagement')}
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
        </>
      ) : (
        /* Student Voice Tab */
        <div className="space-y-6">
          {/* Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-sky-50/50 to-indigo-50 dark:from-sky-950/70 dark:to-slate-900 border border-sky-200/80 dark:border-sky-800 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-600 text-white flex-shrink-0">
                <MessageSquareHeart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{t('ข้อมูลเชิงคุณภาพเสียงของนักศึกษา (Student Voice Analysis)', 'Student Voice Qualitative Analysis')}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    AUN-QA Criteria 6 & 8
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {t(
                    'รวบรวมข้อเสนอแนะโดยสมัครใจจากนักศึกษาที่ขอลาออกหรือลาพัก เพื่อนำไปปรับปรุงโครงสร้างหลักสูตร กระบวนการเรียนการสอน และมาตรการช่วยเหลือนักศึกษาแบบเชิงรุก',
                    'Aggregated voluntary feedback from departing/on-leave students to enhance curriculum design, pedagogical methods, and proactive academic support.'
                  )}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/60 dark:bg-sky-900/40 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('คุ้มครองข้อมูลส่วนบุคคล & ไร้ผลต่อคำร้อง', 'De-identified & Confidential')}</span>
            </div>
          </div>

          {/* Average Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label={t('ความพึงพอใจต่อหลักสูตร', 'Curriculum Score')} value={`${avgCurriculum} / 5`} icon={<Star className="h-5 w-5" />} color="sky" />
            <StatCard label={t('คุณภาพการสอน', 'Teaching Quality')} value={`${avgTeaching} / 5`} icon={<Star className="h-5 w-5" />} color="sky" />
            <StatCard label={t('การดูแลของอาจารย์ที่ปรึกษา', 'Advisor Mentorship')} value={`${avgAdvisor} / 5`} icon={<Star className="h-5 w-5" />} color="emerald" />
            <StatCard label={t('ประสบการณ์ภาพรวม', 'Overall Experience')} value={`${avgOverall} / 5`} icon={<Sparkles className="h-5 w-5" />} color="purple" />
          </div>

          {/* Primary Factors Chart */}
          <Card>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              {t('ปัจจัยสำคัญที่นักศึกษาระบุว่าส่งผลต่อการลาออก / ลาพัก', 'Key Contributing Factors from Student Voice')}
            </h3>
            <div className="h-64">
              {voiceFactorData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={voiceFactorData} layout="vertical" margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: chartTheme.axis }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: chartTheme.axis }} width={180} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartTheme.tooltipBg,
                        borderColor: chartTheme.tooltipBorder,
                        color: chartTheme.tooltipText,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(val, _name, item) => [val, (item.payload as any).fullName]}
                    />
                    <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]} name={t('จำนวนนักศึกษา', 'Student Count')} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-slate-400">
                  {t('ยังไม่มีข้อมูลปัจจัยจากแบบสอบถาม', 'No survey factor data recorded')}
                </div>
              )}
            </div>
          </Card>

          {/* Qualitative Feedback Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Quote className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              {t('เสียงสะท้อนและความคิดเห็นของนักศึกษา (Verbatim Qualitative Feedback)', 'Verbatim Student Voice Quotes')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.studentVoiceResponses.map((res) => (
                <div
                  key={res.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    {/* Header: Student badge + Type */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {res.isAnonymous ? t('ไม่ระบุตัวตน (Anonymous)', 'Anonymous') : (res.studentCode || t('นักศึกษา', 'Student'))}
                      </span>
                      <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 capitalize">
                        {res.exitType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Academic Year */}
                    <p className="text-[11px] text-slate-400 font-medium">{res.academicYear}</p>

                    {/* Factors Tags */}
                    <div className="flex flex-wrap gap-1">
                      {res.primaryFactors.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-800/60"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>

                    {/* Verbatim quote 1 */}
                    {res.whatCouldUniversityDoBetter && (
                      <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {t('สิ่งที่อยากให้มหาวิทยาลัยช่วยเหลือ:', 'What could university do:')}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                          "{res.whatCouldUniversityDoBetter}"
                        </p>
                      </div>
                    )}

                    {/* Verbatim quote 2 */}
                    {res.curriculumImprovementSuggestions && (
                      <div className="p-2.5 bg-sky-50/50 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900/40 text-xs">
                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
                          {t('ข้อเสนอแนะต่อหลักสูตร:', 'Curriculum suggestions:')}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                          "{res.curriculumImprovementSuggestions}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer ratings & date */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="h-3 w-3 fill-amber-500" />
                      <span>{res.ratings.overallExperience}/5</span>
                    </div>
                    <span>{new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
