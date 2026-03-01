import { test, expect } from '@playwright/test'

/**
 * Phase 7 — Responsive sanity at 320px and 1280px for key pages
 */

const viewports = [
  { name: '320px (mobile)', width: 320, height: 568 },
  { name: '1280px (desktop)', width: 1280, height: 800 },
]

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/cruises', name: 'Cruises' },
  { path: '/contact', name: 'Contact' },
]

for (const vp of viewports) {
  for (const pg of pages) {
    test(`${pg.name} renders at ${vp.name} without horizontal overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(pg.path, { waitUntil: 'networkidle' })

      // Check for horizontal scroll (body wider than viewport)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      expect(
        bodyWidth,
        `${pg.path} at ${vp.name}: body scrollWidth ${bodyWidth}px > viewport ${vp.width}px`
      ).toBeLessThanOrEqual(vp.width + 5) // 5px tolerance

      // Verify header is visible
      const header = page.locator('header')
      await expect(header).toBeVisible()

      // Verify footer is present
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })
  }
}
