import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/contexts/ToastContext'
import { PageHeader, DataTable, StatusBadge, Button, SearchInput, Modal, UserAvatar } from '@/components/ui'
import type { User, UserRole } from '@/types'
import { ChevronDown, Bot, ExternalLink, UserPlus, ShieldCheck } from 'lucide-react'

export default function UserManagement() {
  const store = useStore()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  // Add User / Pre-register Email Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [isCodeCustomized, setIsCodeCustomized] = useState(false)
  const [newRole, setNewRole] = useState<UserRole>('student')
  const [newDept, setNewDept] = useState('School of Applied Digital Technology (ADT)')

  // Helper to safely determine code by role & checking database users
  function getSuggestedCode(role: UserRole, email: string): string {
    const emailPrefix = email.trim().split('@')[0]
    
    // 1. Student: Only extract real digits if present in institutional email (e.g. 6631503001)
    // Never synthesize or invent fake student ID numbers!
    if (role === 'student' || /^\d/.test(emailPrefix) || email.includes('@student.') || email.includes('@lamduan.')) {
      if (/^\d{8,12}/.test(emailPrefix)) {
        return emailPrefix
      }
      return '' // Leave empty so admin provides the student's actual university ID
    }

    // 2. Faculty Advisor: Query database for highest existing ADV ID
    if (role === 'advisor') {
      const numbers = store.users
        .map(u => {
          const match = u.code.match(/^ADV(\d+)$/i)
          return match ? parseInt(match[1], 10) : 0
        })
        .filter(n => n > 0)
      const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0
      return `ADV${String(maxNum + 1).padStart(3, '0')}`
    }

    // 3. QA Chair: Query database for highest existing QA ID
    if (role === 'qa_chair') {
      const numbers = store.users
        .map(u => {
          const match = u.code.match(/^QA(\d+)$/i)
          return match ? parseInt(match[1], 10) : 0
        })
        .filter(n => n > 0)
      const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0
      return `QA${String(maxNum + 1).padStart(3, '0')}`
    }

    // 4. System Admin: Query database for highest existing ADM ID
    if (role === 'admin') {
      const numbers = store.users
        .map(u => {
          const match = u.code.match(/^ADM(\d+)$/i)
          return match ? parseInt(match[1], 10) : 0
        })
        .filter(n => n > 0)
      const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0
      return `ADM${String(maxNum + 1).padStart(3, '0')}`
    }

    return emailPrefix ? emailPrefix.toUpperCase() : ''
  }

  // Auto-detect Student ID from email prefix or student code
  const isStudentDetected =
    /^\d/.test(newEmail.trim().split('@')[0]) ||
    /^\d/.test(newCode.trim()) ||
    newEmail.includes('@student.') ||
    newEmail.includes('@lamduan.')

  const effectiveRole: UserRole = isStudentDetected ? 'student' : newRole

  // Automatically update code if user has not manually customized it
  function handleEmailChange(email: string) {
    setNewEmail(email)
    if (!isCodeCustomized) {
      const isStu = /^\d/.test(email.trim().split('@')[0]) || email.includes('@student.') || email.includes('@lamduan.')
      const r = isStu ? 'student' : newRole
      setNewCode(getSuggestedCode(r, email))
    }
  }

  function handleRoleChange(r: UserRole) {
    setNewRole(r)
    if (!isCodeCustomized) {
      setNewCode(getSuggestedCode(r, newEmail))
    }
  }

  function openAddModal() {
    setNewEmail('')
    setNewName('')
    setNewRole('student')
    setNewDept('School of Applied Digital Technology (ADT)')
    setIsCodeCustomized(false)
    setNewCode('')
    setShowAddModal(true)
  }

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail.trim() || !newName.trim()) {
      addToast('error', t('กรุณากรอกอีเมลและชื่อ-นามสกุล', 'Please enter email and full name'))
      return
    }

    // Student ID must be present
    if (effectiveRole === 'student' && !newCode.trim()) {
      addToast('error', t('กรุณาระบุรหัสนักศึกษา (Student ID)', 'Please enter student ID code'))
      return
    }

    const email = newEmail.trim().toLowerCase()

    // Check if duplicate
    const exists = store.users.some(u => u.email.toLowerCase() === email)
    if (exists) {
      addToast('warning', t('อีเมลนี้ได้รับการลงทะเบียนในระบบแล้ว', 'This email is already registered in the system'))
      return
    }

    const generatedCode = newCode.trim() || (effectiveRole === 'student' ? email.split('@')[0] : getSuggestedCode(effectiveRole, email))
    const generatedId = `${effectiveRole.toUpperCase().slice(0, 3)}_${Date.now().toString().slice(-6)}`

    const newUser: User = {
      id: generatedId,
      code: generatedCode,
      name: newName.trim(),
      email,
      role: effectiveRole,
      department: newDept,
      isActive: true,
      hasAiAccess: effectiveRole !== 'student',
      createdAt: new Date().toISOString().split('T')[0],
    }

    store.addUser(newUser)
    addToast(
      'success',
      t('ลงทะเบียนผู้ใช้สำเร็จ', 'User Registered Successfully'),
      t(`เพิ่มและลงทะเบียนอีเมล ${email} (${effectiveRole}) สำเร็จแล้ว`, `User email ${email} (${effectiveRole}) successfully registered`)
    )
    setShowAddModal(false)
    setNewEmail('')
    setNewName('')
    setNewCode('')
    setNewRole('student')
  }

  const roleOptions: { value: UserRole | 'all'; labelTh: string; labelEn: string }[] = [
    { value: 'all', labelTh: 'ทุกบทบาท (All Roles)', labelEn: 'All Roles' },
    { value: 'student', labelTh: 'นักศึกษา (Student)', labelEn: 'Student' },
    { value: 'advisor', labelTh: 'อาจารย์ที่ปรึกษา (Advisor)', labelEn: 'Advisor' },
    { value: 'qa_chair', labelTh: 'ประกันคุณภาพ/ประธาน (QA)', labelEn: 'QA Chair' },
    { value: 'admin', labelTh: 'ผู้ดูแลระบบ (Admin)', labelEn: 'Admin' },
  ]

  const users = store.users.filter(u => {
    // Apply role filter
    if (roleFilter !== 'all' && u.role !== roleFilter) return false

    // Apply search filter
    if (!search) return true
    const s = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(s) ||
      u.code.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s)
    )
  })

  const columns = [
    {
      key: 'name',
      header: t('ชื่อ-นามสกุล', 'Full Name'),
      render: (u: User) => (
        <div className="flex items-center gap-2.5">
          <UserAvatar name={u.name} avatar={u.avatar} size="sm" />
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-mono">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'code',
      header: t('รหัสประจำตัว', 'User ID / Code'),
      render: (u: User) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-300 font-medium">
          {u.code}
        </span>
      ),
    },
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
    {
      key: 'dept',
      header: t('สำนักวิชา / ส่วนงาน', 'Department'),
      render: (u: User) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{u.department || '—'}</span>
      ),
    },
    {
      key: 'status',
      header: t('สถานะบัญชี', 'Account Status'),
      render: (u: User) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} />,
    },
    {
      key: 'actions',
      header: t('การจัดการ', 'Actions'),
      render: (u: User) => {
        const superAdminEmail = ((import.meta.env.VITE_SUPER_ADMIN_EMAIL as string) || 'se.advisinglog@gmail.com').toLowerCase().trim()
        const isSuperAdmin = u.email?.toLowerCase().trim() === superAdminEmail || u.code === 'ADM-SUPER' || u.id === 'ADM_SE_GOOGLE'
        if (isSuperAdmin) {
          return (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
              {t('คุ้มครองระดับระบบ', 'Root Protected')}
            </span>
          )
        }
        return (
          <Button
            size="sm"
            variant={u.isActive ? 'secondary' : 'primary'}
            onClick={() => {
              store.updateUser(u.id, { isActive: !u.isActive })
              addToast(
                'info',
                u.isActive ? t('ระงับการใช้งานบัญชี', 'Account Deactivated') : t('เปิดใช้งานบัญชี', 'Account Activated'),
                t(`บัญชีของ ${u.name} (${u.code}) ถูก${u.isActive ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}แล้ว`, `User account for ${u.name} has been ${u.isActive ? 'deactivated' : 'activated'}.`)
              )
            }}
          >
            {u.isActive ? t('ปิดการใช้งาน', 'Deactivate') : t('เปิดใช้งาน', 'Activate')}
          </Button>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('การจัดการผู้ใช้งาน', 'User Management')}
        description={t(
          'ตรวจสอบและจัดการบัญชีผู้ใช้งาน นักศึกษาและคณาจารย์ กำหนดบทบาทในระบบ และสถานะบัญชีการใช้งาน',
          'Manage student and faculty accounts, system roles, and account status.'
        )}
        actions={
          <Button onClick={openAddModal}>
            <UserPlus className="h-4 w-4 mr-1.5" />
            {t('เพิ่มผู้ใช้ / ลงทะเบียนอีเมล', 'Add User / Register Email')}
          </Button>
        }
      />

      {/* Quick Link to Dedicated AI Governance */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/40 to-white dark:from-[#0b101b] dark:via-[#0f172a] dark:to-[#0e1424] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {t('ศูนย์ควบคุมระบบ AI และการกำหนดสิทธิ์ (AI Governance Hub)', 'AI & LLM Governance Console')}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t(
                'สำหรับการเปิด/ปิดสิทธิ์ AI รายบุคคลของอาจารย์และ QA รวมทั้งตั้งค่า API Key ส่วนกลาง กรุณาใช้หน้าจัดการ AI โดยเฉพาะ',
                'To manage individual AI permissions for faculty/QA and configure central API keys, visit the dedicated AI Governance console.'
              )}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/admin/ai-governance')}
          className="text-xs px-3 py-1.5 self-start sm:self-auto flex items-center gap-1.5 font-bold cursor-pointer"
        >
          <span>{t('ไปที่หน้าจัดการระบบ AI', 'Go to AI Governance')}</span>
          <ExternalLink className="h-3 w-3 text-sky-500" />
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="max-w-sm flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t('ค้นหาตามชื่อ, รหัส หรืออีเมล...', 'Search by name, ID, or email...')}
          />
        </div>

        {/* Role Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <span>
              {t(
                roleOptions.find(r => r.value === roleFilter)?.labelTh || 'All Roles',
                roleOptions.find(r => r.value === roleFilter)?.labelEn || 'All Roles'
              )}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 py-1 divide-y divide-slate-100 dark:divide-slate-800">
                {roleOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setRoleFilter(option.value as UserRole | 'all')
                      setShowRoleDropdown(false)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                      roleFilter === option.value
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t(option.labelTh, option.labelEn)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        emptyMessage={t('ไม่พบข้อมูลผู้ใช้งานที่ตรงกับเงื่อนไข', 'No users match the search and filter criteria.')}
      />

      {/* Add User / Pre-register Email Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={t('เพิ่มผู้ใช้งาน / ลงทะเบียนอีเมลใหม่', 'Add User / Pre-Register Google Email')}
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t(
              'ผู้ใช้งานที่มีอีเมลตรงกับที่ระบุในรายการนี้เท่านั้นจึงจะสามารถเข้าสู่ระบบผ่าน Google OAuth ได้',
              'Only users whose institutional emails are registered here will be permitted to log in via Google SSO.'
            )}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              {t('อีเมลมหาวิทยาลัย (Google Email) *', 'University Email Address *')}
            </label>
            <input
              type="email"
              required
              placeholder="e.g. 6631503099@lamduan.mfu.ac.th or advisor@mfu.ac.th"
              value={newEmail}
              onChange={e => handleEmailChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              {t('ชื่อ-นามสกุล *', 'Full Name *')}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Somchai Jaidee"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t('รหัสประจำตัว (Code) *', 'User / Student Code *')}
                </label>
                {!isCodeCustomized && newCode && (
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-0.5">
                    ⚡ {t('สร้างอัตโนมัติ', 'Auto-generated')}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 6631503099 or ADV004"
                  value={newCode}
                  onChange={e => {
                    setNewCode(e.target.value)
                    setIsCodeCustomized(true)
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                {isCodeCustomized && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCodeCustomized(false)
                      setNewCode(getSuggestedCode(effectiveRole, newEmail))
                    }}
                    className="absolute right-2 top-2 px-2 py-0.5 text-[10px] text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-md cursor-pointer transition-colors"
                    title={t('สร้างรหัสใหม่อัตโนมัติ', 'Auto-regenerate code')}
                  >
                    ↻ {t('รีเซ็ต', 'Reset')}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('บทบาทในระบบ *', 'System Role *')}
              </label>
              {isStudentDetected ? (
                <div className="px-3.5 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  <span>{t('นักศึกษา (ตรวจพบรหัส นศ. อัตโนมัติ)', 'Student (Auto-detected from ID)')}</span>
                </div>
              ) : (
                <select
                  value={newRole}
                  onChange={e => handleRoleChange(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="advisor">{t('อาจารย์ที่ปรึกษา (Advisor)', 'Faculty Advisor')}</option>
                  <option value="qa_chair">{t('ประกันคุณภาพ/ประธานหลักสูตร (QA)', 'QA Chair')}</option>
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              {t('สำนักวิชา / ส่วนงาน', 'Department')}
            </label>
            <input
              type="text"
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              {t('ยกเลิก', 'Cancel')}
            </Button>
            <Button
              size="sm"
              type="submit"
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              {t('ลงทะเบียนผู้ใช้', 'Register User')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
