# XploreCruiseTravel — Test Cases

**Version:** 1.0.0
**Date:** 2026-03-03
**Audience:** QA, Development team
**Test Frameworks:** Vitest (unit), Playwright (E2E), axe-core (accessibility)

> **Maintenance Rule:** Each development iteration that adds or modifies test cases
> must update this document before committing.

---

## Table of Contents

1. [Unit Tests](#1-unit-tests)
2. [E2E Tests](#2-e2e-tests)
3. [Test Summary](#3-test-summary)
4. [Test Configuration](#4-test-configuration)
5. [Running Tests](#5-running-tests)

---

## 1. Unit Tests

**Framework:** Vitest 4.0
**Directory:** `__tests__/`
**Total:** 107 tests across 8 files

### 1.1 A/B Testing (`ab-testing.test.ts`) — 15 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | getAssignedVariant | returns a valid variant (A, B, or C) | PASS |
| 2 | getAssignedVariant | returns the same variant on subsequent calls | PASS |
| 3 | getAssignedVariant | persists variant in cookie | PASS |
| 4 | getAssignedVariant | distributes among all 3 variants over many assignments | PASS |
| 5 | forceVariant | forces variant A | PASS |
| 6 | forceVariant | forces variant B | PASS |
| 7 | forceVariant | forces variant C | PASS |
| 8 | forceVariant | overrides existing variant | PASS |
| 9 | clearVariant | clears the variant cookie | PASS |
| 10 | getVariantConfig | returns valid config for assigned variant | PASS |
| 11 | getVariantConfig | returns variant B config | PASS |
| 12 | getVariantConfig | returns variant C config | PASS |
| 13 | CTA_VARIANTS | has exactly 3 variants | PASS |
| 14 | CTA_VARIANTS | all variants have required properties | PASS |
| 15 | CTA_VARIANTS | variant A is the control with original CTA keys | PASS |

### 1.2 A/B Results API (`api-ab-results.test.ts`) — 11 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | /api/ab-results GET | returns demo results when Supabase not configured | PASS |
| 2 | /api/ab-results GET | returns results for all 3 variants | PASS |
| 3 | /api/ab-results GET | each variant has required fields | PASS |
| 4 | /api/ab-results GET | includes period information | PASS |
| 5 | /api/ab-results GET | respects days parameter | PASS |
| 6 | /api/ab-results GET | clamps days to max 365 | PASS |
| 7 | /api/ab-results GET | defaults invalid days to 30 | PASS |
| 8 | /api/ab-results GET | has correct overall conversion rate | PASS |
| 9 | /api/ab-results GET | includes cache headers | PASS |
| 10 | /api/ab-results GET | demo data scales with days parameter | PASS |
| 11 | /api/ab-results GET | all conversion rates are between 0 and 100 | PASS |

### 1.3 Stats API (`api-stats.test.ts`) — 13 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | /api/stats GET | returns demo stats when Supabase not configured | PASS |
| 2 | /api/stats GET | returns stats with correct fields | PASS |
| 3 | /api/stats GET | returns all 4 default stats in correct order | PASS |
| 4 | /api/stats GET | includes cache headers | PASS |
| 5 | /api/stats PUT | rejects missing id | PASS |
| 6 | /api/stats PUT | updates stat in demo mode | PASS |
| 7 | /api/stats PUT | returns 404 for non-existent demo id | PASS |
| 8 | /api/stats PUT | rejects negative stat values | PASS |
| 9 | /api/stats POST | rejects missing required fields | PASS |
| 10 | /api/stats POST | creates stat in demo mode | PASS |
| 11 | /api/stats DELETE | rejects missing id parameter | PASS |
| 12 | /api/stats DELETE | succeeds in demo mode | PASS |
| 13 | /api/stats PUT | (additional validation edge case) | PASS |

### 1.4 Reviews API (`api-reviews.test.ts`) — 5 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | /api/reviews POST | returns 400 for missing rating | PASS |
| 2 | /api/reviews POST | returns 400 for message too short | PASS |
| 3 | /api/reviews POST | returns 201 for valid submission | PASS |
| 4 | /api/reviews GET | returns reviews array | PASS |
| 5 | /api/reviews GET | respects limit parameter | PASS |

### 1.5 Testimonials API (`api-testimonials.test.ts`) — 9 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | /api/testimonials GET | returns testimonials array | PASS |
| 2 | /api/testimonials GET | respects limit parameter | PASS |
| 3 | /api/testimonials GET | supports tags filter parameter | PASS |
| 4 | /api/testimonials POST | returns 400 for missing required fields | PASS |
| 5 | /api/testimonials POST | returns 201 for valid testimonial | PASS |
| 6 | /api/testimonials PUT | returns 400 for missing id | PASS |
| 7 | /api/testimonials PUT | returns 200 for valid update | PASS |
| 8 | /api/testimonials DELETE | returns 400 for missing id | PASS |
| 9 | /api/testimonials DELETE | returns 200 for valid deletion | PASS |

### 1.6 Review Validation (`reviews-validation.test.ts`) — 14 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | ReviewSubmitSchema | accepts a valid review with all fields | PASS |
| 2 | ReviewSubmitSchema | accepts a minimal review (only required fields) | PASS |
| 3 | ReviewSubmitSchema | trims whitespace from name, city, and message | PASS |
| 4 | ReviewSubmitSchema | converts empty name/city to null | PASS |
| 5 | ReviewSubmitSchema | rejects rating below 1 | PASS |
| 6 | ReviewSubmitSchema | rejects rating above 5 | PASS |
| 7 | ReviewSubmitSchema | rejects non-integer rating | PASS |
| 8 | ReviewSubmitSchema | rejects message shorter than 10 characters | PASS |
| 9 | ReviewSubmitSchema | rejects message longer than 2000 characters | PASS |
| 10 | ReviewSubmitSchema | rejects when consent_publish is false | PASS |
| 11 | ReviewSubmitSchema | rejects when consent_publish is missing | PASS |
| 12 | ReviewSubmitSchema | rejects honeypot field with content (bot detection) | PASS |
| 13 | ReviewSubmitSchema | rejects name longer than 100 characters | PASS |
| 14 | ReviewSubmitSchema | accepts null for optional fields | PASS |

### 1.7 Testimonials Relevance (`testimonials-relevance.test.ts`) — 10 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | getRelevantTestimonials | returns all when no tags match | PASS |
| 2 | getRelevantTestimonials | prioritizes testimonials with matching tags | PASS |
| 3 | getRelevantTestimonials | ranks higher overlap above lower overlap | PASS |
| 4 | getRelevantTestimonials | respects limit parameter | PASS |
| 5 | getRelevantTestimonials | handles empty testimonials array | PASS |
| 6 | getRelevantTestimonials | handles empty searchTags | PASS |
| 7 | getRelevantTestimonials | is case-insensitive for tag matching | PASS |
| 8 | getRelevantTestimonials | uses sort_order as secondary sort for equal scores | PASS |
| 9 | getRelevantTestimonials | returns river-related testimonials for river cruise | PASS |
| 10 | getRelevantTestimonials | returns adventure testimonials for adventure cruise | PASS |

### 1.8 BNR Exchange Rate (`bnr-exchange-rate.test.ts`) — 30 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | parseBnrXml | parses valid BNR XML and extracts EUR rate | PASS |
| 2 | parseBnrXml | returns null for XML without EUR rate | PASS |
| 3 | parseBnrXml | returns null for XML without date | PASS |
| 4 | parseBnrXml | returns null for empty string | PASS |
| 5 | parseBnrXml | returns null for invalid EUR rate (zero) | PASS |
| 6 | parseBnrXml | returns null for invalid EUR rate (NaN) | PASS |
| 7 | parseBnrXml | returns null for negative EUR rate | PASS |
| 8 | parseBnrXml | handles 10-day XML format (takes first) | PASS |
| 9 | isBnrPublishingTime | returns true on weekday after 14:00 Romania time | PASS |
| 10 | isBnrPublishingTime | returns false on weekday before 14:00 Romania time | PASS |
| 11 | isBnrPublishingTime | returns false on Saturday | PASS |
| 12 | isBnrPublishingTime | returns false on Sunday | PASS |
| 13 | isBnrPublishingTime | returns true on Friday after 14:00 | PASS |
| 14 | isBnrPublishingTime | returns true exactly at 14:00 | PASS |
| 15 | eurToRon | converts EUR to RON with given rate | PASS |
| 16 | eurToRon | rounds to nearest integer | PASS |
| 17 | eurToRon | handles zero amount | PASS |
| 18 | eurToRon | handles small amounts | PASS |
| 19 | eurToRon | handles large amounts | PASS |
| 20 | formatRon | formats amount with RON suffix | PASS |
| 21 | formatRon | formats zero | PASS |
| 22 | formatRon | formats large numbers with locale separators | PASS |
| 23 | EXCHANGE_MARGIN | is 2.5% | PASS |
| 24 | FALLBACK_EUR_RON | is a reasonable fallback rate | PASS |
| 25 | rate with margin | applies 2.5% margin correctly | PASS |
| 26 | rate with margin | fallback rate with margin is reasonable | PASS |
| 27 | clearRateCache | can be called without error | PASS |
| 28 | getExchangeRate | returns fallback rate when fetch fails | PASS |
| 29 | getExchangeRate | returns parsed rate from valid XML response | PASS |
| 30 | getExchangeRate | falls back to 10-day feed when daily feed fails | PASS |

---

## 2. E2E Tests

**Framework:** Playwright 1.58
**Directory:** `e2e/`
**Browsers:** Chromium, WebKit, Mobile Chrome (Pixel 5)
**Total:** 65 tests across 9 files

### 2.1 Route Loading (`routes.spec.ts`) — 9 tests

| # | Test Case | Status |
|---|-----------|--------|
| 1 | Homepage (/) loads without errors | PASS |
| 2 | Cruises listing (/cruises) loads without errors | PASS |
| 3 | About (/about) loads without errors | PASS |
| 4 | Contact (/contact) loads without errors | PASS |
| 5 | Privacy Policy (/privacy) loads without errors | PASS |
| 6 | Terms & Conditions (/terms) loads without errors | PASS |
| 7 | Cookie Policy (/cookies) loads without errors | PASS |
| 8 | GDPR (/gdpr) loads without errors | PASS |
| 9 | Cruise detail page loads (first slug) | PASS |

### 2.2 Internal Links (`links.spec.ts`) — 5 tests

| # | Test Case | Status |
|---|-----------|--------|
| 1 | Internal links on / are valid | PASS |
| 2 | Internal links on /cruises are valid | PASS |
| 3 | Internal links on /about are valid | PASS |
| 4 | Internal links on /contact are valid | PASS |
| 5 | CTAs: phone/email/WhatsApp links are correct | PASS |

### 2.3 Contact Form (`contact-form.spec.ts`) — 4 tests

| # | Test Case | Status |
|---|-----------|--------|
| 1 | shows validation errors for empty required fields | PASS |
| 2 | shows error for invalid email format | PASS |
| 3 | happy path: fills and submits the form | PASS |
| 4 | API error shows error state | PASS |

### 2.4 Responsive Design (`responsive.spec.ts`) — 6 tests

| # | Test Case | Status |
|---|-----------|--------|
| 1 | Homepage renders at 320px (mobile) without horizontal overflow | PASS |
| 2 | Homepage renders at 1280px (desktop) without horizontal overflow | PASS |
| 3 | Cruises renders at 320px (mobile) without horizontal overflow | PASS |
| 4 | Cruises renders at 1280px (desktop) without horizontal overflow | PASS |
| 5 | Contact renders at 320px (mobile) without horizontal overflow | PASS |
| 6 | Contact renders at 1280px (desktop) without horizontal overflow | PASS |

### 2.5 Accessibility (`a11y.spec.ts`) — 8 tests

| # | Test Case | Status |
|---|-----------|--------|
| 1 | Accessibility audit: Homepage (/) | PASS |
| 2 | Accessibility audit: Cruises (/cruises) | PASS |
| 3 | Accessibility audit: About (/about) | PASS |
| 4 | Accessibility audit: Contact (/contact) | PASS |
| 5 | Color contrast audit (non-blocking): Homepage | PASS |
| 6 | Color contrast audit (non-blocking): Cruises | PASS |
| 7 | Color contrast audit (non-blocking): About | PASS |
| 8 | Color contrast audit (non-blocking): Contact | PASS |

### 2.6 Internationalization (`i18n.spec.ts`) — 5 tests

| # | Test Case | Status |
|---|-----------|--------|
| 1 | Language switch on homepage preserves route | PASS |
| 2 | Language switch on /cruises preserves route | PASS |
| 3 | Language switch on /contact preserves route | PASS |
| 4 | No visible translation keys in RO mode | PASS |
| 5 | No visible translation keys in EN mode | PASS |

### 2.7 Lead Capture Form (`booking-form.spec.ts`) — 7 tests

| # | Test Case | Status |
|---|-----------|--------|
| 1 | "Request an offer" button opens the lead capture form | PASS |
| 2 | Validation: empty fields show error | PASS |
| 3 | Validation: invalid email shows error | PASS |
| 4 | Validation: missing GDPR consent shows error | PASS |
| 5 | Escape key closes the modal | PASS |
| 6 | Happy path: fill form and submit | PASS |
| 7 | ?offer=1 query param auto-opens the form | PASS |

### 2.8 Reviews System (`reviews.spec.ts`) — 12 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | /review page | renders the review form with all fields | PASS |
| 2 | /review page | shows validation error when rating is missing | PASS |
| 3 | /review page | shows validation error when message is too short | PASS |
| 4 | /review page | submits a valid review and shows success | PASS |
| 5 | /review page | star rating is interactive (click and hover) | PASS |
| 6 | Homepage reviews | renders reviews section with at least 1 review card | PASS |
| 7 | API /api/reviews | GET returns reviews array | PASS |
| 8 | API /api/reviews | GET respects cruise_type filter | PASS |
| 9 | API /api/reviews | POST rejects empty body | PASS |
| 10 | API /api/reviews | POST rejects missing consent | PASS |
| 11 | API /api/reviews | POST rejects honeypot field with content | PASS |
| 12 | API /api/reviews | POST accepts valid review | PASS |

### 2.9 Testimonials System (`testimonials.spec.ts`) — 9 tests

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Homepage testimonials | renders testimonials section with at least 1 card | PASS |
| 2 | Homepage testimonials | testimonial cards show star ratings | PASS |
| 3 | Homepage testimonials | testimonial cards show author names | PASS |
| 4 | API /api/testimonials | GET returns testimonials array | PASS |
| 5 | API /api/testimonials | GET returns testimonials with required fields | PASS |
| 6 | API /api/testimonials | GET respects tags filter | PASS |
| 7 | API /api/testimonials | POST rejects empty body | PASS |
| 8 | API /api/testimonials | POST rejects invalid rating | PASS |
| 9 | API /api/testimonials | POST accepts valid testimonial | PASS |

### 2.10 Multi-Select Night Range Filters (`cruises-filters.spec.ts`) — 7 tests (planned)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Night range filter | selecting a single range filters cruises correctly | MANUAL |
| 2 | Night range filter | selecting multiple ranges composes min/max (e.g. 4-7 + 8-14 → 4-14) | MANUAL |
| 3 | Night range filter | deselecting a range updates composed min/max | MANUAL |
| 4 | Night range filter | "Clear all" resets all selected night ranges | MANUAL |
| 5 | Night range filter | non-contiguous ranges compose correctly (1-3 + 15+) | MANUAL |
| 6 | Night range filter | selected ranges show active styling (multi-select toggle) | MANUAL |
| 7 | Night range filter | active filter count includes night ranges in hasActiveFilters | MANUAL |

### 2.11 Per-Date Pricing & Departure Date Picker (`cruise-detail-pricing.spec.ts`) — 12 tests (planned)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | API /api/cruises/[slug] | returns date_prices array for cruises with enriched data | MANUAL |
| 2 | API /api/cruises/[slug] | date_prices contains correct per-date minimum prices | MANUAL |
| 3 | API /api/cruises/[slug] | date_prices includes cabin_count per date | MANUAL |
| 4 | API /api/cruises/[slug] | returns empty date_prices when enriched data missing | MANUAL |
| 5 | DepartureDatePicker | renders all departure dates with per-date prices | MANUAL |
| 6 | DepartureDatePicker | shows "Cel mai bun preț" badge on cheapest date | MANUAL |
| 7 | DepartureDatePicker | selecting a date updates the sidebar price dynamically | MANUAL |
| 8 | DepartureDatePicker | price label changes to "Preț pentru data selectată" when date has pricing | MANUAL |
| 9 | DepartureDatePicker | shows percentage discount when selected date is cheaper than base price | MANUAL |
| 10 | DepartureDatePicker | collapsed view shows first 4 dates, expand button shows all | MANUAL |
| 11 | DepartureDatePicker | RON conversion updates when departure date changes | MANUAL |
| 12 | DepartureDatePicker | single-date cruises show simple row (no DepartureDatePicker) | MANUAL |

### 2.12 Email Notifications (`email-notifications.spec.ts`) — 8 tests (planned)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Email service | isEmailConfigured returns false when SMTP not set | MANUAL |
| 2 | Email service | isEmailConfigured returns true when SMTP vars set | MANUAL |
| 3 | Lead form (/api/contact) | triggers notifyNewLead on successful submission | MANUAL |
| 4 | Lead form (/api/contact) | email includes cruise title, slug, price when provided | MANUAL |
| 5 | Lead form (/api/contact) | form submission succeeds even if email fails | MANUAL |
| 6 | Review submission (/api/reviews) | triggers notifyNewReview on successful submission | MANUAL |
| 7 | Review notification | email includes star rating, review text, city | MANUAL |
| 8 | Contact form | triggers notifyNewContact for general contact submissions | MANUAL |

### 2.13 Admin Integration Status (`admin-integrations.spec.ts`) — 5 tests (planned)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | API /api/admin/status | returns JSON with integrations object | MANUAL |
| 2 | API /api/admin/status | integration statuses reflect actual env var configuration | MANUAL |
| 3 | Admin dashboard | fetches live integration statuses on load | MANUAL |
| 4 | Admin dashboard | shows green/red indicators for each integration | MANUAL |
| 5 | Admin dashboard | displays Google Analytics as 4th integration row | MANUAL |

### 2.14 Cruise Data Sync Automation — 4 tests (planned)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | GitHub Actions | sync-cruises.yml runs on cron schedule (04:00 UTC daily) | MANUAL |
| 2 | GitHub Actions | sync script uses env vars (PRICE_API_KEY, PRICE_API_URL) | MANUAL |
| 3 | GitHub Actions | sync commits and pushes updated JSON files | MANUAL |
| 4 | GitHub Actions | manual trigger via workflow_dispatch works | MANUAL |

### 2.15 Image Fallback & Ship Images — 3 tests (planned)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Ship images | all Unsplash URLs in ship-images.ts return 200 (not 404) | MANUAL |
| 2 | Ship images | getBestImageUrl returns ship-specific image when available | MANUAL |
| 3 | CruiseCard | broken images show gradient fallback placeholder (not broken icon) | MANUAL |

### 2.16 Production Integration Configuration — 12 tests (verified 2026-03-03)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Vercel env vars | NEXT_PUBLIC_SUPABASE_URL is set to real Supabase project URL (not placeholder) | PASS |
| 2 | Vercel env vars | NEXT_PUBLIC_SUPABASE_ANON_KEY is set to real 208-char JWT key | PASS |
| 3 | Vercel env vars | ANTHROPIC_API_KEY is set (starts with sk-ant-api03-) | PASS |
| 4 | Vercel env vars | NEXT_PUBLIC_GA_ID is set to G-HR3D09PT3J | PASS |
| 5 | Vercel env vars | SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS are all configured | PASS |
| 6 | Vercel env vars | NOTIFICATION_EMAIL is set to xplorecruisetravel@gmail.com | PASS |
| 7 | Admin /Setari | Supabase integration shows "Connected" (green) | PASS |
| 8 | Admin /Setari | Claude AI integration shows "Connected" (green) | PASS |
| 9 | Admin /Setari | Email (SMTP) integration shows "Connected" (green) | PASS |
| 10 | Admin /Setari | Google Analytics integration shows "Connected" (green) | PASS |
| 11 | Vercel deploy | Production deployment completes successfully with all env vars | PASS |
| 12 | Admin /Setari | All 4 integrations show "Connected" simultaneously on Settings page | PASS |

### 2.17 Supabase Project Setup — 5 tests (verified 2026-03-03)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Supabase org | Organization "XploreCruiseTravel" created on Free plan | PASS |
| 2 | Supabase project | Project "xplore-cruise-travel" created (EU region, NANO tier) | PASS |
| 3 | Supabase API | Project URL resolves: https://fiwmrbthsgoosfvmgojt.supabase.co | PASS |
| 4 | Supabase keys | Legacy anon key is valid JWT format (208 chars) | PASS |
| 5 | Supabase dashboard | Project accessible via Supabase dashboard | PASS |

### 2.18 Claude AI API Setup — 4 tests (verified 2026-03-03)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Anthropic account | Individual account created (Bogdan's Individual Org) | PASS |
| 2 | Anthropic API key | Key "xplore-cruise-travel" created in Default workspace | PASS |
| 3 | Anthropic plan | Account shows "Evaluation access" plan | PASS |
| 4 | Chat API fallback | /api/chat returns friendly fallback message (not 500 error) when API credits unavailable | PASS |

### 2.19 Email SMTP Setup — 5 tests (verified 2026-03-03)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | Google account | 2-Step Verification enabled on xplorecruisetravel@gmail.com | PASS |
| 2 | App password | App password "XploreCruiseTravel SMTP" generated (16 chars) | PASS |
| 3 | SMTP config | SMTP_HOST=smtp.gmail.com, SMTP_PORT=587 configured on Vercel | PASS |
| 4 | SMTP auth | SMTP_USER and SMTP_PASS set with valid Gmail App Password | PASS |
| 5 | Admin status | Email (SMTP) shows "Connected" on admin dashboard | PASS |

### 2.20 Google Analytics GA4 Setup — 3 tests (verified 2026-03-03)

| # | Describe | Test Case | Status |
|---|----------|-----------|--------|
| 1 | GA4 property | XploreCruiseTravel property created with Measurement ID G-HR3D09PT3J | PASS |
| 2 | Vercel env var | NEXT_PUBLIC_GA_ID set to G-HR3D09PT3J | PASS |
| 3 | Admin status | Google Analytics shows "Connected" on admin dashboard | PASS |

---

## 3. Test Summary

| Category | Files | Tests |
|----------|-------|-------|
| Unit Tests (Vitest) | 8 | 106 |
| E2E Tests (Playwright) | 9 | 65 |
| Manual/Planned Tests | 6 | 39 |
| Integration Config Tests (verified) | 5 | 29 |
| **Total** | **28** | **239** |

### Coverage by Feature

| Feature | Unit | E2E | Manual | Verified | Total |
|---------|------|-----|--------|----------|-------|
| A/B Testing | 26 | — | — | — | 26 |
| Reviews | 19 | 12 | — | — | 31 |
| Testimonials | 19 | 9 | — | — | 28 |
| Stats (Trust Metrics) | 13 | — | — | — | 13 |
| BNR Exchange Rate | 30 | — | — | — | 30 |
| Contact/Lead Form | — | 4 | — | — | 4 |
| Lead Capture Modal | — | 7 | — | — | 7 |
| Routes & Navigation | — | 9 | — | — | 9 |
| Links Validation | — | 5 | — | — | 5 |
| Responsive Design | — | 6 | — | — | 6 |
| Accessibility (a11y) | — | 8 | — | — | 8 |
| Internationalization | — | 5 | — | — | 5 |
| Night Range Filters | — | — | 7 | — | 7 |
| Per-Date Pricing | — | — | 12 | — | 12 |
| Email Notifications | — | — | 8 | — | 8 |
| Admin Integrations | — | — | 5 | — | 5 |
| Data Sync Automation | — | — | 4 | — | 4 |
| Image Fallback | — | — | 3 | — | 3 |
| Production Config (Integrations) | — | — | — | 12 | 12 |
| Supabase Setup | — | — | — | 5 | 5 |
| Claude AI Setup | — | — | — | 4 | 4 |
| Email SMTP Setup | — | — | — | 5 | 5 |
| Google Analytics Setup | — | — | — | 3 | 3 |

---

## 4. Test Configuration

### Vitest (`vitest.config.ts`)

| Setting | Value |
|---------|-------|
| Environment | Node |
| Test pattern | `__tests__/**/*.test.ts` |
| Path aliases | `@` → `./src` |
| Timeout | Default (5s) |

### Playwright (`playwright.config.ts`)

| Setting | Value |
|---------|-------|
| Test directory | `./e2e` |
| Base URL | `http://localhost:3000` |
| Browsers | Chromium, WebKit, Mobile Chrome (Pixel 5) |
| Parallel | Yes (except CI) |
| Retries | 2 (CI) / 0 (local) |
| Screenshots | On failure only |
| Tracing | On first retry |
| Reports | HTML (`artifacts/playwright-report`) + list |
| Dev server | Auto-started via `npm run dev` |

---

## 5. Running Tests

```bash
# Full test suite (typecheck + lint + i18n-audit + unit)
npm run test

# Unit tests only (Vitest)
npm run test:unit

# E2E tests (all browsers)
npm run test:e2e

# E2E — specific browser
npm run test:e2e:chromium
npm run test:e2e:webkit

# Accessibility tests only
npm run test:a11y

# Individual unit test file
npx vitest run __tests__/bnr-exchange-rate.test.ts
```

---

## Changelog

| Date | Change | Tests Added |
|------|--------|-------------|
| 2026-03-03 | Initial document creation | 172 tests cataloged (107 unit + 65 E2E) |
| 2026-03-03 | Added manual test cases for new features | +39 manual tests: night filters (7), per-date pricing (12), email (8), admin status (5), sync (4), images (3) |
| 2026-03-03 | Added verified integration configuration tests | +29 integration tests: production config (12), Supabase setup (5), Claude AI setup (4), Email SMTP setup (5), GA4 setup (3) |
