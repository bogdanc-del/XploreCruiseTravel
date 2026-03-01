# LIVE BUGS — xplorecruisetravel.com (Post-Fix Re-QA)

| Field | Value |
|---|---|
| **Date** | 2026-03-01 |
| **Previous Bugs** | 22 (L001–L022) — ALL RESOLVED ✅ |
| **Remaining Issues** | 7 |
| **Breakdown** | 0 Blocker · 0 Critical · 2 Major · 5 Minor |

---

## PREVIOUSLY RESOLVED (22/22) ✅

All 22 bugs from the initial QA have been fixed, deployed, and verified:

| ID | Issue | Fix Verified |
|----|-------|-------------|
| L001 | Contact form `name=""` on all inputs | ✅ Form submits with data |
| L002 | Social links → `#` placeholders | ✅ Real URLs |
| L003 | Identical English `<title>` on all pages | ✅ Unique RO titles |
| L004 | Identical English `<meta description>` | ✅ Unique RO descriptions |
| L005 | Missing robots.txt (404) | ✅ Present, blocks /api/ |
| L006 | Missing sitemap.xml (404) | ✅ 14 URLs |
| L007 | No canonical tags | ✅ Present on static pages |
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

## 🟡 MAJOR (2)

### R001: Cruise detail pages share parent /cruises meta tags
- **Pages:** All 6 cruise detail pages
- **Severity:** Major (SEO)
- **Description:** All 6 cruise detail pages (`/cruises/western-mediterranean-discovery`, etc.) render the same `<title>`, `<meta description>`, and `og:title` as the parent `/cruises` listing page, rather than unique per-cruise metadata.
- **Evidence:**
  - Title on all 6 detail pages: `Croaziere Premium — Ocean, Fluviale, Lux, Expeditie | XploreCruiseTravel`
  - Description on all 6: `Exploreaza toate ofertele de croaziere premium...`
- **Impact:** Search engines cannot distinguish cruise detail pages in results. Click-through rates suffer from generic titles. Missed SEO opportunity for long-tail cruise keywords.
- **Fix:** Add dynamic `generateMetadata()` in `/cruises/[slug]/page.tsx` that reads the cruise title and description to generate unique metadata per cruise page.
- **Effort:** 1–2 hours

### R002: Color contrast — text-navy-400 on white (3.66:1)
- **Pages:** Homepage (13 instances), likely all pages with cruise cards
- **Severity:** Major (Accessibility)
- **WCAG:** 1.4.3 (Level AA) — minimum 4.5:1 for normal text
- **Description:** The `text-navy-400` colour (#6787b7) on white background (#ffffff) has a contrast ratio of **3.66:1**, below the WCAG AA minimum of 4.5:1. Affects secondary text like "de la" (from) and "/persoana" (/person) on cruise price cards.
- **Evidence:** axe-core reports 13 nodes failing color-contrast on homepage.
- **Impact:** Low-vision users may struggle to read pricing context text.
- **Fix:** Darken `--color-navy-400` to at least `#5a7399` (4.54:1) or use `text-navy-500` for these elements.
- **Effort:** 30 minutes

---

## 🟢 MINOR (5)

### R003: Cruise detail canonical URLs point to /cruises parent
- **Pages:** All 6 cruise detail pages
- **Severity:** Minor (SEO)
- **Description:** `<link rel="canonical" href="https://xplorecruisetravel.com/cruises">` on all detail pages points to the parent listing instead of the detail page's own URL.
- **Impact:** Search engines may consolidate detail page signals into the listing page.
- **Fix:** Set canonical to self-URL in `generateMetadata()`.
- **Effort:** Included with R001 fix

### R004: `lang="ro"` hardcoded regardless of locale
- **Pages:** All pages
- **Severity:** Minor (I18N)
- **Description:** `<html lang="ro">` is always set in the server-rendered HTML, even when the user switches to EN locale client-side.
- **Impact:** Minimal for SEO (Google sees RO content with RO lang, which is correct for SSR). Only affects client-side EN users who inspect source.
- **Note:** This is an expected limitation of the client-side i18n architecture. A fix would require server-side locale detection or URL-based i18n.
- **Effort:** Architectural change (low priority)

### R005: landmark-banner-is-top-level
- **Pages:** Homepage (1 instance)
- **Severity:** Minor (Accessibility)
- **Description:** The `role="banner"` landmark is contained within another landmark element. axe-core recommends banner be a top-level landmark.
- **Fix:** Ensure `<header role="banner">` is not nested inside `<main>` or another landmark.
- **Effort:** 15 minutes

### R006: landmark-contentinfo-is-top-level
- **Pages:** Homepage (1 instance)
- **Severity:** Minor (Accessibility)
- **Description:** The `role="contentinfo"` landmark is contained within another landmark element.
- **Fix:** Ensure `<footer role="contentinfo">` is not nested inside `<main>` or another landmark.
- **Effort:** 15 minutes

### R007: Desktop Lighthouse performance 82 (LCP 2.9s)
- **Pages:** Homepage (desktop form factor)
- **Severity:** Minor (Performance)
- **Description:** Lighthouse desktop score is 82 with LCP of 2.9s (score 35). Mobile performance is excellent (96) suggesting the desktop form factor emulation may be stricter. All other Core Web Vitals are excellent.
- **Impact:** Desktop visitors may experience slightly slower perceived load for the hero image.
- **Fix:** Consider adding `fetchpriority="high"` to the hero image, or preloading the desktop hero image variant.
- **Effort:** 30 minutes

---

## SEVERITY DEFINITIONS

| Severity | Definition |
|----------|-----------|
| 🔴 Blocker | Prevents core business function; must fix before any traffic |
| 🟠 Critical | Major user-facing issue; must fix before launch |
| 🟡 Major | Significant quality issue; fix within first sprint post-launch |
| 🟢 Minor | Polish item; fix as capacity allows |

---

*Bug list generated from live QA testing on 2026-03-01.*
