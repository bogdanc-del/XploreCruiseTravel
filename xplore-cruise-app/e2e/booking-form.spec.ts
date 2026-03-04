import { test, expect } from '@playwright/test'

/**
 * Lead Capture Form — validation, happy path, keyboard & auto-open
 *
 * The LeadCaptureForm replaced the old BookingModal.
 * It opens from the cruise detail page via "Solicita oferta" / "Request an offer".
 */

test.describe('Lead Capture Form', () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ page }) => {
    // Navigate to a cruise detail page
    await page.goto('/cruises', { waitUntil: 'load' })
    await page.locator('a[href^="/cruises/"]').first().waitFor({ timeout: 15_000 })

    // Click on the first cruise card link
    const firstCard = page.locator('a[href^="/cruises/"]').first()
    await firstCard.click()
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)
  })

  test('"Request an offer" button opens the lead capture form', async ({ page }) => {
    // Find and click the "Solicita oferta" / "Request an offer" button
    const offerBtn = page.locator(
      'button:has-text("Solicită ofertă"), button:has-text("Request an offer"), button:has-text("Obține preț"), button:has-text("Get personalized"), button:has-text("Vorbește cu"), button:has-text("Talk to")'
    )
    await offerBtn.first().click()

    // Modal should be visible with role="dialog"
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 3000 })

    // Should contain form fields
    await expect(modal.locator('input[name="name"]')).toBeVisible()
    await expect(modal.locator('input[name="email"]')).toBeVisible()
    await expect(modal.locator('input[name="phone"]')).toBeVisible()
    await expect(modal.locator('textarea[name="message"]')).toBeVisible()
  })

  test('Validation: empty fields show error', async ({ page }) => {
    // Open lead form
    const offerBtn = page.locator(
      'button:has-text("Solicită ofertă"), button:has-text("Request an offer"), button:has-text("Obține preț"), button:has-text("Get personalized"), button:has-text("Vorbește cu"), button:has-text("Talk to")'
    )
    await offerBtn.first().click()
    await page.waitForTimeout(500)

    const modal = page.locator('[role="dialog"]')

    // Try to submit without filling fields
    const submitBtn = modal.locator(
      'button:has-text("Trimite"), button:has-text("Send request")'
    )
    await submitBtn.first().click()

    // Should show validation error (red error box)
    const errorMsg = modal.locator('.bg-red-50')
    await expect(errorMsg.first()).toBeVisible({ timeout: 3000 })
  })

  test('Validation: invalid email shows error', async ({ page }) => {
    // Open lead form
    const offerBtn = page.locator(
      'button:has-text("Solicită ofertă"), button:has-text("Request an offer"), button:has-text("Obține preț"), button:has-text("Get personalized"), button:has-text("Vorbește cu"), button:has-text("Talk to")'
    )
    await offerBtn.first().click()
    await page.waitForTimeout(500)

    const modal = page.locator('[role="dialog"]')

    // Fill name and phone but invalid email
    await modal.locator('input[name="name"]').fill('John Doe')
    await modal.locator('input[name="email"]').fill('not-an-email')
    await modal.locator('input[name="phone"]').fill('+40 749 000 000')

    // Try to submit
    const submitBtn = modal.locator(
      'button:has-text("Trimite"), button:has-text("Send request")'
    )
    await submitBtn.first().click()

    // Should show validation error
    const errorMsg = modal.locator('.bg-red-50')
    await expect(errorMsg.first()).toBeVisible({ timeout: 3000 })
  })

  test('Validation: missing GDPR consent shows error', async ({ page }) => {
    // Open lead form
    const offerBtn = page.locator(
      'button:has-text("Solicită ofertă"), button:has-text("Request an offer"), button:has-text("Obține preț"), button:has-text("Get personalized"), button:has-text("Vorbește cu"), button:has-text("Talk to")'
    )
    await offerBtn.first().click()
    await page.waitForTimeout(500)

    const modal = page.locator('[role="dialog"]')

    // Fill all fields but don't check GDPR
    await modal.locator('input[name="name"]').fill('John Doe')
    await modal.locator('input[name="email"]').fill('john@example.com')
    await modal.locator('input[name="phone"]').fill('+40 749 000 000')

    // Try to submit without GDPR consent
    const submitBtn = modal.locator(
      'button:has-text("Trimite"), button:has-text("Send request")'
    )
    await submitBtn.first().click()

    // Should show GDPR validation error
    const errorMsg = modal.locator('.bg-red-50')
    await expect(errorMsg.first()).toBeVisible({ timeout: 3000 })
  })

  test('Escape key closes the modal', async ({ page }) => {
    const offerBtn = page.locator(
      'button:has-text("Solicită ofertă"), button:has-text("Request an offer"), button:has-text("Obține preț"), button:has-text("Get personalized"), button:has-text("Vorbește cu"), button:has-text("Talk to")'
    )
    await offerBtn.first().click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible({ timeout: 3000 })
  })

  test('Happy path: fill form and submit', async ({ page, browserName }) => {
    test.setTimeout(browserName === 'webkit' ? 60_000 : 30_000)

    // Open lead form
    const offerBtn = page.locator(
      'button:has-text("Solicită ofertă"), button:has-text("Request an offer"), button:has-text("Obține preț"), button:has-text("Get personalized"), button:has-text("Vorbește cu"), button:has-text("Talk to")'
    )
    await offerBtn.first().click()
    await page.waitForTimeout(500)

    const modal = page.locator('[role="dialog"]')

    // Fill personal details
    await modal.locator('input[name="name"]').fill('John Doe')
    await modal.locator('input[name="email"]').fill('john@example.com')
    await modal.locator('input[name="phone"]').fill('+40 749 000 000')
    await modal.locator('textarea[name="message"]').fill('I would like to request an offer for this cruise.')

    // Check GDPR consent — click the label wrapper
    const gdprLabel = modal.locator('label:has(input[name="gdprConsent"])')
    await gdprLabel.click()
    await page.waitForTimeout(200)

    // Mock the API
    await page.route('**/api/contact', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Message sent successfully!',
        }),
      })
    })

    // Submit
    const submitBtn = modal.locator(
      'button:has-text("Trimite"), button:has-text("Send request")'
    )
    await submitBtn.first().click()

    // Success state should appear (green checkmark area or success text)
    await expect(
      modal.locator('text=/trimis|sent|success|Felicitări|Congratulations/i').first()
    ).toBeVisible({ timeout: 5000 })
  })

  test('?offer=1 query param auto-opens the form', async ({ page }) => {
    // Get the current URL and append ?offer=1
    const currentUrl = page.url()
    const separator = currentUrl.includes('?') ? '&' : '?'
    await page.goto(`${currentUrl}${separator}offer=1`, { waitUntil: 'load' })
    await page.waitForTimeout(1000)

    // Modal should auto-open
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 5000 })
  })
})
