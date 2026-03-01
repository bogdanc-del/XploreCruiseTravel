# QA Report — XploreCruiseTravel

**Date**: 2026-03-01
**QA Lead**: Claude (AI-assisted)
**Framework**: Next.js 15, TypeScript, Tailwind CSS v4
**Languages**: Romanian (RO) + English (EN)

---

## Executive Summary

| Metric | Result |
|--------|--------|
| E2E Tests (Chromium) | **41/41 passed** ✅ |
| E2E Tests (WebKit) | **40/41 passed** (1 timing flake) |
| TypeScript | **Clean** — no errors |
| ESLint | **4 warnings**, 0 errors |
| npm audit | **0 vulnerabilities** |
| i18n audit | **131/131 keys** in both locales |
| Bugs found | **8** (0 Critical, 2 Major, 6 Minor) |

---

## Phase 0: Discovery

### Routes
| Route | Type | Status |
|-------|------|--------|
| `/` | Static | ✅ |
| `/cruises` | Static (demo data) | ✅ |
| `/cruises/[slug]` | Dynamic | ✅ |
| `/about` | Static | ✅ |
| `/contact` | Static + Form | ✅ |
| `/admin` | Protected | ✅ |
| `/privacy` | Static | ✅ |
| `/terms` | Static | ✅ |
| `/cookies` | Static | ✅ |
| `/gdpr` | Static | ✅ |

### API Routes
| Endpoint | Method | Validation | Status |
|----------|--------|------------|--------|
| `/api/contact` | POST | Name, email, message, GDPR consent | ✅ |
| `/api/booking` | POST | Name, email, GDPR, terms, passenger count | ✅ |
| `/api/chat` | POST | Message content, Anthropic API | ⚠️ No API key |

### Environment Variables
| Variable | Required | Status |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Configured (placeholder) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Configured (placeholder) |
| `ANTHROPIC_API_KEY` | Optional | Not configured |
| `NEXT_PUBLIC_SITE_URL` | Optional | Configured |

---

## Phase 1: Quality Gates

### TypeScript
```
$ npx tsc --noEmit
(clean — no output)
```

### ESLint
```
$ npx next lint
Warnings:
  - about/page.tsx:120 — <img> instead of next/Image
  - contact/page.tsx:340 — <img> instead of next/Image
  - cruises/[slug]/page.tsx:607 — <img> instead of next/Image
  - cruise/RouteMap.tsx:424 — missing useEffect dependency
Errors: 0
```

### npm audit
```
$ npm audit
found 0 vulnerabilities
```

---

## Phase 2: Functional E2E Tests

**Tool**: Playwright 1.58
**Browser**: Chromium (Desktop Chrome)

| Test Suite | Tests | Passed | Failed |
|------------|-------|--------|--------|
| Routes (all pages load) | 9 | 9 | 0 |
| Links (integrity + CTAs) | 5 | 5 | 0 |
| Contact form (validation, happy path, error) | 4 | 4 | 0 |
| Booking modal (open, validate, escape, submit) | 4 | 4 | 0 |
| i18n (switch, raw keys) | 5 | 5 | 0 |
| A11y (axe-core) | 8 | 8 | 0 |
| Responsive (320px, 1280px) | 6 | 6 | 0 |
| **Total** | **41** | **41** | **0** |

### Key Findings
- All 8 static routes return HTTP 200
- All internal links valid on `/`, `/cruises`, `/about`, `/contact`
- Phone CTA: `tel:+40749558572` ✅
- Email CTA: `mailto:xplorecruisetravel@gmail.com` ✅
- Contact form validates empty fields, invalid email, handles API errors
- Booking modal: 3-step flow works end-to-end with mocked API
- Language switch preserves route on all tested pages

---

## Phase 3: i18n Audit

```
$ npx tsx scripts/i18n-audit.ts
✅ All translation keys are present in both EN and RO
✅ Placeholder check complete (no lorem, TODO, etc.)
📊 EN keys: 131 | RO keys: 131 | Missing: 0
⚠️  0/131 RO keys contain Romanian diacritics (ă, â, î, ș, ț)
```

**Finding**: All Romanian translations use ASCII equivalents. See BUG-001 in BUGS.md.

---

## Phase 5: Accessibility (axe-core)

| Page | Critical | Serious | Moderate | Minor |
|------|----------|---------|----------|-------|
| Homepage | 0 | 25 (contrast) | 0 | 0 |
| Cruises | 0* | 25 (contrast) | 0 | 0 |
| About | 0 | 8 (contrast) | 0 | 0 |
| Contact | 0 | 2 (contrast) | 0 | 0 |

*Fixed: 3 `select-name` critical issues on `/cruises` by adding `aria-label` attributes.

All serious issues are color-contrast (WCAG 2 AA). Documented in BUG-002.

---

## Phase 6: Security

| Check | Result |
|-------|--------|
| npm audit | 0 vulnerabilities |
| XSS in forms | Forms use React controlled inputs (safe by default) |
| API input validation | Contact + Booking APIs validate required fields |
| Env var leakage | `.env.local` in `.gitignore` ✅ |
| `dangerouslySetInnerHTML` | Not used anywhere ✅ |
| GDPR consent | Required on both contact and booking forms ✅ |

---

## Phase 7: Compatibility

### Browser Matrix
| Browser | Tests | Passed | Notes |
|---------|-------|--------|-------|
| Chromium | 41 | 41 | Clean |
| WebKit | 41 | 40 | Booking happy path timing flake (BUG-008) |

### Responsive
| Viewport | Pages Tested | Horizontal Overflow | Result |
|----------|-------------|---------------------|--------|
| 320px (mobile) | Home, Cruises, Contact | None | ✅ |
| 1280px (desktop) | Home, Cruises, Contact | None | ✅ |

---

## CI Pipeline

GitHub Actions workflow created at `.github/workflows/ci.yml`:
- **quality-gates** job: TypeScript, ESLint, i18n audit
- **e2e-tests** job: Playwright on Chromium + WebKit (matrix)
- Artifacts: Playwright HTML reports uploaded on every run
- Trigger: Push/PR to `main`

---

## Fixes Applied During QA

| Fix | File | Description |
|-----|------|-------------|
| `aria-label` on select elements | `cruises/page.tsx` | Fixed 3 critical `select-name` a11y violations |
| Playwright test suite | `e2e/*.spec.ts` | Created 41 E2E tests covering all key flows |
| i18n audit script | `scripts/i18n-audit.ts` | Automated translation key comparison |
| CI pipeline | `.github/workflows/ci.yml` | Lint + typecheck + E2E on PR/push |
| Test scripts | `package.json` | Added `test`, `test:e2e`, `test:a11y`, `i18n-audit` |
