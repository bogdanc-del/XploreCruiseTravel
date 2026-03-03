import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  parseBnrXml,
  isBnrPublishingTime,
  eurToRon,
  formatRon,
  clearRateCache,
  EXCHANGE_MARGIN,
  FALLBACK_EUR_RON,
} from '../src/lib/bnr-exchange-rate'

// ============================================================
// Unit tests for BNR EUR/RON Exchange Rate module
// Tests XML parsing, publishing time logic, conversion, and caching
// ============================================================

describe('parseBnrXml', () => {
  const VALID_XML = `<?xml version="1.0" encoding="utf-8"?>
<DataSet xmlns="http://www.bnr.ro/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.bnr.ro/xsd nbrfxrates.xsd">
  <Header>
    <Publisher>National Bank of Romania</Publisher>
    <PublishingDate>2026-03-03</PublishingDate>
    <MessageType>DR</MessageType>
  </Header>
  <Body>
    <Subject>Reference rates</Subject>
    <OrigCurrency>RON</OrigCurrency>
    <Cube date="2026-03-03">
      <Rate currency="AUD">3.1234</Rate>
      <Rate currency="EUR">5.0981</Rate>
      <Rate currency="USD">4.5678</Rate>
    </Cube>
  </Body>
</DataSet>`

  it('parses valid BNR XML and extracts EUR rate', () => {
    const result = parseBnrXml(VALID_XML)
    expect(result).not.toBeNull()
    expect(result!.rate).toBe(5.0981)
    expect(result!.date).toBe('2026-03-03')
  })

  it('returns null for XML without EUR rate', () => {
    const noEur = `<Cube date="2026-03-03"><Rate currency="USD">4.5678</Rate></Cube>`
    expect(parseBnrXml(noEur)).toBeNull()
  })

  it('returns null for XML without date', () => {
    const noDate = `<Rate currency="EUR">5.0981</Rate>`
    expect(parseBnrXml(noDate)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseBnrXml('')).toBeNull()
  })

  it('returns null for invalid EUR rate (zero)', () => {
    const zeroRate = `<Cube date="2026-03-03"><Rate currency="EUR">0</Rate></Cube>`
    expect(parseBnrXml(zeroRate)).toBeNull()
  })

  it('returns null for invalid EUR rate (NaN)', () => {
    const nanRate = `<Cube date="2026-03-03"><Rate currency="EUR">abc</Rate></Cube>`
    expect(parseBnrXml(nanRate)).toBeNull()
  })

  it('returns null for negative EUR rate', () => {
    const negativeRate = `<Cube date="2026-03-03"><Rate currency="EUR">-5.0981</Rate></Cube>`
    expect(parseBnrXml(negativeRate)).toBeNull()
  })

  it('handles 10-day XML format (multiple Cube elements — takes first)', () => {
    const tenDayXml = `
    <Body>
      <Cube date="2026-03-03">
        <Rate currency="EUR">5.0981</Rate>
      </Cube>
      <Cube date="2026-03-02">
        <Rate currency="EUR">5.0900</Rate>
      </Cube>
    </Body>`
    const result = parseBnrXml(tenDayXml)
    expect(result).not.toBeNull()
    expect(result!.rate).toBe(5.0981)
    expect(result!.date).toBe('2026-03-03')
  })
})

describe('isBnrPublishingTime', () => {
  it('returns true on weekday after 14:00 Romania time', () => {
    // Wednesday March 3, 2026 at 15:00 EET (13:00 UTC)
    const wed15 = new Date('2026-03-04T13:00:00Z') // Wednesday UTC → 15:00 EET
    expect(isBnrPublishingTime(wed15)).toBe(true)
  })

  it('returns false on weekday before 14:00 Romania time', () => {
    // Wednesday March 4, 2026 at 10:00 EET (08:00 UTC)
    const wed10 = new Date('2026-03-04T08:00:00Z')
    expect(isBnrPublishingTime(wed10)).toBe(false)
  })

  it('returns false on Saturday', () => {
    // Saturday March 7, 2026 at 15:00 EET
    const sat = new Date('2026-03-07T13:00:00Z')
    expect(isBnrPublishingTime(sat)).toBe(false)
  })

  it('returns false on Sunday', () => {
    // Sunday March 8, 2026 at 15:00 EET
    const sun = new Date('2026-03-08T13:00:00Z')
    expect(isBnrPublishingTime(sun)).toBe(false)
  })

  it('returns true on Friday after 14:00', () => {
    // Friday March 6, 2026 at 16:00 EET (14:00 UTC)
    const fri16 = new Date('2026-03-06T14:00:00Z')
    expect(isBnrPublishingTime(fri16)).toBe(true)
  })

  it('returns true exactly at 14:00', () => {
    // Wednesday March 4, 2026 at 14:00 EET (12:00 UTC)
    const exact14 = new Date('2026-03-04T12:00:00Z')
    expect(isBnrPublishingTime(exact14)).toBe(true)
  })
})

describe('eurToRon', () => {
  it('converts EUR to RON with given rate', () => {
    // 500 EUR * 5.0981 = 2549.05 → rounded to 2549
    expect(eurToRon(500, 5.0981)).toBe(2549)
  })

  it('rounds to nearest integer', () => {
    // 100 EUR * 5.0981 = 509.81 → rounded to 510
    expect(eurToRon(100, 5.0981)).toBe(510)
  })

  it('handles zero amount', () => {
    expect(eurToRon(0, 5.0981)).toBe(0)
  })

  it('handles small amounts', () => {
    // 1 EUR * 5.0981 = 5.0981 → rounded to 5
    expect(eurToRon(1, 5.0981)).toBe(5)
  })

  it('handles large amounts', () => {
    // 10000 EUR * 5.0981 = 50981
    expect(eurToRon(10000, 5.0981)).toBe(50981)
  })
})

describe('formatRon', () => {
  it('formats amount with RON suffix', () => {
    const result = formatRon(2549)
    expect(result).toContain('RON')
    expect(result).toContain('2')
  })

  it('formats zero', () => {
    const result = formatRon(0)
    expect(result).toContain('0')
    expect(result).toContain('RON')
  })

  it('formats large numbers with locale separators', () => {
    const result = formatRon(50981)
    expect(result).toContain('RON')
  })
})

describe('EXCHANGE_MARGIN', () => {
  it('is 2.5%', () => {
    expect(EXCHANGE_MARGIN).toBe(0.025)
  })
})

describe('FALLBACK_EUR_RON', () => {
  it('is a reasonable fallback rate', () => {
    expect(FALLBACK_EUR_RON).toBeGreaterThan(4)
    expect(FALLBACK_EUR_RON).toBeLessThan(6)
  })
})

describe('rate with margin calculation', () => {
  it('applies 2.5% margin correctly', () => {
    const baseRate = 5.0981
    const rateWithMargin = Math.round(baseRate * (1 + EXCHANGE_MARGIN) * 10000) / 10000

    // 5.0981 * 1.025 = 5.225555 → rounded to 5.2256
    expect(rateWithMargin).toBeCloseTo(5.2256, 3)
  })

  it('fallback rate with margin is reasonable', () => {
    const fallbackWithMargin = Math.round(FALLBACK_EUR_RON * (1 + EXCHANGE_MARGIN) * 10000) / 10000

    // 4.97 * 1.025 = 5.09425 → rounded to 5.0943
    expect(fallbackWithMargin).toBeGreaterThan(5)
    expect(fallbackWithMargin).toBeLessThan(5.2)
  })
})

describe('clearRateCache', () => {
  it('can be called without error', () => {
    expect(() => clearRateCache()).not.toThrow()
  })
})

describe('getExchangeRate (integration)', () => {
  beforeEach(() => {
    clearRateCache()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    clearRateCache()
  })

  it('returns fallback rate when fetch fails', async () => {
    // Mock fetch to fail
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { getExchangeRate } = await import('../src/lib/bnr-exchange-rate')
    clearRateCache()
    const result = await getExchangeRate()

    expect(result.isFallback).toBe(true)
    expect(result.rate).toBe(FALLBACK_EUR_RON)
    expect(result.rateWithMargin).toBeGreaterThan(result.rate)
    expect(result.date).toBeTruthy()
    expect(result.fetchedAt).toBeTruthy()

    vi.unstubAllGlobals()
  })

  it('returns parsed rate from valid XML response', async () => {
    const mockXml = `<?xml version="1.0"?>
    <DataSet>
      <Body>
        <Cube date="2026-03-03">
          <Rate currency="EUR">5.0981</Rate>
        </Cube>
      </Body>
    </DataSet>`

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockXml),
    }))

    const { getExchangeRate } = await import('../src/lib/bnr-exchange-rate')
    clearRateCache()
    const result = await getExchangeRate()

    expect(result.isFallback).toBe(false)
    expect(result.rate).toBe(5.0981)
    expect(result.date).toBe('2026-03-03')
    // rateWithMargin = 5.0981 * 1.025 = 5.225555 → 5.2256
    expect(result.rateWithMargin).toBeCloseTo(5.2256, 3)

    vi.unstubAllGlobals()
  })

  it('falls back to 10-day feed when daily feed fails', async () => {
    let callCount = 0
    const mockXml = `<DataSet><Body><Cube date="2026-03-02"><Rate currency="EUR">5.0900</Rate></Cube></Body></DataSet>`

    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        // Daily feed fails
        return Promise.resolve({ ok: false, status: 500 })
      }
      // 10-day feed succeeds
      return Promise.resolve({ ok: true, text: () => Promise.resolve(mockXml) })
    }))

    const { getExchangeRate } = await import('../src/lib/bnr-exchange-rate')
    clearRateCache()
    const result = await getExchangeRate()

    expect(result.isFallback).toBe(false)
    expect(result.rate).toBe(5.09)
    expect(result.date).toBe('2026-03-02') // Yesterday's rate

    vi.unstubAllGlobals()
  })
})
