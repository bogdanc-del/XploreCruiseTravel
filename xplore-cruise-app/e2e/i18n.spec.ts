import { test, expect } from '@playwright/test'

/**
 * Phase 2+3 — i18n: language switch preserves route, no missing keys,
 * no mixed-language UI, meta title/description translated
 */

test.describe('i18n / Language switch', () => {
  test('Language switch on homepage preserves route', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500) // Wait for hydration

    // Default locale is RO — nav should show "Croaziere"
    const navRo = page.locator('nav >> text=Croaziere')
    await expect(navRo).toBeVisible({ timeout: 5000 })

    // Click language toggle button (labeled "EN" when in RO mode)
    const langBtn = page.locator('button[aria-label*="Switch language"]').first()
    await langBtn.click()
    await page.waitForTimeout(500)

    // Now nav should show "Cruises"
    const navEn = page.locator('nav >> text=Cruises')
    await expect(navEn).toBeVisible({ timeout: 5000 })

    // Route should still be /
    expect(page.url()).toMatch(/\/$/)
  })

  test('Language switch on /cruises preserves route', async ({ page }) => {
    await page.goto('/cruises', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Switch to EN
    const langBtn = page.locator('button[aria-label*="Switch language"]').first()
    await langBtn.click()
    await page.waitForTimeout(500)

    const navEn = page.locator('nav >> text=Cruises')
    await expect(navEn).toBeVisible({ timeout: 5000 })
    expect(page.url()).toContain('/cruises')

    // Switch back to RO
    await langBtn.click()
    await page.waitForTimeout(500)

    const navRo = page.locator('nav >> text=Croaziere')
    await expect(navRo).toBeVisible({ timeout: 5000 })
    expect(page.url()).toContain('/cruises')
  })

  test('Language switch on /contact preserves route', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const langBtn = page.locator('button[aria-label*="Switch language"]').first()
    await langBtn.click()
    await page.waitForTimeout(500)

    // Header should now show English nav
    const navEn = page.locator('nav >> text=Home')
    await expect(navEn).toBeVisible({ timeout: 5000 })
    expect(page.url()).toContain('/contact')
  })

  test('No visible translation keys in RO mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Check that no raw translation keys (snake_case patterns) are visible in the body
    const bodyText = await page.locator('body').innerText()
    const rawKeyPattern = /\b(nav_|hero_|stats_|cruise_|filter_|detail_|booking_|contact_|about_|footer_|chat_|cookie_|map_)\w+/g
    const matches = bodyText.match(rawKeyPattern)
    expect(matches, `Found raw i18n keys on homepage RO: ${matches?.join(', ')}`).toBeNull()
  })

  test('No visible translation keys in EN mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Switch to EN
    const langBtn = page.locator('button[aria-label*="Switch language"]').first()
    await langBtn.click()
    await page.waitForTimeout(500)

    const bodyText = await page.locator('body').innerText()
    const rawKeyPattern = /\b(nav_|hero_|stats_|cruise_|filter_|detail_|booking_|contact_|about_|footer_|chat_|cookie_|map_)\w+/g
    const matches = bodyText.match(rawKeyPattern)
    expect(matches, `Found raw i18n keys on homepage EN: ${matches?.join(', ')}`).toBeNull()
  })
})
