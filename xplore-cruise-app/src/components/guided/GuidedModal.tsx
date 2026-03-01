'use client'

import React, { useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import { useLocale, useT } from '@/i18n/context'
import { useGuidedFlow } from '@/context/GuidedFlowContext'
import type { TravelParty, Priority, TimingWindow, BudgetRange } from '@/context/GuidedFlowContext'
import { trackGuidedStepComplete, trackGuidedSkip, trackGuidedOptionalComplete } from '@/lib/analytics'
import GuidedProgress from './GuidedProgress'
import GuidedStepExperience from './GuidedStepExperience'
import GuidedStepTravelParty from './GuidedStepTravelParty'
import GuidedStepPriority from './GuidedStepPriority'
import GuidedStepTiming from './GuidedStepTiming'
import GuidedStepPreferences from './GuidedStepPreferences'

// ============================================================
// Destination list (from cruises data)
// ============================================================

const DESTINATIONS = [
  { slug: 'mediterranean', label: 'Mediterranean' },
  { slug: 'caribbean-central-america', label: 'Caribbean & Central America' },
  { slug: 'northern-europe', label: 'Northern Europe' },
  { slug: 'middle-east', label: 'Middle East' },
  { slug: 'transatlantic', label: 'Transatlantic' },
  { slug: 'south-america', label: 'South America' },
  { slug: 'africa', label: 'Africa' },
  { slug: 'asia', label: 'Asia' },
  { slug: 'alaska', label: 'Alaska' },
  { slug: 'danube', label: 'Danube' },
  { slug: 'rhine', label: 'Rhine' },
  { slug: 'greek-islands', label: 'Greek Islands' },
  { slug: 'canary-islands', label: 'Canary Islands' },
  { slug: 'british-isles', label: 'British Isles' },
  { slug: 'indian-ocean', label: 'Indian Ocean' },
  { slug: 'australia-new-zealand', label: 'Australia & New Zealand' },
  { slug: 'hawaii', label: 'Hawaii' },
  { slug: 'tahiti-south-pacific', label: 'Tahiti & South Pacific' },
  { slug: 'antarctica', label: 'Antarctica' },
  { slug: 'around-the-world', label: 'Around the World' },
]

// ============================================================
// GuidedModal
// ============================================================

export default function GuidedModal() {
  const { locale } = useLocale()
  const t = useT()
  const { state, dispatch, isOpen, closeFlow } = useGuidedFlow()
  const [startedAt] = useState(() => Date.now())

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeFlow()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, closeFlow])

  // Check if current step has a value (for enabling Next)
  const canProceed = useCallback((): boolean => {
    switch (state.currentStep) {
      case 1: return state.isFirstCruise !== null
      case 2: return state.travelParty !== null
      case 3: return state.mainPriority !== null
      case 4: return state.travelWindow !== null
      case 5: return true // optional step, always can proceed
      default: return false
    }
  }, [state])

  // Handle Next
  const handleNext = useCallback(() => {
    if (!canProceed()) return

    // Track step complete
    const stepNames = ['experience', 'travel_party', 'priority', 'timing', 'preferences']
    const stepValues = [
      String(state.isFirstCruise),
      state.travelParty || '',
      state.mainPriority || '',
      state.travelWindow || '',
      `budget:${state.budgetRange || 'none'},dest:${state.preferredDestination || 'none'}`,
    ]

    if (state.currentStep <= 4) {
      trackGuidedStepComplete(state.currentStep, stepNames[state.currentStep - 1], stepValues[state.currentStep - 1])
    }

    if (state.currentStep === 5) {
      // Optional step completed
      trackGuidedOptionalComplete(state.budgetRange || '', state.preferredDestination || '')
      dispatch({ type: 'COMPLETE' })
    } else {
      dispatch({ type: 'NEXT_STEP' })
    }
  }, [canProceed, state, dispatch])

  // Handle Back
  const handleBack = useCallback(() => {
    if (state.currentStep === 1) {
      closeFlow()
    } else {
      dispatch({ type: 'PREV_STEP' })
    }
  }, [state.currentStep, dispatch, closeFlow])

  // Handle Skip (step 5)
  const handleSkip = useCallback(() => {
    trackGuidedSkip(5)
    dispatch({ type: 'SKIP_OPTIONAL' })
  }, [dispatch])

  if (!isOpen) return null

  // If flow is complete (step 6), don't show modal — GuidedResults takes over
  if (state.currentStep === 6) return null

  const totalSteps = 5

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={locale === 'ro' ? 'Recomandare rapidă' : 'Quick Recommendation'}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-navy-100">
        <Link
          href="/cruises"
          className="text-xs text-navy-500 hover:text-gold-600 transition-colors underline underline-offset-2"
        >
          {locale === 'ro' ? 'Explorează toate croazierele' : 'Browse all cruises'}
        </Link>

        <div className="flex-1 max-w-md mx-4 sm:mx-8">
          <GuidedProgress currentStep={state.currentStep} totalSteps={totalSteps} locale={locale} />
        </div>

        <button
          type="button"
          onClick={closeFlow}
          className="flex items-center gap-1 text-sm text-navy-500 hover:text-navy-900 transition-colors"
          aria-label={t('guided_close')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">{t('guided_close')}</span>
        </button>
      </div>

      {/* Step content — centered */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-4 sm:px-6 py-8">
        {state.currentStep === 1 && (
          <GuidedStepExperience
            value={state.isFirstCruise}
            previousLine={state.previousCruiseLine}
            onChange={val => dispatch({ type: 'SET_FIRST_CRUISE', payload: val })}
            onPreviousLineChange={val => dispatch({ type: 'SET_PREVIOUS_LINE', payload: val })}
            locale={locale}
          />
        )}
        {state.currentStep === 2 && (
          <GuidedStepTravelParty
            value={state.travelParty}
            onChange={(val: TravelParty) => dispatch({ type: 'SET_TRAVEL_PARTY', payload: val })}
            locale={locale}
          />
        )}
        {state.currentStep === 3 && (
          <GuidedStepPriority
            value={state.mainPriority}
            onChange={(val: Priority) => dispatch({ type: 'SET_PRIORITY', payload: val })}
            locale={locale}
          />
        )}
        {state.currentStep === 4 && (
          <GuidedStepTiming
            value={state.travelWindow}
            onChange={(val: TimingWindow) => dispatch({ type: 'SET_TIMING', payload: val })}
            locale={locale}
          />
        )}
        {state.currentStep === 5 && (
          <GuidedStepPreferences
            budget={state.budgetRange}
            destination={state.preferredDestination}
            destinations={DESTINATIONS}
            onBudgetChange={(val: BudgetRange | null) => dispatch({ type: 'SET_BUDGET', payload: val })}
            onDestinationChange={(val: string | null) => dispatch({ type: 'SET_DESTINATION', payload: val })}
            locale={locale}
          />
        )}
      </div>

      {/* Bottom bar — navigation */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-navy-100 bg-white">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-navy-600 hover:text-navy-900 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t('guided_back')}
        </button>

        <div className="flex items-center gap-3">
          {/* Skip button — only on step 5 */}
          {state.currentStep === 5 && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-navy-500 hover:text-navy-700 transition-colors underline underline-offset-2"
            >
              {t('guided_skip')}
            </button>
          )}

          {/* Next/Complete button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${canProceed()
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-navy-100 text-navy-400 cursor-not-allowed'
              }
            `}
          >
            {state.currentStep === 5
              ? (locale === 'ro' ? 'Vezi recomandări' : 'See recommendations')
              : t('guided_next')
            }
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
