import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const nextThemeLabel = isDark
    ? t('เปลี่ยนเป็นโหมดสว่าง', 'Switch to light mode')
    : t('เปลี่ยนเป็นโหมดมืด', 'Switch to dark mode')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-[4.25rem] items-center rounded-full border border-slate-200/80 bg-amber-50 p-1 shadow-inner shadow-amber-100/70 transition-all duration-300 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/20 dark:hover:border-slate-600 dark:hover:shadow-black/30 dark:focus-visible:ring-offset-slate-900 cursor-pointer group ${className}`}
      title={nextThemeLabel}
      aria-label={nextThemeLabel}
      aria-pressed={isDark}
    >
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className={`h-4 w-4 transition-all duration-300 ${isDark ? 'text-slate-500' : 'text-amber-500 group-hover:rotate-45 group-hover:scale-110'}`} />
        <Moon className={`h-4 w-4 transition-all duration-300 ${isDark ? 'text-sky-200 group-hover:-rotate-12 group-hover:scale-110' : 'text-slate-400'}`} />
      </span>
      <span
        aria-hidden="true"
        className={`relative z-10 h-7 w-7 rounded-full shadow-md transition-transform duration-300 ease-out ${
          isDark
            ? 'translate-x-7 bg-slate-800 ring-1 ring-slate-700'
            : 'translate-x-0 bg-white ring-1 ring-amber-200/80'
        }`}
      />
    </button>
  )
}
