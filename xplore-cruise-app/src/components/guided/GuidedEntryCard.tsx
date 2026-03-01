'use client'

import React from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'

// ============================================================
// GuidedEntryCard — CTA card for entering the guided flow
// ============================================================

interface GuidedEntryCardProps {
  variant: 'hero' | 'banner' | 'inline'
  onStart: () => void
  locale: Locale
}

export default function GuidedEntryCard({ variant, onStart, locale }: GuidedEntryCardProps) {
  if (variant === 'banner') {
    return (
      <div className="rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex-shrink-0 text-gold-400">
            <CompassIcon className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-heading)] text-gold-400 mb-1">
              {t('guided_entry_title', locale)}
            </h3>
            <p className="text-sm text-navy-300">
              {t('guided_entry_subtitle', locale)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {t('guided_entry_cta', locale)}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <Link
              href="/cruises"
              className="text-xs text-navy-400 hover:text-gold-400 underline underline-offset-2 transition-colors"
            >
              {t('guided_entry_skip', locale)}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="rounded-xl border-2 border-dashed border-gold-300 bg-gold-50/50 p-6 text-center">
        <div className="text-gold-500 mb-3">
          <CompassIcon className="w-10 h-10 mx-auto" />
        </div>
        <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-navy-900 mb-1">
          {t('guided_entry_title', locale)}
        </h3>
        <p className="text-sm text-navy-500 mb-4 max-w-sm mx-auto">
          {t('guided_entry_subtitle', locale)}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          {t('guided_entry_cta', locale)}
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // variant === 'hero'
  return (
    <div className="rounded-xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8 sm:p-10 text-white shadow-xl border border-gold-500/20">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
          <CompassIcon className="w-8 h-8 text-gold-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-heading)] text-gold-400 mb-2">
          {t('guided_entry_title', locale)}
        </h3>
        <p className="text-sm text-navy-300 mb-6">
          {t('guided_entry_subtitle', locale)}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          {t('guided_entry_cta', locale)}
          <ArrowRightIcon className="w-4 h-4" />
        </button>
        <Link
          href="/cruises"
          className="mt-4 text-xs text-navy-400 hover:text-gold-400 underline underline-offset-2 transition-colors"
        >
          {t('guided_entry_skip', locale)}
        </Link>
      </div>
    </div>
  )
}

// ============================================================
// Icons
// ============================================================

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM15.61 8.39l-2.526 5.684a1.875 1.875 0 01-.994.994L6.405 17.61a.375.375 0 01-.495-.495l2.526-5.684a1.875 1.875 0 01.994-.994l5.684-2.526a.375.375 0 01.495.495z" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}
