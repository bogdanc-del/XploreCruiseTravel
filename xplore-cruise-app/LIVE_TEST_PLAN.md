# LIVE TEST PLAN — xplorecruisetravel.com

| Field | Value |
|---|---|
| **Project** | XploreCruiseTravel |
| **URL** | https://xplorecruisetravel.com |
| **Date** | 2026-03-01 (Post-Fix Re-QA) |
| **QA Engineer** | Claude (Senior QA Lead + SDET) |
| **Stack** | Next.js 15 · TypeScript · Tailwind CSS v4 · Vercel |

---

## 1. Scope

Full live QA of the production deployment covering 14 URLs (8 static pages + 6 cruise detail pages) across two locales (RO, EN). This is the **second-pass QA** after all 22 original bugs (L001–L022) were resolved and deployed.

### In Scope
- Smoke & routing (HTTP status, redirects, 404 handling)
- Functional testing (navigation, forms, CTAs, modals, search/filter)
- Internationalisation (RO ↔ EN locale switching, content completeness)
- Performance (Lighthouse CLI mobile + desktop, Core Web Vitals)
- Accessibility (axe-core 4.8.4 automated + manual keyboard/ARIA)
- SEO & trust signals (meta tags, OG, canonical, sitemap, robots.txt)
- Security (response headers, mixed content, CORS)
- Cross-browser & viewport compatibility (320px–1440px)
- Playwright E2E regression suite (123 tests × 3 browsers)

### Out of Scope
- Backend/database security audits
- Load / stress testing
- Payment processing (no real transactions)
- Third-party API deep testing (Supabase, Google Maps)

---

## 2. Test Environment

| Item | Detail |
|---|---|
| Production URL | https://xplorecruisetravel.com |
| Hosting | Vercel (Edge Network) |
| Browsers (automated) | Chromium, WebKit, Mobile Chrome (Playwright) |
| Browsers (manual) | Chrome 134 (macOS Sequoia) |
| Viewports tested | 320×568, 375×812, 1440×900 |
| Locales | Romanian (RO, default), English (EN) |
| Lighthouse | CLI v12+ (mobile + desktop form factors) |
| axe-core | v4.8.4 (injected via CDN) |
| Playwright | 123 tests across 3 browser engines |

---

## 3. URL Inventory (from sitemap.xml — 14 URLs)

### Static Pages (8)
| # | URL | Type |
|---|---|---|
| 1 | `/` | Homepage |
| 2 | `/cruises` | Cruise listing + search/filter |
| 3 | `/about` | About us |
| 4 | `/contact` | Contact + form + Google Maps |
| 5 | `/terms` | Terms & Conditions |
| 6 | `/privacy` | Privacy Policy |
| 7 | `/cookies` | Cookie Policy |
| 8 | `/gdpr` | GDPR |

### Cruise Detail Pages (6)
| # | Slug |
|---|---|
| 1 | `/cruises/western-mediterranean-discovery` |
| 2 | `/cruises/greek-islands-turkey-voyage` |
| 3 | `/cruises/norwegian-fjords-explorer` |
| 4 | `/cruises/romantic-danube-river-cruise` |
| 5 | `/cruises/caribbean-perfect-day` |
| 6 | `/cruises/adriatic-luxury-collection` |

---

## 4. Test Phases

### Phase 0 — Site Discovery
- Crawl sitemap.xml and verify all 14 URLs
- Validate robots.txt directives
- Verify www → non-www redirect (308)

### Phase 1 — Smoke & Routing
- HTTP 200 for all 14 URLs
- Custom 404 page for non-existent routes
- www redirect behaviour
- Playwright E2E suite (123 tests × 3 browsers)

### Phase 2 — Functional Testing
- Desktop & mobile navigation
- Hamburger menu on mobile
- Language switch (RO ↔ EN) on all pages
- Cruise search, filters, sort
- Booking modal 3-step wizard
- Contact form validation + submission
- Chat widget open/close
- All CTA buttons
- Phone/email/WhatsApp links

### Phase 3 — I18N & Content
- RO vs EN text audit on all pages
- Translation keys visibility check
- Date/number/currency formatting
- Port name translations
- Meta tags language consistency

### Phase 4 — Performance (Lighthouse CLI)
- Mobile audit: Homepage, /cruises, /contact, /about
- Desktop audit: Homepage
- Core Web Vitals: FCP, LCP, TBT, CLS, SI, TTI

### Phase 5 — Accessibility
- axe-core 4.8.4 automated scan (homepage)
- WCAG 2.1 AA compliance
- Colour contrast validation
- ARIA landmarks audit
- Keyboard navigation

### Phase 6 — SEO & Trust
- Per-page `<title>` and `<meta description>` uniqueness
- Open Graph tags
- Canonical URLs
- `<html lang>` attribute
- H1 count per page
- sitemap.xml + robots.txt

### Phase 7 — Security (Passive)
- Response headers audit
- Mixed content detection
- CORS policy

### Phase 8 — Compatibility
- 320px, 375px, 1440px viewports
- Horizontal overflow check
- Mobile hamburger menu
- Chat widget positioning

---

## 5. Pass / Fail Criteria

| Category | Pass Threshold | Result |
|---|---|---|
| Smoke & Routing | 100% pages return 200; 404 works | ✅ PASS |
| Playwright E2E | 100% tests pass (123/123) | ✅ PASS |
| Lighthouse Performance (mobile) | ≥ 80 | ✅ PASS (89–96) |
| Lighthouse Accessibility | ≥ 90 | ✅ PASS (95–97) |
| Lighthouse SEO | ≥ 90 | ✅ PASS (100) |
| Lighthouse Best Practices | ≥ 90 | ✅ PASS (96) |
| axe-core Critical | 0 critical violations | ✅ PASS |
| Security Headers | All required headers present | ✅ PASS |
| I18N | No untranslated keys visible | ✅ PASS |

---

## 6. Tools Used

| Tool | Purpose |
|---|---|
| curl | HTTP status, headers, redirects, meta extraction |
| sed | HTML meta tag parsing |
| Playwright | 123 E2E tests × 3 browsers (Chromium, WebKit, Mobile Chrome) |
| Lighthouse CLI | Performance, Accessibility, SEO, Best Practices |
| axe-core 4.8.4 | WCAG 2.1 AA automated audit |
| Chrome (browser) | Manual functional & visual testing |

---

## 7. Deliverables

1. `LIVE_TEST_PLAN.md` — This document
2. `LIVE_QA_REPORT.md` — Full test results with screenshots
3. `LIVE_BUGS.md` — Prioritised remaining issue list
4. `PERFORMANCE_REPORT.md` — Lighthouse + Web Vitals summary
5. `I18N_CONTENT_REPORT.md` — Translation & content audit
