// ============================================================
// Student — Exit Form Redirection & Consolidation Notice
// Exit, Leave of Absence, and Transfer requests are now consolidated
// into the Advising Appointment Request flow (/student/request?category=withdrawal_leave)
// with the required AUN-QA Student Voice survey gate.
// ============================================================
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, Button, Card } from '@/components/ui'
import { ArrowRight, CalendarPlus, MessageSquareHeart, CheckCircle2 } from 'lucide-react'

export default function ExitForm() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto py-6">
      <PageHeader
        title={t('คำร้องขอลาพักการศึกษา / ลาออก / โอนย้าย', 'Exit & Leave Request')}
        description={t('ยื่นคำร้องอย่างเป็นทางการสำหรับการขอลาพักการศึกษา ลาออก หรือโอนย้ายสถานศึกษา', 'Submit an official request for withdrawal, leave of absence, or university transfer.')}
      />

      <Card className="p-6 sm:p-8 text-center space-y-6 border-sky-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
        <div className="h-16 w-16 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center shadow-sm">
          <CalendarPlus className="h-8 w-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
            <MessageSquareHeart className="h-3.5 w-3.5" />
            {t('รวมกระบวนการกับคำขอนัดหมายเข้าพบอาจารย์แล้ว', 'Consolidated with Advising Request')}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            {t('การขอลาออก / ลาพักการศึกษา / ย้ายสาขา', 'Withdrawal / Leave / Transfer Advisory')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t(
              'เพื่อประโยชน์สูงสุดของนักศึกษาและการประกันคุณภาพการศึกษา (AUN-QA Criteria 6 & 8) มหาวิทยาลัยได้รวมกระบวนการยื่นคำร้องขอลาพัก/ลาออก/ย้ายสาขา เข้ากับ "การยื่นคำร้องขอเข้าพบอาจารย์ที่ปรึกษา" โดยนักศึกษาจะได้นัดหมายเวลาเข้าพบและทำแบบสำรวจ Student Voice ได้ในขั้นตอนเดียว',
              'For your best academic interest and AUN-QA Criteria 6 & 8 quality assurance, exit and leave petitions are now submitted via the Advising Request workflow. You can schedule an advisor meeting and complete your Student Voice survey in one seamless step.'
            )}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {t('ขั้นตอนการดำเนินการใหม่:', 'Consolidated Steps:')}
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>{t('เลือกหมวด "การขอลาพัก / ขอลาออก / ย้ายสาขา"', 'Select category "Withdrawal / Leave / Transfer"')}</li>
            <li>{t('เลือกวันที่และเวลาที่ประสงค์ขอเข้าพบอาจารย์', 'Propose your requested meeting date and time')}</li>
            <li>{t('ทำแบบสำรวจเสียงสะท้อนนักศึกษา (Student Voice Survey)', 'Complete the mandatory Student Voice survey')}</li>
            <li>{t('กดยืนยันส่งคำร้องไปยังอาจารย์ที่ปรึกษา', 'Submit your advising request')}</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/student/request?category=withdrawal_leave')}
            className="w-full sm:w-auto shadow-md shadow-sky-600/20 py-2.5 font-bold text-xs sm:text-sm"
          >
            {t('ไปยังหน้ายื่นคำร้องขอเข้าพบ', 'Go to Advising Request Form')}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/student')}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {t('กลับหน้าหลัก', 'Return to Dashboard')}
          </Button>
        </div>
      </Card>
    </div>
  )
}
