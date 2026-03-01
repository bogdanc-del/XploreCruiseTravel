# I18N & CONTENT REPORT — xplorecruisetravel.com

**Date:** 2026-03-01
**Site:** https://xplorecruisetravel.com
**Default Language:** Romanian (RO) — server-rendered
**Secondary Language:** English (EN) — client-side toggle via `localStorage`
**i18n Strategy:** Client-side only, key `xplore-locale`

---

## EXECUTIVE SUMMARY

### ⚠️ I18N Status: NEEDS SIGNIFICANT WORK

**Body content is correctly translated** in both Romanian and English. However, **all metadata (title, description, OG tags) is hardcoded in English**, creating a severe mismatch between the `<html lang="ro">` declaration and the actual `<head>` content. This has devastating SEO implications for a Romanian-language site.

---

## ARCHITECTURE ANALYSIS

### How i18n Works

| Component | Implementation | Language |
|-----------|---------------|----------|
| `<html lang="...">` | Hardcoded `lang="ro"` | Always RO |
| `<title>` | Hardcoded in layout | Always EN |
| `<meta description>` | Hardcoded in layout | Always EN |
| `<meta og:*>` | Hardcoded in layout | Always EN |
| Body content | Client-side translation via React state | RO (SSR) / EN (toggle) |
| `aria-label` attributes | Hardcoded | Always EN |
| URL structure | No locale prefix | Same URLs for both |

### Key Issues with Architecture

1. **SSR always renders Romanian body** — Google sees Romanian content
2. **`<head>` always renders English meta** — Google sees English metadata
3. **Language signal conflict** — `lang="ro"` + English `<title>` confuses search engines
4. **No `/en/` routes** — English content is invisible to crawlers
5. **Client-side only toggle** — search engines cannot access English version

---

## TRANSLATION ISSUES TABLE

### Category 1: Meta Tags (ALL 14 Pages Affected)

| URL | Language | Issue Type | Exact Text (Current) | Suggested Fix |
|-----|----------|------------|----------------------|---------------|
| ALL 14 pages | RO/EN | Wrong language `<title>` | `XploreCruiseTravel - Premium Cruise Experiences` | Per-page RO title, e.g., `Acasă \| XploreCruiseTravel` |
| ALL 14 pages | RO/EN | Wrong language `<meta description>` | `Discover and book premium cruise experiences worldwide...` | Per-page RO description |
| ALL 14 pages | RO/EN | Wrong language `og:title` | `XploreCruiseTravel - Premium Cruise Experiences` | Match `<title>` per page |
| ALL 14 pages | RO/EN | Wrong language `og:description` | `Discover and book premium cruise experiences worldwide...` | Match `<meta description>` per page |

**Impact:** 56 instances of English meta on a Romanian site (4 meta tags × 14 pages).

### Category 2: Accessibility Labels (ALL Pages)

| URL | Language | Issue Type | Exact Text (Current) | Suggested Fix |
|-----|----------|------------|----------------------|---------------|
| ALL pages | RO | EN `aria-label` | `aria-label="Open chat"` | `aria-label="Deschide chat"` |
| ALL pages | RO | EN `aria-label` | `aria-label="Open menu"` | `aria-label="Deschide meniul"` |
| ALL pages | RO | EN `aria-label` | `aria-label="Switch language to English"` | `aria-label="Schimbă limba în engleză"` |
| ALL pages | RO | EN `aria-label` | `aria-label="facebook"` | `aria-label="Vizitează pagina noastră de Facebook"` |
| ALL pages | RO | EN `aria-label` | `aria-label="instagram"` | `aria-label="Vizitează pagina noastră de Instagram"` |
| ALL pages | RO | EN `aria-label` | `aria-label="twitter"` | `aria-label="Vizitează pagina noastră de X/Twitter"` |

**Impact:** Screen reader users in Romanian mode hear English labels for interactive elements.

### Category 3: Content Translation Gaps

| URL | Language | Issue Type | Exact Text (Current) | Suggested Fix |
|-----|----------|------------|----------------------|---------------|
| `/cruises/western-mediterranean-discovery` | RO | Untranslated country | `Barcelona, Spain` | `Barcelona, Spania` |
| `/cruises/greek-islands-turkey-voyage` | RO | Untranslated country | (Verify port names) | Translate all country names |
| `/cruises/norwegian-fjords-explorer` | RO | Untranslated country | (Verify port names) | Translate all country names |
| `/cruises/romantic-danube-river-cruise` | RO | Untranslated country | (Verify port names) | Translate all country names |
| `/cruises/caribbean-perfect-day` | RO | Untranslated country | (Verify port names) | Translate all country names |
| `/cruises/adriatic-luxury-collection` | RO | Untranslated country | (Verify port names) | Translate all country names |
| `/contact` | RO | Placeholder text | `Harta va fi adaugata in curand` | Integrate map or remove section |

### Category 4: SEO Language Signals

| URL | Issue | Current | Expected |
|-----|-------|---------|----------|
| ALL pages | `<html lang>` | `lang="ro"` (correct for RO) | Should be dynamic per language |
| ALL pages | `hreflang` tags | Missing | Add `<link rel="alternate" hreflang="ro">` and `hreflang="en"` |
| ALL pages | `og:locale` | Missing | Add `og:locale="ro_RO"` |
| ALL pages | Content-Language header | Missing | Add `Content-Language: ro` |

---

## LANGUAGE COVERAGE MATRIX

### Romanian (Default — Server-Rendered)

| Content Area | Translated | Quality | Notes |
|-------------|-----------|---------|-------|
| Navigation (header) | ✅ | Good | All menu items in RO |
| Navigation (footer) | ✅ | Good | All links in RO |
| Homepage hero | ✅ | Good | Compelling RO copy |
| Homepage sections | ✅ | Good | All body content in RO |
| Cruise listing | ✅ | Good | Titles, descriptions in RO |
| Cruise detail pages | ⚠️ | Mostly good | Port country names in English |
| About page | ✅ | Good | Full RO content |
| Contact page | ✅ | Good | Form labels, headings in RO |
| Legal pages (4) | ✅ | Good | Complete legal text in RO |
| `<title>` | ❌ | N/A | English only |
| `<meta description>` | ❌ | N/A | English only |
| OG tags | ❌ | N/A | English only |
| `aria-label` | ❌ | N/A | English only |
| Button alt text | ⚠️ | Partial | Some in English |

### English (Client-Side Toggle)

| Content Area | Translated | Quality | Notes |
|-------------|-----------|---------|-------|
| Navigation (header) | ✅ | Good | All menu items in EN |
| Navigation (footer) | ✅ | Good | All links in EN |
| Homepage hero | ✅ | Good | Good EN copy |
| Homepage sections | ✅ | Good | All body content in EN |
| Cruise listing | ✅ | Good | Titles, descriptions in EN |
| Cruise detail pages | ✅ | Good | Already English port names |
| About page | ✅ | Good | Full EN content |
| Contact page | ✅ | Good | Form labels, headings in EN |
| Legal pages (4) | ✅ | Good | Complete legal text in EN |
| `<title>` | ✅ (by accident) | N/A | Already English |
| `<meta description>` | ✅ (by accident) | N/A | Already English |

---

## RECOMMENDED FIX PRIORITY

### Priority 1 — Critical (Before Launch)

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | Implement per-page `metadata` exports in each `page.tsx` with Romanian titles and descriptions | 2-3 hours | Fixes BUG-L003, BUG-L004 |
| 2 | Add canonical tags via metadata | 30 min | Fixes BUG-L007 |
| 3 | Add `og:image` to metadata | 30 min | Fixes BUG-L013 |
| 4 | Add `og:locale` to metadata | 15 min | Language signal improvement |

### Priority 2 — High (First Sprint)

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 5 | Make `aria-label` attributes locale-aware | 1-2 hours | Accessibility improvement |
| 6 | Translate country names in port data | 1 hour | Content consistency |
| 7 | Add `hreflang` tags | 1 hour | Helps Google understand language versions |

### Priority 3 — Future Consideration

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 8 | Implement URL-based i18n (`/en/` prefix) | 1-2 days | Makes EN content crawlable |
| 9 | Server-render correct language per URL | 1-2 days | Full SSR i18n support |
| 10 | Add `Content-Language` header | 15 min | Additional language signal |
| 11 | Integrate real map on contact page | 2-3 hours | Replace placeholder |

---

## CONTENT CONSISTENCY CHECKS

### Placeholder / Incomplete Content

| Page | Element | Text | Status |
|------|---------|------|--------|
| `/contact` | Map section | "Harta va fi adaugata in curand" | ⚠️ Placeholder — remove or implement |

### Brand Name Consistency

| Variant | Usage | Correct? |
|---------|-------|----------|
| `XploreCruiseTravel` | Title tag, branding | ✅ Primary |
| `Xplore Cruise Travel` | Some body text | ⚠️ Inconsistent spacing |

### Currency & Number Formatting

| Element | Format | Correct for RO? |
|---------|--------|-----------------|
| Cruise prices | `€1,299` / `de la 1.299 €` | ✅ EUR appropriate for RO cruise market |
| Phone number | `+40 749 558 572` | ✅ Romanian format |

### Date Formatting

| Element | Format | Correct for RO? |
|---------|--------|-----------------|
| Cruise dates | Various formats observed | ✅ Acceptable |

---

## CONCLUSION

The site's **body content translation is solid** — both Romanian and English versions read naturally and are complete across all 14 pages. The critical gap is in **metadata and accessibility attributes**, which remain hardcoded in English despite the site being primarily Romanian.

**The #1 priority** is implementing per-page, per-locale metadata exports. This single change would fix 4 of the 5 Critical SEO bugs (BUG-L003, L004, L007 partial, and the i18n dimension of L016).

**Long-term**, the site would benefit from URL-based i18n (`/ro/` and `/en/` prefixes) to make the English version discoverable by search engines, but this is a significant architectural change that can be planned for a future release.

---

*Report generated from manual content inspection and automated HTML analysis on 2026-03-01.*
