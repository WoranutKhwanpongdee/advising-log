import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import { REFERRAL_DESTINATIONS } from '@/types'
import type { Referral, ReferralDestination } from '@/types'
import { Plus } from 'lucide-react'

export default function Referrals() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t, getReferralLabel } = useLanguage()
  const [showCreate, setShowCreate] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [reason, setReason] = useState('')
  const [destination, setDestination] = useState<ReferralDestination | ''>('')

  if (!currentUser) return null
  const myReferrals = store.referrals.filter(r => r.advisorId === currentUser.id)
  const myStudents = store.roster
    .filter(r => r.advisorId === currentUser.id && r.isActive)
    .map(r => store.users.find(u => u.id === r.studentId)!)
    .filter(Boolean)

  function handleCreate() {
    if (!studentId || !reason || !destination) {
      addToast('error', t('ข้อมูลไม่ครบถ้วน', 'Validation Error'), t('กรุณากรอกข้อมูลที่จำเป็นให้ครบทุกช่อง', 'Please complete all required fields.'))
      return
    }
    const ref = store.addReferral({
      sessionId: '',
      studentId,
      advisorId: currentUser!.id,
      reason,
      destination: destination as ReferralDestination,
      status: 'pending',
      referredAt: new Date().toISOString().split('T')[0],
    })
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'advisor',
      action: 'referral_created',
      description: `Referred ${store.users.find(u => u.id === studentId)?.name} to ${getReferralLabel(destination)}`,
      targetId: ref.id,
    })
    addToast('success', t('ส่งต่อหน่วยงานสำเร็จ', 'Referral Created'), t('ส่งต่อข้อมูลคำร้องไปยังหน่วยงานที่เกี่ยวข้องแล้ว', 'Referral request dispatched.'))
    setShowCreate(false); setStudentId(''); setReason(''); setDestination('')
  }

  const columns = [
    {
      key: 'student',
      header: t('นักศึกษา', 'Student'),
      render: (r: Referral) => {
        const s = store.users.find(u => u.id === r.studentId)
        return (
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">{s?.name}</p>
            <p className="text-[11px] font-mono text-slate-400">{s?.code}</p>
          </div>
        )
      },
    },
    {
      key: 'dest',
      header: t('หน่วยงานที่ส่งต่อ', 'Referred Unit'),
      render: (r: Referral) => (
        <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
          {getReferralLabel(r.destination)}
        </span>
      ),
    },
    { key: 'reason', header: t('เหตุผลในการส่งต่อ', 'Referral Reason'), render: (r: Referral) => <span className="text-xs text-slate-600 line-clamp-1 max-w-xs">{r.reason}</span> },
    { key: 'date', header: t('วันที่ส่งต่อ', 'Referred Date'), render: (r: Referral) => <span className="text-xs text-slate-500 font-medium">{r.referredAt}</span> },
    { key: 'status', header: t('สถานะ', 'Status'), render: (r: Referral) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: t('การจัดการ', 'Action'),
      render: (r: Referral) => r.status !== 'completed' ? (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            store.updateReferralStatus(r.id, r.status === 'pending' ? 'referred' : r.status === 'referred' ? 'in_progress' : 'completed')
            addToast('info', t('อัปเดตสถานะแล้ว', 'Status Updated'))
          }}
        >
          {r.status === 'pending' ? t('ส่งต่อแล้ว', 'Mark Dispatched') : r.status === 'referred' ? t('กำลังดำเนินการ', 'In Progress') : t('เสร็จสิ้น', 'Complete')}
        </Button>
      ) : null,
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('การส่งต่อความช่วยเหลือนักศึกษา', 'Student Support Referrals')}
        description={t('ส่งต่อนักศึกษาไปยังหน่วยงานเฉพาะทาง เช่น ศูนย์แนะแนว สุขภาพจิต หรือทุนการศึกษา', 'Refer students to specialized counseling, academic support, or health units.')}
        actions={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> {t('สร้างการส่งต่อใหม่', 'Create Referral')}
          </Button>
        }
      />
      <DataTable columns={columns} data={myReferrals} emptyMessage={t('ยังไม่มีรายการส่งต่อหน่วยงาน', 'No student referrals created.')} />

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={t('ส่งต่อนักศึกษาไปยังหน่วยงานสนับสนุน', 'Create Student Support Referral')} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">{t('เลือกนักศึกษาในความดูแล', 'Select Advisee')} *</label>
            <select
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="">{t('-- เลือกนักศึกษา --', 'Select a student')}</option>
              {myStudents.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">{t('หน่วยงานปลายทาง', 'Target Department / Unit')} *</label>
            <select
              value={destination}
              onChange={e => setDestination(e.target.value as ReferralDestination)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="">{t('-- เลือกหน่วยงาน --', 'Select destination')}</option>
              {REFERRAL_DESTINATIONS.map(d => (
                <option key={d.value} value={d.value}>{getReferralLabel(d.value)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">{t('เหตุผลและความช่วยเหลือที่ต้องการ', 'Reason & Context')} *</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder={t('ระบุรายละเอียด ปูมหลัง และประเด็นที่ต้องการให้หน่วยงานช่วยเหลือนักศึกษา...', 'Explain the background and specific support needed...')}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>{t('ยกเลิก', 'Cancel')}</Button>
            <Button variant="primary" onClick={handleCreate}>{t('ยืนยันส่งต่อ', 'Submit Referral')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

