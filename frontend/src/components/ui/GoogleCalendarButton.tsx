// ============================================================
// Google Calendar Button Component
// ============================================================

import React from 'react'
import { Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  buildGoogleCalendarUrl,
  type GoogleCalendarEventOptions,
} from '@/utils/calendarUtils'

export interface GoogleCalendarButtonProps {
  event: GoogleCalendarEventOptions
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
  label?: string
  showIcon?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function GoogleCalendarButton({
  event,
  variant = 'secondary',
  size = 'sm',
  label,
  showIcon = true,
  className = '',
  onClick,
}: GoogleCalendarButtonProps) {
  const { t } = useLanguage()

  const defaultLabel = t('บันทึก Google Calendar', 'Add to Google Calendar')
  const buttonText = label || defaultLabel
  const calendarUrl = buildGoogleCalendarUrl(event)

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e)
    }
  }

  const baseStyles =
    'inline-flex items-center justify-center gap-1.5 font-bold rounded-xl transition-all duration-200 cursor-pointer text-decoration-none shadow-2xs hover:shadow-xs'

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
  }

  const variantStyles = {
    primary:
      'bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600 border border-sky-600 dark:border-sky-500 shadow-sm',
    secondary:
      'bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80',
    outline:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    ghost:
      'bg-transparent hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-none shadow-none',
  }

  return (
    <a
      href={calendarUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      title={t(
        'เปิด Google Calendar ในแท็บใหม่เพื่อบันทึกนัดหมายและส่งบัตรเชิญ',
        'Open Google Calendar in a new tab to add this session and send invitations'
      )}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {showIcon && (
        <span className="flex items-center justify-center flex-shrink-0">
          <Calendar className={size === 'sm' ? 'h-3.5 w-3.5 text-sky-600 dark:text-sky-400' : 'h-4 w-4 text-sky-600 dark:text-sky-400'} />
        </span>
      )}
      <span>{buttonText}</span>
    </a>
  )
}
