import { test, expect } from '@playwright/test'

/**
 * Phase 2 — Booking modal: validation, happy path, double-submit prevention
 */

test.describe('Booking modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a cruise detail page to trigger booking modal
    await page.goto('/cruises', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Click on the first cruise card
    const firstCard = page.locator('a[href^="/cruises/"]').first()
    await firstCard.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
  })

  test('Book Now button opens the booking modal', async ({ page }) => {
    // Find and click the "Book Now" / "Rezerva Acum" button
    const bookBtn = page.locator('button:has-text("Book"), button:has-text("Rezerva")')
    await bookBtn.first().click()

    // Modal should be visible
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 3000 })
  })

  test('Step 1 validation: empty fields show error', async ({ page }) => {
    // Open booking modal
    const bookBtn = page.locator('button:has-text("Book"), button:has-text("Rezerva")')
    await bookBtn.first().click()
    await page.waitForTimeout(500)

    // Try to proceed without filling fields
    const nextBtn = page.locator('[role="dialog"] button:has-text("Next"), [role="dialog"] button:has-text("Pasul")')
    await nextBtn.first().click()

    // Should show validation error
    const errorMsg = page.locator('[role="dialog"] .bg-red-50')
    await expect(errorMsg.first()).toBeVisible({ timeout: 3000 })
  })

  test('Escape key closes the modal', async ({ page }) => {
    const bookBtn = page.locator('button:has-text("Book"), button:has-text("Rezerva")')
    await bookBtn.first().click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible({ timeout: 3000 })
  })

  test('Happy path: fill 3 steps and submit', async ({ page }) => {
    // Open modal
    const bookBtn = page.locator('button:has-text("Book"), button:has-text("Rezerva")')
    await bookBtn.first().click()
    await page.waitForTimeout(500)

    const modal = page.locator('[role="dialog"]')

    // Step 1: Fill personal details
    const allInputs = modal.locator('input:not([type="checkbox"]):not([type="hidden"])')
    const inputCount = await allInputs.count()

    for (let i = 0; i < inputCount; i++) {
      const input = allInputs.nth(i)
      const type = await input.getAttribute('type')
      if (type === 'date') await input.fill('1990-01-15')
      else if (type === 'email') await input.fill('john@example.com')
      else if (type === 'tel') await input.fill('+40 749 000 000')
      else await input.fill(i === 0 ? 'John' : 'Doe')
    }

    // Click Next
    const nextBtn = modal.locator('button:has-text("Next"), button:has-text("Pasul")')
    await nextBtn.first().click()
    await page.waitForTimeout(600)

    // Step 2: Cruise selection (fields are optional, just proceed)
    const nextBtn2 = modal.locator('button:has-text("Next"), button:has-text("Pasul")')
    if (await nextBtn2.count() > 0) {
      await nextBtn2.first().click()
      await page.waitForTimeout(600)
    }

    // Step 3: Consent checkboxes — use the visible custom checkbox divs
    await page.waitForTimeout(300)
    const checkboxInputs = modal.locator('input.sr-only[type="checkbox"]')
    const checkboxCount = await checkboxInputs.count()
    // Check GDPR and terms (first two)
    for (let i = 0; i < Math.min(2, checkboxCount); i++) {
      await checkboxInputs.nth(i).check({ force: true })
    }

    // Mock the API
    await page.route('**/api/booking', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          bookingRef: 'BK-20260301-TEST',
          message: 'Booking registered successfully!',
        }),
      })
    })

    // Submit
    const submitBtn = modal.locator('button:has-text("Submit"), button:has-text("Trimite")')
    await submitBtn.first().click()

    // Success state should appear
    await expect(modal.locator('text=/BK-|Primita|Received/i').first()).toBeVisible({ timeout: 5000 })
  })
})
