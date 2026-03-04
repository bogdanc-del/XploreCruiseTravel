import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

/**
 * Data Integrity — verify enriched data structure is valid
 * These tests run against the local data files to catch sync issues early.
 */

const DATA_DIR = path.join(process.cwd(), 'public', 'data')

test.describe('Data files exist and are valid', () => {
  test('cruises.json exists and is valid', () => {
    const filePath = path.join(DATA_DIR, 'cruises.json')
    expect(fs.existsSync(filePath)).toBe(true)

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(1000) // should have 8000+ cruises

    // Sample validation
    const cruise = data[0]
    expect(cruise).toHaveProperty('slug')
    expect(cruise).toHaveProperty('id')
    expect(cruise).toHaveProperty('title')
  })

  test('cruises-index.json exists and is valid', () => {
    const filePath = path.join(DATA_DIR, 'cruises-index.json')
    expect(fs.existsSync(filePath)).toBe(true)

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(1000)
  })

  test('cruises-enriched.json exists and has compact format', () => {
    const filePath = path.join(DATA_DIR, 'cruises-enriched.json')
    expect(fs.existsSync(filePath)).toBe(true)

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const keys = Object.keys(data)
    expect(keys.length).toBeGreaterThan(1000)

    // Verify compact room format
    const sampleKey = keys.find(k => {
      const entry = data[k]
      return entry.rooms && entry.rooms.length > 0
    })

    if (sampleKey) {
      const entry = data[sampleKey]
      const room = entry.rooms[0]
      // Compact format: {n, c, dp: [[date, price], ...]}
      expect(room).toHaveProperty('n')  // name
      expect(room).toHaveProperty('c')  // category
      expect(room).toHaveProperty('dp') // date/price pairs
      expect(Array.isArray(room.dp)).toBe(true)
      if (room.dp.length > 0) {
        expect(Array.isArray(room.dp[0])).toBe(true)
        expect(room.dp[0]).toHaveLength(2) // [date, price]
      }
    }

    // Verify compact itinerary format
    const itinKey = keys.find(k => {
      const entry = data[k]
      return entry.itinerary && entry.itinerary.some((it: Record<string, unknown>) => it.p)
    })

    if (itinKey) {
      const it = data[itinKey].itinerary.find((it: Record<string, unknown>) => it.p)
      expect(it).toHaveProperty('d')  // day
      expect(it).toHaveProperty('p')  // port (some entries may omit empty port names)
    }

    // Verify gallery URLs are stripped of common prefix
    const galKey = keys.find(k => {
      const entry = data[k]
      return entry.gallery && entry.gallery.length > 0
    })

    if (galKey) {
      const url = data[galKey].gallery[0]
      // Should NOT start with full URL prefix (was stripped)
      expect(url.startsWith('https://www.croaziere.net/uploads/images/')).toBe(false)
    }
  })
})

test.describe('Enriched data quality', () => {
  test('At least 80% of cruises have HTML content', () => {
    const filePath = path.join(DATA_DIR, 'cruises-enriched.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const keys = Object.keys(data)
    const total = keys.length

    let withHtml = 0
    for (const k of keys) {
      if (data[k].included_html || data[k].excluded_html) {
        withHtml++
      }
    }

    const percentage = (withHtml / total) * 100
    expect(percentage).toBeGreaterThan(80)
  })

  test('At least 40% of cruises have excursions', () => {
    const filePath = path.join(DATA_DIR, 'cruises-enriched.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const keys = Object.keys(data)
    const total = keys.length

    let withExcursions = 0
    for (const k of keys) {
      if (data[k].excursions && data[k].excursions.length > 0) {
        withExcursions++
      }
    }

    const percentage = (withExcursions / total) * 100
    expect(percentage).toBeGreaterThan(40)
  })

  test('No inline CSS styles in HTML fields (optimization check)', () => {
    const filePath = path.join(DATA_DIR, 'cruises-enriched.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const keys = Object.keys(data)

    // Sample check on 100 random entries
    const sampleSize = Math.min(100, keys.length)
    const sample = keys.sort(() => 0.5 - Math.random()).slice(0, sampleSize)

    let stylesFound = 0
    for (const k of sample) {
      for (const field of ['included_html', 'excluded_html', 'cancellation_html']) {
        const html = data[k][field]
        if (html && html.includes('style="')) {
          stylesFound++
        }
      }
    }

    // Allow some residual styles but most should be stripped
    expect(stylesFound).toBeLessThan(sampleSize * 0.1) // Less than 10% should have styles
  })

  test('File size is under 100MB', () => {
    const filePath = path.join(DATA_DIR, 'cruises-enriched.json')
    const stats = fs.statSync(filePath)
    const sizeMB = stats.size / 1024 / 1024
    expect(sizeMB).toBeLessThan(100)
  })
})
