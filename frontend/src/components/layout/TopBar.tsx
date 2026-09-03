// ============================================================
// AdvisingLog — Top Bar
// ============================================================

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/data/mock-store'
import { Bell, LogOut, Menu, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, logout } = useAuth()
  const store = useStore()
  const navigate = useNavigate()
  const [showNotifs, setShowNotifs] = useState(false)

  if (!currentUser) return null

  const myNotifs = store.notifications.filter(n => n.userId === currentUser.id)
  const unreadCount = myNotifs.filter(n => !n.isRead).length

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left: Menu button (mobile) */}
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-700">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative text-slate-500 hover:text-slate-700 p-1"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => { store.markAllNotificationsRead(currentUser.id); setShowNotifs(false) }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                {myNotifs.length === 0 ? (
                  <p className="px-3 py-6 text-xs text-slate-400 text-center">No notifications</p>
                ) : (
                  myNotifs.slice(0, 10).map(n => (
                    <div
                      key={n.id}
                      onClick={() => { store.markNotificationRead(n.id); setShowNotifs(false) }}
                      className={`px-3 py-2.5 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                    >
                      <p className={`text-xs ${n.isRead ? 'text-slate-500' : 'text-slate-900 font-medium'}`}>{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-900 leading-none">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400">{currentUser.code}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="text-slate-400 hover:text-slate-600 ml-1 p-1"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
