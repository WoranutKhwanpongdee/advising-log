// ============================================================
// AdvisingLog — Bilingual Language Context (TH / EN)
// Complete Thai / English localization support for MFU SIS
// ============================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { ADVISING_CATEGORIES, REFERRAL_DESTINATIONS, EXIT_REASON_CODES, EARLY_WARNING_TYPES } from '@/types'

export type Language = 'th' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (th: string, en: string) => string
  formatAcademicTerm: () => string
  getCategoryLabel: (value: string) => string
  getReferralLabel: (value: string) => string
  getExitReasonLabel: (value: string) => string
  getWarningTypeLabel: (value: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('advising_log_lang')
    return (saved === 'en' || saved === 'th') ? saved : 'th'
  })

  useEffect(() => {
    localStorage.setItem('advising_log_lang', language)
    document.documentElement.lang = language
  }, [language])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
  }

  // Dual-text helper: selects Thai or English dynamically
  function t(th: string, en: string): string {
    return language === 'th' ? th : en
  }

  function formatAcademicTerm(): string {
    return language === 'th'
      ? 'ภาคการศึกษา 1/2569'
      : 'Semester 1 / Academic Year 2026'
  }

  function getCategoryLabel(value: string): string {
    const item = ADVISING_CATEGORIES.find(c => c.value === value)
    if (!item) return value
    return language === 'th' ? item.labelTh : item.labelEn
  }

  function getReferralLabel(value: string): string {
    const item = REFERRAL_DESTINATIONS.find(d => d.value === value)
    if (!item) return value
    return language === 'th' ? item.labelTh : item.labelEn
  }

  function getExitReasonLabel(value: string): string {
    const item = EXIT_REASON_CODES.find(r => r.value === value)
    if (!item) return value
    return language === 'th' ? item.labelTh : item.labelEn
  }

  function getWarningTypeLabel(value: string): string {
    const item = EARLY_WARNING_TYPES.find(w => w.value === value)
    if (!item) return value
    return language === 'th' ? item.labelTh : item.labelEn
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      formatAcademicTerm,
      getCategoryLabel,
      getReferralLabel,
      getExitReasonLabel,
      getWarningTypeLabel,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
