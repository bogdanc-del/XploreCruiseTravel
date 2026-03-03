# XploreCruiseTravel — Technical Analysis

**Project:** XploreCruiseTravel Web Platform
**Version:** 1.0.0
**Date:** 2026-03-03
**Audience:** Development team, DevOps, technical reviewers

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client Layer                     │
│  React 19 + Next.js 15 App Router (SSR/SSG/ISR)    │
│  Tailwind CSS 4 + Leaflet Maps + i18n (EN/RO)      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/HTTPS
┌──────────────────────▼──────────────────────────────┐
│                   API Layer                          │
│  Next.js Route Handlers (11 endpoints)               │
│  Rate Limiting · Input Validation (Zod) · PII Strip │
└─────┬──────────┬──────────┬──────────┬──────────────┘
      │          │          │          │
┌─────▼────┐ ┌──▼──┐ ┌────▼────┐ ┌───▼───────┐
│ Supabase │ │JSON │ │ Claude  │ │ BNR API   │
│ Postgres │ │Files│ │ AI SDK  │ │ (EUR/RON) │
│ (RLS)    │ │     │ │         │ │           │
└──────────┘ └─────┘ └─────────┘ └───────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 22.x | Server runtime |
| **Framework** | Next.js | 15.3.0 | Full-stack React framework (App Router) |
| **UI Library** | React | 19.1.0 | Component-based UI |
| **Language** | TypeScript | 5.8.0 | Type safety (strict mode) |
| **Styling** | Tailwind CSS | 4.1.0 | Utility-first CSS framework |
| **Database** | Supabase | 2.49.0 | PostgreSQL with RLS, auth, storage |
| **AI** | Anthropic SDK | 0.39.0 | Claude chat API |
| **Maps** | Leaflet | 1.9.4 | Interactive cruise route maps |
| **Validation** | Zod | 4.3.6 | Runtime schema validation |
| **i18n** | next-intl | 4.1.0 | Internationalization (EN/RO) |
| **Testing** | Vitest | 4.0.18 | Unit testing |
| **E2E Testing** | Playwright | 1.58.2 | End-to-end + a11y testing |
| **Accessibility** | axe-core | 4.11.1 | WCAG 2.1 AA compliance |

### 1.3 Rendering Strategy

| Page | Strategy | Cache |
|------|----------|-------|
| `/` (Homepage) | Static (SSG) | Build-time |
| `/cruises` (Listing) | Static (SSG) | Build-time |
| `/cruises/[slug]` (Detail) | Dynamic (SSR) | On-demand |
| `/admin` | Client-side (CSR) | No cache |
| `/review` | Static (SSG) | Build-time |
| `/contact`, `/about`, `/terms`, etc. | Static (SSG) | Build-time |
| API routes | Dynamic (serverless) | s-maxage headers |

---

## 2. Data Architecture

### 2.1 Data Sources

| Source | Type | Size | Update Frequency |
|--------|------|------|-----------------|
| `cruises-index.json` | Static JSON | 8,483 records (~18MB) | API sync (daily) |
| `cruises-enriched.json` | Static JSON | Full details | API sync (daily) |
| Supabase `reviews` | PostgreSQL | Dynamic | Real-time (user submissions) |
| Supabase `testimonials` | PostgreSQL | Dynamic | Admin-managed |
| Supabase `site_stats` | PostgreSQL | 4+ rows | Admin-managed |
| Supabase `analytics_events` | PostgreSQL | Dynamic | Auto (event tracking) |
| BNR API | External REST | 1 rate | Daily (weekdays after 14:00) |

### 2.2 Cruise Data Schema (JSON Index)

```typescript
interface CruiseIndex {
  s: string    // slug
  t: string    // title
  cl: string   // cruise_line
  sn: string   // ship_name
  ct: string   // cruise_type (ocean|river|luxury|expedition)
  d: string    // destination
  ds: string   // destination_slug
  n: number    // nights
  p: number    // price_from (EUR)
  dd: string   // departure_date (ISO)
  ep: string   // embarkation_port
  dp: string   // disembarkation_port
  img: string  // image URL
  it: object[] // itinerary
  f: boolean   // featured
}
```

### 2.3 Database Tables (Supabase)

#### `reviews`
```sql
CREATE TABLE reviews (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rating          integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  name            text NOT NULL,
  city            text,
  cruise_type     text,
  message         text NOT NULL,
  consent_publish boolean DEFAULT false,
  approved        boolean DEFAULT false,
  source          text DEFAULT 'direct' CHECK (source IN ('qr','direct','manual')),
  created_at      timestamptz DEFAULT now()
);
```

#### `testimonials`
```sql
CREATE TABLE testimonials (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  city        text,
  rating      integer NOT NULL DEFAULT 5,
  quote       text NOT NULL,
  tags        text[] DEFAULT '{}',
  active      boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
```

#### `site_stats`
```sql
CREATE TABLE site_stats (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key    text NOT NULL UNIQUE,
  stat_value  integer NOT NULL DEFAULT 0,
  label_en    text NOT NULL DEFAULT '',
  label_ro    text NOT NULL DEFAULT '',
  suffix      text NOT NULL DEFAULT '+',
  sort_order  integer NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

#### `analytics_events`
```sql
CREATE TABLE analytics_events (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name  text NOT NULL,
  url         text,
  locale      text,
  page        text,
  cruise_slug text,
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

### 2.4 Row Level Security (RLS)

| Table | Role | SELECT | INSERT | UPDATE | DELETE |
|-------|------|--------|--------|--------|--------|
| reviews | anon | approved=true | yes (with rate limit) | no | no |
| reviews | authenticated | all | all | all | all |
| testimonials | anon | active=true | no | no | no |
| testimonials | authenticated | all | all | all | all |
| site_stats | anon | active=true | no | no | no |
| site_stats | authenticated | all | all | all | all |
| analytics_events | anon | no | yes | no | no |
| analytics_events | authenticated | all | yes | no | no |
| analytics_events | service_role | no | yes | no | no |

---

## 3. API Design

### 3.1 Endpoint Inventory

| Endpoint | Method | Auth | Rate Limit | Cache |
|----------|--------|------|------------|-------|
| `GET /api/cruises` | GET | None | None | s-maxage=600 |
| `GET /api/cruises/[slug]` | GET | None | None | s-maxage=600 |
| `GET /api/reviews` | GET | None | None | s-maxage=300 |
| `POST /api/reviews` | POST | None | 5/hr/IP | None |
| `GET /api/testimonials` | GET | None | None | s-maxage=600 |
| `POST /api/testimonials` | POST | Admin | None | None |
| `PUT /api/testimonials` | PUT | Admin | None | None |
| `GET /api/stats` | GET | None | None | s-maxage=600 |
| `PUT /api/stats` | PUT | Admin | None | None |
| `POST /api/stats` | POST | Admin | None | None |
| `DELETE /api/stats` | DELETE | Admin | None | None |
| `POST /api/chat` | POST | None | None | None |
| `POST /api/contact` | POST | None | None | None |
| `POST /api/events` | POST | None | 100/min/IP | None |
| `GET /api/ab-results` | GET | Admin | None | s-maxage=300 |
| `GET /api/exchange-rate` | GET | None | None | s-maxage=3600 |
| `POST /api/sync/prices` | POST | SYNC_SECRET | None | None |

### 3.2 Cruise Listing API

```
GET /api/cruises?page=1&limit=24&destination=mediterranean&type=ocean&minPrice=500&maxPrice=2000&minNights=5&maxNights=14&sort=price_asc&search=msc&collapse=true
```

**Response:**
```json
{
  "cruises": [...],
  "total": 342,
  "page": 1,
  "totalPages": 15,
  "meta": {
    "destinations": ["mediterranean", "caribbean", ...],
    "cruiseLines": ["MSC Cruises", "Royal Caribbean", ...],
    "priceRange": { "min": 199, "max": 45000 }
  }
}
```

### 3.3 Analytics Events API

```
POST /api/events
Content-Type: application/json

{
  "event": "cta_click",
  "locale": "ro",
  "cruise_slug": "western-mediterranean-msc",
  "cta_type": "cta_request_offer",
  "variant": "A"
}
```

**Security:** PII fields (`name`, `email`, `phone`, etc.) are automatically stripped server-side.

---

## 4. Component Architecture

### 4.1 Component Tree (Key Paths)

```
RootLayout
├── Header (nav, language switcher)
├── Page Content
│   ├── Homepage
│   │   ├── Hero section
│   │   ├── GuidedEntryCard
│   │   ├── Featured CruiseCard[] (6)
│   │   ├── StatCounter[] (4)
│   │   ├── TestimonialsSection → TestimonialCard[]
│   │   ├── ReviewsSection → ReviewCard[]
│   │   └── CTA section (consultant photo)
│   │
│   ├── Cruises Listing
│   │   ├── Filters (destination, type, price, nights)
│   │   ├── SearchBar
│   │   ├── CruiseCard[] (24/page)
│   │   └── Pagination
│   │
│   ├── Cruise Detail
│   │   ├── HeroGallery
│   │   ├── CTA Buttons (A/B variant)
│   │   ├── Itinerary
│   │   ├── RouteMap (Leaflet) → PortDrawer
│   │   ├── ExcursionCard[]
│   │   ├── BeveragePackageTable
│   │   └── CruiseLineTerms
│   │
│   └── Admin Dashboard
│       ├── AdminStats
│       ├── AdminTestimonials
│       ├── AdminReviews
│       └── AdminABTesting
│
├── Footer
├── ChatWidget (Claude AI)
├── LeadCaptureForm (modal)
├── GuidedModal (overlay)
│   ├── GuidedProgress
│   ├── GuidedStepTravelParty
│   ├── GuidedStepExperience
│   ├── GuidedStepPriority
│   ├── GuidedStepTiming
│   ├── GuidedStepPreferences
│   └── GuidedResults → GuidedResultCard[]
└── GuidedFlowContext (provider)
```

### 4.2 State Management

| State | Scope | Technology | Persistence |
|-------|-------|-----------|-------------|
| Locale (EN/RO) | Global | React Context | URL / localStorage |
| Exchange rate | Global | React Context (ExchangeRateProvider) | In-memory (session) |
| Guided flow | Global | React Context + useReducer | sessionStorage |
| A/B variant | Per-user | Cookie | 30-day cookie |
| Admin auth | Page | useState | localStorage |
| Chat messages | Page | useState | Session only |
| Form state | Component | useState | None |

---

## 5. Security Architecture

### 5.1 Attack Surface & Mitigations

| Vector | Mitigation |
|--------|-----------|
| XSS | React auto-escaping, security headers (X-XSS-Protection) |
| CSRF | SameSite=Lax cookies, no state-changing GET requests |
| SQL Injection | Supabase parameterized queries, Zod validation |
| Bot spam (reviews) | Honeypot field, rate limiting (5/hr/IP) |
| DDoS (events) | Rate limiting (100/min/IP), in-memory counter |
| PII leakage | Analytics PII sanitization, field whitelist |
| Clickjacking | X-Frame-Options: DENY |
| MIME sniffing | X-Content-Type-Options: nosniff |

### 5.2 Security Headers (next.config.ts)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 5.3 Data Privacy

- **PII sanitization** in analytics pipeline (16 blocked field names)
- **GDPR consent** required on all forms
- **No user accounts** — no stored credentials
- **Review moderation** — no personal info published without consent
- **Supabase RLS** — database-level access control

---

## 6. Performance Architecture

### 6.1 Optimization Strategies

| Strategy | Implementation |
|----------|---------------|
| Static Generation (SSG) | Homepage, listing, legal pages |
| Image optimization | Next.js Image component, WebP format |
| Code splitting | Per-route automatic splitting |
| Lazy loading | Maps, chat widget, guided flow |
| API caching | s-maxage + stale-while-revalidate headers |
| Font optimization | Google Fonts with display=swap |
| CSS optimization | Tailwind CSS 4 (utility-first, tree-shaken) |

### 6.2 Bundle Analysis

| Route | JS Bundle | First Load Shared |
|-------|-----------|-------------------|
| `/` (Homepage) | ~7.5 KB | 103 KB |
| `/cruises` | ~7.6 KB | 103 KB |
| `/cruises/[slug]` | ~34 KB | 103 KB |
| `/admin` | ~26 KB | 103 KB |
| `/review` | ~2.9 KB | 103 KB |

### 6.3 Caching Strategy

| Resource | Cache | TTL |
|----------|-------|-----|
| Static pages | CDN edge cache | Build-time |
| API: cruises listing | CDN + browser | 600s (10 min) |
| API: stats, testimonials | CDN + browser | 600s (10 min) |
| API: reviews | CDN + browser | 300s (5 min) |
| API: A/B results | CDN + browser | 300s (5 min) |
| API: exchange rate | CDN + in-memory | 3600s CDN, 4h server |
| Cruise images | CDN (external) | Long-lived |
| Static assets (JS/CSS) | Immutable hash | 1 year |

---

## 7. Testing Architecture

### 7.1 Test Pyramid

```
         ╱╲
        ╱ E2E ╲        9 specs (Playwright)
       ╱────────╲       Chromium + WebKit + Mobile
      ╱ Integration╲    API route tests
     ╱──────────────╲   8 files, 106 tests (Vitest)
    ╱   Unit Tests    ╲  Validation, scoring, A/B, BNR
   ╱────────────────────╲
```

### 7.2 Unit Tests (Vitest)

| File | Tests | Focus |
|------|-------|-------|
| `ab-testing.test.ts` | 15 | Variant assignment, cookie persistence, distribution |
| `api-ab-results.test.ts` | 11 | Aggregation, period filtering, demo data |
| `api-stats.test.ts` | 12 | CRUD operations, validation, demo mode |
| `api-testimonials.test.ts` | 9 | CRUD, tag filtering |
| `api-reviews.test.ts` | 5 | Submission, rate limiting |
| `reviews-validation.test.ts` | 14 | Zod schema edge cases |
| `testimonials-relevance.test.ts` | 10 | Tag-based scoring algorithm |
| `bnr-exchange-rate.test.ts` | 30 | BNR XML parsing, rate caching, EUR→RON conversion |
| **Total** | **106** | |

### 7.3 E2E Tests (Playwright)

| Spec | Browsers | Focus |
|------|----------|-------|
| `routes.spec.ts` | All | Every page returns 200 |
| `links.spec.ts` | Chromium | No broken links |
| `responsive.spec.ts` | Mobile + Tablet + Desktop | Layout integrity |
| `a11y.spec.ts` | Chromium | axe-core WCAG 2.1 AA |
| `booking-form.spec.ts` | All | Lead form submission flow |
| `contact-form.spec.ts` | All | Contact form flow |
| `reviews.spec.ts` | All | QR review submission |
| `testimonials.spec.ts` | Chromium | Display + filtering |
| `i18n.spec.ts` | Chromium | Language switching |

### 7.4 Test Commands

```bash
npm run test:unit              # Vitest (106 tests)
npm run test:e2e               # Playwright (all browsers)
npm run test:e2e:chromium      # Playwright (Chromium only)
npm run test:e2e:webkit        # Playwright (WebKit only)
npm run test:a11y              # Accessibility audit
npm run test                   # Full suite (typecheck + lint + i18n + unit)
```

---

## 8. Internationalization Architecture

### 8.1 Translation System

```typescript
// src/i18n/translations.ts
const translations = {
  en: {
    hero_title: 'Discover Your Dream Cruise',
    cta_request_offer: 'Request an offer',
    // ... 436+ keys
  },
  ro: {
    hero_title: 'Descopera Croaziera Visurilor Tale',
    cta_request_offer: 'Solicita oferta',
    // ... 436+ keys (balanced)
  }
}
```

### 8.2 Usage Pattern

```typescript
// In any component
const t = useT()           // Hook returns translator for current locale
const { locale } = useLocale()  // Get current locale

<Button>{t('cta_request_offer')}</Button>
// Output: "Request an offer" (EN) or "Solicita oferta" (RO)
```

### 8.3 Key Categories

| Category | Count | Examples |
|----------|-------|---------|
| Navigation | ~20 | nav_home, nav_cruises, nav_contact |
| Hero/CTA | ~15 | hero_title, hero_subtitle, cta_request_offer |
| Cruise listing | ~30 | filter_destination, sort_price_asc |
| Cruise detail | ~25 | cruise_itinerary, cruise_price_from |
| Guided flow | ~40 | guided_q1, guided_q2_couple, guided_results_title |
| Forms | ~25 | lead_form_name, lead_form_submit, contact_success |
| Reviews/Testimonials | ~15 | review_submit, testimonial_read_more |
| Admin | ~30 | admin_approve, admin_delete_confirm |
| A/B Variants | ~8 | cta_get_price, cta_talk_expert |
| Misc | ~30 | footer_company, error_404, loading |
| **Total** | **~436+** | |

---

## 9. Deployment Architecture

### 9.1 Recommended Deployment

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Vercel     │     │   Supabase   │     │  Anthropic   │
│  (Next.js)   │────▶│  (PostgreSQL)│     │  (Claude AI) │
│  Edge + SSR  │     │  RLS + Auth  │     │  Chat API    │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                                         ▲
       │                                         │
       └─────────── API Routes ──────────────────┘
```

### 9.2 Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...

# Cruise Sync API (croaziere.net)
PRICE_API_URL=https://www.croaziere.net/api/v1.1/cruises
PRICE_API_KEY=<your-api-key>
SYNC_SECRET=<your-sync-secret>

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://xplorecruisetravel.com
```

### 9.3 CI/CD Pipeline

```
git push → GitHub Actions
  ├── npm run typecheck
  ├── npm run lint
  ├── npm run i18n-audit
  ├── npm run test:unit (106 tests)
  ├── npm run build
  └── Deploy to Vercel (production)
```

### 9.4 Automated Data Sync (GitHub Actions)

**Workflow:** `.github/workflows/sync-cruises.yml`

```
Daily at 04:00 UTC (07:00 EET) → GitHub Actions
  ├── Checkout repository
  ├── npm ci (install deps)
  ├── node scripts/sync-cruises-api.mjs
  │   ├── Batch-fetch 8,400+ cruise IDs (50/batch, 500ms delay)
  │   ├── Update prices, images, departures
  │   ├── Write cruises.json, cruises-enriched.json, cruises-index.json
  │   └── Generate route map images (if data changed)
  ├── git diff public/data/ → detect changes
  ├── If changed: commit + push → Vercel auto-redeploy
  └── Write job summary
```

| Property | Value |
|----------|-------|
| Schedule | `0 4 * * *` (daily 04:00 UTC) |
| Manual trigger | workflow_dispatch (GitHub Actions UI) |
| Timeout | 30 minutes |
| Required secrets | `PRICE_API_KEY`, `PRICE_API_URL` (optional) |
| Commit author | `github-actions[bot]` |

**Why GitHub Actions (not Vercel Cron):**
- Vercel serverless functions have read-only filesystem — cannot persist JSON files
- Cruise sync takes 2-5 minutes — exceeds Vercel function timeout limits
- GitHub Actions can commit data changes back to git → triggers Vercel redeploy

---

## 10. Monitoring & Observability

### 10.1 Analytics Events (18 types)

| Event | Trigger |
|-------|---------|
| `cruises_list_view` | Visit /cruises |
| `cruise_detail_view` | Visit /cruises/[slug] |
| `cta_impression` | CTA buttons rendered |
| `cta_click` | CTA button clicked |
| `lead_form_open` | Lead form modal opens |
| `lead_form_submit` | Form submitted successfully |
| `lead_form_abandon` | Form closed without submit |
| `lead_submit_success` | Contact/lead saved |
| `contact_submit_success` | Contact form submitted |
| `guided_start` | Guided flow opened |
| `guided_step_complete` | Step answered |
| `guided_skip` | Step 5 skipped |
| `guided_optional_complete` | Step 5 completed |
| `guided_complete` | Results displayed |
| `guided_abandon` | Flow closed before results |
| `guided_result_click` | Result card clicked |
| `guided_result_offer` | "Solicita oferta" on result |
| `browse_filter_apply` | Filter changed |

### 10.2 Error Handling

- API routes use try-catch with console.error logging
- Supabase errors logged but don't crash the page (demo fallback)
- Claude API failures show graceful fallback message in chat
- Client-side errors caught by React error boundaries

---

## 11. Scalability Considerations

### 11.1 Current Limits

| Aspect | Current | Bottleneck | Scale Path |
|--------|---------|-----------|------------|
| Cruise catalog | 8,483 (JSON) | Memory (~18MB) | Migrate to DB + pagination |
| Concurrent users | ~100 | Serverless cold starts | Vercel Pro / Edge Runtime |
| Analytics events | Unlimited | Supabase row limits | Partition by month, 90-day cleanup |
| Chat sessions | ~10 concurrent | Claude API rate limits | Queue + connection pooling |
| Image delivery | External CDNs | CDN bandwidth | Self-hosted CDN cache |

### 11.2 Migration Path (Phase 2+)

1. **Cruise data → Supabase** — Move from JSON to PostgreSQL for real-time updates
2. **Search → Full-text index** — PostgreSQL `tsvector` for better search
3. **Caching → Redis** — Server-side cache for hot data
4. **Image CDN → Cloudflare R2** — Self-controlled image delivery
5. **Analytics → ClickHouse** — If event volume exceeds Supabase limits

---

## 12. Dependencies & Vulnerability Management

### 12.1 Production Dependencies (14)

| Package | Version | Risk | Notes |
|---------|---------|------|-------|
| next | 15.3.0 | Low | Major framework, well-maintained |
| react / react-dom | 19.1.0 | Low | Core UI library |
| @supabase/supabase-js | 2.49.0 | Low | Database client |
| @anthropic-ai/sdk | 0.39.0 | Low | AI chat |
| leaflet / react-leaflet | 1.9.4 / 5.0.0 | Low | Maps |
| tailwindcss | 4.1.0 | Low | Styling |
| zod | 4.3.6 | Low | Validation |
| next-intl | 4.1.0 | Low | i18n |
| lucide-react | 0.475.0 | Low | Icons |
| clsx | 2.1.1 | Low | Class utility |

### 12.2 Dev Dependencies (10)

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5.8.0 | Type safety |
| vitest | 4.0.18 | Unit testing |
| playwright | 1.58.2 | E2E testing |
| @axe-core/playwright | 4.11.1 | Accessibility |
| jsdom | 28.1.0 | DOM testing env |
| eslint | 9.0.0 | Code quality |
| tsx | 4.21.0 | Script runner |

### 12.3 Update Strategy

- **Monthly:** Check for security advisories (`npm audit`)
- **Quarterly:** Update minor versions
- **Major updates:** Test in staging branch, run full test suite before merge
