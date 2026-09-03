import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import { EARLY_WARNING_TYPES } from '@/types'
import type { EarlyWarningCase, EarlyWarningType, EarlyWarningSeverity } from '@/types'
import { Plus } from 'lucide-react'

export default function EarlyWarning() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t, getWarningTypeLabel } = useLanguage()
  const [showCreate, setShowCreate] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [warningType, setWarningType] = useState<EarlyWarningType | ''>('')
  const [severity, setSeverity] = useState<EarlyWarningSeverity | ''>('')
  const [description, setDescription] = useState('')
  const [recommendedAction, setRecommendedAction] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  if (!currentUser) return null
  const myWarnings = store.earlyWarnings.filter(w => w.advisorId === currentUser.id)
  const myStudents = store.roster
    .filter(r => r.advisorId === currentUser.id && r.isActive)
    .map(r => store.users.find(u => u.id === r.studentId)!)
    .filter(Boolean)

  function handleCreate() {
    if (!studentId || !warningType || !severity || !description) {
      addToast('error', t('ข้อมูลไม่ครบถ้วน', 'Validation Error'), t('กรุณากรอกข้อมูลที่จำเป็นให้ครบทุกช่อง', 'Please complete all required fields.'))
      return
    }
    const ew = store.addEarlyWarning({
      studentId,
      advisorId: currentUser!.id,
      warningType: warningType as EarlyWarningType,
      severity: severity as EarlyWarningSeverity,
      description,
      dateDetected: new Date().toISOString().split('T')[0],
      recommendedAction,
      followUpDate,
      status: 'active',
    })
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'advisor',
      action: 'warning_created',
      description: `Created early warning for ${store.users.find(u => u.id === studentId)?.name}`,
      targetId: ew.id,
    })
    addToast('success', t('สร้างเคสเตือนภัยวิชาการแล้ว', 'Early Warning Created'), t('เคสถูกบันทึกและอยู่ภายใต้การเฝ้าระวังติดตามผล', 'The case is now active under monitoring.'))
    setShowCreate(false)
    setStudentId(''); setWarningType(''); setSeverity(''); setDescription(''); setRecommendedAction(''); setFollowUpDate('')
  }

  const columns = [
    {
      key: 'student',
      header: t('นักศึกษา', 'Student'),
      render: (w: EarlyWarningCase) => {
        const s = store.users.find(u => u.id === w.studentId)
        return (
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">{s?.name}</p>
            <p className="text-[11px] font-mono text-slate-400">{s?.code}</p>
          </div>
        )
      },
    },
    {
      key: 'type',
      header: t('ประเภทปัจจัยเสี่ยง', 'Warning Factor'),
      render: (w: EarlyWarningCase) => (
        <span className="text-xs font-semibold text-slate-800">
          {getWarningTypeLabel(w.warningType)}
        </span>
      ),
    },
    { key: 'severity', header: t('ระดับความรุนแรง', 'Severity'), render: (w: EarlyWarningCase) => <StatusBadge status={w.severity} /> },
    { key: 'detected', header: t('วันที่ตรวจพบ', 'Detected On'), render: (w: EarlyWarningCase) => <span className="text-xs text-slate-500 font-medium">{w.dateDetected}</span> },
    { key: 'followup', header: t('วันที่ต้องติดตามผล', 'Follow-up Date'), render: (w: EarlyWarningCase) => <span className="text-xs text-slate-600 font-medium">{w.followUpDate || '—'}</span> },
    { key: 'status', header: t('สถานะ', 'Status'), render: (w: EarlyWarningCase) => <StatusBadge status={w.status} /> },
    {
      key: 'actions',
      header: t('การจัดการ', 'Actions'),
      render: (w: EarlyWarningCase) => w.status === 'active' ? (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => { store.updateEarlyWarningStatus(w.id, 'monitoring'); addToast('info', t('ปรับสถานะเป็นกำลังเฝ้าระวังแล้ว', 'Status updated to Monitoring')) }}
          >
            {t('เฝ้าระวัง', 'Monitor')}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => { store.updateEarlyWarningStatus(w.id, 'resolved'); addToast('success', t('ยุติเคสแล้ว', 'Warning Resolved'), t('บันทึกเคสว่าได้รับการแก้ไขเรียบร้อยแล้ว', 'Case marked resolved.')) }}
          >
            {t('แก้ไขแล้ว', 'Resolve')}
          </Button>
        </div>
      ) : null,
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('ระบบเตือนภัยวิชาการนักศึกษา', 'Student Early Warning System')}
        description={t('ตรวจจับและเฝ้าระวังความเสี่ยงด้านผลการเรียน การเข้าชั้นเรียน หรือปัญหาส่วนตัวเพื่อเข้าช่วยเหลือได้ทันท่วงที', 'Detect academic, attendance, or personal risk factors early to intervene promptly.')}
        actions={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> {t('บันทึกเตือนภัยใหม่', 'Create Warning')}
          </Button>
        }
      />
      <DataTable columns={columns} data={myWarnings} emptyMessage={t('ไม่พบเคสเตือนภัยวิชาการที่กำลังดำเนินการ', 'No active early warning cases detected.')} />

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={t('สร้างเคสเตือนภัยวิชาการใหม่', 'Create Early Warning Case')} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">{t('เลือกนักศึกษาในความดูแล', 'Select Advisee Student')} *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Warning Factor *</label>
              <select
                value={warningType}
                onChange={e => setWarningType(e.target.value as EarlyWarningType)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="">Select type</option>
                {EARLY_WARNING_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Severity Level *</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as EarlyWarningSeverity)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="">Select severity</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Urgent Risk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Observations & Risk Description *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what behavior or performance flags were observed..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Recommended Intervention</label>
            <textarea
              value={recommendedAction}
              onChange={e => setRecommendedAction(e.target.value)}
              rows={2}
              placeholder="Recommended actions or support units to involve..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Follow-up Target Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create Warning</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

