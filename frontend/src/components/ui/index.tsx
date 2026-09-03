// ============================================================
// Reusable UI Components — Ultra-Clean Minimal White & Sky Blue
// ============================================================

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info, ChevronLeft, ChevronRight, Search, FileText } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import type { RequestStatus, FollowUpStatus, ReferralStatus, ExitCaseStatus, AppointmentStatus, EarlyWarningSeverity, DocumentStatus } from '@/types'

// --- Status Badge ---

type BadgeStatus = RequestStatus | FollowUpStatus | ReferralStatus | ExitCaseStatus | AppointmentStatus | EarlyWarningSeverity | DocumentStatus | string

const statusLabelsTh: Record<string, string> = {
  requested: 'ยื่นคำร้องแล้ว',
  scheduled: 'นัดหมายแล้ว',
  active: 'เปิดใช้งาน / ปกติ',
  in_progress: 'กำลังดำเนินการ',
  open: 'เปิดเคสใหม่',
  uploaded: 'อัปโหลดแล้ว',
  completed: 'เสร็จสิ้นสมบูรณ์',
  resolved: 'ยุติ / แก้ไขแล้ว',
  signed: 'ลงนามเรียบร้อย',
  approved: 'อนุมัติแล้ว',
  pending: 'รอดำเนินการ',
  under_review: 'กำลังตรวจสอบ',
  monitoring: 'เฝ้าระวัง / ติดตาม',
  required: 'ต้องยื่นเอกสาร',
  medium: 'ความเสี่ยงปานกลาง',
  overdue: 'เกินกำหนดเวลา',
  high: 'ความเสี่ยงสูง',
  critical: 'วิกฤตเร่งด่วน',
  rejected: 'ไม่อนุมัติ / ปฏิเสธ',
  cancelled: 'ยกเลิก',
  closed: 'ปิดเคส',
  low: 'ความเสี่ยงต่ำ',
  referred: 'ส่งต่อหน่วยงานแล้ว',
  inactive: 'ปิดใช้งาน',
}

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  // Sky Blue for active, open, requested, scheduled
  requested: { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-200/60', dot: 'bg-sky-500' },
  scheduled: { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-200/60', dot: 'bg-sky-500' },
  active: { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-200/60', dot: 'bg-sky-500' },
  in_progress: { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-200/60', dot: 'bg-sky-500' },
  open: { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-200/60', dot: 'bg-sky-500' },
  uploaded: { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-200/60', dot: 'bg-sky-500' },

  // Emerald for completed, resolved, signed, approved
  completed: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200/60', dot: 'bg-emerald-500' },
  resolved: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200/60', dot: 'bg-emerald-500' },
  signed: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200/60', dot: 'bg-emerald-500' },
  approved: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200/60', dot: 'bg-emerald-500' },

  // Amber for pending, review, monitoring, required
  pending: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200/60', dot: 'bg-amber-500' },
  under_review: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200/60', dot: 'bg-amber-500' },
  monitoring: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200/60', dot: 'bg-amber-500' },
  required: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200/60', dot: 'bg-amber-500' },
  medium: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200/60', dot: 'bg-amber-500' },

  // Rose/Red for high, critical, overdue, rejected
  overdue: { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-200/60', dot: 'bg-rose-500' },
  high: { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-200/60', dot: 'bg-rose-500' },
  critical: { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-200/60', dot: 'bg-rose-500' },
  rejected: { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-200/60', dot: 'bg-rose-500' },

  // Slate for closed, cancelled, low
  cancelled: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  closed: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  low: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  referred: { bg: 'bg-purple-50/80', text: 'text-purple-700', border: 'border-purple-200/60', dot: 'bg-purple-500' },
  inactive: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400' },
}

export function StatusBadge({ status, className }: { status: BadgeStatus; className?: string }) {
  const { language } = useLanguage()
  const conf = statusConfig[status] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' }
  const label = language === 'th' && statusLabelsTh[status]
    ? statusLabelsTh[status]
    : status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-tight',
      conf.bg, conf.text, conf.border,
      className,
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', conf.dot)} />
      {label}
    </span>
  )
}

// --- Page Header ---

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-shrink-0">{actions}</div>}
    </div>
  )
}

// --- Stat Card ---

export function StatCard({ label, value, icon, color = 'sky' }: { label: string; value: string | number; icon: ReactNode; color?: string }) {
  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    sky: { bg: 'bg-sky-50/90', text: 'text-sky-600', ring: 'ring-1 ring-sky-200/60' },
    indigo: { bg: 'bg-sky-50/90', text: 'text-sky-600', ring: 'ring-1 ring-sky-200/60' },
    blue: { bg: 'bg-sky-50/90', text: 'text-sky-600', ring: 'ring-1 ring-sky-200/60' },
    emerald: { bg: 'bg-emerald-50/90', text: 'text-emerald-600', ring: 'ring-1 ring-emerald-200/60' },
    amber: { bg: 'bg-amber-50/90', text: 'text-amber-600', ring: 'ring-1 ring-amber-200/60' },
    red: { bg: 'bg-rose-50/90', text: 'text-rose-600', ring: 'ring-1 ring-rose-200/60' },
    purple: { bg: 'bg-purple-50/90', text: 'text-purple-600', ring: 'ring-1 ring-purple-200/60' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-1 ring-slate-200' },
  }
  const theme = colorMap[color] || colorMap.sky

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-premium hover:shadow-premium-hover hover:border-sky-300/60 transition-all duration-200">
      <div className="flex items-center gap-3.5">
        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200', theme.bg, theme.text, theme.ring)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">{value}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate tracking-wide">{label}</p>
        </div>
      </div>
    </div>
  )
}

// --- Card ---

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/70 p-5 shadow-premium',
        onClick && 'cursor-pointer hover:border-sky-300/80 hover:shadow-premium-hover transition-all duration-200 hover:-translate-y-0.5',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// --- Empty State ---

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-12 w-12 rounded-2xl bg-sky-50/50 border border-sky-100/80 flex items-center justify-center text-sky-600 mb-3.5 shadow-xs">
        {icon || <FileText className="h-5 w-5" />}
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}

// --- Modal / Dialog ---

export function Modal({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!isOpen) return null
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-h-[90vh] flex flex-col z-10 animate-[slideIn_0.15s_ease-out]', sizeClass)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

// --- Confirm Dialog ---

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'primary' }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; variant?: 'primary' | 'danger'
}) {
  if (!isOpen) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-600 mb-5 leading-relaxed">{message}</p>
      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

// --- Tabs ---

export function Tabs({ tabs, active, onChange }: { tabs: { value: string; label: string; count?: number }[]; active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 border-b border-slate-200/70 mb-6 overflow-x-auto pb-px">
      {tabs.map(t => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            'px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 -mb-px whitespace-nowrap flex items-center gap-2 cursor-pointer',
            active === t.value
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300',
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={cn(
              'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-bold tracking-tight',
              active === t.value ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500',
            )}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// --- Search Input ---

export function SearchInput({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm border border-slate-200/90 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all shadow-xs"
      />
    </div>
  )
}

// --- Data Table ---

interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

export function DataTable<T extends { id?: string }>({ columns, data, onRowClick, emptyMessage = 'No data available.' }: {
  columns: Column<T>[]; data: T[]; onRowClick?: (row: T) => void; emptyMessage?: string
}) {
  if (data.length === 0) {
    return (
      <div className="border border-slate-200/70 rounded-2xl bg-white shadow-premium">
        <EmptyState title={emptyMessage} />
      </div>
    )
  }
  return (
    <div className="overflow-x-auto border border-slate-200/70 rounded-2xl bg-white shadow-premium">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/70">
            {columns.map(col => (
              <th key={col.key} className={cn('px-4 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'bg-white transition-colors duration-150',
                onRowClick && 'cursor-pointer hover:bg-sky-50/30',
              )}
            >
              {columns.map(col => (
                <td key={col.key} className={cn('px-4 py-3.5 text-xs sm:text-sm text-slate-700 align-middle', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- Pagination ---

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between mt-4 text-xs text-slate-500 font-medium">
      <span>Page {page} of {totalPages}</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// --- Timeline ---

export function Timeline({ items }: { items: { date: string; title: string; description?: string; status?: string }[] }) {
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3.5">
          <div className="flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-sky-500 mt-1.5 ring-4 ring-sky-100" />
            {i < items.length - 1 && <div className="w-px flex-1 bg-slate-200/80 my-1" />}
          </div>
          <div className="pb-5">
            <p className="text-[11px] font-semibold text-slate-400">{item.date}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{item.title}</p>
            {item.description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>}
            {item.status && <StatusBadge status={item.status} className="mt-1.5" />}
          </div>
        </div>
      ))}
    </div>
  )
}

// --- Toast Container ---

export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null

  const iconMap = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    error: <AlertCircle className="h-4 w-4 text-rose-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    info: <Info className="h-4 w-4 text-sky-500" />,
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
      {toasts.map(t => (
        <div key={t.id} className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-3.5 flex items-start gap-3 animate-[slideIn_0.2s_ease-out]">
          <div className="mt-0.5 flex-shrink-0">{iconMap[t.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-slate-900">{t.title}</p>
            {t.message && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.message}</p>}
          </div>
          <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

// --- Button helpers ---

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className, type = 'button' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; size?: 'sm' | 'md'; disabled?: boolean; className?: string; type?: 'button' | 'submit'
}) {
  const variants = {
    primary: 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white border-transparent shadow-xs font-semibold focus:ring-4 focus:ring-sky-500/15',
    secondary: 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-xs font-semibold focus:ring-4 focus:ring-slate-100',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white border-transparent shadow-xs font-semibold focus:ring-4 focus:ring-rose-500/15',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent font-medium',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-xs sm:text-sm rounded-xl',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center border transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  )
}

// --- Student Profile Banner (REG MFU Academic Information Style) ---

export function StudentProfileBanner({
  student,
  advisor,
  school,
  major,
  gpax = '3.48',
  credits = '102 / 136',
  status,
  semester,
}: {
  student: { name: string; code: string; email: string; department?: string }
  advisor?: { name: string; email: string; phone?: string; department?: string } | null
  school?: string
  major?: string
  gpax?: string
  credits?: string
  status?: string
  semester?: string
}) {
  const { t } = useLanguage()
  const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2)
  const displaySchool = school || t('สำนักวิชาเทคโนโลยีสารสนเทศ', 'School of Information Technology')
  const displayMajor = major || t('สาขาวิชาวิศวกรรมซอฟต์แวร์', 'Software Engineering')
  const displayStatus = status || t('ปกติ', 'Normal')
  const displaySemester = semester || t('1/2569', 'Semester 1 / Academic Year 2026')

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-premium p-5 sm:p-6 mb-6 relative overflow-hidden">
      {/* Top sky accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Avatar + Identity */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-sky-50 border-2 border-sky-100 flex items-center justify-center text-sky-700 font-extrabold text-lg sm:text-xl shadow-xs flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-100/70 text-sky-800 text-xs font-mono font-bold border border-sky-200/60">
                {student.code}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {displayStatus}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {t('ภาคการศึกษา:', 'Term:')} {displaySemester}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {student.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {displayMajor} · {displaySchool}
            </p>
          </div>
        </div>

        {/* Right: Academic metrics & Advisor */}
        <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('GPAX สะสม', 'Cumulative GPAX')}</p>
            <p className="text-base font-extrabold text-sky-600 mt-0.5 font-mono">{gpax}</p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('หน่วยกิตสะสม', 'Earned Credits')}</p>
            <p className="text-base font-extrabold text-slate-800 mt-0.5 font-mono">{credits}</p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-sky-50/50 border border-sky-100 max-w-xs">
            <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">{t('อาจารย์ที่ปรึกษา', 'Faculty Advisor')}</p>
            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
              {advisor?.name || t('ยังไม่ได้รับการจัดสรร', 'Not Assigned')}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {advisor?.email || t('กรุณาติดต่อสำนักวิชา', 'Contact School Office')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Advisor Cohort Banner ---

export function AdvisorCohortBanner({
  advisor,
  adviseeCount,
  school,
  semester,
}: {
  advisor: { name: string; code: string; email: string; department?: string }
  adviseeCount: number
  school?: string
  semester?: string
}) {
  const { t } = useLanguage()
  const initials = advisor.name.split(' ').map(n => n[0]).join('').substring(0, 2)
  const displaySchool = school || advisor.department || t('สำนักวิชาเทคโนโลยีสารสนเทศ', 'School of Information Technology')
  const displaySemester = semester || t('1/2569', 'Semester 1 / Academic Year 2026')

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-premium p-5 sm:p-6 mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 font-extrabold text-lg shadow-xs flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-sky-100/70 text-sky-800 text-[11px] font-mono font-bold">
                {advisor.code}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {t('อาจารย์ที่ปรึกษาทางวิชาการ', 'Academic Advisor')} · {displaySemester}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {advisor.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {displaySchool}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-100 text-center">
            <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">{t('นักศึกษาในความดูแล', 'Assigned Advisees')}</p>
            <p className="text-xl font-extrabold text-sky-800 mt-0.5 font-mono">{adviseeCount} {t('คน', 'Students')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

