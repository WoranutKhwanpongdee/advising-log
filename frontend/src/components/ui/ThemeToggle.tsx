import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer flex items-center justify-center group ${className}`}
      title={isDark ? t('เปลี่ยนเป็นโหมดสว่าง (คลิกเพื่อสลับทันที)', 'Switch to Light Mode (Click to toggle)') : t('เปลี่ยนเป็นโหมดมืด (คลิกเพื่อสลับทันที)', 'Switch to Dark Mode (Click to toggle)')}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-slate-600 dark:text-slate-300 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  )
}
