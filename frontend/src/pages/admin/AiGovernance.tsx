import { useState } from 'react'
import {
  Bot,
  Power,
  ShieldCheck,
  KeyRound,
  Users,
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Lock,
  Layers,
  ScrollText,
  Zap,
} from 'lucide-react'
import { PageHeader, Button, DataTable, StatusBadge } from '@/components/ui'
import { useStore } from '@/data/mock-store'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  getStoredGeminiKey,
  setStoredGeminiKey,
  clearStoredGeminiKey,
  testAiConnection,
} from '@/services/aiService'
import type { User } from '@/types'

export default function AiGovernance() {
  const store = useStore()
  const { currentUser } = useAuth()
  const { addToast } = useToast()
  const { t, language } = useLanguage()

  const [activeTab, setActiveTab] = useState<'overview' | 'personnel' | 'audit'>('overview')

  // API Key local state
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiKey())
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; provider?: string } | null>(null)

  // Personnel filter state (strictly faculty/staff - excluding students!)
  const [personnelSearch, setPersonnelSearch] = useState('')
  const [personnelRoleFilter, setPersonnelRoleFilter] = useState<'all' | 'advisor' | 'qa_chair' | 'admin'>('all')
  const [personnelAiFilter, setPersonnelAiFilter] = useState<'all' | 'granted' | 'revoked'>('all')

  const isEnabled = store.systemApiConfig?.isAiApiEnabled !== false
  const provider = store.systemApiConfig?.provider || 'Google Gemini'
  const model = store.systemApiConfig?.model || 'gemini-1.5-flash'

  // Master Switch Handler
  const handleToggleMasterSwitch = () => {
    const nextState = !isEnabled
    store.toggleAiApi(nextState, currentUser?.name || 'Admin')
    addToast(
      nextState ? 'success' : 'warning',
      nextState
        ? t('เปิดใช้งานระบบ AI / LLM เรียบร้อย', 'AI / LLM API Enabled')
        : t('ปิดการใช้งานระบบ AI / LLM ทั้งหมดแล้ว', 'AI / LLM API Disabled'),
      nextState
        ? t('ระบบ AI พร้อมให้บริการสำหรับผู้ที่ได้รับสิทธิ์', 'AI system is now operational for authorized users.')
        : t('ระงับการเรียกโมเดลภาษาภายนอกทั้งหมดชั่วคราว', 'All outbound LLM requests are halted.')
    )
  }

  // Save API Key
  const handleSaveApiKey = () => {
    setStoredGeminiKey(apiKeyInput)
    setTestResult(null)
    addToast(
      'success',
      t('บันทึก API Key เรียบร้อย', 'API Key Saved'),
      t('กุญแจเชื่อมต่อระบบ AI ได้รับการบันทึกใน Local Storage แล้ว', 'AI connection key has been safely updated.')
    )
  }

  // Clear API Key
  const handleClearApiKey = () => {
    clearStoredGeminiKey()
    setApiKeyInput('')
    setTestResult(null)
    addToast(
      'info',
      t('ล้าง API Key แล้ว', 'API Key Removed'),
      t('ระบบจะสลับไปใช้ Offline Smart Intelligence Engine สำหรับการประเมินจำลอง', 'Switched back to local intelligent engine.')
    )
  }

  // Test Connection
  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      const res = await testAiConnection(apiKeyInput)
      setTestResult(res)
      if (res.success) {
        addToast('success', t('ทดสอบการเชื่อมต่อสำเร็จ', 'Connection Test Passed'), res.message)
      } else {
        addToast('error', t('การเชื่อมต่อล้มเหลว', 'Connection Failed'), res.message)
      }
    } finally {
      setIsTesting(false)
    }
  }

  // Handle Toggle Individual Personnel AI Access
  const handleTogglePersonnelAi = (targetUser: User) => {
    const nextState = !targetUser.hasAiAccess
    store.toggleUserAiAccess(targetUser.id, nextState, currentUser?.name || 'Admin')
    addToast(
      nextState ? 'success' : 'info',
      nextState ? t('อนุมัติสิทธิ์ AI เรียบร้อย', 'AI Access Granted') : t('ระงับสิทธิ์ AI เรียบร้อย', 'AI Access Revoked'),
      t(
        `ปรับปรุงสิทธิ์ของ ${targetUser.name} เป็น: ${nextState ? 'อนุมัติ' : 'ระงับ'}`,
        `Updated permissions for ${targetUser.name}: ${nextState ? 'Allowed' : 'Revoked'}`
      )
    )
  }

  // Personnel List — EXCLUDE STUDENTS STRICTLY!
  const facultyAndStaff = store.users.filter(u => u.role !== 'student')
  const totalPersonnelCount = facultyAndStaff.length
  const authorizedPersonnelCount = facultyAndStaff.filter(u => u.hasAiAccess === true).length

  // Filtered Personnel
  const filteredPersonnel = facultyAndStaff.filter(u => {
    if (personnelRoleFilter !== 'all' && u.role !== personnelRoleFilter) return false
    if (personnelAiFilter === 'granted' && u.hasAiAccess !== true) return false
    if (personnelAiFilter === 'revoked' && u.hasAiAccess === true) return false

    if (!personnelSearch) return true
    const s = personnelSearch.toLowerCase()
    return (
      u.name.toLowerCase().includes(s) ||
      u.code.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      (u.department && u.department.toLowerCase().includes(s))
    )
  })

  // Filter AI Audit Logs
  const aiAuditLogs = store.auditLogs.filter(log =>
    log.action === 'user_ai_access_toggled' ||
    log.action.includes('ai') ||
    log.description.toLowerCase().includes('ai') ||
    log.description.toLowerCase().includes('llm')
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('จัดการระบบ AI & กำหนดสิทธิ์ (AI Governance)', 'AI & LLM Governance Console')}
        description={t(
          'ศูนย์รวมการควบคุมโมเดลภาษาขนาดใหญ่ (LLM) สวิตช์หลักของระบบ การตั้งค่า API Key และการกระจายสิทธิ์เฉพาะคณาจารย์และฝ่ายประกันคุณภาพ',
          'Enterprise AI Governance: Master system switch, API credentials, model configuration, and role-targeted delegation for faculty & QA.'
        )}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200/70 dark:border-slate-800 mb-8 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 -mb-px whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-300 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>{t('การตั้งค่าระบบหลัก & API Key', 'System & API Config')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('personnel')}
          className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 -mb-px whitespace-nowrap cursor-pointer ${
            activeTab === 'personnel'
              ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-300 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{t('กำหนดสิทธิ์บุคลากร (อาจารย์ / QA)', 'Personnel Access (Faculty & QA)')}</span>
          <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-sky-100 dark:bg-sky-500/12 text-sky-800 dark:text-sky-300 font-bold border border-sky-200/60 dark:border-sky-500/25">
            {authorizedPersonnelCount} / {totalPersonnelCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 -mb-px whitespace-nowrap cursor-pointer ${
            activeTab === 'audit'
              ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-300 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <ScrollText className="h-4 w-4" />
          <span>{t('ประวัติความปลอดภัย AI (AI Audit)', 'AI Security Logs')}</span>
          {aiAuditLogs.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200/60 dark:border-slate-700/60">
              {aiAuditLogs.length}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SYSTEM OVERVIEW & API CONFIGURATION */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Master Switch Card */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-[#0e1424] dark:to-[#0f172a] border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-premium transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                    isEnabled
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white dark:from-emerald-400 dark:to-emerald-500 shadow-lg shadow-emerald-500/30'
                      : 'bg-gradient-to-br from-rose-500 to-rose-600 text-white dark:from-rose-400 dark:to-rose-500 shadow-lg shadow-rose-500/30'
                  }`}
                >
                  <Bot className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                      {t('สวิตช์ควบคุมหลักของระบบ (Tier 1 System Master Switch)', 'Tier 1 System Master Switch')}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isEnabled
                          ? 'bg-emerald-100 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/25'
                          : 'bg-rose-100 dark:bg-rose-500/12 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/25'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {isEnabled ? t('API: เปิดใช้งานอยู่ (Active)', 'API: Active') : t('API: ปิดใช้งาน (Disabled)', 'API: Disabled')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    {t(
                      'สวิตช์ปิดฉุกเฉินระดับมหาวิทยาลัย หากปิดสวิตช์นี้ ระบบจะระงับการเรียกใช้ AI / LLM ทุกจุดในระบบทันที ไม่ว่าผู้ใช้รายบุคคลจะมีสิทธิ์หรือไม่ เหมาะสำหรับควบคุมงบประมาณหรือช่วงปิดปรับปรุง',
                      'Emergency kill-switch. When turned off, all AI / LLM requests are blocked immediately regardless of user permissions.'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={isEnabled ? 'danger' : 'primary'}
                  onClick={handleToggleMasterSwitch}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm px-6 py-3 font-bold cursor-pointer"
                >
                  <Power className="h-4 w-4" />
                  <span>
                    {isEnabled
                      ? t('คลิกเพื่อปิด AI ทั้งระบบ (Shut Down)', 'Turn Off System AI')
                      : t('คลิกเพื่อเปิดใช้งาน AI (Activate)', 'Turn On System AI')}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Configuration Grid: API Key & Model Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 & 2: API Credentials & Connection */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t('กุญแจเชื่อมต่อโมเดลภาษา (Google Gemini API Credentials)', 'LLM Gateway Credentials')}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {provider} ({model})
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {t('เชื่อมต่อภายนอก', 'External')}
                </span>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('Gemini API Key ส่วนกลางของหลักสูตร', 'Central Gemini API Key')}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-4 pr-12 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="primary" onClick={handleSaveApiKey} className="text-sm px-4 py-2">
                      <Lock className="h-4 w-4 mr-1.5" />
                      {t('บันทึกกุญแจเชื่อมต่อ', 'Save API Key')}
                    </Button>
                    {apiKeyInput && (
                      <Button variant="secondary" onClick={handleClearApiKey} className="text-sm px-4 py-2 text-rose-600 dark:text-rose-400">
                        {t('ล้างค่า', 'Clear')}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    onClick={handleTestConnection}
                    disabled={isTesting || !isEnabled}
                    className="text-sm px-4 py-2 font-bold cursor-pointer"
                  >
                    <Zap className={`h-4 w-4 mr-2 text-sky-500 ${isTesting ? 'animate-spin' : ''}`} />
                    {isTesting ? t('กำลังทดสอบ...', 'Testing...') : t('ทดสอบการเชื่อมต่อ (Test Connection)', 'Test Connection')}
                  </Button>
                </div>

                {/* Connection Status Box */}
                {testResult && (
                  <div
                    className={`p-4 rounded-xl border text-sm flex items-start gap-3 transition-all ${
                      testResult.success
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold">{testResult.success ? t('เชื่อมต่อสำเร็จ', 'Verified Successfully') : t('ไม่สามารถเชื่อมต่อได้', 'Connection Failed')}</p>
                      <p className="text-xs opacity-90 mt-1">{testResult.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* PDPA & Security Guarantee Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-emerald-950/30 dark:to-sky-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('การปกป้องข้อมูลส่วนบุคคล (PDPA Data Protection Policy)', 'PDPA Protection Policy')}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(
                    'ข้อมูลเคสที่ส่งไปวิเคราะห์กับ LLM จะถูกนิรนาม (De-identified) โดยอัตโนมัติ โดยระบบจะไม่ส่งชื่อจริง นามสกุล เลขบัตรประชาชน หรือเบอร์โทรศัพท์ของนักศึกษาออกไปยังภายนอกเด็ดขาด',
                    'All outbound prompts are strictly stripped of PII. Names, national IDs, and contact numbers are replaced with anonymous tokens.'
                  )}
                </p>
              </div>
            </div>

            {/* Column 3: Telemetry & Model Overview */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t('สถิติและโควตาการใช้งาน', 'Quota & Telemetry')}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-200/60 dark:border-sky-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('บุคลากรที่ได้รับสิทธิ์', 'Authorized Personnel')}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                      {Math.round((authorizedPersonnelCount / (totalPersonnelCount || 1)) * 100)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{authorizedPersonnelCount} / {totalPersonnelCount}</p>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${(authorizedPersonnelCount / (totalPersonnelCount || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('โมเดลหลักที่เปิดใช้งาน', 'Active LLM Engine')}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">Gemini 1.5 Flash</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Zap className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Fast & Cost-Smart
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('โหมดสำรองกรณีออฟไลน์', 'Offline Fallback Engine')}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{t('เปิดทำงานอัตโนมัติ', 'Active & Ready')}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Smart Engine
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PERSONNEL ACCESS DELEGATION (EXCLUDES STUDENTS STRICTLY) */}
      {/* ============================================================ */}
      {activeTab === 'personnel' && (
        <div className="space-y-4">
          {/* Strict Role Filtering Notice Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/40 to-white dark:from-[#0b101b] dark:via-[#0f172a] dark:to-[#0e1424] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
                  <span>{t('ระบบกำหนดสิทธิ์เฉพาะบุคลากร (Faculty & QA Staff Only)', 'Faculty & QA Staff Delegation')}</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                    {authorizedPersonnelCount} / {totalPersonnelCount} {t('ได้รับอนุมัติ', 'authorized')}
                  </span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t(
                    '🔒 หน้านี้คัดกรองเฉพาะอาจารย์และฝ่ายประกันคุณภาพเท่านั้น (ตัดนักศึกษาออกทั้งหมด 100%) เพื่อป้องกันการเปิดสิทธิ์ผิดคนและควบคุมค่าใช้จ่ายอย่างรัดกุม',
                    '🔒 Restricted to faculty and QA personnel only. Students are completely excluded from AI access privileges.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-white dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setPersonnelAiFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  personnelAiFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                {t('ทั้งหมด', 'All')}
              </button>
              <button
                type="button"
                onClick={() => setPersonnelAiFilter('granted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  personnelAiFilter === 'granted'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                }`}
              >
                {t('เฉพาะมีสิทธิ์', 'Allowed')}
              </button>
              <button
                type="button"
                onClick={() => setPersonnelAiFilter('revoked')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  personnelAiFilter === 'revoked'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                {t('ระงับสิทธิ์', 'Revoked')}
              </button>
            </div>
          </div>

          {/* Search & Role Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('ค้นหาชื่อ, รหัสบุคลากร, สำนักวิชา...', 'Search name, employee ID, department...')}
                value={personnelSearch}
                onChange={e => setPersonnelSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={personnelRoleFilter}
                onChange={e => setPersonnelRoleFilter(e.target.value as any)}
                className="px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer transition-all"
              >
                <option value="all">{t('ทุกบทบาทบุคลากร (All Faculty & Staff)', 'All Faculty & Staff')}</option>
                <option value="qa_chair">{t('ประกันคุณภาพ / ประธานสาขา (QA Chair)', 'QA Chair')}</option>
                <option value="advisor">{t('อาจารย์ที่ปรึกษา (Advisor)', 'Advisor')}</option>
                <option value="admin">{t('ผู้ดูแลระบบ (Admin)', 'Admin')}</option>
              </select>
            </div>
          </div>

          {/* Personnel Table */}
          <div className="bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200/70 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <DataTable
              data={filteredPersonnel}
              columns={[
                {
                  key: 'name',
                  header: t('อาจารย์ / บุคลากร', 'Faculty & Staff'),
                  render: (u: User) => (
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400 font-mono">
                          {u.code} • {u.email}
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'role',
                  header: t('บทบาท', 'Role'),
                  render: (u: User) => {
                    const roleLabels: Record<string, { th: string; en: string }> = {
                      advisor: { th: 'อาจารย์ที่ปรึกษา', en: 'Faculty Advisor' },
                      qa_chair: { th: 'ประกันคุณภาพ / ประธาน', en: 'QA / Chair' },
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
                {
                  key: 'dept',
                  header: t('สำนักวิชา / ส่วนงาน', 'Department'),
                  render: (u: User) => (
                    <span className="text-xs text-slate-600 dark:text-slate-300">{u.department || '—'}</span>
                  ),
                },
                {
                  key: 'aiAccess',
                  header: t('สิทธิ์การใช้งาน AI', 'AI Access'),
                  render: (u: User) => {
                    const hasAccess = u.hasAiAccess === true
                    return (
                      <button
                        type="button"
                        onClick={() => handleTogglePersonnelAi(u)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                          hasAccess
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750'
                        }`}
                        title={t('คลิกเพื่อเปิดหรือระงับสิทธิ์ AI สำหรับบุคคลนี้', 'Click to grant or revoke AI permission')}
                      >
                        <Bot className={`h-3.5 w-3.5 ${hasAccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                        <span>{hasAccess ? t('มีสิทธิ์ AI (Allowed)', 'Allowed') : t('ระงับสิทธิ์ (Revoked)', 'Revoked')}</span>
                      </button>
                    )
                  },
                },
                {
                  key: 'status',
                  header: t('สถานะบัญชี', 'Account Status'),
                  render: (u: User) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} />,
                },
              ]}
              emptyMessage={t('ไม่พบข้อมูลบุคลากรที่ตรงกับเงื่อนไข', 'No matching faculty or staff found')}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: AI SECURITY AUDIT LOGS */}
      {/* ============================================================ */}
      {activeTab === 'audit' && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <ScrollText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {t('บันทึกการกระทำและประวัติความปลอดภัย AI (AI Governance Audit Trail)', 'AI Governance Audit Trail')}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {aiAuditLogs.length} {t('รายการที่บันทึก', 'entries recorded')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {t('บันทึกเรียลไทม์', 'Real-time')}
                </span>
              </div>
            </div>

            {aiAuditLogs.length === 0 ? (
              <div className="py-16 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-4">
                  <ScrollText className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t('ยังไม่มีประวัติการเปลี่ยนแปลงสิทธิ์ AI ในระบบ', 'No AI security events logged yet.')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {t('การเปลี่ยนแปลงสิทธิ์ AI และการกระทำที่เกี่ยวข้องจะถูกบันทึกที่นี่เมื่อเกิดขึ้น', 'AI permission changes and related actions will be logged here as they occur.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiAuditLogs.map((log, index) => (
                  <div 
                    key={log.id} 
                    className="group relative p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200/60 dark:hover:border-indigo-800/60 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/60 dark:to-purple-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">{log.description}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{log.userName}</span>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span className="font-mono text-xs">{log.userRole}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-mono whitespace-nowrap">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{new Date(log.createdAt).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Timeline connector for consecutive items */}
                    {index < aiAuditLogs.length - 1 && (
                      <div className="absolute left-9 top-12 bottom-0 w-px bg-gradient-to-b from-indigo-200/60 to-transparent dark:from-indigo-800/60" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
