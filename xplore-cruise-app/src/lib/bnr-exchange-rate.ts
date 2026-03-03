// ============================================================
// BNR Exchange Rate Fetcher — EUR/RON from National Bank of Romania
//
// Source: https://www.bnr.ro/nbrfxrates.xml
// Published: Daily at ~13:00 EET (weekdays only, no weekends/holidays)
// Format: XML with <Rate currency="EUR">5.0981</Rate>
//
// Business rule:
//   RON price = EUR price * BNR rate * (1 + MARGIN)
//   MARGIN = 2.5% (configurable)
// ============================================================

const BNR_XML_URL = 'https://www.bnr.ro/nbrfxrates.xml'
const BNR_10DAYS_URL = 'https://www.bnr.ro/nbrfxrates10days.xml'

/** Margin added on top of BNR reference rate (2.5%) */
export const EXCHANGE_MARGIN = 0.025

/** Fallback EUR/RON rate if BNR is unavailable */
export const FALLBACK_EUR_RON = 4.97

export interface ExchangeRateData {
  /** BNR reference rate (EUR → RON) */
  rate: number
  /** Rate with margin applied: rate * (1 + MARGIN) */
  rateWithMargin: number
  /** BNR publishing date (YYYY-MM-DD) */
  date: string
  /** When this data was fetched (ISO timestamp) */
  fetchedAt: string
  /** Whether this is the fallback rate */
  isFallback: boolean
}

// ---- In-memory cache (server-side singleton) ----
let cachedRate: ExchangeRateData | null = null
let cacheExpiry = 0

/**
 * Parse BNR XML and extract EUR rate + date.
 * Works with both nbrfxrates.xml and nbrfxrates10days.xml
 */
export function parseBnrXml(xml: string): { rate: number; date: string } | null {
  // Extract date from <Cube date="YYYY-MM-DD">
  const dateMatch = xml.match(/<Cube\s+date="(\d{4}-\d{2}-\d{2})"/)
  if (!dateMatch) return null

  // Extract EUR rate from <Rate currency="EUR">X.XXXX</Rate>
  const eurMatch = xml.match(/<Rate\s+currency="EUR">([0-9.]+)<\/Rate>/)
  if (!eurMatch) return null

  const rate = parseFloat(eurMatch[1])
  if (isNaN(rate) || rate <= 0) return null

  return { rate, date: dateMatch[1] }
}

/**
 * Check if it's a BNR publishing day and past publishing time.
 * BNR publishes rates on weekdays around 13:00 EET (Romania time).
 * We check after 14:00 to allow margin for delays.
 */
export function isBnrPublishingTime(now: Date = new Date()): boolean {
  // Convert to Romania time (EET = UTC+2, EEST = UTC+3)
  const roTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' }))
  const day = roTime.getDay() // 0=Sun, 6=Sat
  const hour = roTime.getHours()

  // Skip weekends
  if (day === 0 || day === 6) return false

  // Only after 14:00 Romania time
  return hour >= 14
}

/**
 * Fetch the current EUR/RON exchange rate from BNR.
 *
 * - Caches the result for 4 hours (rate doesn't change intra-day)
 * - Falls back to 10-day feed if daily feed fails
 * - Falls back to hardcoded rate if both feeds fail
 * - Applies 2.5% margin for business use
 */
export async function getExchangeRate(): Promise<ExchangeRateData> {
  const now = Date.now()

  // Return cached rate if still fresh (4-hour TTL)
  if (cachedRate && now < cacheExpiry) {
    return cachedRate
  }

  try {
    // Try daily feed first
    let xml: string | null = null
    try {
      const res = await fetch(BNR_XML_URL, {
        headers: { 'Accept': 'application/xml, text/xml' },
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) xml = await res.text()
    } catch {
      // Daily feed failed, try 10-day feed
    }

    if (!xml) {
      try {
        const res = await fetch(BNR_10DAYS_URL, {
          headers: { 'Accept': 'application/xml, text/xml' },
          signal: AbortSignal.timeout(5000),
        })
        if (res.ok) xml = await res.text()
      } catch {
        // Both feeds failed
      }
    }

    if (xml) {
      const parsed = parseBnrXml(xml)
      if (parsed) {
        const data: ExchangeRateData = {
          rate: parsed.rate,
          rateWithMargin: Math.round(parsed.rate * (1 + EXCHANGE_MARGIN) * 10000) / 10000,
          date: parsed.date,
          fetchedAt: new Date().toISOString(),
          isFallback: false,
        }

        // Cache for 4 hours
        cachedRate = data
        cacheExpiry = now + 4 * 60 * 60 * 1000

        return data
      }
    }
  } catch (err) {
    console.error('[BNR] Exchange rate fetch error:', err)
  }

  // Fallback rate
  const fallback: ExchangeRateData = {
    rate: FALLBACK_EUR_RON,
    rateWithMargin: Math.round(FALLBACK_EUR_RON * (1 + EXCHANGE_MARGIN) * 10000) / 10000,
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    isFallback: true,
  }

  // Cache fallback for 1 hour (retry sooner)
  cachedRate = fallback
  cacheExpiry = now + 1 * 60 * 60 * 1000

  return fallback
}

/**
 * Convert EUR amount to RON using BNR rate + margin.
 */
export function eurToRon(eurAmount: number, rateWithMargin: number): number {
  return Math.round(eurAmount * rateWithMargin)
}

/**
 * Format a RON amount for display.
 * Example: 2549 → "2.549 RON"
 */
export function formatRon(amount: number): string {
  return `${amount.toLocaleString('ro-RO')} RON`
}

/**
 * Clear the cached rate (for testing).
 */
export function clearRateCache(): void {
  cachedRate = null
  cacheExpiry = 0
}
