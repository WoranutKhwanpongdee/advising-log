import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, Tabs, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import type { AdvisingRequest } from '@/types'
import { Calendar, CheckCircle2 } from 'lucide-react'

export default function AdvisingSessions() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t, getCategoryLabel } = useLanguage()
  const [tab, setTab] = useState('pending')
  const [selectedReq, setSelectedReq] = useState<AdvisingRequest | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [schedDate, setSchedDate] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [schedLoc, setSchedLoc] = useState('')

  if (!currentUser) return null

  const myRequests = store.requests.filter(r => r.advisorId === currentUser.id)
  const filterMap: Record<string, string[]> = {
    pending: ['requested', 'pending'],
    upcoming: ['scheduled'],
    completed: ['completed', 'closed'],
    cancelled: ['cancelled'],
  }
  const filtered = myRequests.filter(r => filterMap[tab]?.includes(r.status))

  const tabs = [
    { value: 'pending', label: t('คำร้องรอการตอบรับ', 'Pending Requests'), count: myRequests.filter(r => ['requested', 'pending'].includes(r.status)).length },
    { value: 'upcoming', label: t('นัดหมายที่ยืนยันแล้ว', 'Upcoming Sessions'), count: myRequests.filter(r => r.status === 'scheduled').length },
    { value: 'completed', label: t('เสร็จสิ้นแล้ว', 'Completed'), count: myRequests.filter(r => ['completed', 'closed'].includes(r.status)).length },
    { value: 'cancelled', label: t('ยกเลิก', 'Cancelled'), count: myRequests.filter(r => r.status === 'cancelled').length },
  ]

  function handleAccept(req: AdvisingRequest) {
    store.updateRequestStatus(req.id, 'pending')
    addToast('success', t('ตอบรับคำร้องแล้ว', 'Request Accepted'), t('คุณสามารถกำหนดเวลานัดหมายกับนักศึกษาได้ทันที', 'You can now schedule an appointment with the student.'))
  }

  function handleSchedule() {
    if (!selectedReq || !schedDate || !schedTime || !schedLoc) return
    const apt = store.addAppointment({
      requestId: selectedReq.id,
      studentId: selectedReq.studentId,
      advisorId: currentUser!.id,
      scheduledDate: schedDate,
      scheduledTime: schedTime,
      location: schedLoc,
      status: 'scheduled',
    })
    store.updateRequestStatus(selectedReq.id, 'scheduled')
    store.addNotification({
      userId: selectedReq.studentId,
      type: 'info',
      title: t('นัดหมายเวลาเข้าพบอาจารย์แล้ว', 'Appointment Scheduled'),
      message: `${t('อาจารย์ที่ปรึกษานัดหมายเข้าพบในวันที่', 'Your advising appointment has been scheduled for')} ${schedDate} ${schedTime} (${schedLoc})`,
      relatedId: apt.id,
      isRead: false,
    })
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'advisor',
      action: 'appointment_scheduled',
      description: `Scheduled appointment for ${store.users.find(u => u.id === selectedReq.studentId)?.name}`,
      targetId: apt.id,
    })
    addToast('success', t('นัดหมายสำเร็จ', 'Appointment Scheduled'), `${schedDate} · ${schedTime}`)
    setShowSchedule(false)
    setSelectedReq(null)
    setSchedDate(''); setSchedTime(''); setSchedLoc('')
  }

  function handleCancel(req: AdvisingRequest) {
    store.updateRequestStatus(req.id, 'cancelled')
    const apt = store.appointments.find(a => a.requestId === req.id && a.status === 'scheduled')
    if (apt) store.updateAppointmentStatus(apt.id, 'cancelled')
    addToast('info', t('ยกเลิกคำร้องแล้ว', 'Request Cancelled'))
  }

  function handleComplete(req: AdvisingRequest) {
    store.updateRequestStatus(req.id, 'completed')
    const apt = store.appointments.find(a => a.requestId === req.id && a.status === 'scheduled')
    if (apt) store.updateAppointmentStatus(apt.id, 'completed')
    addToast('success', t('บันทึกเสร็จสิ้นแล้ว', 'Marked as Completed'), t('คุณสามารถเขียนบันทึกผลการให้คำปรึกษาได้ทันที', 'You can now proceed to write an advising log.'))
  }

  const columns = [
    {
      key: 'student',
      header: t('นักศึกษา', 'Student'),
      render: (r: AdvisingRequest) => {
        const s = store.users.find(u => u.id === r.studentId)
        return (
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{s?.name}</p>
            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{s?.code}</p>
          </div>
        )
      },
    },
    {
      key: 'category',
      header: t('หมวดหมู่', 'Category'),
      render: (r: AdvisingRequest) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {getCategoryLabel(r.category)}
        </span>
      ),
    },
    {
      key: 'date',
      header: t('วันที่ยื่นคำร้อง', 'Requested Date'),
      render: (r: AdvisingRequest) => <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{r.createdAt}</span>,
    },
    {
      key: 'preferred',
      header: t('เวลาที่สะดวก', 'Preferred Slot'),
      render: (r: AdvisingRequest) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {r.preferredDate} · {r.preferredTime}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('สถานะ', 'Status'),
      render: (r: AdvisingRequest) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: t('การจัดการ', 'Actions'),
      render: (r: AdvisingRequest) => (
        <div className="flex items-center gap-1.5">
          {r.status === 'requested' && (
            <Button size="sm" variant="primary" onClick={() => handleAccept(r)}>
              {t('ตอบรับ', 'Accept')}
            </Button>
          )}
          {(r.status === 'requested' || r.status === 'pending') && (
            <Button size="sm" variant="secondary" onClick={() => { setSelectedReq(r); setShowSchedule(true) }}>
              <Calendar className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400" /> {t('นัดหมาย', 'Schedule')}
            </Button>
          )}
          {r.status === 'scheduled' && (
            <Button size="sm" variant="primary" onClick={() => handleComplete(r)}>
              <CheckCircle2 className="h-3 w-3 mr-1" /> {t('เสร็จสิ้น', 'Complete')}
            </Button>
          )}
          {r.status !== 'completed' && r.status !== 'cancelled' && r.status !== 'closed' && (
            <Button size="sm" variant="ghost" onClick={() => handleCancel(r)}>
              {t('ยกเลิก', 'Cancel')}
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('รายการการให้คำปรึกษาทางวิชาการ', 'Advising Sessions')}
        description={t('ตรวจสอบคำร้องของนักศึกษา กำหนดเวลานัดหมายเข้าพบ และบันทึกผลการให้คำปรึกษา', 'Review student advising requests, schedule appointments, and mark sessions complete.')}
      />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <DataTable columns={columns} data={filtered} emptyMessage={t(`ไม่พบรายการในสถานะนี้`, `No ${tab} sessions found.`)} />

      {/* Schedule Modal */}
      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title={t('นัดหมายเวลาเข้าพบอาจารย์ที่ปรึกษา', 'Schedule Advising Appointment')} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">{t('วันที่นัดหมาย', 'Appointment Date')} *</label>
            <input
              type="date"
              value={schedDate}
              onChange={e => setSchedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">{t('เวลานัดหมาย', 'Appointment Time')} *</label>
            <input
              type="time"
              value={schedTime}
              onChange={e => setSchedTime(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">{t('สถานที่ / ห้องเข้าพบ', 'Location / Meeting Room')} *</label>
            <input
              type="text"
              value={schedLoc}
              onChange={e => setSchedLoc(e.target.value)}
              placeholder={t('เช่น ห้องพักอาจารย์ S2-301 หรือ Zoom Online', 'e.g. Office Room S2-301 or Online (Zoom)')}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setShowSchedule(false)}>{t('ยกเลิก', 'Cancel')}</Button>
            <Button variant="primary" onClick={handleSchedule}>{t('ยืนยันนัดหมาย', 'Confirm Schedule')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

