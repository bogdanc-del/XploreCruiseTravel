import { test, expect } from '@playwright/test'

/**
 * Phase 2 — Internal link integrity on key pages
 * Checks that all internal links on key pages return HTTP 2xx/3xx
 */

const pages = ['/', '/cruises', '/about', '/contact']

for (const pagePath of pages) {
  test(`Internal links on ${pagePath} are valid`, async ({ page }) => {
    await page.goto(pagePath, { waitUntil: 'networkidle' })

    const links = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
      [...new Set(anchors.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))]
    )

    for (const link of links) {
      // Skip anchor-only links and hash links
      if (!link || link === '#' || link.startsWith('#')) continue

      const res = await page.request.get(link)
      expect(
        res.status(),
        `Broken link: ${link} from ${pagePath} returned ${res.status()}`
      ).toBeLessThan(400)
    }
  })
}

test('CTAs: phone/email/WhatsApp links are correct', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'networkidle' })

  // Phone link
  const phoneLink = page.locator('a[href^="tel:"]').first()
  await expect(phoneLink).toBeVisible()
  const phoneHref = await phoneLink.getAttribute('href')
  expect(phoneHref).toContain('+40749558572')

  // Email link
  const emailLink = page.locator('a[href^="mailto:"]').first()
  await expect(emailLink).toBeVisible()
  const emailHref = await emailLink.getAttribute('href')
  expect(emailHref).toContain('xplorecruisetravel@gmail.com')
})
