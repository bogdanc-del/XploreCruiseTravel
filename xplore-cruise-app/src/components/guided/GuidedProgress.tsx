'use client'

import React from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'

// ============================================================
// GuidedProgress — step indicator bar
// ============================================================

interface GuidedProgressProps {
  currentStep: number
  totalSteps: number
  locale: Locale
}

const STEP_LABELS_RO = ['Experiență', 'Călătorești cu', 'Prioritate', 'Perioadă', 'Preferințe']
const STEP_LABELS_EN = ['Experience', 'Travel Party', 'Priority', 'Timing', 'Preferences']

export default function GuidedProgress({ currentStep, totalSteps, locale }: GuidedProgressProps) {
  const labels = locale === 'ro' ? STEP_LABELS_RO : STEP_LABELS_EN
  const pct = Math.min(((currentStep - 1) / (totalSteps - 1)) * 100, 100)

  return (
    <div className="w-full" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {/* Progress bar */}
      <div className="relative h-1 bg-navy-100 rounded-full overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between items-center">
        {labels.slice(0, totalSteps).map((label, i) => {
          const step = i + 1
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const isOptional = step === 5

          return (
            <div key={step} className="flex flex-col items-center gap-1 min-w-0">
              <div
                className={`
                  flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-300
                  ${isCompleted
                    ? 'bg-gold-500 text-white'
                    : isActive
                      ? 'bg-navy-900 text-white ring-2 ring-gold-400 ring-offset-2'
                      : 'bg-navy-100 text-navy-400'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckIcon />
                ) : (
                  step
                )}
              </div>
              <span
                className={`
                  text-[10px] leading-tight text-center hidden sm:block truncate max-w-[70px]
                  ${isActive ? 'text-navy-900 font-semibold' : 'text-navy-400'}
                `}
              >
                {label}
                {isOptional && (
                  <span className="block text-[9px] text-navy-300 font-normal">
                    ({t('guided_skip', locale).toLowerCase()})
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
