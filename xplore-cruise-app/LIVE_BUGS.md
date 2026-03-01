# LIVE BUGS — xplorecruisetravel.com

**Date:** 2026-03-01
**Total Issues Found:** 22
**Breakdown:** 2 Blocker · 5 Critical · 8 Major · 7 Minor

---

## 🔴 BLOCKER (2)

### BUG-L001: Contact form inputs have no `name` attribute
- **Page:** `/contact`
- **Severity:** Blocker
- **Description:** All 6 form fields (name, email, phone, interest, message, gdpr-consent) have `name=""` (empty string). When the form is submitted, no field data will be sent to the server. The form is completely non-functional for lead capture.
- **Evidence:** `<input id="contact-name" type="text" required name="">`
- **Impact:** Zero leads can be captured from the website. Primary conversion path is broken.
- **Fix:** Add proper `name` attributes to each input: `name="name"`, `name="email"`, `name="phone"`, `name="interest"`, `name="message"`, `name="gdprConsent"`.

### BUG-L002: Social media links are placeholder anchors (#)
- **Page:** All pages (footer)
- **Severity:** Blocker
- **Description:** Facebook, Instagram, and X/Twitter links in the footer point to `#facebook`, `#instagram`, `#twitter` — which are in-page anchors that do nothing.
- **Evidence:** `<a href="#facebook" aria-label="facebook">`
- **Impact:** Users cannot reach social media profiles. Trust signal is broken — clicking a social icon and nothing happening damages credibility.
- **Fix:** Replace with actual social media profile URLs.

---

## 🟠 CRITICAL (5)

### BUG-L003: All pages share identical `<title>` tag (English)
- **Page:** ALL 14 pages
- **Severity:** Critical
- **Description:** Every page renders `<title>XploreCruiseTravel - Premium Cruise Experiences</title>` regardless of page content or language. Title is hardcoded in English in the layout.
- **Impact:** Devastating SEO impact. Google will see 14 pages with the same English title for a Romanian-language site. No page differentiation in search results.
- **Fix:** Implement per-page, per-locale `metadata` exports in each `page.tsx`.

### BUG-L004: All pages share identical `<meta description>` (English)
- **Page:** ALL 14 pages
- **Severity:** Critical
- **Description:** Same English meta description on every page: "Discover and book premium cruise experiences worldwide..."
- **Impact:** Google snippets will show English description for Romanian pages, and no page-specific context.
- **Fix:** Unique Romanian descriptions per page in metadata exports.

### BUG-L005: Missing `robots.txt`
- **Page:** `/robots.txt` → 404
- **Severity:** Critical
- **Description:** No robots.txt file exists. Returns a Next.js 404 page.
- **Impact:** Search engine crawlers have no directives. No sitemap reference. May crawl unnecessary pages.
- **Fix:** Add `app/robots.ts` using Next.js Metadata API.

### BUG-L006: Missing `sitemap.xml`
- **Page:** `/sitemap.xml` → 404
- **Severity:** Critical
- **Description:** No sitemap exists. Returns a Next.js 404 page.
- **Impact:** Search engines cannot discover all pages efficiently. New pages won't be indexed promptly.
- **Fix:** Add `app/sitemap.ts` using Next.js Metadata API listing all 14 public pages.

### BUG-L007: No canonical tags on any page
- **Page:** ALL pages
- **Severity:** Critical
- **Description:** No `<link rel="canonical">` tag on any page. Combined with both `www` and non-`www` serving content (no redirect), this creates duplicate content.
- **Impact:** Search engines may split page authority between www and non-www versions.
- **Fix:** Add canonical tags via metadata and configure www-to-non-www redirect in Vercel.

---

## 🟡 MAJOR (8)

### BUG-L008: Missing security headers
- **Page:** All pages
- **Severity:** Major
- **Description:** Only `strict-transport-security` is present. Missing: `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`.
- **Impact:** Clickjacking, MIME type sniffing, and other passive attacks possible.
- **Fix:** Add headers in `vercel.json` or `next.config.ts`.

### BUG-L009: No `<main>` landmark element
- **Page:** ALL pages
- **Severity:** Major (A11y)
- **WCAG:** 1.3.1 (Level A), landmark-one-main
- **Description:** Page content is not wrapped in `<main>` element. Axe reports `landmark-one-main` violation.
- **Impact:** Screen readers cannot navigate to main content. Keyboard users lack structure.
- **Fix:** Wrap page content in `<main>` tag in layout.tsx.

### BUG-L010: No skip navigation link
- **Page:** ALL pages
- **Severity:** Major (A11y)
- **WCAG:** 2.4.1 (Level A)
- **Description:** No "Skip to content" link exists for keyboard users.
- **Impact:** Keyboard users must tab through all nav items on every page load.
- **Fix:** Add visually-hidden skip link as first focusable element.

### BUG-L011: Color contrast failures (25+ instances)
- **Page:** Homepage (25), Contact (2), likely all pages
- **Severity:** Major (A11y)
- **WCAG:** 1.4.3 (Level AA), wcag143
- **Description:** Gold text color (`#a67b22` — `text-gold-600`) on white background has contrast ratio 3.83:1, below WCAG AA minimum of 4.5:1. Also `text-navy-400` on white has insufficient contrast.
- **Impact:** Text is hard to read for users with low vision.
- **Fix:** Darken gold-600 to at least `#8B6914` or use darker variant.

### BUG-L012: Mobile hamburger menu has no opaque background
- **Page:** ALL pages (mobile viewport)
- **Severity:** Major (UX)
- **Description:** On mobile (375px), the hamburger menu opens as an overlay but without an opaque background. Menu text overlaps the page content behind it.
- **Impact:** Menu items are difficult to read due to content showing through. Navigation impaired.
- **Fix:** Add `bg-navy-900` or equivalent solid background to mobile menu overlay.

### BUG-L013: `og:image` missing on all pages
- **Page:** ALL pages
- **Severity:** Major
- **Description:** No Open Graph image tag on any page.
- **Impact:** Social media shares (Facebook, LinkedIn, WhatsApp, Twitter) show no preview image, reducing click-through rate.
- **Fix:** Add og:image with a branded share image.

### BUG-L014: www and non-www both serve content (no redirect)
- **Page:** All pages via `www.xplorecruisetravel.com`
- **Severity:** Major (SEO)
- **Description:** Both `https://xplorecruisetravel.com` and `https://www.xplorecruisetravel.com` serve identical content with HTTP 200. No redirect configured.
- **Impact:** Duplicate site in search engines, split link equity.
- **Fix:** Configure redirect in Vercel dashboard: www → non-www (or vice versa).

### BUG-L015: 404 page is default Next.js (no branding)
- **Page:** Any non-existent URL
- **Severity:** Major (UX)
- **Description:** The 404 page shows only "404 | This page could not be found." with no site header, footer, navigation, or link back to homepage.
- **Impact:** Users who land on a broken link are stranded with no way to navigate back. Zero branding.
- **Fix:** Create custom `app/not-found.tsx` with navigation and helpful links.

---

## 🟢 MINOR (7)

### BUG-L016: `<title>` and meta description in English on server-render (RO pages)
- **Page:** ALL pages (meta tags only)
- **Severity:** Minor (overlaps with L003/L004 — this is the i18n dimension)
- **Description:** Server-rendered HTML always has English meta tags even though `html lang="ro"` and all body content is Romanian.
- **Impact:** SEO language signal mismatch.

### BUG-L017: Port names not translated — "Barcelona, Spain" in RO mode
- **Page:** `/cruises/western-mediterranean-discovery` and other detail pages
- **Severity:** Minor (i18n)
- **Description:** Departure port shows "Barcelona, Spain" when in Romanian. Should be "Barcelona, Spania".
- **Fix:** Translate country names in port data.

### BUG-L018: aria-label attributes in English when page is in Romanian
- **Page:** ALL pages
- **Severity:** Minor (A11y)
- **Description:** `aria-label="Open chat"`, `aria-label="Open menu"`, `aria-label="Switch language to English"` are English regardless of active language.
- **WCAG:** Related to 3.1.2
- **Fix:** Make aria-labels locale-aware.

### BUG-L019: Content not contained by landmarks (16 instances on /contact)
- **Page:** `/contact` and others
- **Severity:** Minor (A11y)
- **WCAG:** Best practice (region landmark)
- **Description:** Axe reports `region` violation — page sections not within landmark regions.
- **Fix:** Wrap sections in appropriate landmark elements or `role="region"` with labels.

### BUG-L020: Map placeholder on contact page
- **Page:** `/contact`
- **Severity:** Minor
- **Description:** The map section shows "Harta va fi adaugata in curand" (Map coming soon) with a placeholder graphic.
- **Impact:** Looks unfinished. Reduces trust.
- **Fix:** Integrate Google Maps or Leaflet, or remove the placeholder section.

### BUG-L021: Chat widget overlaps search input at 320px viewport
- **Page:** `/cruises` at 320px width
- **Severity:** Minor (UX)
- **Description:** The floating chat button overlaps the right edge of the search input at the smallest viewport.
- **Fix:** Adjust z-index or add bottom margin, or increase chat button offset on small screens.

### BUG-L022: Wide-open CORS header
- **Page:** ALL pages
- **Severity:** Minor (Security)
- **Description:** `Access-Control-Allow-Origin: *` on all responses. Not a vulnerability but unnecessarily permissive for a site that doesn't serve a public API.
- **Fix:** Remove or restrict CORS header.
