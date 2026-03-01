# LIVE BUGS — xplorecruisetravel.com (Final QA)

| Field | Value |
|---|---|
| **Date** | 2026-03-01 (Final) |
| **Previous Bugs** | 22 (L001–L022) — ALL RESOLVED ✅ |
| **Post-QA Issues** | 7 (R001–R007) — ALL RESOLVED ✅ |
| **Additional Fixes** | 3 (contrast on dark bg, footer opacity, heading order) — ALL RESOLVED ✅ |
| **Remaining Issues** | 0 |
| **Breakdown** | 0 Blocker · 0 Critical · 0 Major · 0 Minor |

---

## ALL 22 ORIGINAL BUGS RESOLVED ✅

| ID | Issue | Fix Verified |
|----|-------|-------------|
| L001 | Contact form `name=""` on all inputs | ✅ Form submits with data |
| L002 | Social links → `#` placeholders | ✅ Real URLs |
| L003 | Identical English `<title>` on all pages | ✅ Unique RO titles |
| L004 | Identical English `<meta description>` | ✅ Unique RO descriptions |
| L005 | Missing robots.txt (404) | ✅ Present, blocks /api/ |
| L006 | Missing sitemap.xml (404) | ✅ 14 URLs |
| L007 | No canonical tags | ✅ Present on all pages |
| L008 | Missing security headers | ✅ All 6 present |
| L009 | No `<main>` landmark | ✅ Present |
| L010 | No skip navigation link | ✅ Present |
| L011 | Gold text contrast failure | ✅ Darkened |
| L012 | Mobile menu no opaque background | ✅ Opaque bg |
| L013 | og:image missing | ✅ opengraph-image |
| L014 | www/non-www no redirect | ✅ 308 redirect |
| L015 | Default 404 page | ✅ Branded page |
| L016 | EN meta on RO site | ✅ RO metadata |
| L017 | Port names not translated | ✅ RO translations |
| L018 | CORS `*` too permissive | ✅ Restricted |
| L019 | Departure port country names | ✅ Translated |
| L020 | Missing ARIA landmarks | ✅ Added |
| L021 | Map placeholder | ✅ Google Maps |
| L022 | Chat widget 320px overlap | ✅ Responsive |

---

## ALL 7 POST-QA ISSUES RESOLVED ✅

| ID | Issue | Fix | Verified |
|----|-------|-----|----------|
| R001 | Cruise detail pages share parent metadata | Added `generateMetadata()` in `[slug]/layout.tsx` with unique RO titles, descriptions, OG tags per cruise | ✅ All 6 cruise pages have unique titles & descriptions |
| R002 | Color contrast — text-navy-400 on white (3.66:1) | Darkened `--color-navy-400` from `#6787b7` to `#5a7399` (≥4.5:1 ratio) | ✅ axe-core 0 violations |
| R003 | Cruise detail canonical URLs → /cruises parent | Self-referencing canonicals in `generateMetadata()` | ✅ Each cruise page canonicalizes to itself |
| R004 | `lang="ro"` hardcoded regardless of locale | Added `useEffect` in LocaleProvider to dynamically set `document.documentElement.lang` | ✅ `<html lang>` updates on toggle |
| R005 | landmark-banner-is-top-level | Moved `<main>` from root layout to individual pages, keeping Header/Footer as top-level landmarks | ✅ axe-core 0 landmark violations |
| R006 | landmark-contentinfo-is-top-level | Same fix as R005 — structural refactor | ✅ axe-core 0 landmark violations |
| R007 | Desktop LCP 2.9s | Added `fetchPriority="high"` to hero image | ✅ Applied |

---

## ADDITIONAL FIXES (discovered during axe-core verification) ✅

| Issue | Pages | Fix | Verified |
|-------|-------|-----|----------|
| `text-navy-400` on dark bg (company details) | /about (5 nodes) | Changed to `text-navy-300` for adequate contrast on `bg-navy-900` | ✅ 0 violations |
| `text-navy-400` on dark bg (contact card) | /contact (5 nodes) | Changed to `text-navy-300` for adequate contrast on `bg-navy-900` | ✅ 0 violations |
| `text-navy-400` on dark bg (footer) | All pages (4 nodes) | Changed to `text-navy-300` in Footer.tsx | ✅ 0 violations |
| `text-gold-500/70` footer opacity (3.95:1) | All pages (1 node) | Removed `/70` opacity → `text-gold-500` full opacity | ✅ 0 violations |
| Heading order skip (h1 → h3) | /cruises | Added visually-hidden `<h2>` before cruise grid | ✅ 0 heading-order violations |

---

## FINAL LIVE SITE AXE-CORE RESULTS

| Page | Violations | Passes | Status |
|------|-----------|--------|--------|
| `/` (Homepage) | **0** | 41 | ✅ PASS |
| `/about` | **0** | 39 | ✅ PASS |
| `/contact` | **0** | 48 | ✅ PASS |
| `/cruises` | **0** | 44 | ✅ PASS |

**Total axe-core violations across all 4 main pages: 0**

---

## FINAL PLAYWRIGHT TEST RESULTS

| Metric | Value |
|--------|-------|
| Total tests | 123 |
| Passed | 123 |
| Failed | 0 |
| Browsers | Chromium, WebKit, Mobile Chrome |
| Duration | ~1.1 minutes |

---

## SEVERITY DEFINITIONS

| Severity | Definition |
|----------|-----------|
| 🔴 Blocker | Prevents core business function; must fix before any traffic |
| 🟠 Critical | Major user-facing issue; must fix before launch |
| 🟡 Major | Significant quality issue; fix within first sprint post-launch |
| 🟢 Minor | Polish item; fix as capacity allows |

---

## KNOWN LIMITATIONS (by design, not bugs)

| Item | Notes |
|------|-------|
| `<html lang="ro">` on SSR | Server always renders RO; `lang` updates client-side on EN toggle. Correct for primary audience. |
| No `hreflang` tags | EN content not discoverable by crawlers. Would require URL-based i18n (`/en/` prefix). |
| No URL-based locale | EN is client-side only. Future consideration for full i18n. |

---

*Final report generated from live axe-core audits + Playwright 123/123 pass on 2026-03-01.*
