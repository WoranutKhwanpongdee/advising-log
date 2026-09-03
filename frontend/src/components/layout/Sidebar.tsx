// ============================================================
// AdvisingLog — Sidebar Navigation
// ============================================================

import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types'
import {
  LayoutDashboard,
  FileEdit,
  History,
  FileText,
  ListChecks,
  LogOut as LogOutIcon,
  CalendarClock,
  ClipboardList,
  AlertTriangle,
  Share2,
  UserX,
  BarChart3,
  Users,
  BookOpen,
  FolderCog,
  FileCog,
  ScrollText,
  GraduationCap,
  X,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'student':
      return [
        { to: '/student', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: '/student/request', label: 'Request Advising', icon: <FileEdit className="h-4 w-4" /> },
        { to: '/student/history', label: 'Advising History', icon: <History className="h-4 w-4" /> },
        { to: '/student/documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
        { to: '/student/followups', label: 'Follow-ups', icon: <ListChecks className="h-4 w-4" /> },
        { to: '/student/exit', label: 'Exit Form', icon: <LogOutIcon className="h-4 w-4" /> },
      ]
    case 'advisor':
      return [
        { to: '/advisor', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: '/advisor/sessions', label: 'Advising Sessions', icon: <CalendarClock className="h-4 w-4" /> },
        { to: '/advisor/log', label: 'Advisor Log', icon: <ClipboardList className="h-4 w-4" /> },
        { to: '/advisor/warnings', label: 'Early Warning', icon: <AlertTriangle className="h-4 w-4" /> },
        { to: '/advisor/referrals', label: 'Referrals', icon: <Share2 className="h-4 w-4" /> },
        { to: '/advisor/exit-cases', label: 'Exit Cases', icon: <UserX className="h-4 w-4" /> },
      ]
    case 'qa_chair':
      return [
        { to: '/qa', label: 'QA Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
        { to: '/qa/exit-review', label: 'Exit Case Review', icon: <UserX className="h-4 w-4" /> },
      ]
    case 'admin':
      return [
        { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: '/admin/users', label: 'User Management', icon: <Users className="h-4 w-4" /> },
        { to: '/admin/roster', label: 'Student-Advisor Roster', icon: <BookOpen className="h-4 w-4" /> },
        { to: '/admin/categories', label: 'Categories', icon: <FolderCog className="h-4 w-4" /> },
        { to: '/admin/document-types', label: 'Document Types', icon: <FileCog className="h-4 w-4" /> },
        { to: '/admin/audit-logs', label: 'Audit Logs', icon: <ScrollText className="h-4 w-4" /> },
      ]
    default:
      return []
  }
}

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  advisor: 'Advisor',
  qa_chair: 'Program Chair / QA',
  admin: 'Admin',
}

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentUser } = useAuth()
  if (!currentUser) return null

  const navItems = getNavItems(currentUser.role)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 z-40 h-full w-56 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        {/* Logo area */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-md">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">AdvisingLog</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Role label */}
        <div className="px-4 py-2.5 border-b border-slate-100">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {roleLabels[currentUser.role]}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student' || item.to === '/advisor' || item.to === '/qa' || item.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
