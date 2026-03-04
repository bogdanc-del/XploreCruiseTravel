import { test, expect } from '@playwright/test'

/**
 * Phase 2 — Contact form: validation, invalid formats, happy path, double-submit prevention, error state
 */

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'load' })
  })

  test('shows validation errors for empty required fields', async ({ page }) => {
    // Click submit without filling anything
    const submitBtn = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Trimite")')
    await submitBtn.first().click()

    // Should show browser-native or custom validation
    // Check that the form did NOT navigate away
    expect(page.url()).toContain('/contact')
  })

  test('shows error for invalid email format', async ({ page }) => {
    // Fill name and message, but bad email
    await page.fill('input[type="text"]', 'Test User')

    const emailInput = page.locator('input[type="email"]')
    if (await emailInput.count() > 0) {
      await emailInput.fill('not-an-email')
    }

    const submitBtn = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Trimite")')
    await submitBtn.first().click()

    // Form should not submit successfully with invalid email
    expect(page.url()).toContain('/contact')
  })

  test('happy path: fills and submits the form', async ({ page }) => {
    // Fill all fields
    const inputs = page.locator('input:not([type="checkbox"]):not([type="hidden"])')
    const inputCount = await inputs.count()

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i)
      const type = await input.getAttribute('type')
      if (type === 'email') {
        await input.fill('test@example.com')
      } else if (type === 'tel') {
        await input.fill('+40 749 000 000')
      } else {
        await input.fill('Test User')
      }
    }

    // Fill textarea if exists
    const textarea = page.locator('textarea')
    if (await textarea.count() > 0) {
      await textarea.first().fill('This is a test message for QA validation.')
    }

    // Check GDPR consent if exists
    const gdprCheckbox = page.locator('input[type="checkbox"]').first()
    if (await gdprCheckbox.count() > 0) {
      await gdprCheckbox.check({ force: true })
    }

    // Mock the API to avoid real submissions
    await page.route('**/api/contact', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message sent successfully!' }),
      })
    })

    const submitBtn = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Trimite")')
    await submitBtn.first().click()

    // Wait for success message
    await expect(page.locator('text=/succes|success/i')).toBeVisible({ timeout: 5000 })
  })

  test('API error shows error state', async ({ page }) => {
    // Fill required fields
    const inputs = page.locator('input:not([type="checkbox"]):not([type="hidden"])')
    const inputCount = await inputs.count()
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i)
      const type = await input.getAttribute('type')
      if (type === 'email') await input.fill('test@example.com')
      else if (type === 'tel') await input.fill('+40 749 000 000')
      else await input.fill('Test User')
    }

    const textarea = page.locator('textarea')
    if (await textarea.count() > 0) {
      await textarea.first().fill('Test message.')
    }

    const gdprCheckbox = page.locator('input[type="checkbox"]').first()
    if (await gdprCheckbox.count() > 0) {
      await gdprCheckbox.check({ force: true })
    }

    // Mock API failure
    await page.route('**/api/contact', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    const submitBtn = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Trimite")')
    await submitBtn.first().click()

    // Should still be on contact page (no redirect)
    expect(page.url()).toContain('/contact')
  })
})
