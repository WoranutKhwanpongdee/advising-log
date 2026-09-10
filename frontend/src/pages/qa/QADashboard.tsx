// ============================================================
// QA / Program Chair — Dashboard (Minimal White & Sky Blue)
// ============================================================

import { useState, type ReactNode } from 'react'
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
  Brain,
  ArrowRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import QualitativeExitAnalysis from './QualitativeExitAnalysis'

const PIE_COLORS = ['#0284c7', '#38bdf8', '#7dd3fc', '#cbd5e1', '#94a3b8', '#64748b', '#f59e0b', '#ef4444']


type VoiceScoreTone = 'sky' | 'emerald' | 'violet'

const voiceScoreTone: Record<
  VoiceScoreTone,
  { icon: string; accent: string }
> = {
  sky: {
    icon: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/35 dark:text-sky-300 dark:border-sky-900/50',
    accent: 'before:bg-sky-500',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/35 dark:text-emerald-300 dark:border-emerald-900/50',
    accent: 'before:bg-emerald-500',
  },
  violet: {
    icon: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/35 dark:text-violet-300 dark:border-violet-900/50',
    accent: 'before:bg-violet-500',
  },
}

function VoiceScoreCard({
  label,
  value,
  icon,
  tone = 'sky',
}: {
  label: string
  value: string
  icon: ReactNode
  tone?: VoiceScoreTone
}) {
  const style = voiceScoreTone[tone]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0e1424] p-4 shadow-sm before:absolute before:inset-x-0 before:top-0 before:h-0.5 ${style.accent}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-11 w-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${style.icon}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </div>
          <div className="mt-1 text-sm font-medium leading-5 text-slate-600 dark:text-slate-300">
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QADashboard() {
  const store = useStore()
  const { addToast } = useToast()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState<'overview' | 'exit_qualitative' | 'student_voice'>('overview')

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
    const count = store.requests.filter(r => r.category === c.value).length
    return {
      name: language === 'th' ? c.labelTh : c.labelEn,
      count,
      percentage: totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0,
    }
  }).filter(d => d.count > 0).sort((a, b) => b.count - a.count)

  // Exit reason distribution
  const exitData = EXIT_REASON_CODES.map(r => ({
    name: language === 'th' ? r.labelTh : r.labelEn,
    value: store.exitCases.filter(e => e.reasonCode === r.value).length,
  })).filter(d => d.value > 0)
  const exitTotal = exitData.reduce((sum, item) => sum + item.value, 0)

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
  const voiceFactorData = Object.entries(factorCounts)
    .map(([name, count]) => ({ name, fullName: name, count }))
    .sort((a, b) => b.count - a.count)

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
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
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
          onClick={() => setActiveTab('exit_qualitative')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'exit_qualitative'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Brain className="h-4 w-4" />
          <span>{t('วิเคราะห์เจาะลึกทำไมลาออก / พักการศึกษา (Qualitative)', 'Why Resign / Leave (Qualitative)')}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-extrabold border border-rose-200/60 dark:border-rose-800/60">
            {totalExitCases}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('student_voice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
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

      {activeTab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
              <div className="h-[28rem] sm:h-[30rem]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 16 }} barCategoryGap={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: chartTheme.axis }} tickLine={false} axisLine={false} width={210} interval={0} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartTheme.tooltipBg,
                        borderColor: chartTheme.tooltipBorder,
                        color: chartTheme.tooltipText,
                        borderRadius: '8px',
                        fontSize: '11px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ color: chartTheme.tooltipText }}
                      formatter={(value, _name, item) => [`${value} ${t('คำร้อง', 'requests')} (${item.payload.percentage}%)`, t('จำนวน', 'Count')]}
                    />
                    <Bar dataKey="count" fill="#0284c7" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Exit Reason Distribution */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserX className="h-4 w-4 text-rose-600 dark:text-rose-400" /> {t('สัดส่วนสาเหตุการขอลาออกและลาพัก', 'Exit & Leave Cases by Category')}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('exit_qualitative')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer"
                >
                  <span>{t('วิเคราะห์เจาะลึกเชิงคุณภาพ', 'Explore Qualitative')}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="h-72">
                {exitData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 8, right: 8, bottom: 24, left: 8 }}>
                      <Pie
                        data={exitData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={78}
                        paddingAngle={3}
                        stroke={isDark ? '#0f172a' : '#ffffff'}
                        strokeWidth={3}
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
                        formatter={(value, name) => {
                          const count = Number(value || 0)
                          const percentage = exitTotal > 0 ? Math.round((count / exitTotal) * 100) : 0
                          return [`${count} (${percentage}%)`, name]
                        }}
                      />
                      <Legend
                        iconSize={8}
                        wrapperStyle={{ fontSize: 10, color: chartTheme.axis, lineHeight: '18px', paddingTop: 8 }}
                        formatter={(value: string) => (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {value.length > 30 ? `${value.slice(0, 30)}...` : value}
                          </span>
                        )}
                      />
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
            <div className="h-52 sm:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={advisorWorkload}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: chartTheme.axis }} />
                  <YAxis tick={{ fontSize: 10, fill: chartTheme.axis }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      color: chartTheme.tooltipText,
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    itemStyle={{ color: chartTheme.tooltipText }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, color: chartTheme.axis }} />
                  <Bar dataKey="students" fill="#0284c7" name={t('นักศึกษาในความดูแล', 'Assigned Advisees')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="requests" fill="#38bdf8" name={t('คำร้องที่ได้รับ', 'Student Requests')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sessions" fill="#64748b" name={t('ครั้งที่ให้คำปรึกษาสำเร็จ', 'Completed Sessions')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'exit_qualitative' && (
        <QualitativeExitAnalysis />
      )}

      {activeTab === 'student_voice' && (
        /* Student Voice Tab */
        <div className="space-y-7">
          {/* Student Voice Header */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0e1424] p-5 sm:p-6 shadow-sm">
            <div className="absolute inset-y-0 left-0 w-1 bg-sky-500" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pl-1">
              <div className="flex items-start gap-4 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 text-sky-600 dark:text-sky-300 flex items-center justify-center flex-shrink-0">
                  <MessageSquareHeart className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {t('ข้อมูลเชิงคุณภาพเสียงของนักศึกษา', 'Student Voice Qualitative Analysis')}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      AUN-QA Criteria 6 & 8
                    </span>
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {t(
                      'รวบรวมข้อเสนอแนะโดยสมัครใจจากนักศึกษาที่ขอลาออกหรือลาพัก เพื่อค้นหาปัจจัยสำคัญและนำข้อมูลไปปรับปรุงหลักสูตร การเรียนการสอน และระบบช่วยเหลือนักศึกษา',
                      'Aggregated voluntary feedback from departing or on-leave students to identify key drivers and improve curriculum, teaching, and student support.'
                    )}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 self-start lg:self-auto">
                <ShieldCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span>{t('ไม่ระบุตัวตนและเก็บข้อมูลเป็นความลับ', 'De-identified & Confidential')}</span>
              </div>
            </div>
          </section>

          {/* Average Scores */}
          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  {t('คะแนนประสบการณ์จากนักศึกษา', 'Student Experience Scores')}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t(
                    `ค่าเฉลี่ยจากแบบประเมิน ${totalVoiceResponses} รายการ`,
                    `Average ratings from ${totalVoiceResponses} responses`
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <VoiceScoreCard
                label={t('ความพึงพอใจต่อหลักสูตร', 'Curriculum Score')}
                value={`${avgCurriculum} / 5`}
                icon={<Star className="h-5 w-5" />}
                tone="sky"
              />
              <VoiceScoreCard
                label={t('คุณภาพการสอน', 'Teaching Quality')}
                value={`${avgTeaching} / 5`}
                icon={<Star className="h-5 w-5" />}
                tone="sky"
              />
              <VoiceScoreCard
                label={t('การดูแลของอาจารย์ที่ปรึกษา', 'Advisor Mentorship')}
                value={`${avgAdvisor} / 5`}
                icon={<Star className="h-5 w-5" />}
                tone="emerald"
              />
              <VoiceScoreCard
                label={t('ประสบการณ์ภาพรวม', 'Overall Experience')}
                value={`${avgOverall} / 5`}
                icon={<Sparkles className="h-5 w-5" />}
                tone="violet"
              />
            </div>
          </section>

          {/* Primary Factors Chart */}
          <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0e1424] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  {t(
                    'ปัจจัยสำคัญที่นักศึกษาระบุว่าส่งผลต่อการลาออก / ลาพัก',
                    'Key Contributing Factors from Student Voice'
                  )}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {t(
                    'เรียงตามจำนวนครั้งที่ปัจจัยนั้นถูกระบุในแบบประเมิน เพื่อช่วยให้เห็นประเด็นที่ควรให้ความสำคัญก่อน',
                    'Ranked by frequency of mentions to highlight the issues that may need attention first.'
                  )}
                </p>
              </div>

              <span className="inline-flex items-center self-start rounded-full border border-sky-100 dark:border-sky-900/50 bg-sky-50 dark:bg-sky-950/35 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                {t(`${voiceFactorData.length} ปัจจัย`, `${voiceFactorData.length} factors`)}
              </span>
            </div>

            <div
              style={{ height: Math.max(360, voiceFactorData.length * 56) }}
              className="w-full"
            >
              {voiceFactorData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={voiceFactorData}
                    layout="vertical"
                    margin={{ top: 4, right: 28, bottom: 6, left: 12 }}
                    barCategoryGap={10}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartTheme.grid}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: chartTheme.axis }}
                      tickLine={false}
                      axisLine={{ stroke: chartTheme.grid }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={260}
                      interval={0}
                      tick={{ fontSize: 12, fill: chartTheme.axis }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartTheme.tooltipBg,
                        borderColor: chartTheme.tooltipBorder,
                        color: chartTheme.tooltipText,
                        borderRadius: '10px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgb(15 23 42 / 0.08)',
                      }}
                      itemStyle={{ color: chartTheme.tooltipText }}
                      formatter={(val, _name, item) => [
                        `${val} ${t('ครั้ง', 'mentions')}`,
                        (item.payload as any).fullName,
                      ]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#0f78b8"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={40}
                      name={t('จำนวนครั้งที่ถูกระบุ', 'Mentions')}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-400">
                  {t('ยังไม่มีข้อมูลปัจจัยจากแบบสอบถาม', 'No survey factor data recorded')}
                </div>
              )}
            </div>
          </Card>

          {/* Qualitative Feedback */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <Quote className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  {t(
                    'เสียงสะท้อนและความคิดเห็นของนักศึกษา',
                    'Verbatim Student Voice Feedback'
                  )}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {t(
                    'อ่านข้อความจริงควบคู่กับปัจจัยหลักและคะแนนประสบการณ์ เพื่อให้เห็นบริบทของแต่ละกรณี',
                    'Review student comments together with key factors and experience ratings for case context.'
                  )}
                </p>
              </div>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t(`${totalVoiceResponses} ความคิดเห็น`, `${totalVoiceResponses} responses`)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {store.studentVoiceResponses.map((res) => {
                const isWithdrawal =
                  res.exitType === 'withdrawal' || res.exitType === 'dropout'

                return (
                  <article
                    key={res.id}
                    className="bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-sky-200 dark:hover:border-sky-900/60 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-4">
                      {/* Meta */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {res.isAnonymous
                              ? t('ไม่ระบุตัวตน', 'Anonymous')
                              : res.studentCode || t('นักศึกษา', 'Student')}
                          </span>
                          <p className="mt-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {res.academicYear}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            isWithdrawal
                              ? 'border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/35 dark:text-rose-300'
                              : 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-300'
                          }`}
                        >
                          {isWithdrawal
                            ? t('ลาออกถาวร', 'Withdrawal')
                            : t('พักการศึกษา', 'Leave of Absence')}
                        </span>
                      </div>

                      {/* Factor tags */}
                      {res.primaryFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {res.primaryFactors.map((fac, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                            >
                              {fac}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* What University Could Do */}
                      {res.whatCouldUniversityDoBetter && (
                        <div className="rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-3.5">
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                            <Quote className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                            {t(
                              'สิ่งที่อยากให้มหาวิทยาลัยช่วยเหลือ',
                              'What the university could improve'
                            )}
                          </div>
                          <p className="text-sm leading-6 italic text-slate-600 dark:text-slate-300">
                            “{res.whatCouldUniversityDoBetter}”
                          </p>
                        </div>
                      )}

                      {/* Curriculum Suggestions */}
                      {res.curriculumImprovementSuggestions && (
                        <div className="rounded-xl border-l-2 border-l-sky-500 border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/25 p-3.5">
                          <div className="mb-2 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                            {t('ข้อเสนอแนะต่อหลักสูตร', 'Curriculum suggestion')}
                          </div>
                          <p className="text-sm leading-6 italic text-slate-600 dark:text-slate-300">
                            “{res.curriculumImprovementSuggestions}”
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <footer className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
                      <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>{res.ratings.overallExperience}/5</span>
                      </div>
                      <span>{new Date(res.createdAt).toLocaleDateString()}</span>
                    </footer>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
