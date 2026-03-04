import { test, expect } from '@playwright/test'

/**
 * Phase 2 — All key routes load without console errors
 */

const routes = [
  { path: '/', name: 'Homepage' },
  { path: '/cruises', name: 'Cruises listing' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/terms', name: 'Terms & Conditions' },
  { path: '/cookies', name: 'Cookie Policy' },
  { path: '/gdpr', name: 'GDPR' },
]

for (const route of routes) {
  test(`${route.name} (${route.path}) loads without errors`, async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    const response = await page.goto(route.path, { waitUntil: 'load' })
    expect(response?.status()).toBeLessThan(400)

    // Filter out known benign errors (e.g., favicon, dev mode warnings)
    const realErrors = consoleErrors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('Download the React DevTools') &&
        !e.includes('hydrat') // Next.js hydration warnings in dev
    )

    expect(realErrors, `Console errors on ${route.path}: ${realErrors.join('; ')}`).toHaveLength(0)
  })
}

test('Cruise detail page loads (first slug)', async ({ page }) => {
  test.setTimeout(60_000)
  // Navigate to cruises, click the first card to get a valid slug
  await page.goto('/cruises', { waitUntil: 'load' })
  await page.locator('a[href^="/cruises/"]').first().waitFor({ timeout: 15_000 })
  const firstCard = page.locator('a[href^="/cruises/"]').first()
  const href = await firstCard.getAttribute('href')
  expect(href).toBeTruthy()

  const response = await page.goto(href!, { waitUntil: 'load' })
  expect(response?.status()).toBeLessThan(400)
})
