import { test, expect } from '@playwright/test'

/**
 * Cruise Detail Page — E2E tests for enriched data features
 *
 * Tests cover: itinerary tabs, cabin selector, port drawer,
 * included/excluded content, and promo badge rendering.
 */

// Navigate to first available cruise detail page
async function goToFirstCruise(page: import('@playwright/test').Page) {
  await page.goto('/cruises', { waitUntil: 'networkidle' })
  const firstCard = page.locator('a[href^="/cruises/"]').first()
  const href = await firstCard.getAttribute('href')
  expect(href).toBeTruthy()
  await page.goto(href!, { waitUntil: 'networkidle' })
  return href!
}

// ── Route & Tab Structure ──────────────────────────────

test('Cruise detail page has all expected tabs', async ({ page }) => {
  await goToFirstCruise(page)

  // Check that tab buttons exist
  const tabs = page.locator('button[role="tab"], [data-tab]')
  const tabCount = await tabs.count()
  expect(tabCount).toBeGreaterThanOrEqual(4) // at least: itinerary, cabins, included, beverages
})

test('Itinerary tab renders timeline with ports', async ({ page }) => {
  await goToFirstCruise(page)

  // Click itinerary tab if not already active
  const itinTab = page.getByRole('tab', { name: /itinerar/i }).or(
    page.getByRole('button', { name: /itinerar/i })
  )
  if (await itinTab.count()) await itinTab.first().click()

  // Verify timeline nodes exist
  const timeline = page.locator('.rounded-full')
  const nodeCount = await timeline.count()
  expect(nodeCount).toBeGreaterThanOrEqual(2) // at least embarkation + disembarkation
})

// ── Cabin Selector ─────────────────────────────────────

test('Cabins tab shows cabin categories when date is selected', async ({ page }) => {
  await goToFirstCruise(page)

  // Click cabins tab
  const cabinsTab = page.getByRole('tab', { name: /cabin/i }).or(
    page.getByRole('button', { name: /cabin/i })
  )
  if (await cabinsTab.count()) {
    await cabinsTab.first().click()
    await page.waitForTimeout(500)

    // Should see either cabin cards or a "select date" message
    const cabinContent = page.locator('[class*="cabin"], [class*="Cabin"]')
    const selectDate = page.getByText(/selectea|select.*dat/i)
    const hasContent = (await cabinContent.count()) > 0 || (await selectDate.count()) > 0
    expect(hasContent).toBe(true)
  }
})

// ── Included / Excluded Tab ────────────────────────────

test('Included tab renders included and excluded sections', async ({ page }) => {
  await goToFirstCruise(page)

  // Click included tab
  const includedTab = page.getByRole('tab', { name: /inclus/i }).or(
    page.getByRole('button', { name: /inclus/i })
  )
  if (await includedTab.count()) {
    await includedTab.first().click()
    await page.waitForTimeout(300)

    // Should have green (included) and red (excluded) sections
    const listItems = page.locator('li')
    const listCount = await listItems.count()
    expect(listCount).toBeGreaterThanOrEqual(2) // at least a few included/excluded items
  }
})

// ── Port Drawer ────────────────────────────────────────

test('Clicking a port opens the port drawer', async ({ page }) => {
  await goToFirstCruise(page)

  // Click itinerary tab
  const itinTab = page.getByRole('tab', { name: /itinerar/i }).or(
    page.getByRole('button', { name: /itinerar/i })
  )
  if (await itinTab.count()) await itinTab.first().click()
  await page.waitForTimeout(500)

  // Find a clickable port (has role="button" or cursor-pointer class)
  const clickablePort = page.locator('[role="button"]').first()
  if (await clickablePort.count()) {
    await clickablePort.click()
    await page.waitForTimeout(500)

    // Drawer should be visible (dialog)
    const drawer = page.locator('[role="dialog"]')
    await expect(drawer).toBeVisible()

    // Should have a close button
    const closeBtn = drawer.locator('button').first()
    await expect(closeBtn).toBeVisible()

    // Close the drawer
    await closeBtn.click()
    await page.waitForTimeout(300)
    await expect(drawer).not.toBeVisible()
  }
})

test('Port drawer closes on Escape key', async ({ page }) => {
  await goToFirstCruise(page)

  const itinTab = page.getByRole('tab', { name: /itinerar/i }).or(
    page.getByRole('button', { name: /itinerar/i })
  )
  if (await itinTab.count()) await itinTab.first().click()
  await page.waitForTimeout(500)

  const clickablePort = page.locator('[role="button"]').first()
  if (await clickablePort.count()) {
    await clickablePort.click()
    await page.waitForTimeout(500)

    const drawer = page.locator('[role="dialog"]')
    await expect(drawer).toBeVisible()

    // Press Escape to close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    await expect(drawer).not.toBeVisible()
  }
})

// ── Responsive ─────────────────────────────────────────

test('Cruise detail page has no horizontal overflow at 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await goToFirstCruise(page)

  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(380)
})

test('Port drawer renders as bottom sheet on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await goToFirstCruise(page)

  const itinTab = page.getByRole('tab', { name: /itinerar/i }).or(
    page.getByRole('button', { name: /itinerar/i })
  )
  if (await itinTab.count()) await itinTab.first().click()
  await page.waitForTimeout(500)

  const clickablePort = page.locator('[role="button"]').first()
  if (await clickablePort.count()) {
    await clickablePort.click()
    await page.waitForTimeout(500)

    const drawer = page.locator('[role="dialog"]')
    await expect(drawer).toBeVisible()

    // Verify the drawer is positioned at the bottom (bottom-sheet pattern)
    const box = await drawer.boundingBox()
    if (box) {
      // On mobile, the drawer should start from the bottom portion of the screen
      expect(box.y).toBeGreaterThan(0) // Not at very top
    }

    // Verify drag handle is visible on mobile
    const dragHandle = drawer.locator('.rounded-full').first()
    await expect(dragHandle).toBeVisible()
  }
})

// ── Console Error Free ─────────────────────────────────

test('Cruise detail page loads without console errors', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  await goToFirstCruise(page)

  // Filter known benign errors
  const realErrors = consoleErrors.filter(
    (e) =>
      !e.includes('favicon') &&
      !e.includes('Download the React DevTools') &&
      !e.includes('hydrat') &&
      !e.includes('Failed to load resource') && // images that may 404
      !e.includes('net::ERR') // network errors from external images
  )

  expect(realErrors).toHaveLength(0)
})

// ── API Route ──────────────────────────────────────────

test('API /api/cruises returns valid JSON with cruise data', async ({ request }) => {
  const response = await request.get('/api/cruises?limit=5')
  expect(response.ok()).toBe(true)

  const data = await response.json()
  expect(data).toHaveProperty('cruises')
  expect(data.cruises.length).toBeGreaterThan(0)

  // Each cruise should have essential fields
  const cruise = data.cruises[0]
  expect(cruise).toHaveProperty('slug')
  expect(cruise).toHaveProperty('title')
})

test('API /api/cruises/[slug] returns enriched data', async ({ request }) => {
  // First get a valid slug
  const listResponse = await request.get('/api/cruises?limit=1')
  const listData = await listResponse.json()
  const slug = listData.cruises[0]?.slug
  expect(slug).toBeTruthy()

  // Get detail
  const response = await request.get(`/api/cruises/${slug}`)
  expect(response.ok()).toBe(true)

  const data = await response.json()
  expect(data).toHaveProperty('slug')
  expect(data).toHaveProperty('date_prices')
  expect(data).toHaveProperty('_rooms')
  expect(data).toHaveProperty('_itinerary_enriched')
  expect(data).toHaveProperty('_included_html')
  expect(data).toHaveProperty('_excluded_html')
  expect(data).toHaveProperty('_excursions')
  expect(data).toHaveProperty('_plane_included')
})
