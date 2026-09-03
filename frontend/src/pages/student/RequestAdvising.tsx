// ============================================================
// Student — Request Advising Form (Minimal White & Sky Blue)
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, Button, Card } from '@/components/ui'
import { ADVISING_CATEGORIES } from '@/types'
import type { AdvisingCategory } from '@/types'
import { Paperclip, User, ShieldCheck } from 'lucide-react'

export default function RequestAdvising() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t, getCategoryLabel } = useLanguage()
  const navigate = useNavigate()

  const [category, setCategory] = useState<AdvisingCategory | ''>('')
  const [subCategory, setSubCategory] = useState('')
  const [details, setDetails] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [pdpaConsent, setPdpaConsent] = useState(false)

  if (!currentUser) return null

  const rosterEntry = store.roster.find(r => r.studentId === currentUser!.id && r.isActive)
  const advisor = rosterEntry ? store.users.find(u => u.id === rosterEntry.advisorId) : null

  const selectedCategoryConfig = store.categoryConfigs.find(c => c.value === category)
  const subCategories = selectedCategoryConfig?.subCategories || []

  function handleFileSimulate() {
    const fakeFiles = ['study_plan.pdf', 'grade_transcript.pdf', 'petition_form.pdf', 'schedule.png']
    const random = fakeFiles[Math.floor(Math.random() * fakeFiles.length)]
    setAttachments(prev => [...prev, random])
    addToast('info', t('แนบไฟล์แล้ว', 'File attached'), `${random} ${t('(จำลองการแนบไฟล์)', '(simulated)')}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!category || !details || !preferredDate || !preferredTime || !pdpaConsent) {
      addToast('error', t('ข้อมูลไม่ครบถ้วน', 'Validation Error'), t('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและยินยอม PDPA', 'Please fill in all required fields and give consent.'))
      return
    }

    if (!advisor) {
      addToast('error', t('ไม่พบอาจารย์ที่ปรึกษา', 'No Advisor'), t('คุณยังไม่มีอาจารย์ที่ปรึกษาในระบบ กรุณาติดต่อสำนักวิชา', 'You do not have an assigned advisor. Please contact admin.'))
      return
    }

    const newRequest = store.addRequest({
      studentId: currentUser!.id,
      advisorId: advisor.id,
      category: category as AdvisingCategory,
      subCategory: subCategory || undefined,
      details,
      preferredDate,
      preferredTime,
      attachments,
      pdpaConsent,
      status: 'requested',
    })

    // Notify advisor
    store.addNotification({
      userId: advisor.id,
      type: 'action_required',
      title: t('คำร้องขอรับคำปรึกษาใหม่', 'New Advising Request'),
      message: `${currentUser!.name} (${currentUser!.code}) ${t('ยื่นคำร้อง:', 'submitted a request:')} ${getCategoryLabel(category)}`,
      relatedId: newRequest.id,
      isRead: false,
    })

    // Audit log
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'student',
      action: 'request_created',
      description: `Created advising request for ${getCategoryLabel(category)}`,
      targetId: newRequest.id,
    })

    addToast('success', t('ยื่นคำร้องสำเร็จ', 'Request Submitted'), t('คำร้องของคุณถูกส่งไปยังอาจารย์ที่ปรึกษาเรียบร้อยแล้ว', 'Your advising request has been sent to your advisor.'))
    navigate('/student/history')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t('ยื่นคำร้องขอรับคำปรึกษา', 'Request Advising Session')}
        description={t('กรอกรายละเอียดเพื่อนัดหมายเข้าพบอาจารย์ที่ปรึกษาทางวิชาการ', 'Schedule a meeting with your academic advisor. Fill in the required details below.')}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Advisor info banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-premium flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('อาจารย์ที่ปรึกษาที่รับผิดชอบ', 'Assigned Advisor')}</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {advisor ? `${advisor.name} · ${advisor.department || 'School of IT'}` : t('ยังไม่ได้รับการจัดสรรอาจารย์ที่ปรึกษา', 'No assigned advisor')}
            </p>
          </div>
        </div>

        <Card className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              {t('หมวดหมู่คำปรึกษา', 'Advising Category')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value as AdvisingCategory); setSubCategory('') }}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs cursor-pointer"
            >
              <option value="">{t('-- กรุณาเลือกหมวดหมู่ --', 'Select a category')}</option>
              {ADVISING_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{getCategoryLabel(c.value)}</option>
              ))}
            </select>
          </div>

          {/* Sub-category */}
          {subCategories.length > 0 && (
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                {t('หัวข้อย่อย', 'Sub-category')} <span className="text-slate-400 font-normal">({t('ไม่บังคับ', 'Optional')})</span>
              </label>
              <select
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs cursor-pointer"
              >
                <option value="">{t('-- เลือกหัวข้อย่อย --', 'Select specific topic')}</option>
                {subCategories.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          )}

          {/* Details */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              {t('หัวข้อ / รายละเอียดที่ต้องการปรึกษา', 'Problem / Advising Details')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows={4}
              placeholder={t('ระบุคำถาม ปัญหาที่พบ หรือประเด็นที่ต้องการปรึกษาอาจารย์...', 'Describe your questions, topics to discuss, or issues you are experiencing...')}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs resize-none leading-relaxed"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                {t('วันที่สะดวกเข้าพบ', 'Preferred Date')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                {t('เวลาที่สะดวกเข้าพบ', 'Preferred Time')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-xs"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              {t('เอกสารประกอบ (ถ้ามี)', 'Supporting Documents')}
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {attachments.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-100 rounded-lg text-xs font-medium text-sky-800">
                  <Paperclip className="h-3 w-3" />
                  {f}
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-sky-400 hover:text-sky-700 ml-0.5 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={handleFileSimulate}>
              <Paperclip className="h-3.5 w-3.5 mr-1" /> {t('แนบไฟล์เอกสาร (จำลอง)', 'Attach File (Simulated)')}
            </Button>
          </div>

          {/* PDPA Consent */}
          <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pdpaConsent}
                onChange={e => setPdpaConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500/30 accent-sky-600"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-600 inline" /> {t('ความยินยอมข้อมูลส่วนบุคคล (PDPA Consent)', 'PDPA / Privacy & Advising Consent')} <span className="text-rose-500">*</span>
                </span>
                {t(
                  'ข้าพเจ้ายินยอมให้อาจารย์ที่ปรึกษาและมหาวิทยาลัยเก็บรวบรวมและใช้ข้อมูลทางการศึกษาเพื่อประโยชน์ในการให้คำปรึกษาทางวิชาการตามนโยบายคุ้มครองข้อมูลส่วนบุคคล',
                  'I consent to the collection and processing of my academic and personal information by assigned university advisors in accordance with the institution\'s privacy policy.'
                )}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              {t('ยกเลิก', 'Cancel')}
            </Button>
            <Button type="submit">
              {t('ยืนยันส่งคำร้อง', 'Submit Request')}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}

