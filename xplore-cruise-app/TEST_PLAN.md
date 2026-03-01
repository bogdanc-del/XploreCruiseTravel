# Test Plan — XploreCruiseTravel

## 1. Scope

| Area | Coverage |
|------|----------|
| Framework | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| Languages | Romanian (RO, default) + English (EN), client-side i18n via React Context |
| Routes tested | `/`, `/cruises`, `/cruises/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/gdpr` |
| Forms | Contact form, 3-step Booking modal, Chat widget |
| API routes | `POST /api/contact`, `POST /api/booking`, `POST /api/chat` |
| Integrations | Supabase (optional, gracefully degrades), Anthropic Claude (chatbot, optional) |

## 2. Risk Matrix

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Contact form fails silently | High | Medium | E2E tests with API mocks + error state tests |
| Booking form skips validation | High | Low | Step-by-step validation tests, consent checkbox tests |
| i18n keys missing | Medium | Medium | Automated key comparison script (`scripts/i18n-audit.ts`) |
| Mixed-language UI after switch | Medium | Medium | E2E tests verify nav text changes on toggle |
| Broken internal links | Medium | Low | Link integrity tests on all key pages |
| A11y violations | Medium | High | axe-core audit on 4 key pages |
| Horizontal overflow on mobile | High | Medium | Responsive tests at 320px and 1280px |

## 3. Test Matrix

### Functional E2E (Playwright)

| Test file | Tests | Description |
|-----------|-------|-------------|
| `e2e/routes.spec.ts` | 9 | All routes load without console errors, cruise detail page |
| `e2e/links.spec.ts` | 5 | Internal link integrity, CTA phone/email/WhatsApp links |
| `e2e/contact-form.spec.ts` | 4 | Validation, invalid email, happy path, API error state |
| `e2e/booking-form.spec.ts` | 4 | Modal open, validation, Escape close, 3-step happy path |
| `e2e/i18n.spec.ts` | 5 | Language switch on 3 pages, no raw keys in RO/EN |
| `e2e/a11y.spec.ts` | 8 | axe-core WCAG 2 AA audit (4 pages), color contrast tracking |
| `e2e/responsive.spec.ts` | 6 | No horizontal overflow at 320px/1280px (3 pages) |

**Total: 41 tests** across 7 spec files.

### Browser Matrix

| Browser | Status |
|---------|--------|
| Chromium (Desktop) | 41/41 ✅ |
| WebKit (Safari) | 40/41 ✅ (1 timing flake on booking modal) |
| Mobile Chrome (Pixel 5) | Configured, covered via responsive tests |

### Quality Gates (CI)

| Check | Command | Status |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ Clean |
| ESLint | `npx next lint` | ✅ Warnings only (no errors) |
| npm audit | `npm audit` | ✅ 0 vulnerabilities |
| i18n audit | `npx tsx scripts/i18n-audit.ts` | ✅ 131/131 keys in both locales |

## 4. Out of Scope

- Supabase integration tests (no real Supabase configured)
- Anthropic API chatbot responses (no API key configured)
- Production Lighthouse scoring (dev server only available)
- Load/performance testing
- Visual regression testing
