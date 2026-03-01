'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

// ============================================================
// Types
// ============================================================

export type TravelParty = 'solo' | 'couple' | 'family' | 'friends' | 'group'
export type Priority = 'budget' | 'luxury' | 'family' | 'adventure' | 'relaxation'
export type TimingWindow = 'next_3_months' | 'next_6_months' | 'next_year' | 'flexible'
export type BudgetRange = 'under_500' | '500_1000' | '1000_2000' | 'over_2000'

export interface GuidedFlowState {
  // Step 1 — required
  isFirstCruise: boolean | null
  previousCruiseLine: string | null

  // Step 2 — required
  travelParty: TravelParty | null

  // Step 3 — required
  mainPriority: Priority | null

  // Step 4 — required
  travelWindow: TimingWindow | null

  // Step 5 — optional
  budgetRange: BudgetRange | null
  preferredDestination: string | null

  // Flow metadata
  currentStep: number
  isComplete: boolean
  startedAt: number | null
  completedAt: number | null
}

// ============================================================
// Actions
// ============================================================

export type GuidedFlowAction =
  | { type: 'SET_FIRST_CRUISE'; payload: boolean }
  | { type: 'SET_PREVIOUS_LINE'; payload: string }
  | { type: 'SET_TRAVEL_PARTY'; payload: TravelParty }
  | { type: 'SET_PRIORITY'; payload: Priority }
  | { type: 'SET_TIMING'; payload: TimingWindow }
  | { type: 'SET_BUDGET'; payload: BudgetRange | null }
  | { type: 'SET_DESTINATION'; payload: string | null }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SKIP_OPTIONAL' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }

// ============================================================
// Initial State
// ============================================================

const INITIAL_STATE: GuidedFlowState = {
  isFirstCruise: null,
  previousCruiseLine: null,
  travelParty: null,
  mainPriority: null,
  travelWindow: null,
  budgetRange: null,
  preferredDestination: null,
  currentStep: 1,
  isComplete: false,
  startedAt: null,
  completedAt: null,
}

const STORAGE_KEY = 'xplore-guided-flow'

// ============================================================
// Reducer
// ============================================================

function guidedFlowReducer(state: GuidedFlowState, action: GuidedFlowAction): GuidedFlowState {
  switch (action.type) {
    case 'SET_FIRST_CRUISE':
      return { ...state, isFirstCruise: action.payload }

    case 'SET_PREVIOUS_LINE':
      return { ...state, previousCruiseLine: action.payload }

    case 'SET_TRAVEL_PARTY':
      return { ...state, travelParty: action.payload }

    case 'SET_PRIORITY':
      return { ...state, mainPriority: action.payload }

    case 'SET_TIMING':
      return { ...state, travelWindow: action.payload }

    case 'SET_BUDGET':
      return { ...state, budgetRange: action.payload }

    case 'SET_DESTINATION':
      return { ...state, preferredDestination: action.payload }

    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) }

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) }

    case 'SKIP_OPTIONAL':
      // Skip step 5 → go to results (step 6)
      return { ...state, currentStep: 6, isComplete: true, completedAt: Date.now() }

    case 'COMPLETE':
      return { ...state, isComplete: true, completedAt: Date.now(), currentStep: 6 }

    case 'RESET':
      return { ...INITIAL_STATE }

    default:
      return state
  }
}

// ============================================================
// Budget Bounds Helper
// ============================================================

export function getBudgetBounds(budget: BudgetRange): [number, number] {
  switch (budget) {
    case 'under_500': return [0, 500]
    case '500_1000': return [500, 1000]
    case '1000_2000': return [1000, 2000]
    case 'over_2000': return [2000, Infinity]
  }
}

// ============================================================
// Timing Helper
// ============================================================

export function getMaxDate(timing: TimingWindow): Date {
  const now = new Date()
  switch (timing) {
    case 'next_3_months':
      return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
    case 'next_6_months':
      return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate())
    case 'next_year':
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    case 'flexible':
      return new Date(9999, 11, 31) // no constraint
  }
}

// ============================================================
// Context
// ============================================================

interface GuidedFlowContextValue {
  state: GuidedFlowState
  dispatch: React.Dispatch<GuidedFlowAction>
  isOpen: boolean
  openFlow: (source?: 'homepage' | 'listing' | 'nav') => void
  closeFlow: () => void
  resetFlow: () => void
  getFilterParams: () => URLSearchParams
}

const GuidedFlowContext = createContext<GuidedFlowContextValue | null>(null)

// ============================================================
// Provider
// ============================================================

export function GuidedFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(guidedFlowReducer, INITIAL_STATE, () => {
    // Hydrate from sessionStorage on initial mount
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as GuidedFlowState
          return { ...INITIAL_STATE, ...parsed }
        }
      } catch {
        // ignore parse errors
      }
    }
    return INITIAL_STATE
  })

  const [isOpen, setIsOpen] = React.useState(false)

  // Persist to sessionStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        // ignore quota errors
      }
    }
  }, [state])

  const openFlow = useCallback((source?: 'homepage' | 'listing' | 'nav') => {
    // If not already started, set startedAt
    if (!state.startedAt) {
      dispatch({ type: 'RESET' })
    }
    // Set startedAt after reset
    setIsOpen(true)
    if (!state.isComplete) {
      // Will be set fresh — reducer doesn't set startedAt, we handle it here
      dispatch({
        type: 'SET_FIRST_CRUISE',
        payload: state.isFirstCruise as boolean,
      } as GuidedFlowAction)
    }
    // Track analytics event (imported dynamically to avoid circular deps)
    if (source) {
      import('@/lib/analytics').then(({ trackGuidedStart }) => trackGuidedStart(source))
    }
  }, [state.startedAt, state.isComplete, state.isFirstCruise])

  const closeFlow = useCallback(() => {
    setIsOpen(false)
    if (!state.isComplete) {
      // Abandoned — fire event and reset
      const durationSeconds = state.startedAt
        ? Math.round((Date.now() - state.startedAt) / 1000)
        : 0
      import('@/lib/analytics').then(({ trackGuidedAbandon }) =>
        trackGuidedAbandon(state.currentStep, durationSeconds)
      )
      dispatch({ type: 'RESET' })
    }
    // If complete, preserve state for back-navigation
  }, [state.isComplete, state.startedAt, state.currentStep])

  const resetFlow = useCallback(() => {
    dispatch({ type: 'RESET' })
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const getFilterParams = useCallback((): URLSearchParams => {
    const params = new URLSearchParams()
    if (state.preferredDestination) params.set('destination', state.preferredDestination)
    if (state.budgetRange) {
      const [min, max] = getBudgetBounds(state.budgetRange)
      if (min > 0) params.set('minPrice', String(min))
      if (max < Infinity) params.set('maxPrice', String(max))
    }
    if (state.mainPriority === 'luxury') params.set('type', 'luxury')
    if (state.mainPriority === 'budget') params.set('sort', 'price_asc')
    if (state.isComplete) params.set('guided', '1')
    return params
  }, [state])

  const value: GuidedFlowContextValue = {
    state,
    dispatch,
    isOpen,
    openFlow,
    closeFlow,
    resetFlow,
    getFilterParams,
  }

  return (
    <GuidedFlowContext.Provider value={value}>
      {children}
    </GuidedFlowContext.Provider>
  )
}

// ============================================================
// Hook
// ============================================================

export function useGuidedFlow(): GuidedFlowContextValue {
  const ctx = useContext(GuidedFlowContext)
  if (!ctx) {
    throw new Error('useGuidedFlow must be used within a GuidedFlowProvider')
  }
  return ctx
}
