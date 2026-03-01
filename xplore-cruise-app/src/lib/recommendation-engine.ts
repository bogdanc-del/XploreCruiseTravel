// ============================================================
// Recommendation Engine — Rule-Based Scoring
// ============================================================

import type { GuidedFlowState, BudgetRange, TimingWindow } from '@/context/GuidedFlowContext'
import { getBudgetBounds, getMaxDate } from '@/context/GuidedFlowContext'

// ============================================================
// CruiseIndex — compact shape from cruises-index.json
// ============================================================

export interface CruiseIndex {
  id: string
  s: string       // slug
  t: string       // title
  ct: string      // cruise_type: ocean | river | luxury
  n: number       // nights
  p: number       // price_from
  dp: string      // departure_port
  dd: string      // departure_date
  img: string     // image_url
  cl: string      // cruise_line
  sn: string      // ship_name
  d: string       // destination
  dr: string      // destination_ro
  ds: string      // destination_slug
}

// ============================================================
// Scoring Constants
// ============================================================

const FIRST_CRUISE_LINES = ['MSC Cruises', 'Costa Cruises', 'Royal Caribbean Cruise Line']
const SOLO_LINES = ['Norwegian Cruise Line', 'Virgin Voyages', 'Celebrity Cruises']
const COUPLE_TYPES = ['ocean', 'luxury']
const FAMILY_LINES = ['MSC Cruises', 'Royal Caribbean Cruise Line', 'Disney Cruise Line', 'Norwegian Cruise Line', 'Costa Cruises']
const FRIENDS_LINES = ['Norwegian Cruise Line', 'Royal Caribbean Cruise Line', 'Carnival Cruise Line', 'Virgin Voyages']
const LUXURY_LINES = ['Silversea Cruises', 'Regent Seven Seas Cruises', 'Seabourn', 'Celebrity Cruises', 'Oceania Cruises']
const ADVENTURE_DESTS = ['alaska', 'africa', 'asia', 'south-america', 'australia-new-zealand', 'tahiti-south-pacific', 'antarctica']
const RELAXATION_DESTS = ['caribbean-central-america', 'mediterranean']
const FAMILY_DESTS = ['mediterranean', 'caribbean-central-america']

// ============================================================
// Scoring Function
// ============================================================

function computeScore(c: CruiseIndex, state: GuidedFlowState): number {
  let score = 0

  // === isFirstCruise scoring (+20 max) ===
  if (state.isFirstCruise === true) {
    if (c.ct === 'ocean') score += 10
    if (c.n <= 7) score += 5
    if (FIRST_CRUISE_LINES.includes(c.cl)) score += 5
  }

  // === travelParty scoring (+20 max) ===
  switch (state.travelParty) {
    case 'solo':
      if (SOLO_LINES.includes(c.cl)) score += 15
      if (c.ct === 'luxury') score += 5
      break
    case 'couple':
      if (COUPLE_TYPES.includes(c.ct)) score += 10
      if (LUXURY_LINES.includes(c.cl)) score += 10
      break
    case 'family':
      if (FAMILY_LINES.includes(c.cl)) score += 15
      if (c.n <= 10) score += 5
      break
    case 'friends':
      if (FRIENDS_LINES.includes(c.cl)) score += 15
      if (c.ct === 'ocean') score += 5
      break
    case 'group':
      if (c.p < 800) score += 15
      if (c.ct === 'ocean') score += 5
      break
  }

  // === priority scoring (+30 max) ===
  switch (state.mainPriority) {
    case 'budget':
      if (c.p < 400) score += 20
      else if (c.p < 600) score += 15
      else if (c.p < 800) score += 10
      break
    case 'luxury':
      if (c.ct === 'luxury') score += 20
      else if (LUXURY_LINES.includes(c.cl)) score += 15
      if (c.p >= 1500) score += 10
      break
    case 'family':
      if (FAMILY_LINES.includes(c.cl)) score += 15
      if (FAMILY_DESTS.includes(c.ds)) score += 15
      break
    case 'adventure':
      if (ADVENTURE_DESTS.includes(c.ds)) score += 25
      if (c.n >= 10) score += 5
      break
    case 'relaxation':
      if (RELAXATION_DESTS.includes(c.ds)) score += 20
      if (c.ct === 'luxury') score += 10
      break
  }

  // === timing freshness (+10 max) ===
  if (state.travelWindow && state.travelWindow !== 'flexible' && c.dd) {
    const now = Date.now()
    const dep = new Date(c.dd).getTime()
    const maxDep = getMaxDate(state.travelWindow).getTime()
    if (dep >= now && dep <= maxDep) {
      // Closer departures score higher
      const range = maxDep - now
      const dist = dep - now
      const freshness = 1 - (dist / range)
      score += Math.round(freshness * 10)
    }
  }

  // === image quality bonus (+5) ===
  if (c.img && !c.img.includes('default') && !c.img.includes('placeholder')) {
    score += 5
  }

  // === price attractiveness for non-budget (+5) ===
  if (state.mainPriority !== 'budget') {
    if (c.p < 600) score += 5
    else if (c.p < 1000) score += 3
  }

  return score
}

// ============================================================
// Main Recommendation Function
// ============================================================

export function getRecommendations(
  state: GuidedFlowState,
  allCruises: CruiseIndex[],
  maxResults: number = 5
): (CruiseIndex & { _score: number })[] {
  const now = new Date()

  // === 1. Apply HARD FILTERS ===
  let pool = allCruises.filter(c => {
    // Only active cruises with future departure
    if (c.dd) {
      const dep = new Date(c.dd)
      if (dep < now) return false
    }

    // Timing filter
    if (state.travelWindow && state.travelWindow !== 'flexible' && c.dd) {
      const maxDate = getMaxDate(state.travelWindow)
      if (new Date(c.dd) > maxDate) return false
    }

    // Budget filter
    if (state.budgetRange) {
      const [min, max] = getBudgetBounds(state.budgetRange)
      if (c.p < min || c.p > max) return false
    }

    // Destination filter
    if (state.preferredDestination) {
      if (c.ds !== state.preferredDestination) return false
    }

    return true
  })

  // === 2. Fallback if pool too small ===
  if (pool.length < 3) {
    // Relax budget
    pool = allCruises.filter(c => {
      if (c.dd && new Date(c.dd) < now) return false
      if (state.travelWindow && state.travelWindow !== 'flexible' && c.dd) {
        const maxDate = getMaxDate(state.travelWindow)
        if (new Date(c.dd) > maxDate) return false
      }
      if (state.preferredDestination && c.ds !== state.preferredDestination) return false
      return true
    })
  }

  if (pool.length < 3) {
    // Relax destination too
    pool = allCruises.filter(c => {
      if (c.dd && new Date(c.dd) < now) return false
      if (state.travelWindow && state.travelWindow !== 'flexible' && c.dd) {
        const maxDate = getMaxDate(state.travelWindow)
        if (new Date(c.dd) > maxDate) return false
      }
      return true
    })
  }

  if (pool.length < 3) {
    // Final fallback: all future cruises
    pool = allCruises.filter(c => !c.dd || new Date(c.dd) >= now)
  }

  // === 3. SCORE each cruise ===
  const scored = pool.map(c => ({
    ...c,
    _score: computeScore(c, state),
  }))

  // === 4. Sort by score DESC, then price ASC for ties ===
  scored.sort((a, b) => b._score - a._score || a.p - b.p)

  // === 5. Deduplicate by cruise_line — max 2 per line ===
  const result: (CruiseIndex & { _score: number })[] = []
  const lineCounts = new Map<string, number>()

  for (const item of scored) {
    if (result.length >= maxResults) break
    const count = lineCounts.get(item.cl) || 0
    if (count >= 2) continue
    lineCounts.set(item.cl, count + 1)
    result.push(item)
  }

  // If we still don't have enough (shouldn't happen with 8k+ cruises)
  if (result.length < 3 && scored.length >= 3) {
    for (const item of scored) {
      if (result.length >= maxResults) break
      if (!result.find(r => r.id === item.id)) {
        result.push(item)
      }
    }
  }

  return result
}

// ============================================================
// "Why this cruise?" — explanation text
// ============================================================

export function getRecommendationReason(
  c: CruiseIndex & { _score: number },
  state: GuidedFlowState,
  locale: 'en' | 'ro'
): string {
  const reasons: string[] = []

  // Priority match
  if (state.mainPriority === 'budget' && c.p < 600) {
    reasons.push(locale === 'ro' ? 'Preț excelent' : 'Great price')
  }
  if (state.mainPriority === 'luxury' && (c.ct === 'luxury' || LUXURY_LINES.includes(c.cl))) {
    reasons.push(locale === 'ro' ? 'Experiență premium' : 'Premium experience')
  }
  if (state.mainPriority === 'adventure' && ADVENTURE_DESTS.includes(c.ds)) {
    reasons.push(locale === 'ro' ? 'Destinație exotică' : 'Exotic destination')
  }
  if (state.mainPriority === 'relaxation' && RELAXATION_DESTS.includes(c.ds)) {
    reasons.push(locale === 'ro' ? 'Perfectă pentru relaxare' : 'Perfect for relaxation')
  }
  if (state.mainPriority === 'family' && FAMILY_LINES.includes(c.cl)) {
    reasons.push(locale === 'ro' ? 'Ideală pentru familie' : 'Great for families')
  }

  // Travel party match
  if (state.travelParty === 'couple' && (c.ct === 'luxury' || LUXURY_LINES.includes(c.cl))) {
    reasons.push(locale === 'ro' ? 'Romantică' : 'Romantic')
  }
  if (state.travelParty === 'family' && FAMILY_LINES.includes(c.cl)) {
    reasons.push(locale === 'ro' ? 'Prietenoasă cu copiii' : 'Kid-friendly')
  }

  // First cruise match
  if (state.isFirstCruise && c.n <= 7 && FIRST_CRUISE_LINES.includes(c.cl)) {
    reasons.push(locale === 'ro' ? 'Ideală pentru prima croazieră' : 'Perfect for first-timers')
  }

  // Score-based generic
  if (reasons.length === 0) {
    if (c._score >= 50) {
      reasons.push(locale === 'ro' ? 'Potrivire foarte bună' : 'Excellent match')
    } else if (c._score >= 30) {
      reasons.push(locale === 'ro' ? 'Potrivire bună' : 'Good match')
    } else {
      reasons.push(locale === 'ro' ? 'Recomandare' : 'Recommended')
    }
  }

  return reasons.slice(0, 2).join(' · ')
}
