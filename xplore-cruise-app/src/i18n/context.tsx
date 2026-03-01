'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, type Locale, type TranslationKey } from './translations'

// ============================================================
// Locale Context
// ============================================================

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'xplore-locale'

// ============================================================
// Provider
// ============================================================

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ro')
  const [mounted, setMounted] = useState(false)

  // Load persisted locale from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
      if (stored === 'en' || stored === 'ro') {
        setLocaleState(stored)
      }
    } catch {
      // localStorage unavailable (SSR or privacy mode)
    }
    setMounted(true)
  }, [])

  // Update <html lang> attribute when locale changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale
    }
  }, [locale, mounted])

  // Persist locale changes to localStorage
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ro' : 'en')
  }, [locale, setLocale])

  // Update html lang attribute when locale changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale
    }
  }, [locale, mounted])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

// ============================================================
// Hooks
// ============================================================

/**
 * Access the current locale and locale-switching functions.
 */
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

/**
 * Returns a `t(key)` function bound to the current locale.
 * Usage:
 *   const t = useT()
 *   <span>{t('nav_home')}</span>
 */
export function useT(): (key: TranslationKey) => string {
  const { locale } = useLocale()

  return useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] || translations.en[key] || key
    },
    [locale],
  )
}
