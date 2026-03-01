'use client'

import React from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'
import type { BudgetRange } from '@/context/GuidedFlowContext'

// ============================================================
// Step 5: Optional preferences (budget + destination)
// ============================================================

interface GuidedStepPreferencesProps {
  budget: BudgetRange | null
  destination: string | null
  destinations: { slug: string; label: string }[]
  onBudgetChange: (val: BudgetRange | null) => void
  onDestinationChange: (val: string | null) => void
  locale: Locale
}

const BUDGET_OPTIONS: { key: BudgetRange; translationKey: string }[] = [
  { key: 'under_500', translationKey: 'budget_under_500' },
  { key: '500_1000', translationKey: 'budget_500_1000' },
  { key: '1000_2000', translationKey: 'budget_1000_2000' },
  { key: 'over_2000', translationKey: 'budget_over_2000' },
]

export default function GuidedStepPreferences({
  budget,
  destination,
  destinations,
  onBudgetChange,
  onDestinationChange,
  locale,
}: GuidedStepPreferencesProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-2">
        {t('guided_q5', locale)}
      </h2>
      <p className="text-sm text-navy-500 text-center mb-8">
        {locale === 'ro'
          ? 'Aceste preferințe sunt opționale, dar ne ajută să rafinăm recomandările.'
          : 'These preferences are optional, but help us refine recommendations.'}
      </p>

      {/* Budget Range */}
      <div className="w-full mb-8">
        <label className="block text-sm font-semibold text-navy-700 mb-3">
          {t('guided_q5_budget_label', locale)}
        </label>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onBudgetChange(budget === opt.key ? null : opt.key)}
              className={`
                px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                ${budget === opt.key
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100 border border-navy-200'
                }
              `}
            >
              {t(opt.translationKey as 'budget_under_500', locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Preference */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-navy-700 mb-3">
          {t('guided_q5_dest_label', locale)}
        </label>
        <select
          value={destination || ''}
          onChange={e => onDestinationChange(e.target.value || null)}
          className="w-full rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-900 bg-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">
            {locale === 'ro' ? 'Fără preferință' : 'No preference'}
          </option>
          {destinations.map(d => (
            <option key={d.slug} value={d.slug}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
