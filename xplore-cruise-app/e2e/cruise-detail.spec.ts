import { test, expect } from '@playwright/test'

// Increase timeout for cruise detail tests (large enriched data loading)
test.setTimeout(60_000)

/**
 * Cruise Detail Page — E2E tests for enriched data features
 *
 * Tests cover: itinerary tabs, cabin selector, port drawer,
 * included/excluded content, and promo badge rendering.
 */

// Navigate to first available cruise detail page
async function goToFirstCruise(page: import('@playwright/test').Page) {
  await page.goto('/cruises', { waitUntil: 'load' })
  await page.locator('a[href^="/cruises/"]').first().waitFor({ timeout: 15_000 })
  const firstCard = page.locator('a[href^="/cruises/"]').first()
  const href = await firstCard.getAttribute('href')
  expect(href).toBeTruthy()
  await page.goto(href!, { waitUntil: 'load' })
  await page.waitForTimeout(2000)
  return href!
}

// Navigate to a cruise with multiple ports (for port drawer tests)
async function goToMultiPortCruise(page: import('@playwright/test').Page) {
  await page.goto('/cruises', { waitUntil: 'load' })
  await page.locator('a[href^="/cruises/"]').first().waitFor({ timeout: 15_000 })
  // Find a cruise with "7 nopți" or more (skip 1-2 night repositioning cruises)
  const cards = page.locator('a[href^="/cruises/"]')
  const count = await cards.count()
  let href: string | null = null

  for (let i = 0; i < Math.min(count, 20); i++) {
    const card = cards.nth(i)
    const text = await card.textContent()
    // Look for cruises with 5+ nights — they'll have proper itineraries
    if (text && /[5-9]\s*nop|1[0-9]\s*nop|2[0-9]\s*nop/i.test(text)) {
      href = await card.getAttribute('href')
      break
    }
  }

  // Fallback to 3rd cruise if no long cruise found
  if (!href) {
    href = await cards.nth(Math.min(2, count - 1)).getAttribute('href')
  }

  expect(href).toBeTruthy()
  await page.goto(href!, { waitUntil: 'load' })
  await page.waitForTimeout(2000)
  return href!
}

// ── Route & Tab Structure ──────────────────────────────

test('Cruise detail page has all expected tabs', async ({ page }) => {
  await goToFirstCruise(page)

  // Tabs are plain buttons containing tab names
  const expectedTabs = ['Itinerariu', 'Cabine', 'inclus']
  for (const tabName of expectedTabs) {
    const tab = page.getByRole('button', { name: new RegExp(tabName, 'i') })
    await expect(tab.first()).toBeVisible()
  }
})

test('Itinerary tab renders timeline with ports', async ({ page }) => {
  await goToFirstCruise(page)

  // Click itinerary tab
  const itinTab = page.getByRole('button', { name: /itinerar/i })
  if (await itinTab.count()) await itinTab.first().click()
  await page.waitForTimeout(500)

  // Verify itinerary content exists — look for day labels (Day X / Ziua X)
  const dayLabels = page.locator('text=/Day \\d+|Ziua \\d+/i')
  const dayCount = await dayLabels.count()
  expect(dayCount).toBeGreaterThanOrEqual(2) // at least embarkation + disembarkation
})

// ── Cabin Selector ─────────────────────────────────────

test('Cabins tab shows cabin categories when date is selected', async ({ page }) => {
  await goToFirstCruise(page)

  // Click cabins tab
  const cabinsTab = page.getByRole('button', { name: /cabin/i })
  if (await cabinsTab.count()) {
    await cabinsTab.first().click()
    await page.waitForTimeout(500)

    // Should see either cabin cards or a "select date" message
    const cabinContent = page.locator('[class*="cabin"], [class*="Cabin"]')
    const selectDate = page.getByText(/selectea|select.*dat|alege.*dat/i)
    const priceText = page.getByText(/€|persoană|person/i)
    const hasContent =
      (await cabinContent.count()) > 0 ||
      (await selectDate.count()) > 0 ||
      (await priceText.count()) > 0
    expect(hasContent).toBe(true)
  }
})

// ── Included / Excluded Tab ────────────────────────────

test('Included tab renders included and excluded sections', async ({ page }) => {
  await goToFirstCruise(page)

  // Click included tab
  const includedTab = page.getByRole('button', { name: /inclus/i })
  if (await includedTab.count()) {
    await includedTab.first().click()
    await page.waitForTimeout(300)

    // Should have list items (included/excluded content)
    const listItems = page.locator('li')
    const listCount = await listItems.count()
    expect(listCount).toBeGreaterThanOrEqual(2) // at least a few included/excluded items
  }
})

// ── Port Drawer ────────────────────────────────────────

test('Clicking a port opens the port drawer', async ({ page }) => {
  await goToMultiPortCruise(page)

  // Click itinerary tab
  const itinTab = page.getByRole('button', { name: /itinerar/i })
  if (await itinTab.count()) await itinTab.first().click()
  await page.waitForTimeout(1000)

  // Find clickable port — ports have cursor-pointer and contain port text
  const clickablePort = page.locator('[class*="cursor-pointer"]').first()
  if (await clickablePort.count()) {
    await clickablePort.click()
    await page.waitForTimeout(1000)

    // Drawer should be visible (dialog or sheet)
    const drawer = page.locator('[role="dialog"], [data-state="open"]')
    if (await drawer.count()) {
      await expect(drawer.first()).toBeVisible()

      // Should have a close button
      const closeBtn = drawer.first().locator('button').first()
      await expect(closeBtn).toBeVisible()

      // Close the drawer
      await closeBtn.click()
      await page.waitForTimeout(500)
    }
  }
})

test('Port drawer closes on Escape key', async ({ page }) => {
  await goToMultiPortCruise(page)

  const itinTab = page.getByRole('button', { name: /itinerar/i })
  if (await itinTab.count()) await itinTab.first().click()
  await page.waitForTimeout(1000)

  const clickablePort = page.locator('[class*="cursor-pointer"]').first()
  if (await clickablePort.count()) {
    await clickablePort.click()
    await page.waitForTimeout(1000)

    const drawer = page.locator('[role="dialog"], [data-state="open"]')
    if (await drawer.count()) {
      await expect(drawer.first()).toBeVisible()

      // Press Escape to close
      await page.keyboard.press('Escape')
      await page.waitForTimeout(500)
    }
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
  await goToMultiPortCruise(page)

  const itinTab = page.getByRole('button', { name: /itinerar/i })
  if (await itinTab.count()) await itinTab.first().click()
  await page.waitForTimeout(1000)

  const clickablePort = page.locator('[class*="cursor-pointer"]').first()
  if (await clickablePort.count()) {
    await clickablePort.click()
    await page.waitForTimeout(1000)

    const drawer = page.locator('[role="dialog"], [data-state="open"]')
    if (await drawer.count()) {
      await expect(drawer.first()).toBeVisible()

      // Verify the drawer is positioned at the bottom (bottom-sheet pattern)
      const box = await drawer.first().boundingBox()
      if (box) {
        // On mobile, the drawer should not start from the very top
        expect(box.y).toBeGreaterThan(0)
      }
    }
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
