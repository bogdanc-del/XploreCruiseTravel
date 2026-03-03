import { test, expect } from '@playwright/test'

test.describe('Testimonials System (C2)', () => {
  test.describe('Homepage testimonials section', () => {
    test('renders testimonials section with at least 1 testimonial card', async ({ page }) => {
      await page.goto('/')

      // Scroll down to load testimonials section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(1000)

      // Check that the testimonials section exists
      const testimonialsSection = page.locator('section[aria-label]').filter({
        hasText: /apreciat|trusted/i,
      })
      await expect(testimonialsSection).toBeVisible({ timeout: 10000 })

      // Check at least one testimonial card is shown
      const testimonialCards = testimonialsSection.locator('.rounded-xl.border')
      await expect(testimonialCards.first()).toBeVisible()
    })

    test('testimonial cards show star ratings', async ({ page }) => {
      await page.goto('/')

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(1000)

      const testimonialsSection = page.locator('section[aria-label]').filter({
        hasText: /apreciat|trusted/i,
      })

      // Stars should be visible
      const stars = testimonialsSection.locator('[aria-label*="stars"]')
      await expect(stars.first()).toBeVisible({ timeout: 10000 })
    })

    test('testimonial cards show author names', async ({ page }) => {
      await page.goto('/')

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(1000)

      const testimonialsSection = page.locator('section[aria-label]').filter({
        hasText: /apreciat|trusted/i,
      })

      // Author name should be visible
      const authorNames = testimonialsSection.locator('.font-semibold')
      await expect(authorNames.first()).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('API /api/testimonials', () => {
    test('GET returns testimonials array', async ({ request }) => {
      const res = await request.get('/api/testimonials?limit=6')
      expect(res.ok()).toBeTruthy()

      const data = await res.json()
      expect(Array.isArray(data.testimonials)).toBeTruthy()
      expect(data.testimonials.length).toBeGreaterThan(0)
      expect(data.testimonials.length).toBeLessThanOrEqual(6)
    })

    test('GET returns testimonials with required fields', async ({ request }) => {
      const res = await request.get('/api/testimonials?limit=1')
      expect(res.ok()).toBeTruthy()

      const data = await res.json()
      const t = data.testimonials[0]
      expect(t.id).toBeDefined()
      expect(t.name).toBeDefined()
      expect(t.rating).toBeGreaterThanOrEqual(1)
      expect(t.rating).toBeLessThanOrEqual(5)
      expect(t.quote).toBeDefined()
      expect(Array.isArray(t.tags)).toBeTruthy()
    })

    test('GET respects tags filter', async ({ request }) => {
      const res = await request.get('/api/testimonials?tags=ocean,mediterranean&limit=3')
      expect(res.ok()).toBeTruthy()

      const data = await res.json()
      expect(Array.isArray(data.testimonials)).toBeTruthy()
    })

    test('POST rejects empty body', async ({ request }) => {
      const res = await request.post('/api/testimonials', {
        data: {},
      })
      expect(res.status()).toBe(400)
    })

    test('POST rejects invalid rating', async ({ request }) => {
      const res = await request.post('/api/testimonials', {
        data: {
          name: 'Test',
          quote: 'Test quote',
          rating: 6,
        },
      })
      expect(res.status()).toBe(400)
    })

    test('POST accepts valid testimonial', async ({ request }) => {
      const res = await request.post('/api/testimonials', {
        data: {
          name: 'E2E Test',
          city: 'TestCity',
          rating: 5,
          quote: 'This is a test testimonial from Playwright e2e test.',
          tags: ['ocean', 'test'],
        },
      })
      expect(res.status()).toBe(201)
      const data = await res.json()
      expect(data.success).toBeTruthy()
    })
  })
})
