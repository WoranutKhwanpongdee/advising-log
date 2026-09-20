import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { useLanguage } from '@/contexts/LanguageContext'
import { Modal, ThemeToggle } from '@/components/ui'
import type { Notification } from '@/types'
import { Bell, LogOut, Menu, Calendar, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const thaiNotificationTranslations: Record<string, { title: string; message: string }> = {
  NOT001: {
    title: 'นัดหมายถูกกำหนดแล้ว',
    message: 'นัดหมายเข้าพบอาจารย์ที่ปรึกษาของคุณถูกกำหนดไว้วันที่ 10 กันยายน 2569 เวลา 10:00 น. ณ ห้อง S2-301',
  },
  NOT002: {
    title: 'ต้องดำเนินการติดตามผล',
    message: 'กรุณาดำเนินการส่งแบบฟอร์มเพิ่มถอนรายวิชาก่อนถึงกำหนดเวลา',
  },
  NOT003: {
    title: 'ดำเนินการติดตามผลเสร็จสิ้น',
    message: 'ส่งแบบฟอร์มต่ออายุทุนการศึกษาของคุณเรียบร้อยแล้ว',
  },
  NOT004: {
    title: 'มีคำร้องขอรับคำปรึกษาใหม่',
    message: 'Nattapong Wongchai (6631503003) ยื่นคำร้องขอรับคำปรึกษาใหม่เกี่ยวกับปัญหาส่วนตัว',
  },
  NOT005: {
    title: 'มีคำร้องขอรับคำปรึกษาใหม่',
    message: 'Waraporn Chantara (6631503010) ยื่นคำร้องขอรับคำปรึกษาใหม่เกี่ยวกับผลการเรียน',
  },
  NOT006: {
    title: 'นัดหมายถูกกำหนดแล้ว',
    message: 'นัดหมายเข้าพบอาจารย์ที่ปรึกษาของคุณถูกกำหนดไว้วันที่ 15 กันยายน 2569 เวลา 10:00 น. ณ ห้อง S2-205',
  },
  NOT007: {
    title: 'ใกล้ถึงกำหนดส่งงานติดตามผล',
    message: 'งานติดตามผล “ส่งใบสมัครขอความช่วยเหลือทางการเงินฉุกเฉิน” ของคุณมีกำหนดส่งวันที่ 15 กันยายน',
  },
  NOT008: {
    title: 'มีคำร้องรอดำเนินการ',
    message: 'Kannika Thongkam (6631503004) มีคำร้องขอรับคำปรึกษาเกี่ยวกับการฝึกงาน/อาชีพที่รอการตรวจสอบ',
  },
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const store = useStore()
  const navigate = useNavigate()
  const [showNotifs, setShowNotifs] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  if (!currentUser) return null

  const myNotifs = store.notifications.filter(n => n.userId === currentUser.id)
  const unreadCount = myNotifs.filter(n => !n.isRead).length
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)

  function getNotificationPath(notification: Notification): string | null {
    if (!notification.relatedId) return null

    if (currentUser?.role === 'student') {
      if (notification.relatedId.startsWith('APT')) {
        const appointment = store.appointments.find(a => a.id === notification.relatedId)
        return appointment ? `/student/history/${appointment.requestId}` : '/student/history'
      }
      if (notification.relatedId.startsWith('REQ')) return `/student/history/${notification.relatedId}`
      if (notification.relatedId.startsWith('FU')) return '/student/followups'
      if (notification.relatedId.startsWith('DOC')) return '/student/documents'
    }

    if (currentUser?.role === 'advisor' && notification.relatedId.startsWith('REQ')) {
      return '/advisor/sessions'
    }

    return null
  }

  return (
    <header className="h-16 bg-white/90 dark:bg-[#0e1424]/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 shadow-xs text-slate-900 dark:text-slate-100">
      {/* Left: Menu button (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Academic Term Indicator (REG MFU Style) */}
      <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
        <Calendar className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {t('ภาคการศึกษา 1/2569', 'Semester 1 / 2026')}
        </span>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/12 px-2 py-0.5 rounded border border-sky-100 dark:border-sky-500/25">
          {t('ระบบบริการการศึกษา มฟล.', 'MFU SIS Advising')}
        </span>
      </div>

      {/* Right: Language + Theme + Notifications + User */}
      <div className="flex items-center gap-1 sm:gap-2.5">
        {/* Language switch (TH/EN) */}
        <div className="flex items-center text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('th')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              language === 'th'
                ? 'bg-sky-600 text-white shadow-xs font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            TH
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-sky-600 text-white shadow-xs font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle (Light / Dark / System) */}
        <ThemeToggle />

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-sky-600 text-white text-[10px] font-extrabold rounded-full h-4.5 w-4.5 flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-full mt-2.5 w-[calc(100vw-1.5rem)] max-w-88 bg-white dark:bg-[#0e1424] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-[slideIn_0.15s_ease-out]">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{t('การแจ้งเตือนของระบบ', 'System Notifications')}</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => { store.markAllNotificationsRead(currentUser.id); setShowNotifs(false) }}
                      className="text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold transition-colors cursor-pointer"
                    >
                      {t('อ่านทั้งหมดแล้ว', 'Mark all as read')}
                    </button>
                  )}
                </div>
                {myNotifs.length === 0 ? (
                  <p className="px-4 py-8 text-xs text-slate-400 dark:text-slate-500 text-center font-medium">{t('ไม่มีการแจ้งเตือนใหม่', 'No pending notifications')}</p>
                ) : (
                  myNotifs.slice(0, 10).map(n => {
                    const translated = language === 'th' ? thaiNotificationTranslations[n.id] : undefined
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => { store.markNotificationRead(n.id); setSelectedNotification(n); setShowNotifs(false) }}
                        className={`w-full text-left px-5 py-3.5 border-b border-slate-50 dark:border-slate-800/60 cursor-pointer hover:bg-sky-50/30 dark:hover:bg-slate-800/60 transition-colors ${!n.isRead ? 'bg-sky-50/50 dark:bg-sky-500/10' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs ${n.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100 font-bold'}`}>{translated?.title ?? n.title}</p>
                          {!n.isRead && <span className="h-2 w-2 rounded-full bg-sky-500 flex-shrink-0 mt-1 ring-2 ring-sky-100 dark:ring-sky-900" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{translated?.message ?? n.message}</p>
                      </button>
                    )
                  })
                )}
              </div>
            </>
          )}
          <Modal
            isOpen={!!selectedNotification}
            onClose={() => setSelectedNotification(null)}
            title={t('รายละเอียดการแจ้งเตือน', 'Notification Details')}
            size="sm"
          >
            {selectedNotification && (() => {
              const translated = language === 'th' ? thaiNotificationTranslations[selectedNotification.id] : undefined
              const notificationPath = getNotificationPath(selectedNotification)
              return (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {translated?.title ?? selectedNotification.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {translated?.message ?? selectedNotification.message}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400 dark:text-slate-500">{t('วันที่แจ้งเตือน', 'Received')}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{selectedNotification.createdAt}</span>
                    </div>
                    {selectedNotification.relatedId && (
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400 dark:text-slate-500">{t('รายการที่เกี่ยวข้อง', 'Related item')}</span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{selectedNotification.relatedId}</span>
                      </div>
                    )}
                  </div>
                  {notificationPath && (
                    <button
                      type="button"
                      onClick={() => { setSelectedNotification(null); navigate(notificationPath) }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('ไปยังรายการที่เกี่ยวข้อง', 'Open related item')} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )
            })()}
          </Modal>
        </div>

        {/* User info chip */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200/70 dark:border-slate-800">
          <div className="h-9 w-9 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-800 flex items-center justify-center text-xs font-bold text-sky-700 dark:text-sky-400 flex-shrink-0 shadow-2xs">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{currentUser.code}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-0.5 cursor-pointer"
            title={t('ออกจากระบบ', 'Sign out')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}



