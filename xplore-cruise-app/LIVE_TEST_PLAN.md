# LIVE TEST PLAN — xplorecruisetravel.com

**Date:** 2026-03-01
**Site:** https://xplorecruisetravel.com
**Platform:** Next.js 15 on Vercel
**Languages:** Romanian (RO, default) / English (EN, client-side toggle)
**Tester:** Automated QA via Claude

---

## Scope

Full live QA covering 8 phases against the production deployment. No code modifications; all tests are observational or use safe test data.

## URL Map

### Pages (Romanian — Server-Rendered Default)

| # | URL | Template | Status |
|---|-----|----------|--------|
| 1 | `/` | Homepage | 200 ✅ |
| 2 | `/cruises` | Listing | 200 ✅ |
| 3 | `/about` | About | 200 ✅ |
| 4 | `/contact` | Contact + Form | 200 ✅ |
| 5 | `/cruises/western-mediterranean-discovery` | Cruise Detail | 200 ✅ |
| 6 | `/cruises/greek-islands-turkey-voyage` | Cruise Detail | 200 ✅ |
| 7 | `/cruises/norwegian-fjords-explorer` | Cruise Detail | 200 ✅ |
| 8 | `/cruises/romantic-danube-river-cruise` | Cruise Detail | 200 ✅ |
| 9 | `/cruises/caribbean-perfect-day` | Cruise Detail | 200 ✅ |
| 10 | `/cruises/adriatic-luxury-collection` | Cruise Detail | 200 ✅ |
| 11 | `/terms` | Legal | 200 ✅ |
| 12 | `/privacy` | Legal | 200 ✅ |
| 13 | `/cookies` | Legal | 200 ✅ |
| 14 | `/gdpr` | Legal | 200 ✅ |

### English (Client-Side Only — No URL Change)

Language is toggled via localStorage key `xplore-locale`. No `/en/` URL prefix routes exist (all return 404).

### External/Action Links

| Link Type | Value |
|-----------|-------|
| Phone | `tel:+40749558572` |
| Email | `mailto:xplorecruisetravel@gmail.com` |
| Social FB | `#facebook` (BROKEN — placeholder) |
| Social IG | `#instagram` (BROKEN — placeholder) |
| Social X | `#twitter` (BROKEN — placeholder) |

---

## Test Phases

### Phase 0 — Site Discovery ✅
- Crawl all pages from homepage
- Map URL structure per language
- Identify templates, CTAs, forms

### Phase 1 — Smoke & Routing ✅
- HTTP 200 on all 14 pages
- 404 behavior on non-existent URL
- Language switch keeps user on same page (no URL change)
- Console errors on page load

### Phase 2 — Functional (Safe Mode) ✅
- Navigation: header menu, footer links
- CTA: "Exploreaza Croazierele", "Contacteaza-ne", "Rezerva Acum", "Vezi Detalii"
- Contact form: empty submit, invalid email, XSS test string
- Phone/email link handlers
- Social media link destinations

### Phase 3 — I18N & Content ✅
- Both RO/EN: no mixed-language UI
- Meta title/description language match
- h1, h2 consistency
- No placeholder text
- Currency, date formats, phone numbers
- Legal text consistency

### Phase 4 — Performance ✅
- curl timing on 5 key pages (3 runs each, median)
- Asset analysis: JS chunks, CSS files, fonts, images
- TTFB, total load, page size

### Phase 5 — Accessibility ✅
- axe-core audit on homepage + contact page
- Keyboard navigation check
- Focus visibility
- Form labels
- ARIA landmarks

### Phase 6 — SEO & Trust ✅
- H1 per page, canonical tags, OG tags
- robots.txt, sitemap.xml presence
- Social preview data
- Brand consistency

### Phase 7 — Security (Passive) ✅
- Security headers (HSTS, CSP, XFO, etc.)
- Mixed content check
- XSS injection test (input field)
- Sensitive data exposure in HTML/JS

### Phase 8 — Compatibility ✅
- Desktop 1440px
- Mobile 375px (iPhone)
- Small mobile 320px
- Hamburger menu behavior
- Chat widget overlap
