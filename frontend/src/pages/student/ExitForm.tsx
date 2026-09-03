// ============================================================
// Student — Exit Form (Minimal White & Sky Blue)
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, Button, Card } from '@/components/ui'
import { EXIT_REASON_CODES } from '@/types'
import type { ExitType, ExitReasonCode } from '@/types'
import { AlertCircle } from 'lucide-react'

export default function ExitForm() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t, getExitReasonLabel } = useLanguage()
  const navigate = useNavigate()

  const [exitType, setExitType] = useState<ExitType | ''>('')
  const [reasonCode, setReasonCode] = useState<ExitReasonCode | ''>('')
  const [details, setDetails] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')

  if (!currentUser) return null

  const rosterEntry = store.roster.find(r => r.studentId === currentUser!.id && r.isActive)
  const advisor = rosterEntry ? store.users.find(u => u.id === rosterEntry.advisorId) : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!exitType || !reasonCode || !details || !effectiveDate) {
      addToast('error', t('ข้อมูลไม่ครบถ้วน', 'Validation Error'), t('กรุณากรอกข้อมูลที่จำเป็นให้ครบทุกช่อง', 'Please fill in all required fields.'))
      return
    }
    if (!advisor) {
      addToast('error', t('ไม่พบอาจารย์ที่ปรึกษา', 'No Advisor'), t('คุณยังไม่มีอาจารย์ที่ปรึกษาในระบบ', 'You do not have an assigned advisor.'))
      return
    }
    const exitCase = store.addExitCase({
      studentId: currentUser!.id,
      advisorId: advisor.id,
      exitType: exitType as ExitType,
      reasonCode: reasonCode as ExitReasonCode,
      details,
      preferredEffectiveDate: effectiveDate,
      status: 'open',
    })
    store.addNotification({
      userId: advisor.id,
      type: 'action_required',
      title: t('คำร้องขอลาพัก / ลาออกใหม่', 'New Exit Case Request'),
      message: `${currentUser!.name} ${t('ได้ยื่นคำร้อง', 'has submitted an exit request')} (${exitType.replace(/_/g, ' ')})`,
      relatedId: exitCase.id,
      isRead: false,
    })
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'student',
      action: 'exit_case_created',
      description: `Created exit case: ${exitType.replace(/_/g, ' ')}`,
      targetId: exitCase.id,
    })
    addToast('success', t('ส่งคำร้องสำเร็จ', 'Exit Form Submitted'), t('ส่งคำร้องไปยังอาจารย์ที่ปรึกษาเพื่อพิจารณาเรียบร้อยแล้ว', 'Your request has been submitted to your advisor for review.'))
    navigate('/student')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title={t('คำร้องขอลาพักการศึกษา / ลาออก / โอนย้าย', 'Exit & Leave Request')}
        description={t('ยื่นคำร้องอย่างเป็นทางการสำหรับการขอลาพักการศึกษา ลาออก หรือโอนย้ายสถานศึกษา', 'Submit an official request for withdrawal, leave of absence, or university transfer.')}
      />

      <div className="mb-5 p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          {t(
            'ก่อนยื่นคำร้องขอลาพักหรือลาออก มหาวิทยาลัยแนะนำให้นักศึกษาเข้าพบและปรึกษาอาจารย์ที่ปรึกษาก่อน เพื่อรับทราบแนวทางการช่วยเหลือและทางเลือกอื่นทางวิชาการ',
            'Before submitting an exit or leave request, we strongly encourage speaking with your faculty advisor to discuss support options and alternative academic plans.'
          )}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              {t('ประเภทคำร้อง', 'Exit Type')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={exitType}
              onChange={e => setExitType(e.target.value as ExitType)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs cursor-pointer"
            >
              <option value="">{t('-- เลือกประเภท --', 'Select type')}</option>
              <option value="withdrawal">{t('ขอลาออกจากการเป็นนักศึกษา', 'Withdrawal / Drop Out')}</option>
              <option value="leave_of_absence">{t('ขอลาพักการศึกษาชั่วคราว', 'Leave of Absence (Temporary)')}</option>
              <option value="transfer">{t('ขอโอนย้ายสถาบัน / สาขาวิชา', 'Institution / Program Transfer')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              {t('สาเหตุหลัก', 'Primary Reason')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={reasonCode}
              onChange={e => setReasonCode(e.target.value as ExitReasonCode)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs cursor-pointer"
            >
              <option value="">{t('-- เลือกสาเหตุ --', 'Select reason')}</option>
              {EXIT_REASON_CODES.map(r => (
                <option key={r.value} value={r.value}>{getExitReasonLabel(r.value)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              {t('รายละเอียดและเหตุผลประกอบ', 'Details & Context')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows={4}
              placeholder={t('อธิบายเหตุผล ความจำเป็น และสถานการณ์ประกอบการพิจารณา...', 'Explain your circumstances and rationale in detail...')}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              {t('วันที่มีผลตามความประสงค์', 'Preferred Effective Date')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={e => setEffectiveDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => navigate('/student')}>{t('ยกเลิก', 'Cancel')}</Button>
            <Button type="submit" variant="primary">{t('ยื่นคำร้อง', 'Submit Request')}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
