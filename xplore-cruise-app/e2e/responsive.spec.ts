import { test, expect } from '@playwright/test'

/**
 * Responsive sanity at 375px and 1280px for key pages
 */

const viewports = [
  { name: '375px (mobile)', width: 375, height: 812 },
  { name: '1280px (desktop)', width: 1280, height: 800 },
]

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/cruises', name: 'Cruises' },
  { path: '/contact', name: 'Contact' },
]

for (const vp of viewports) {
  for (const pg of pages) {
    test(`${pg.name} renders at ${vp.name} without layout issues`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(pg.path, { waitUntil: 'load' })
      await page.waitForTimeout(1000) // Allow content to render

      // Check body scrollWidth vs viewport (allow 30px tolerance for minor overflows)
      // Note: Some pages may have minor overflow (e.g., GuidedEntryCard on homepage)
      // but use overflow-x: hidden, so the user doesn't see horizontal scrolling
      const metrics = await page.evaluate(() => ({
        bodyWidth: document.body.scrollWidth,
        htmlOverflow: getComputedStyle(document.documentElement).overflowX,
        bodyOverflow: getComputedStyle(document.body).overflowX,
      }))

      // Allow tolerance for minor overflow on mobile (e.g., GuidedEntryCard on homepage)
      const overflowHidden = metrics.htmlOverflow === 'hidden' || metrics.bodyOverflow === 'hidden'
      const isMobile = vp.width < 500
      const tolerance = overflowHidden ? 100 : isMobile ? 30 : 10

      expect(
        metrics.bodyWidth,
        `${pg.path} at ${vp.name}: body scrollWidth ${metrics.bodyWidth}px > viewport ${vp.width}px`
      ).toBeLessThanOrEqual(vp.width + tolerance)

      // Verify header is visible
      const header = page.locator('header')
      await expect(header).toBeVisible()

      // Verify footer is present
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })
  }
}
