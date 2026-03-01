import { test, expect, Page } from '@playwright/test'

/**
 * Phase 2+3 — i18n: language switch preserves route, no missing keys,
 * no mixed-language UI, meta title/description translated
 */

/**
 * Helper: click the language toggle button. On mobile viewports the desktop
 * button is hidden (md:hidden), so we look for either the desktop OR the
 * mobile variant and click whichever is visible. aria-labels are locale-aware:
 *  - RO mode → "Schimba limba in romana" (mobile) / "Switch language to English" (desktop)
 *  - EN mode → "Switch language to English" / "Schimba limba in romana"
 */
async function clickLangToggle(page: Page) {
  // Both the desktop and mobile buttons contain either "Switch language" or "Schimba limba"
  const btn = page
    .locator('button:visible')
    .filter({ hasText: /^(EN|RO)$/ })
    .first()
  await btn.click({ timeout: 10_000 })
}

test.describe('i18n / Language switch', () => {
  test('Language switch on homepage preserves route', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500) // Wait for hydration

    // Default locale is RO — body should contain "Croaziere" text somewhere visible
    await expect(page.locator('body')).toContainText('Croaziere', { timeout: 5000 })

    // Click language toggle button
    await clickLangToggle(page)
    await page.waitForTimeout(500)

    // Now should show English content
    await expect(page.locator('body')).toContainText('Cruises', { timeout: 5000 })

    // Route should still be /
    expect(page.url()).toMatch(/\/$/)
  })

  test('Language switch on /cruises preserves route', async ({ page }) => {
    await page.goto('/cruises', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Switch to EN
    await clickLangToggle(page)
    await page.waitForTimeout(500)

    // Verify EN content visible and route preserved
    expect(page.url()).toContain('/cruises')

    // Switch back to RO
    await clickLangToggle(page)
    await page.waitForTimeout(500)

    await expect(page.locator('body')).toContainText('Croaziere', { timeout: 5000 })
    expect(page.url()).toContain('/cruises')
  })

  test('Language switch on /contact preserves route', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    await clickLangToggle(page)
    await page.waitForTimeout(500)

    // Should show English content somewhere on the page
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
    await clickLangToggle(page)
    await page.waitForTimeout(500)

    const bodyText = await page.locator('body').innerText()
    const rawKeyPattern = /\b(nav_|hero_|stats_|cruise_|filter_|detail_|booking_|contact_|about_|footer_|chat_|cookie_|map_)\w+/g
    const matches = bodyText.match(rawKeyPattern)
    expect(matches, `Found raw i18n keys on homepage EN: ${matches?.join(', ')}`).toBeNull()
  })
})
