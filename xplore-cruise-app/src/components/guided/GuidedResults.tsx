'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useLocale, useT } from '@/i18n/context'
import { useGuidedFlow } from '@/context/GuidedFlowContext'
import { getRecommendations, getRecommendationReason } from '@/lib/recommendation-engine'
import type { CruiseIndex } from '@/lib/recommendation-engine'
import { trackGuidedComplete, trackGuidedResultClick, trackGuidedResultOffer } from '@/lib/analytics'
import GuidedResultCard from './GuidedResultCard'
import LeadCaptureForm from '@/components/lead/LeadCaptureForm'
import Button from '@/components/ui/Button'

// ============================================================
// GuidedResults — shows recommended cruises after flow completion
// ============================================================

export default function GuidedResults() {
  const { locale } = useLocale()
  const t = useT()
  const { state, resetFlow, getFilterParams } = useGuidedFlow()

  // Load cruise index data
  const [allCruises, setAllCruises] = useState<CruiseIndex[]>([])
  const [loading, setLoading] = useState(true)

  // Lead form state
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [selectedCruise, setSelectedCruise] = useState<(CruiseIndex & { _score: number }) | null>(null)

  // Fetch cruise index
  useEffect(() => {
    fetch('/data/cruises-index.json')
      .then(r => r.json())
      .then((data: CruiseIndex[]) => {
        setAllCruises(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Get recommendations
  const recommendations = useMemo(() => {
    if (!allCruises.length || !state.isComplete) return []
    return getRecommendations(state, allCruises, 5)
  }, [allCruises, state])

  // Track guided_complete event once
  useEffect(() => {
    if (recommendations.length > 0 && state.isComplete && state.startedAt) {
      const durationSeconds = Math.round((Date.now() - state.startedAt) / 1000)
      trackGuidedComplete(recommendations.length, durationSeconds)
    }
  }, [recommendations.length, state.isComplete, state.startedAt])

  // Build "browse all" URL with guided filters
  const browseUrl = useMemo(() => {
    const params = getFilterParams()
    const qs = params.toString()
    return qs ? `/cruises?${qs}` : '/cruises'
  }, [getFilterParams])

  // Summary sentence
  const summary = useMemo(() => {
    if (!state.isComplete) return ''
    const parts: string[] = []
    if (locale === 'ro') {
      if (state.isFirstCruise) parts.push('prima croazieră')
      if (state.travelParty) {
        const map: Record<string, string> = {
          solo: 'călătorești singur(ă)',
          couple: 'călătorești în cuplu',
          family: 'călătorești cu familia',
          friends: 'călătorești cu prietenii',
          group: 'grup organizat',
        }
        parts.push(map[state.travelParty] || '')
      }
      if (state.mainPriority) {
        const map: Record<string, string> = {
          budget: 'cel mai bun preț',
          luxury: 'experiență premium',
          family: 'activități pentru familie',
          adventure: 'destinații exotice',
          relaxation: 'relaxare și spa',
        }
        parts.push(map[state.mainPriority] || '')
      }
      return `Recomandări personalizate: ${parts.join(', ')}.`
    } else {
      if (state.isFirstCruise) parts.push('first cruise')
      if (state.travelParty) {
        const map: Record<string, string> = {
          solo: 'solo traveler',
          couple: 'traveling as a couple',
          family: 'family trip',
          friends: 'traveling with friends',
          group: 'organized group',
        }
        parts.push(map[state.travelParty] || '')
      }
      if (state.mainPriority) {
        const map: Record<string, string> = {
          budget: 'best price',
          luxury: 'premium experience',
          family: 'family activities',
          adventure: 'exotic destinations',
          relaxation: 'relaxation & spa',
        }
        parts.push(map[state.mainPriority] || '')
      }
      return `Personalized recommendations: ${parts.join(', ')}.`
    }
  }, [state, locale])

  if (!state.isComplete) return null

  return (
    <>
      <section className="min-h-screen bg-navy-50 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
              {t('guided_results_title')}
            </h1>
            <p className="text-navy-500 text-sm max-w-lg mx-auto">
              {summary}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
            </div>
          )}

          {/* Results Grid */}
          {!loading && recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {recommendations.map((cruise, i) => (
                <div key={cruise.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <GuidedResultCard
                    cruise={cruise}
                    reason={getRecommendationReason(cruise, state, locale)}
                    position={i}
                    locale={locale}
                    onCardClick={() => {
                      trackGuidedResultClick(cruise.s, i, cruise._score)
                    }}
                    onRequestOffer={() => {
                      trackGuidedResultOffer(cruise.s, i)
                      setSelectedCruise(cruise)
                      setShowLeadForm(true)
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* No results fallback */}
          {!loading && recommendations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-navy-500 mb-4">
                {locale === 'ro'
                  ? 'Nu am găsit croaziere care să se potrivească exact. Explorează toate opțiunile disponibile.'
                  : 'No exact matches found. Browse all available options.'}
              </p>
            </div>
          )}

          {/* Bottom actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button as="a" href={browseUrl} variant="secondary" size="lg">
              {t('guided_results_browse')}
            </Button>
            <button
              type="button"
              onClick={resetFlow}
              className="text-sm text-navy-500 hover:text-navy-700 underline underline-offset-2 transition-colors"
            >
              {locale === 'ro' ? 'Începe din nou' : 'Start over'}
            </button>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      {selectedCruise && (
        <LeadCaptureForm
          isOpen={showLeadForm}
          onClose={() => {
            setShowLeadForm(false)
            setSelectedCruise(null)
          }}
          cruiseTitle={selectedCruise.t}
          cruiseSlug={selectedCruise.s}
          cruisePrice={selectedCruise.p}
          source="guided_result"
          guidedContext={{
            isFirstCruise: state.isFirstCruise,
            previousCruiseLine: state.previousCruiseLine,
            travelParty: state.travelParty,
            mainPriority: state.mainPriority,
            travelWindow: state.travelWindow,
            budgetRange: state.budgetRange,
            preferredDestination: state.preferredDestination,
          }}
        />
      )}
    </>
  )
}
