import { test, expect } from '@playwright/test'

/**
 * Admin Interface — E2E tests for admin dashboard
 *
 * Tests cover: login, tab navigation, dashboard stats,
 * bookings list, contact messages, reviews, testimonials,
 * A/B testing dashboard, and settings page.
 */

test.setTimeout(60_000)

const ADMIN_PASSWORD = 'xplore2026'

// Helper: login to admin
async function adminLogin(page: import('@playwright/test').Page) {
  await page.goto('/admin', { waitUntil: 'load' })
  await page.waitForTimeout(1000)

  // Fill password and submit
  const passwordInput = page.locator('input[type="password"]')
  await passwordInput.fill(ADMIN_PASSWORD)

  const loginBtn = page.getByRole('button', { name: /login|autentificare|enter/i }).or(
    page.locator('button[type="submit"]')
  )
  await loginBtn.first().click()
  await page.waitForTimeout(1000)
}

// ── Login ────────────────────────────────────────────────

test('Admin page loads and shows login form', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'load' })
  await page.waitForTimeout(500)

  // Should show password input
  const passwordInput = page.locator('input[type="password"]')
  await expect(passwordInput).toBeVisible()
})

test('Admin login with wrong password shows error', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'load' })
  await page.waitForTimeout(500)

  const passwordInput = page.locator('input[type="password"]')
  await passwordInput.fill('wrong-password')

  const loginBtn = page.getByRole('button', { name: /login|autentificare|enter/i }).or(
    page.locator('button[type="submit"]')
  )
  await loginBtn.first().click()
  await page.waitForTimeout(500)

  // Should still show login form (not authenticated)
  await expect(passwordInput).toBeVisible()
})

test('Admin login with correct password shows dashboard', async ({ page }) => {
  await adminLogin(page)

  // Should see dashboard content (bookings count, messages, etc.)
  const dashboardContent = page.getByText(/dashboard|panou/i).or(
    page.getByText(/booking|rezerv/i)
  )
  await expect(dashboardContent.first()).toBeVisible()
})

// ── Tab Navigation ───────────────────────────────────────

test('Admin dashboard has all expected tabs', async ({ page }) => {
  await adminLogin(page)

  // Check that all major tabs exist
  const expectedTabs = ['Dashboard', 'Bookings', 'Messages', 'Reviews', 'Testimonials', 'Stats', 'A/B Testing', 'Settings']
  const expectedTabsRo = ['Dashboard', 'Rezervări', 'Mesaje', 'Recenzii', 'Testimoniale', 'Statistici', 'A/B Testing', 'Setări']

  let foundCount = 0
  for (const tabName of [...expectedTabs, ...expectedTabsRo]) {
    const tab = page.getByRole('button', { name: new RegExp(tabName, 'i') })
    if (await tab.count() > 0) foundCount++
  }
  // Should find at least 6 of the tabs (either EN or RO)
  expect(foundCount).toBeGreaterThanOrEqual(6)
})

test('Clicking Bookings tab shows bookings list', async ({ page }) => {
  await adminLogin(page)

  const bookingsTab = page.getByRole('button', { name: /booking|rezerv/i })
  await bookingsTab.first().click()
  await page.waitForTimeout(500)

  // Should show booking references or booking data
  const bookingContent = page.getByText(/BK-|pending|confirmed|completat/i)
  await expect(bookingContent.first()).toBeVisible()
})

test('Clicking Messages tab shows contact messages', async ({ page }) => {
  await adminLogin(page)

  const messagesTab = page.getByRole('button', { name: /message|mesaj/i })
  await messagesTab.first().click()
  await page.waitForTimeout(500)

  // Should show message content or sender names
  const msgContent = page.getByText(/cristina|andrei|contact|mesaj/i)
  await expect(msgContent.first()).toBeVisible()
})

test('Clicking Reviews tab loads reviews component', async ({ page }) => {
  await adminLogin(page)

  const reviewsTab = page.getByRole('button', { name: /review|recenzi/i })
  await reviewsTab.first().click()
  await page.waitForTimeout(1000)

  // Should show reviews interface (filter buttons or review cards)
  const reviewContent = page.getByText(/pending|approved|all|toate/i)
  await expect(reviewContent.first()).toBeVisible()
})

test('Clicking Testimonials tab loads testimonials component', async ({ page }) => {
  await adminLogin(page)

  const testimonialsTab = page.getByRole('button', { name: /testimonial/i })
  await testimonialsTab.first().click()
  await page.waitForTimeout(1000)

  // Should show testimonials interface
  const testimonialContent = page.getByText(/active|inactive|all|toate|add|adaugă/i)
  await expect(testimonialContent.first()).toBeVisible()
})

test('Clicking Stats tab loads stats component', async ({ page }) => {
  await adminLogin(page)

  const statsTab = page.getByRole('button', { name: /stats|statistic/i })
  await statsTab.first().click()
  await page.waitForTimeout(1000)

  // Should show stats management interface
  const statsContent = page.getByText(/stat|metric|value|valoare/i)
  await expect(statsContent.first()).toBeVisible()
})

test('Clicking A/B Testing tab loads A/B dashboard', async ({ page }) => {
  await adminLogin(page)

  const abTab = page.getByRole('button', { name: /a\/b/i })
  await abTab.first().click()
  await page.waitForTimeout(1000)

  // Should show A/B testing interface with variant info
  const abContent = page.getByText(/variant|conversion|impression|cta/i)
  await expect(abContent.first()).toBeVisible()
})

test('Clicking Settings tab shows settings page', async ({ page }) => {
  await adminLogin(page)

  const settingsTab = page.getByRole('button', { name: /setting|setar/i })
  await settingsTab.first().click()
  await page.waitForTimeout(500)

  // Should show integration status (Supabase, Claude, etc.)
  const settingsContent = page.getByText(/supabase|claude|email|integration|integrare/i)
  await expect(settingsContent.first()).toBeVisible()
})

// ── Dashboard Stats ──────────────────────────────────────

test('Dashboard shows summary cards', async ({ page }) => {
  await adminLogin(page)

  // Dashboard should have stat summary cards
  const statCards = page.getByText(/booking|messages|reviews|revenue|reservări|mesaje|recenzii|venituri/i)
  const cardCount = await statCards.count()
  expect(cardCount).toBeGreaterThanOrEqual(2)
})

// ── API Health ───────────────────────────────────────────

test('API /api/admin/status returns integration health', async ({ request }) => {
  const response = await request.get('/api/admin/status')
  expect(response.ok()).toBe(true)

  const data = await response.json()
  // API returns { integrations: { supabase, claude, email, analytics } }
  expect(data).toHaveProperty('integrations')
  expect(data.integrations).toHaveProperty('supabase')
  expect(data.integrations).toHaveProperty('claude')
  expect(data.integrations).toHaveProperty('email')
  expect(data.integrations).toHaveProperty('analytics')
})

// ── Logout ───────────────────────────────────────────────

test('Logout returns to login screen', async ({ page }) => {
  await adminLogin(page)

  // Click logout button
  const logoutBtn = page.getByRole('button', { name: /logout|deconecta|ieși/i })
  if (await logoutBtn.count()) {
    await logoutBtn.first().click()
    await page.waitForTimeout(500)

    // Should show login form again
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
  }
})

// ── No console errors ────────────────────────────────────

test('Admin dashboard loads without console errors', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  await adminLogin(page)

  // Filter known benign errors
  const realErrors = consoleErrors.filter(
    (e) =>
      !e.includes('favicon') &&
      !e.includes('Download the React DevTools') &&
      !e.includes('hydrat') &&
      !e.includes('Failed to load resource') &&
      !e.includes('net::ERR')
  )

  expect(realErrors).toHaveLength(0)
})
