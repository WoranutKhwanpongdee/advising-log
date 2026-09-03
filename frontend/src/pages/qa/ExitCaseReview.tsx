import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHeader, DataTable, StatusBadge, Button, Modal } from '@/components/ui'
import type { ExitCase } from '@/types'
import { Eye, CheckCircle2 } from 'lucide-react'

export default function ExitCaseReview() {
  const { currentUser } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const { t, getExitReasonLabel } = useLanguage()
  const [selectedCase, setSelectedCase] = useState<ExitCase | null>(null)

  if (!currentUser) return null

  // QA can see cases under review or resolved
  const reviewCases = store.exitCases.filter(e => e.status !== 'open')

  const columns = [
    {
      key: 'student',
      header: t('นักศึกษา', 'Student'),
      render: (e: ExitCase) => {
        const s = store.users.find(u => u.id === e.studentId)
        return (
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">{s?.name}</p>
            <p className="text-[11px] font-mono text-slate-400">{s?.code}</p>
          </div>
        )
      },
    },
    {
      key: 'advisor',
      header: t('อาจารย์ที่ปรึกษา', 'Faculty Advisor'),
      render: (e: ExitCase) => <span className="text-xs text-slate-600 font-medium">{store.users.find(u => u.id === e.advisorId)?.name}</span>,
    },
    {
      key: 'type',
      header: t('ประเภทคำร้อง', 'Exit Type'),
      render: (e: ExitCase) => <span className="text-xs font-semibold capitalize text-slate-800">{e.exitType.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'reason',
      header: t('สาเหตุหลัก', 'Primary Reason'),
      render: (e: ExitCase) => <span className="text-xs text-slate-600">{getExitReasonLabel(e.reasonCode)}</span>,
    },
    { key: 'status', header: t('สถานะ', 'Status'), render: (e: ExitCase) => <StatusBadge status={e.status} /> },
    {
      key: 'actions',
      header: t('การจัดการ', 'Action'),
      render: (e: ExitCase) => (
        <Button size="sm" variant="secondary" onClick={() => handleView(e)}>
          <Eye className="h-3 w-3 mr-1 text-slate-500" /> {t('ตรวจสอบ', 'Review')}
        </Button>
      ),
    },
  ]

  function handleView(e: ExitCase) {
    setSelectedCase(e)
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'qa_chair',
      action: 'qa_viewed_case',
      description: `QA viewed exit case ${e.id}`,
      targetId: e.id,
    })
  }

  function handleCloseCase() {
    if (!selectedCase) return
    store.updateExitCaseStatus(selectedCase.id, 'closed')
    store.addAuditLog({
      userId: currentUser!.id,
      userName: currentUser!.name,
      userRole: 'qa_chair',
      action: 'exit_case_updated',
      description: `QA closed exit case ${selectedCase.id}`,
      targetId: selectedCase.id,
    })
    addToast('success', t('ปิดเคสเรียบร้อย', 'Case Finalized'), t('เคสขอลาออก/ลาพักได้รับการยุติและปิดเคสแล้ว', 'The exit case has been formally closed.'))
    setSelectedCase(null)
  }

  const assessment = selectedCase ? store.advisorAssessments.find(a => a.exitCaseId === selectedCase.id) : null

  return (
    <div>
      <PageHeader
        title={t('ทบทวนเคสขอลาออก / ลาพักการศึกษา', 'Exit & Departure Case Review')}
        description={t('ตรวจสอบการขอลาออกของนักศึกษา ติดตามการให้ความช่วยเหลือของอาจารย์ที่ปรึกษา และสรุปผลในระดับหลักสูตร', 'Review student withdrawal cases, evaluate advisor interventions, and finalize audit records.')}
      />
      <DataTable columns={columns} data={reviewCases} emptyMessage={t('ไม่มีเคสที่รอการตรวจสอบจากฝ่ายประกันคุณภาพ', 'No exit cases currently require QA review.')} />

      {selectedCase && (
        <Modal isOpen={!!selectedCase} onClose={() => setSelectedCase(null)} title={t('การตรวจสอบเคสขอลาออก / ลาพักอย่างเป็นทางการ', 'Exit Case Formal Review')} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
              <div>
                <span className="text-slate-400 block font-medium">{t('นักศึกษา', 'Student')}</span>
                <p className="font-semibold text-slate-900 mt-0.5">{store.users.find(u => u.id === selectedCase.studentId)?.name}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t('อาจารย์ที่ปรึกษา', 'Faculty Advisor')}</span>
                <p className="font-semibold text-slate-900 mt-0.5">{store.users.find(u => u.id === selectedCase.advisorId)?.name}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t('สาเหตุ', 'Reason')}</span>
                <p className="font-semibold text-slate-900 mt-0.5">{getExitReasonLabel(selectedCase.reasonCode)}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t('วันที่มีผล', 'Effective Date')}</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedCase.preferredEffectiveDate}</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">{t('เหตุผลที่นักศึกษาระบุ', 'Student Stated Reason')}</span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                {selectedCase.details}
              </p>
            </div>

            {assessment ? (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">{t('บันทึกความเห็นอย่างเป็นทางการของอาจารย์ที่ปรึกษา', 'Advisor Formal Assessment')}</h4>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">{t('ผลการประเมินและการสัมภาษณ์', 'Assessment Evaluation')}</span>
                    <p className="text-slate-800 leading-relaxed">{assessment.assessment}</p>
                  </div>
                  {assessment.contributingFactors && (
                    <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">{t('ปัจจัยแวดล้อมที่ส่งผลกระทบ', 'Contributing Factors')}</span>
                      <p className="text-slate-800 leading-relaxed">{assessment.contributingFactors}</p>
                    </div>
                  )}
                  {assessment.actionsTaken && (
                    <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">{t('มาตรการช่วยเหลือที่ได้ดำเนินการแล้ว', 'Actions Taken')}</span>
                      <p className="text-slate-800 leading-relaxed">{assessment.actionsTaken}</p>
                    </div>
                  )}
                  {assessment.recommendation && (
                    <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">{t('ข้อเสนอแนะของอาจารย์ที่ปรึกษา', 'Advisor Recommendation')}</span>
                      <p className="text-slate-800 leading-relaxed">{assessment.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 italic">
                {t('ยังไม่มีบันทึกผลการประเมินจากอาจารย์ที่ปรึกษา', 'No formal advisor assessment filed yet.')}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedCase(null)}>{t('ปิด', 'Close')}</Button>
              {selectedCase.status !== 'closed' && (
                <Button variant="primary" onClick={handleCloseCase}>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> {t('สรุปผลและปิดเคส', 'Finalize & Close Case')}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

