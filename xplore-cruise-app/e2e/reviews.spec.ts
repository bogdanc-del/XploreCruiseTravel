import { test, expect } from '@playwright/test'

test.describe('Reviews System (C4)', () => {
  test.describe('/review page', () => {
    test('renders the review form with all fields', async ({ page }) => {
      await page.goto('/review')

      // Check page title
      await expect(page.locator('h1')).toBeVisible()

      // Check form elements
      await expect(page.locator('[aria-label="Rating"]')).toBeVisible()
      await expect(page.locator('#review-name')).toBeVisible()
      await expect(page.locator('#review-city')).toBeVisible()
      await expect(page.locator('#review-cruise-type')).toBeVisible()
      await expect(page.locator('#review-message')).toBeVisible()

      // Submit button
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('shows validation error when rating is missing', async ({ page }) => {
      await page.goto('/review')

      // Fill message and consent but skip rating
      await page.fill('#review-message', 'This is a test review with enough characters.')
      await page.locator('input[type="checkbox"]').check()

      await page.locator('button[type="submit"]').click()

      // Should show error about rating
      await expect(page.locator('.bg-red-50')).toBeVisible()
    })

    test('shows validation error when message is too short', async ({ page }) => {
      await page.goto('/review')

      // Click rating star
      await page.locator('[aria-label="5 stars"]').click()
      await page.fill('#review-message', 'Short')
      await page.locator('input[type="checkbox"]').check()

      await page.locator('button[type="submit"]').click()

      await expect(page.locator('.bg-red-50')).toBeVisible()
    })

    test('submits a valid review and shows success', async ({ page }) => {
      await page.goto('/review')

      // Fill rating
      await page.locator('[aria-label="5 stars"]').click()

      // Fill optional fields
      await page.fill('#review-name', 'Test User')
      await page.fill('#review-city', 'Test City')

      // Fill message
      await page.fill(
        '#review-message',
        'This is a wonderful cruise experience! Everything was perfect from start to finish.'
      )

      // Check consent
      await page.locator('input[type="checkbox"]').check()

      // Submit
      await page.locator('button[type="submit"]').click()

      // Should show success state (green checkmark + thank you)
      await expect(page.locator('text=Mulțumim').or(page.locator('text=Thank you'))).toBeVisible({
        timeout: 10000,
      })
    })

    test('star rating is interactive (click and hover)', async ({ page }) => {
      await page.goto('/review')

      const star3 = page.locator('[aria-label="3 stars"]')
      await star3.click()
      await expect(star3).toHaveAttribute('aria-checked', 'true')
    })
  })

  test.describe('Homepage reviews section', () => {
    test('renders reviews section with at least 1 review card', async ({ page }) => {
      await page.goto('/')

      // Scroll down to load reviews section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)

      // Check that the reviews section exists
      const reviewsSection = page.locator('section[aria-label]').filter({
        hasText: /clienții|clients/i,
      })
      await expect(reviewsSection).toBeVisible({ timeout: 10000 })

      // Check at least one review card is shown
      const reviewCards = reviewsSection.locator('.rounded-xl.border')
      await expect(reviewCards.first()).toBeVisible()
    })
  })

  test.describe('API /api/reviews', () => {
    test('GET returns reviews array', async ({ request }) => {
      const res = await request.get('/api/reviews?limit=3')
      expect(res.ok()).toBeTruthy()

      const data = await res.json()
      expect(Array.isArray(data.reviews)).toBeTruthy()
      expect(data.reviews.length).toBeGreaterThan(0)
      expect(data.reviews.length).toBeLessThanOrEqual(3)
    })

    test('GET respects cruise_type filter', async ({ request }) => {
      const res = await request.get('/api/reviews?cruise_type=ocean&limit=10')
      expect(res.ok()).toBeTruthy()

      const data = await res.json()
      expect(Array.isArray(data.reviews)).toBeTruthy()
    })

    test('POST rejects empty body', async ({ request }) => {
      const res = await request.post('/api/reviews', {
        data: {},
      })
      expect(res.status()).toBe(400)
    })

    test('POST rejects missing consent', async ({ request }) => {
      const res = await request.post('/api/reviews', {
        data: {
          rating: 5,
          message: 'This is a great review message!',
          consent_publish: false,
        },
      })
      expect(res.status()).toBe(400)
    })

    test('POST rejects honeypot field with content', async ({ request }) => {
      const res = await request.post('/api/reviews', {
        data: {
          rating: 5,
          message: 'This is a great review message!',
          consent_publish: true,
          website: 'http://spam.bot',
        },
      })
      expect(res.status()).toBe(400)
    })

    test('POST accepts valid review', async ({ request }) => {
      const res = await request.post('/api/reviews', {
        data: {
          rating: 4,
          name: 'E2E Test',
          city: 'TestCity',
          message: 'This is a test review from Playwright e2e test.',
          consent_publish: true,
          website: '',
        },
      })
      expect(res.status()).toBe(201)
      const data = await res.json()
      expect(data.success).toBeTruthy()
    })
  })
})
