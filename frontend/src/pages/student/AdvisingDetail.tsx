// ============================================================
// Student — Advising Detail (Minimal White & Sky Blue)
// ============================================================

import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, Card, StatusBadge, Timeline, EmptyState } from '@/components/ui'
import { ArrowLeft, Calendar, Paperclip, FileText, CheckCircle } from 'lucide-react'

export default function AdvisingDetail() {
  const { id } = useParams<{ id: string }>()
  const store = useStore()
  const { t, getCategoryLabel } = useLanguage()
  const navigate = useNavigate()

  const request = store.requests.find(r => r.id === id)
  if (!request) return <EmptyState title={t('ไม่พบข้อมูลคำร้อง', 'Request not found')} description={t('ไม่พบข้อมูลคำร้องขอรับคำปรึกษาที่ต้องการ', 'The requested advising record could not be located.')} />

  const advisor = store.users.find(u => u.id === request.advisorId)
  const appointment = store.appointments.find(a => a.requestId === request.id)
  const session = store.sessions.find(s => s.requestId === request.id)
  const followUps = store.followUps.filter(f => f.requestId === request.id)
  const catLabel = getCategoryLabel(request.category)

  // Build timeline
  const timelineItems = [
    { date: request.createdAt, title: t('ยื่นคำร้องขอรับคำปรึกษา', 'Request Submitted'), description: catLabel, status: 'requested' },
  ]
  if (appointment) {
    timelineItems.push({
      date: appointment.createdAt,
      title: t('นัดหมายเวลาเข้าพบ', `Appointment ${appointment.status === 'scheduled' ? 'Scheduled' : appointment.status}`),
      description: `${appointment.scheduledDate} · ${appointment.scheduledTime} (${appointment.location})`,
      status: appointment.status
    })
  }
  if (session) {
    timelineItems.push({
      date: session.sessionDate,
      title: t('บันทึกผลการให้คำปรึกษาเสร็จสิ้น', 'Session Completed'),
      description: session.summary,
      status: 'completed'
    })
  }
  followUps.forEach(fu => {
    timelineItems.push({
      date: fu.createdAt,
      title: `${t('งานติดตามผล:', 'Follow-up:')} ${fu.task}`,
      description: `${t('กำหนดส่ง:', 'Due:')} ${fu.dueDate}`,
      status: fu.status
    })
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/student/history')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> {t('กลับสู่ประวัติคำร้อง', 'Back to Advising History')}
        </button>
      </div>

      <PageHeader title={catLabel} actions={<StatusBadge status={request.status} />} />

      <div className="space-y-6">
        {/* Request details */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('รายละเอียดคำร้อง', 'Request Details')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 dark:text-slate-400 block font-medium">{t('รหัสคำร้อง', 'Request ID')}</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{request.id}</p>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block font-medium">{t('อาจารย์ที่ปรึกษา', 'Faculty Advisor')}</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{advisor?.name || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block font-medium">{t('วันที่สะดวกเข้าพบ', 'Preferred Date')}</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{request.preferredDate}</p>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block font-medium">{t('เวลาที่สะดวกเข้าพบ', 'Preferred Time')}</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{request.preferredTime}</p>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{t('ประเด็นที่ขอรับคำปรึกษา', 'Description')}</span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50/60 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {request.details}
            </p>
          </div>

          {request.attachments.length > 0 && (
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">{t('เอกสารแนบ', 'Attached Files')}</span>
              <div className="flex flex-wrap gap-2">
                {request.attachments.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 rounded-lg text-xs font-medium text-sky-800 dark:text-sky-300">
                    <Paperclip className="h-3 w-3" /> {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Session log */}
        {session && (
          <Card>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> {t('บันทึกผลการเข้าพบอาจารย์ที่ปรึกษา', 'Advising Session Log')}
            </h3>
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">{t('สรุปผลการให้คำปรึกษา', 'Session Summary')}</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{session.summary}</p>
              </div>
              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">{t('คำแนะนำและแนวทางปฏิบัติ', 'Advice & Guidance Provided')}</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{session.advice}</p>
              </div>
              {session.outcome && (
                <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">{t('ผลลัพธ์ / ข้อตกลงร่วมกัน', 'Outcome / Action Items')}</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{session.outcome}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('ลำดับสถานะการดำเนินงาน', 'Progress Timeline')}
          </h3>
          <Timeline items={timelineItems} />
        </Card>

        {/* Follow-ups */}
        {followUps.length > 0 && (
          <Card>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3.5 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {t('รายการงานที่ต้องติดตามผล', 'Assigned Follow-up Tasks')}
            </h3>
            <div className="space-y-2.5">
              {followUps.map(fu => (
                <div key={fu.id} className="flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{fu.task}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 font-medium">{t('กำหนดส่ง:', 'Due:')} {fu.dueDate}</p>
                  </div>
                  <StatusBadge status={fu.status} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

