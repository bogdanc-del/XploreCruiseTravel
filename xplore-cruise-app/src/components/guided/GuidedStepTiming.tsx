'use client'

import React from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'
import type { TimingWindow } from '@/context/GuidedFlowContext'
import { OptionCard } from './GuidedStepExperience'

// ============================================================
// Step 4: "When would you like to travel?"
// ============================================================

interface GuidedStepTimingProps {
  value: TimingWindow | null
  onChange: (val: TimingWindow) => void
  locale: Locale
}

const OPTIONS: { key: TimingWindow; translationKey: string; icon: React.ReactNode }[] = [
  { key: 'next_3_months', translationKey: 'guided_q4_3m', icon: <CalendarSoonIcon /> },
  { key: 'next_6_months', translationKey: 'guided_q4_6m', icon: <CalendarMidIcon /> },
  { key: 'next_year', translationKey: 'guided_q4_year', icon: <CalendarLaterIcon /> },
  { key: 'flexible', translationKey: 'guided_q4_flex', icon: <FlexibleIcon /> },
]

export default function GuidedStepTiming({ value, onChange, locale }: GuidedStepTimingProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-2">
        {t('guided_q4', locale)}
      </h2>
      <p className="text-sm text-navy-500 text-center mb-8">
        {locale === 'ro'
          ? 'Alege intervalul de timp preferat pentru călătorie.'
          : 'Choose your preferred travel timeframe.'}
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.key}
            selected={value === opt.key}
            onClick={() => onChange(opt.key)}
            icon={opt.icon}
            label={t(opt.translationKey as 'guided_q4_3m', locale)}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Icons
// ============================================================

function CalendarSoonIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  )
}

function CalendarMidIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function CalendarLaterIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008z" />
    </svg>
  )
}

function FlexibleIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  )
}
