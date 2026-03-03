'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ExchangeRateData } from '@/lib/bnr-exchange-rate'
import { FALLBACK_EUR_RON, EXCHANGE_MARGIN } from '@/lib/bnr-exchange-rate'

// ============================================================
// ExchangeRateProvider — fetches BNR EUR/RON rate once on mount
// and provides it to all child components via React context.
//
// Falls back to FALLBACK_EUR_RON (4.97) if the API is unavailable.
// Rate is cached in-memory for the session; the API itself caches
// for 4 hours server-side.
// ============================================================

interface ExchangeRateContextValue {
  /** BNR reference rate (EUR → RON) */
  rate: number
  /** Rate with 2.5% margin applied */
  rateWithMargin: number
  /** BNR publishing date (YYYY-MM-DD) */
  date: string
  /** Whether this is the fallback rate */
  isFallback: boolean
  /** Whether the rate is still loading */
  isLoading: boolean
}

const fallbackWithMargin = Math.round(FALLBACK_EUR_RON * (1 + EXCHANGE_MARGIN) * 10000) / 10000

const defaultValue: ExchangeRateContextValue = {
  rate: FALLBACK_EUR_RON,
  rateWithMargin: fallbackWithMargin,
  date: new Date().toISOString().split('T')[0],
  isFallback: true,
  isLoading: true,
}

const ExchangeRateContext = createContext<ExchangeRateContextValue>(defaultValue)

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<ExchangeRateContextValue>(defaultValue)

  useEffect(() => {
    let cancelled = false

    fetch('/api/exchange-rate')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: ExchangeRateData) => {
        if (cancelled) return
        setValue({
          rate: data.rate,
          rateWithMargin: data.rateWithMargin,
          date: data.date,
          isFallback: data.isFallback,
          isLoading: false,
        })
      })
      .catch(() => {
        if (cancelled) return
        // Use fallback rate on error
        setValue((prev) => ({ ...prev, isLoading: false }))
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  )
}

/**
 * Hook to access the current EUR/RON exchange rate.
 *
 * Returns the BNR rate with margin applied (2.5%).
 * Falls back to hardcoded rate (4.97) if BNR is unavailable.
 *
 * Usage:
 *   const { rateWithMargin } = useExchangeRate()
 *   const priceRon = Math.round(priceEur * rateWithMargin)
 */
export function useExchangeRate(): ExchangeRateContextValue {
  return useContext(ExchangeRateContext)
}
