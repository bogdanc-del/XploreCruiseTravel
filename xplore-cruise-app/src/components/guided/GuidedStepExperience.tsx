'use client'

import React from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'

// ============================================================
// Step 1: "Is this your first cruise?"
// ============================================================

interface GuidedStepExperienceProps {
  value: boolean | null
  previousLine: string | null
  onChange: (val: boolean) => void
  onPreviousLineChange: (val: string) => void
  locale: Locale
}

export default function GuidedStepExperience({
  value,
  previousLine,
  onChange,
  onPreviousLineChange,
  locale,
}: GuidedStepExperienceProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-2">
        {t('guided_q1', locale)}
      </h2>
      <p className="text-sm text-navy-500 text-center mb-8">
        {locale === 'ro'
          ? 'Ne ajută să îți recomandăm cele mai potrivite opțiuni.'
          : 'This helps us recommend the best options for you.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
        <OptionCard
          selected={value === true}
          onClick={() => onChange(true)}
          icon={<SparklesIcon />}
          label={t('guided_q1_yes', locale)}
          description={locale === 'ro' ? 'Vreau să descopăr lumea croazierelor' : 'I want to discover the world of cruises'}
        />
        <OptionCard
          selected={value === false}
          onClick={() => onChange(false)}
          icon={<ShipIcon />}
          label={t('guided_q1_no', locale)}
          description={locale === 'ro' ? 'Am experiență cu croazierele' : 'I have cruise experience'}
        />
      </div>

      {/* Follow-up for experienced cruisers */}
      {value === false && (
        <div className="w-full animate-fade-in-up">
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {t('guided_q1_follow', locale)}
          </label>
          <input
            type="text"
            value={previousLine || ''}
            onChange={e => onPreviousLineChange(e.target.value)}
            placeholder={locale === 'ro' ? 'ex: MSC Cruises, Costa...' : 'e.g. MSC Cruises, Costa...'}
            className="w-full rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
          />
        </div>
      )}
    </div>
  )
}

// ============================================================
// Shared Option Card
// ============================================================

export function OptionCard({
  selected,
  onClick,
  icon,
  label,
  description,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  description?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center
        transition-all duration-200 cursor-pointer min-h-[120px] justify-center
        ${selected
          ? 'border-gold-500 bg-gold-50 shadow-md ring-2 ring-gold-500/20'
          : 'border-navy-200 bg-white hover:border-navy-300 hover:shadow-sm'
        }
      `}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className={`${selected ? 'text-gold-600' : 'text-navy-400'} transition-colors`}>
        {icon}
      </div>
      <div>
        <p className={`font-semibold text-sm ${selected ? 'text-navy-900' : 'text-navy-700'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-navy-400 mt-1">{description}</p>
        )}
      </div>
    </button>
  )
}

// ============================================================
// Icons
// ============================================================

function SparklesIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

function ShipIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h16.5M3.75 13.5c0 3.038 2.462 5.5 5.5 5.5h5.5c3.038 0 5.5-2.462 5.5-5.5M3.75 13.5L2.25 12l3-6h13.5l3 6-1.5 1.5M12 3v4m-3 0h6" />
    </svg>
  )
}
