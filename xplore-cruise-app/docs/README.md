# XploreCruiseTravel

A modern, full-stack cruise travel platform built with Next.js 15, React 19, and TypeScript. Features 8,400+ cruise offers, AI-powered recommendations, and a privacy-safe analytics pipeline.

**Live:** [xplorecruisetravel.com](https://xplorecruisetravel.com)

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/your-org/xplore-cruise-travel.git
cd xplore-cruise-travel/xplore-cruise-app
npm install

# Environment setup
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY

# Development
npm run dev          # http://localhost:3000

# Production build
npm run build
npm start
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.3 (App Router) + React 19 |
| Language | TypeScript 5.8 (strict mode) |
| Database | Supabase (PostgreSQL) with RLS |
| AI Chat | Claude API (Anthropic SDK) |
| Styling | Tailwind CSS 4 + custom navy/gold design system |
| Maps | Leaflet + react-leaflet |
| i18n | next-intl (English + Romanian) |
| Validation | Zod |
| Testing | Vitest (unit) + Playwright (E2E) + axe-core (a11y) |

---

## Project Structure

```
xplore-cruise-app/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── page.tsx            # Homepage
│   │   ├── cruises/            # Listing + detail pages
│   │   ├── admin/              # Admin dashboard
│   │   ├── review/             # QR review submission
│   │   ├── contact/            # Contact page
│   │   └── api/                # 12 API routes
│   │       ├── cruises/        # Cruise listing & detail
│   │       ├── reviews/        # Review CRUD
│   │       ├── testimonials/   # Testimonial CRUD
│   │       ├── stats/          # Trust metrics CRUD
│   │       ├── chat/           # Claude AI assistant
│   │       ├── contact/        # Lead form handler
│   │       ├── events/         # Analytics collector
│   │       ├── ab-results/     # A/B test aggregation
│   │       ├── exchange-rate/  # BNR EUR/RON rate
│   │       └── sync/prices/    # Cruise data sync
│   ├── components/             # 38 React components
│   │   ├── cruise/             # Cruise display (card, map, gallery, etc.)
│   │   ├── guided/             # 5-step guided recommendation flow
│   │   ├── chat/               # AI chat widget
│   │   ├── reviews/            # Review display
│   │   ├── testimonials/       # Testimonial display
│   │   ├── lead/               # Lead capture form
│   │   ├── admin/              # Admin components (stats, reviews, testimonials, A/B)
│   │   └── ui/                 # Primitives (Button, Badge, Container)
│   ├── lib/                    # Utilities (analytics, A/B testing, validation)
│   ├── i18n/                   # 436+ translation keys (EN/RO)
│   ├── context/                # React contexts (guided flow, locale, exchange rate)
│   └── data/                   # Static data (ports, ships, packages)
├── public/
│   └── data/
│       └── cruises-index.json  # 8,483 cruise records
├── supabase/migrations/        # 4 SQL migrations
├── __tests__/                  # 106 unit tests (Vitest)
├── e2e/                        # 9 E2E test specs (Playwright)
└── docs/                       # Project documentation
```

---

## Key Features

### Cruise Catalog (8,400+ offers)
- Filterable by destination, type, price range, duration
- Full-text search across titles, cruise lines, ships, ports
- Paginated API (24/page) with sorting options
- Duplicate departure collapsing

### Promo & Best Deal Highlighting
- Automatic promo/best deal badges on CruiseCard and detail page
- Strikethrough original price with promo price display
- Savings percentage shown in sidebar
- "Super Oferte" / "Hot Deals" homepage section (auto-hidden when no promos)
- Promo filter: `/cruises?promo=1`

### Cabin Selector
- Browse available cabin types (Interior, Ocean View, Balcony, Suite)
- Per-cruise-line cabin images from official sources
- Price per person per cabin category per departure date
- Selected cabin preference included in lead form submission
- Category normalization from 80+ API category codes

### Enriched Itinerary
- Arrival and departure times shown per port (from API enriched data)
- Visual timeline with ⚓ Arr / 🚢 Dep indicators
- Enriched data synced daily from croaziere.net API

### Guided Recommendations
- 5-step wizard: travel party, experience, priority, timing, preferences
- Rule-based scoring engine (25+ rules)
- Returns 3-5 personalized cruise recommendations
- Session persistence for back-navigation

### Lead Capture
- "Solicita oferta" / "Request an offer" — the primary conversion action
- Pre-filled from guided flow context
- GDPR consent required
- Cruise context (title, slug, price) included

### AI Chat Assistant
- Claude-powered cruise consultant ("Daniela")
- Bilingual (EN/RO)
- Context-aware recommendations
- Graceful fallback with contact details when API unavailable
- **Note:** Requires purchased Anthropic API credits (Evaluation plan has no free credits)

### Reviews & Testimonials
- QR-code driven review collection
- Admin moderation workflow
- Tag-based testimonial relevance scoring

### A/B Testing
- 3 CTA variants on cruise detail page
- Cookie-based assignment (33.3% each, 30-day sticky)
- Admin dashboard with conversion rates, CSV export

### Dynamic EUR/RON Exchange Rate
- BNR (National Bank of Romania) reference rate fetched daily
- 2.5% business margin applied automatically
- Fallback chain: daily feed → 10-day feed → hardcoded rate (4.97)
- React Context provides rate to all client components
- Cached: 4h server-side, 1h on CDN

### Automated Data Sync
- **Cruise data:** GitHub Actions workflow runs daily at 04:00 UTC (07:00 EET)
- Fetches prices, images, departure dates from croaziere.net API
- Auto-commits updated JSON files → triggers Vercel redeploy
- Can also be triggered manually via GitHub Actions UI
- **Exchange rate:** Auto-fetched on demand from BNR, cached server-side

### Email Notifications
- Auto-sends on new leads, contact form submissions, and review submissions
- SMTP via Nodemailer (default: Gmail)
- Branded HTML email templates (Cerere Noua de Oferta, Mesaj Contact, Recenzie Noua)
- Fire-and-forget pattern — never blocks form submission
- Graceful fallback to console logging when SMTP not configured

### Analytics
- Privacy-safe (PII fields stripped automatically)
- Dual channel: GA4 + custom /api/events
- 18 tracked event types across the funnel

---

## Environment Variables

```bash
# Supabase (required for DB features, falls back to demo data)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Claude AI (required for chat, graceful fallback without)
ANTHROPIC_API_KEY=sk-ant-...

# Cruise Sync API (croaziere.net)
PRICE_API_URL=https://www.croaziere.net/api/v1.1/cruises
PRICE_API_KEY=<api-key>
SYNC_SECRET=<sync-secret>

# Email Notifications (optional — falls back to console logging)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
NOTIFICATION_EMAIL=xplorecruisetravel@gmail.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Database Setup

Run Supabase migrations in order:

```bash
# 1. Reviews table (QR-driven collection)
psql < supabase/migrations/20260303_create_reviews.sql

# 2. Testimonials table (curated quotes)
psql < supabase/migrations/20260303_create_testimonials.sql

# 3. Site stats table (trust metrics)
psql < supabase/migrations/20260303_create_site_stats.sql

# 4. Analytics events table (privacy-safe tracking)
psql < supabase/migrations/20260303_create_analytics_events.sql
```

All tables use Row Level Security (RLS):
- **Public:** Read approved reviews, active testimonials, active stats
- **Authenticated:** Full CRUD on all tables
- **Service role:** Insert analytics events

---

## Testing

```bash
# Unit tests (106 tests, 8 files)
npm run test:unit

# E2E tests (9 specs, Chromium + WebKit + Mobile)
npm run test:e2e

# Accessibility tests (axe-core)
npm run test:a11y

# Full suite (typecheck + lint + i18n-audit + unit)
npm run test

# Individual browsers
npm run test:e2e:chromium
npm run test:e2e:webkit
```

### Test Coverage

| Suite | Files | Tests | Focus |
|-------|-------|-------|-------|
| `ab-testing.test.ts` | 1 | 15 | Variant assignment, cookies, distribution |
| `api-ab-results.test.ts` | 1 | 11 | A/B results aggregation, periods, CSV |
| `api-stats.test.ts` | 1 | 12 | Stats CRUD, validation, demo mode |
| `api-reviews.test.ts` | 1 | 5 | Review submission, rate limiting |
| `api-testimonials.test.ts` | 1 | 9 | Testimonial CRUD, tag filtering |
| `reviews-validation.test.ts` | 1 | 14 | Zod schema validation |
| `testimonials-relevance.test.ts` | 1 | 10 | Tag-based scoring algorithm |
| `bnr-exchange-rate.test.ts` | 1 | 30 | BNR XML parsing, rate caching, conversion |
| **Total (unit)** | **8** | **106** | |

**Full test inventory:** 239 tests total (106 unit + 65 E2E + 39 manual + 29 verified integration config).
See [TEST_CASES.md](./TEST_CASES.md) for the complete catalog.

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `GET /api/cruises` | GET | Paginated cruise listing with filters |
| `GET /api/cruises/[slug]` | GET | Single cruise detail |
| `GET/POST /api/reviews` | GET/POST | Review listing & submission |
| `GET/POST/PUT /api/testimonials` | GET/POST/PUT | Testimonial CRUD |
| `GET/PUT/POST/DELETE /api/stats` | ALL | Site stats management |
| `POST /api/chat` | POST | Claude AI assistant |
| `POST /api/contact` | POST | Lead form submission |
| `POST /api/events` | POST | Analytics event collection |
| `GET /api/ab-results` | GET | A/B test results aggregation |
| `GET /api/exchange-rate` | GET | BNR EUR/RON rate (cached) |
| `POST /api/sync/prices` | POST | Cruise data sync from croaziere.net API |

---

## Admin Dashboard

Access at `/admin` with password: `xplore2026`

### Tabs
1. **Dashboard** — Overview cards (bookings, messages, pending)
2. **Bookings** — View and update booking status
3. **Messages** — Contact form messages (read/reply)
4. **Reviews** — Moderation (approve/reject)
5. **Testimonials** — CRUD (create, edit, toggle, delete)
6. **Stats** — Trust metrics management
7. **A/B Testing** — CTA variant performance (7d/30d/90d, CSV export)
8. **Cruises** — Placeholder (future Supabase CRUD)
9. **Settings** — Company info, integration status

---

## Internationalization

- **Languages:** English (en) + Romanian (ro)
- **Keys:** 436+ translation keys
- **Switching:** Header language toggle
- **Usage:** `const t = useT()` hook with type-safe keys

---

## Design System

- **Colors:** Navy (#0B1426 to #1E3A5F) + Gold (#D4A853 to #B8902E)
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Components:** Button (primary/secondary/ghost), Badge, Container
- **Theme:** Luxury cruise aesthetic with WCAG AA contrast

---

## Scripts

```bash
npm run dev                    # Dev server (localhost:3000)
npm run build                  # Production build
npm start                      # Start production
npm run lint                   # ESLint
npm run typecheck              # TypeScript strict check
npm run test                   # Full test suite
npm run test:unit              # Vitest unit tests
npm run test:e2e               # Playwright E2E
npm run test:a11y              # Accessibility tests
npm run i18n-audit             # i18n key coverage check
npm run generate-route-maps    # Generate route map images
npm run sync:cruises           # Manual cruise data sync from API
```

---

## Automation (GitHub Actions)

### Daily Cruise Sync

**File:** `.github/workflows/sync-cruises.yml`

| Property | Value |
|----------|-------|
| Schedule | Daily at 04:00 UTC (07:00 EET Romania) |
| Trigger | Automatic + manual via workflow_dispatch |
| Action | Runs sync script → commits data changes → Vercel redeploys |
| Duration | ~2-5 minutes (8,400+ cruises in batches of 50) |

**Required GitHub Secrets:**
- `PRICE_API_KEY` — croaziere.net API key
- `PRICE_API_URL` — (optional) API base URL

**Manual trigger:** GitHub → Actions → "Daily Cruise Sync" → Run workflow

---

## License

Proprietary. XPLORE CRUISE TRAVEL SRL. All rights reserved.
