# LIVE QA REPORT — xplorecruisetravel.com

**Date:** 2026-03-01
**Site:** https://xplorecruisetravel.com
**Platform:** Next.js 15.1.6 on Vercel (Hobby)
**Languages:** Romanian (default, SSR) / English (client-side toggle)
**Tester:** Automated QA via Claude
**Browser:** Chrome 133 on macOS

---

## EXECUTIVE SUMMARY

### 🔴 LAUNCH READINESS: **NO — NOT LAUNCH-READY**

The site is **visually polished**, loads **fast**, and has **correct Romanian content** in the body. However, **2 Blocker bugs** and **5 Critical SEO issues** make it unfit for production lead generation or organic search traffic.

**Total Issues Found:** 22
| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Blocker | 2 | Must fix before any marketing spend |
| 🟠 Critical | 5 | Must fix before launch |
| 🟡 Major | 8 | Fix within first sprint post-launch |
| 🟢 Minor | 7 | Fix as capacity allows |

---

### TOP 5 CONVERSION-BLOCKING ISSUES

| # | Bug ID | Issue | Impact |
|---|--------|-------|--------|
| 1 | BUG-L001 | Contact form `name=""` on all inputs | **Zero leads captured** — form submits empty data |
| 2 | BUG-L002 | Social links → `#facebook`, `#instagram`, `#twitter` | Trust destroyed when clicks do nothing |
| 3 | BUG-L011 | Gold text (#a67b22) fails WCAG contrast (3.83:1) | 25+ text elements hard to read for low-vision users |
| 4 | BUG-L012 | Mobile menu has no opaque background | Navigation impaired on mobile — text overlaps content |
| 5 | BUG-L015 | Default Next.js 404 page (no branding) | Users on broken links are stranded with no navigation |

### TOP 5 TRUST-BREAKING ISSUES

| # | Bug ID | Issue | Impact |
|---|--------|-------|--------|
| 1 | BUG-L003 | All 14 pages share identical English `<title>` | Google shows same title for every page |
| 2 | BUG-L004 | All 14 pages share identical English `<meta description>` | English snippets on Romanian site |
| 3 | BUG-L005 | Missing `robots.txt` (returns 404) | No crawler directives, no sitemap reference |
| 4 | BUG-L006 | Missing `sitemap.xml` (returns 404) | Search engines can't discover pages efficiently |
| 5 | BUG-L007 | No canonical tags + www/non-www both serve (BUG-L014) | Duplicate content across 28 URLs |

---

## PHASE RESULTS

### Phase 0 — Site Discovery ✅

- **Pages Found:** 14 unique internal routes
- **Templates:** Homepage (1), Listing (1), Cruise Detail (6), About (1), Contact (1), Legal (4)
- **CTAs Identified:** "Exploreaza Croazierele", "Contacteaza-ne", "Rezerva Acum", "Vezi Detalii"
- **External Links:** tel:+40749558572, mailto:xplorecruisetravel@gmail.com
- **Social Links:** 3 (all broken — `#` anchors)
- **Language:** RO server-rendered, EN via client-side `localStorage` toggle (`xplore-locale`)
- **No `/en/` URL prefix** — all `/en/*` routes return 404

### Phase 1 — Smoke & Routing ✅

| Test | Result |
|------|--------|
| All 14 pages return HTTP 200 | ✅ PASS |
| Non-existent URL returns 404 | ✅ PASS (status 404 correct) |
| 404 page has site branding | ❌ FAIL — default Next.js page |
| robots.txt accessible | ❌ FAIL — returns 404 |
| sitemap.xml accessible | ❌ FAIL — returns 404 |
| Console errors on page load | ✅ PASS — no JS errors |
| Language toggle persists | ✅ PASS — localStorage works |
| HTTPS enforced | ✅ PASS — HSTS header present |

### Phase 2 — Functional (Safe Mode) ✅

| Test | Result |
|------|--------|
| Header nav links (all 4) | ✅ All navigate correctly |
| Footer nav links | ✅ All navigate correctly |
| "Exploreaza Croazierele" CTA | ✅ → /cruises |
| "Contacteaza-ne" CTA | ✅ → /contact |
| "Rezerva Acum" buttons | ✅ → /contact |
| "Vezi Detalii" buttons | ✅ → individual cruise pages |
| Phone link (`tel:`) | ✅ Correct href |
| Email link (`mailto:`) | ✅ Correct href |
| Social media links | ❌ FAIL — all `#` placeholders |
| Contact form: empty submit | ✅ Browser validation fires |
| Contact form: invalid email | ✅ Browser validation fires |
| Contact form: `name` attributes | ❌ FAIL — all `name=""` |
| Contact form: XSS string | ✅ React escapes output |
| GDPR consent checkbox | ✅ Required, blocks submit |

### Phase 3 — I18N & Content ✅

| Test | Result |
|------|--------|
| RO body content (SSR) | ✅ Correct Romanian throughout |
| EN body content (client toggle) | ✅ Correct English throughout |
| `<html lang="ro">` attribute | ✅ Present |
| `<title>` in correct language | ❌ FAIL — English on all pages |
| `<meta description>` in correct language | ❌ FAIL — English on all pages |
| `og:title` / `og:description` language | ❌ FAIL — English on all pages |
| `aria-label` language | ❌ FAIL — English on all pages |
| Port names translated | ❌ FAIL — "Barcelona, Spain" in RO |
| Currency format | ✅ EUR with proper formatting |
| Phone number format | ✅ +40 prefix correct |
| No placeholder text in body | ⚠️ Map section shows "coming soon" |
| Legal pages content | ✅ Complete in Romanian |

### Phase 4 — Performance ✅

| Metric | Homepage | /cruises | /contact | /about | Cruise Detail |
|--------|----------|----------|----------|--------|---------------|
| TTFB (median, 3 runs) | 148ms | 186ms | 169ms | 173ms | 290ms |
| Total Download Size | 29 KB | 35 KB | 31 KB | 29 KB | 73 KB |
| Status | 200 | 200 | 200 | 200 | 200 |

**Asset Breakdown:**
- JS Chunks: 13 files (Next.js code-split)
- CSS Files: 6 files
- Fonts: 3 woff2 (preloaded)
- Images: Served via Next.js `/_next/image` optimization (Unsplash sources)
- Hero image preloaded via `<link rel="preload">`

**Verdict:** Performance is **excellent**. Sub-300ms TTFB on all pages, small page sizes, efficient asset delivery.

### Phase 5 — Accessibility ✅

**axe-core Results (Homepage):**
| Violation | Instances | WCAG | Severity |
|-----------|-----------|------|----------|
| color-contrast | 25 | 1.4.3 (AA) | Serious |
| region | 5 | Best Practice | Moderate |

**axe-core Results (Contact Page):**
| Violation | Instances | WCAG | Severity |
|-----------|-----------|------|----------|
| color-contrast | 2 | 1.4.3 (AA) | Serious |
| landmark-one-main | 1 | 1.3.1 (A) | Serious |
| region | 16 | Best Practice | Moderate |

**Manual Keyboard Tests:**
| Test | Result |
|------|--------|
| Tab navigation through nav | ✅ Works |
| Focus indicators visible | ✅ Visible outlines |
| Skip to content link | ❌ MISSING |
| `<main>` landmark | ❌ MISSING |
| Form labels associated | ✅ All `<label for="">` correct |
| Form tab order | ✅ Logical |

**Key Finding:** Gold text (`text-gold-600` = `#a67b22`) on white background: contrast ratio **3.83:1** — below WCAG AA minimum of **4.5:1**. Affects 25+ elements across all pages.

### Phase 6 — SEO & Trust ✅

| Check | Result |
|-------|--------|
| Unique `<title>` per page | ❌ FAIL — identical English title |
| Unique `<meta description>` per page | ❌ FAIL — identical English description |
| H1 present on each page | ✅ One H1 per page |
| H1 matches page content | ✅ Correct hierarchy |
| Canonical tags | ❌ MISSING on all pages |
| `og:title` | ❌ Same English title on all |
| `og:description` | ❌ Same English description on all |
| `og:image` | ❌ MISSING on all pages |
| `og:url` | Not present |
| `robots.txt` | ❌ 404 |
| `sitemap.xml` | ❌ 404 |
| Structured data (JSON-LD) | Not present |
| www → non-www redirect | ❌ FAIL — both serve 200 |

### Phase 7 — Security (Passive) ✅

| Header | Present | Value |
|--------|---------|-------|
| `Strict-Transport-Security` | ✅ | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | ❌ | Missing |
| `X-Frame-Options` | ❌ | Missing |
| `Content-Security-Policy` | ❌ | Missing |
| `Referrer-Policy` | ❌ | Missing |
| `Permissions-Policy` | ❌ | Missing |
| `Access-Control-Allow-Origin` | ⚠️ | `*` (too permissive) |

| Check | Result |
|-------|--------|
| Mixed content | ✅ All HTTPS |
| XSS via form input | ✅ React auto-escapes |
| Sensitive data in HTML source | ✅ None found |
| Sensitive data in JS bundles | ✅ None found |
| API keys exposed | ✅ None found |

### Phase 8 — Compatibility ✅

| Viewport | Result | Issues |
|----------|--------|--------|
| Desktop 1440px | ✅ Excellent | None |
| Mobile 375px (iPhone) | ⚠️ Functional | Hamburger menu lacks opaque background |
| Small mobile 320px | ⚠️ Functional | Chat widget overlaps search input |

---

## RECOMMENDATIONS

### Before Launch (Blockers + Critical)
1. **Fix contact form `name` attributes** — immediate, 5 minutes
2. **Add real social media URLs** — immediate, 5 minutes
3. **Implement per-page metadata** (title, description, OG tags) — 2-4 hours
4. **Add `robots.txt`** via `app/robots.ts` — 15 minutes
5. **Add `sitemap.xml`** via `app/sitemap.ts` — 30 minutes
6. **Add canonical tags** — 30 minutes (part of metadata work)

### First Sprint Post-Launch
7. Add security headers in `next.config.ts` or `vercel.json`
8. Add `<main>` landmark and skip navigation link
9. Fix gold-600 color contrast (darken to `#8B6914` or darker)
10. Add opaque background to mobile hamburger menu
11. Add og:image with branded social share image
12. Configure www → non-www redirect in Vercel
13. Create custom 404 page with navigation

### Backlog
14. Translate aria-labels per locale
15. Translate port names ("Barcelona, Spania")
16. Fix chat widget overlap at 320px
17. Integrate map on contact page (or remove placeholder)
18. Tighten CORS header
19. Add structured data (JSON-LD) for cruise offers

---

## SIGN-OFF

| Role | Verdict |
|------|---------|
| QA Lead | ❌ **NOT READY** — Blockers must be resolved |
| SEO Engineer | ❌ **NOT READY** — No organic traffic possible in current state |
| Accessibility | ⚠️ **CONDITIONAL** — Fix contrast + landmarks before launch |
| Performance | ✅ **READY** — Excellent speed metrics |
| Security | ⚠️ **CONDITIONAL** — Add security headers |

**Estimated effort to reach launch-ready:** 1 developer, 1-2 days for Blocker + Critical fixes.

---

*Report generated by automated QA pipeline. All tests performed against production deployment at https://xplorecruisetravel.com on 2026-03-01.*
