# XploreCruiseTravel — Requirements Document

**Project:** XploreCruiseTravel Web Platform
**Version:** 1.0.0
**Date:** 2026-03-03
**Owner:** XPLORE CRUISE TRAVEL SRL (CUI: 36785800, J03/1962/2016)
**Contact:** Ceausu Daniela Antonina — xplorecruisetravel@gmail.com — +40 749 558 572

---

## 1. Purpose & Scope

XploreCruiseTravel is a lead-generation cruise travel website for a licensed Romanian cruise consultancy (CAEN 7912). The platform enables visitors to browse 8,400+ cruise offers, receive personalized recommendations, and submit lead requests ("Solicita oferta") to be contacted by a consultant. **There is no instant checkout.** All conversions are assisted sales.

### 1.1 Business Model

| Aspect | Description |
|--------|-------------|
| Revenue model | Lead-based + assisted sales |
| Conversion action | "Solicita oferta" / "Request an offer" form submission |
| Target audience | Romanian travelers, bilingual EN/RO |
| Key differentiator | Personalized cruise consulting with AI assistant |

### 1.2 Scope Boundaries

- **In scope:** Cruise browsing, guided recommendations, lead capture, reviews, testimonials, admin dashboard, analytics, A/B testing
- **Out of scope:** Payment processing, instant booking, user accounts/registration, loyalty programs

---

## 2. Functional Requirements

### FR-01: Cruise Catalog & Browsing

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01.1 | Display 8,400+ cruise offers from JSON data source | Must | Done |
| FR-01.2 | Paginated listing (24 cruises per page) with infinite-scroll-ready API | Must | Done |
| FR-01.3 | Filter by destination (15+ categories) | Must | Done |
| FR-01.4 | Filter by cruise type (ocean, river, luxury, expedition) | Must | Done |
| FR-01.5 | Filter by price range (min/max EUR) | Must | Done |
| FR-01.6 | Filter by duration (nights range) | Must | Done |
| FR-01.7 | Full-text search across title, cruise line, ship name, ports | Must | Done |
| FR-01.8 | Sort by price (asc/desc), departure date, duration | Must | Done |
| FR-01.9 | Collapse duplicate departures under a single card (expandable) | Should | Done |
| FR-01.10 | Display freshness labels (new, updated, upcoming) | Should | Done |

### FR-02: Cruise Detail Page

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-02.1 | Dynamic route `/cruises/[slug]` with full cruise details | Must | Done |
| FR-02.2 | Hero image gallery (ship + destination photos) | Must | Done |
| FR-02.3 | Day-by-day itinerary with port names | Must | Done |
| FR-02.4 | Interactive Leaflet map with port markers and route line | Must | Done |
| FR-02.5 | Port information drawer (activities, coordinates) | Should | Done |
| FR-02.6 | Beverage package pricing table | Should | Done |
| FR-02.7 | Shore excursion cards | Should | Done |
| FR-02.8 | Cruise line terms and conditions section | Should | Done |
| FR-02.9 | A/B tested CTA buttons (3 variants) | Must | Done |
| FR-02.10 | Lead capture form accessible from CTA buttons | Must | Done |

### FR-03: Guided Recommendation Flow

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-03.1 | 5-step guided wizard modal (full-screen overlay) | Must | Done |
| FR-03.2 | Step 1: Travel party (solo/couple/family/friends/group) | Must | Done |
| FR-03.3 | Step 2: Experience level (first cruise? previous cruise line?) | Must | Done |
| FR-03.4 | Step 3: Priority (budget/luxury/family/adventure/relaxation) | Must | Done |
| FR-03.5 | Step 4: Timing (3 months / 6 months / 1 year / flexible) | Must | Done |
| FR-03.6 | Step 5: Optional budget range + destination preference | Should | Done |
| FR-03.7 | Rule-based recommendation engine (25+ scoring rules) | Must | Done |
| FR-03.8 | Results page with 3-5 recommended cruises and relevance scores | Must | Done |
| FR-03.9 | Session storage persistence (back-navigation preserved) | Should | Done |
| FR-03.10 | "Browse all with filters" link to listing page with pre-applied params | Should | Done |

### FR-04: Lead Capture & Contact

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-04.1 | Lead form: name, email, phone, message, GDPR consent | Must | Done |
| FR-04.2 | Pre-filled message from guided flow context | Should | Done |
| FR-04.3 | Cruise context (title, slug, price) passed to form | Must | Done |
| FR-04.4 | Contact form on dedicated `/contact` page | Must | Done |
| FR-04.5 | GDPR consent checkbox required before submission | Must | Done |
| FR-04.6 | Form validation (required fields, email format) | Must | Done |
| FR-04.7 | Success/error feedback after submission | Must | Done |

### FR-05: Reviews System

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-05.1 | QR-code driven review submission at `/review` | Must | Done |
| FR-05.2 | Review fields: rating (1-5), name, city, cruise type, message | Must | Done |
| FR-05.3 | Publish consent checkbox | Must | Done |
| FR-05.4 | Honeypot field for bot protection | Must | Done |
| FR-05.5 | Rate limiting: max 5 submissions per IP per hour | Must | Done |
| FR-05.6 | Admin moderation workflow (approve/reject) | Must | Done |
| FR-05.7 | Only approved reviews displayed publicly | Must | Done |
| FR-05.8 | Zod schema validation on server | Must | Done |

### FR-06: Testimonials System

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-06.1 | Admin CRUD for curated testimonials | Must | Done |
| FR-06.2 | Tag-based relevance scoring for contextual display | Should | Done |
| FR-06.3 | Display on homepage and cruise detail pages | Must | Done |
| FR-06.4 | Carousel/grid layout with star ratings | Should | Done |
| FR-06.5 | Active/inactive toggle for admin control | Must | Done |

### FR-07: Trust Metrics (Site Stats)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-07.1 | Dynamic stats from Supabase: cruise count, destinations, clients, years | Must | Done |
| FR-07.2 | Animated counter on homepage | Should | Done |
| FR-07.3 | Admin CRUD for stats (create, update, delete, toggle active) | Must | Done |
| FR-07.4 | Fallback to hardcoded values when DB unavailable | Must | Done |

### FR-08: AI Chat Assistant

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-08.1 | Claude-powered chat widget (floating bubble) | Must | Done |
| FR-08.2 | Context-aware cruise consulting | Must | Done |
| FR-08.3 | Bilingual responses (EN/RO based on locale) | Must | Done |
| FR-08.4 | Message history within session | Must | Done |
| FR-08.5 | Consultant identity: "Daniela — Cruise Advisor" | Must | Done |
| FR-08.6 | Graceful fallback when API key not configured | Must | Done |

### FR-09: A/B Testing System

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-09.1 | 3 CTA variants (A: control, B: value, C: expert) | Must | Done |
| FR-09.2 | Cookie-based variant assignment (33.3% each) | Must | Done |
| FR-09.3 | 30-day sticky cookie persistence | Must | Done |
| FR-09.4 | Impression and click tracking per variant | Must | Done |
| FR-09.5 | Admin dashboard with results aggregation | Must | Done |
| FR-09.6 | Period selector (7/30/90 days) | Should | Done |
| FR-09.7 | CSV export of results | Should | Done |
| FR-09.8 | Visual bar chart of conversion rates | Should | Done |
| FR-09.9 | Winner highlighting (highest conversion rate) | Should | Done |

### FR-10: Admin Dashboard

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-10.1 | Password-protected access (hardcoded password) | Must | Done |
| FR-10.2 | Dashboard overview: bookings, messages, pending counts | Must | Done |
| FR-10.3 | Bookings management (view, update status) | Must | Done |
| FR-10.4 | Contact messages management (view, mark read) | Must | Done |
| FR-10.5 | Reviews moderation tab | Must | Done |
| FR-10.6 | Testimonials CRUD tab | Must | Done |
| FR-10.7 | Site stats management tab | Must | Done |
| FR-10.8 | A/B testing results tab | Must | Done |
| FR-10.9 | Settings tab (company info, integrations status) | Should | Done |

### FR-11: Internationalization

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-11.1 | Full bilingual support (English + Romanian) | Must | Done |
| FR-11.2 | 436+ translation keys covering all UI text | Must | Done |
| FR-11.3 | Language switcher in header | Must | Done |
| FR-11.4 | Locale-aware date/number formatting | Should | Done |
| FR-11.5 | Type-safe translation keys (TypeScript) | Should | Done |

### FR-12: Analytics & Tracking

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-12.1 | Privacy-safe event tracking (PII fields stripped) | Must | Done |
| FR-12.2 | Dual channel: GA4 + custom /api/events endpoint | Must | Done |
| FR-12.3 | Funnel events: list view, detail view, CTA click, lead submit | Must | Done |
| FR-12.4 | Guided flow events: start, step complete, abandon, results | Must | Done |
| FR-12.5 | Rate limiting on events endpoint (100 events/min/IP) | Should | Done |
| FR-12.6 | Allowed events whitelist (18 event types) | Must | Done |

### FR-13: Dynamic EUR/RON Exchange Rate

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-13.1 | Fetch daily EUR/RON rate from BNR (bnr.ro) | Must | Done |
| FR-13.2 | Apply 2.5% business margin on BNR reference rate | Must | Done |
| FR-13.3 | Fallback chain: daily → 10-day → hardcoded (4.97) | Must | Done |
| FR-13.4 | Server-side caching (4h TTL, 1h for fallback) | Must | Done |
| FR-13.5 | CDN caching (s-maxage=3600, stale-while-revalidate=7200) | Should | Done |
| FR-13.6 | React Context (ExchangeRateProvider) for client components | Must | Done |
| FR-13.7 | Display approximate RON prices on RO locale only | Must | Done |
| FR-13.8 | If today's rate unavailable, use most recent published rate | Must | Done |

### FR-14: Cruise Data Sync (API)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-14.1 | Sync cruise data from croaziere.net REST API | Must | Done |
| FR-14.2 | Batch fetching (50 IDs per request, 500ms delay) | Must | Done |
| FR-14.3 | Update prices, images, departure dates from API | Must | Done |
| FR-14.4 | Store enriched data (gallery, rooms, itinerary) separately | Should | Done |
| FR-14.5 | Rebuild compact index after sync | Must | Done |
| FR-14.6 | Server-side trigger via POST /api/sync/prices | Must | Done |
| FR-14.7 | CLI trigger via node scripts/sync-cruises-api.mjs | Should | Done |

---

## 3. Non-Functional Requirements

### NFR-01: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01.1 | First Contentful Paint (FCP) | < 1.5s |
| NFR-01.2 | Largest Contentful Paint (LCP) | < 2.5s |
| NFR-01.3 | Time to Interactive (TTI) | < 3.5s |
| NFR-01.4 | Cumulative Layout Shift (CLS) | < 0.1 |
| NFR-01.5 | Recommendation engine processing (8,400+ cruises) | < 100ms |
| NFR-01.6 | API response time (paginated listing) | < 200ms |

### NFR-02: Accessibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-02.1 | WCAG 2.1 AA compliance | All pages |
| NFR-02.2 | axe-core zero critical violations | All pages |
| NFR-02.3 | Keyboard navigation support | All interactive elements |
| NFR-02.4 | Skip-to-content link | Root layout |
| NFR-02.5 | Semantic HTML (headings, landmarks, ARIA) | All components |

### NFR-03: Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-03.1 | Security headers (X-Frame-Options, CSP, etc.) | All routes |
| NFR-03.2 | Input validation (Zod schemas) | All form endpoints |
| NFR-03.3 | Rate limiting | Reviews, Events |
| NFR-03.4 | Supabase RLS policies | All tables |
| NFR-03.5 | PII sanitization in analytics | Analytics pipeline |
| NFR-03.6 | GDPR compliance (consent, privacy policy, data handling) | All forms |

### NFR-04: SEO

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-04.1 | Open Graph metadata on all pages | All public pages |
| NFR-04.2 | Twitter Card support | All public pages |
| NFR-04.3 | Dynamic sitemap.xml | Auto-generated |
| NFR-04.4 | robots.txt | Configured |
| NFR-04.5 | Structured data (schema.org) | Cruise detail pages |
| NFR-04.6 | Canonical URLs | All pages |

### NFR-05: Responsiveness

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-05.1 | Mobile layout (320px - 767px) | Tested on Pixel 5 |
| NFR-05.2 | Tablet layout (768px - 1023px) | Tested |
| NFR-05.3 | Desktop layout (1024px+) | Tested |
| NFR-05.4 | Touch-friendly targets (min 48px) | All interactive elements |

### NFR-06: Testing

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-06.1 | Unit test coverage | 106+ tests, 8 test files |
| NFR-06.2 | E2E test coverage | 9 spec files (Playwright) |
| NFR-06.3 | Accessibility testing | axe-core integration |
| NFR-06.4 | Cross-browser testing | Chromium + WebKit |
| NFR-06.5 | Mobile testing | Pixel 5 emulation |

---

## 4. Data Requirements

### DR-01: Cruise Data

| Field | Type | Source |
|-------|------|--------|
| title | string | API sync from croaziere.net |
| slug | string | Generated from title |
| cruise_line | string | 25+ cruise lines |
| ship_name | string | Ship identification |
| cruise_type | enum | ocean, river, luxury, expedition |
| destination | string | 15+ destination categories |
| nights | integer | Duration in nights |
| price_from | number | Starting price in EUR |
| departure_date | date | First departure date |
| embarkation_port | string | Starting port |
| disembarkation_port | string | End port |
| itinerary | object[] | Day-by-day port stops |
| image | string | HD image URL |

**Total records:** 8,483 cruises

### DR-02: Supabase Tables

| Table | Records | Purpose |
|-------|---------|---------|
| reviews | Dynamic | User-submitted cruise reviews |
| testimonials | Dynamic | Curated customer testimonials |
| site_stats | 4 (seed) | Homepage trust metrics |
| analytics_events | Dynamic | Privacy-safe event log |

---

## 5. Integration Requirements

| Integration | Technology | Status |
|-------------|-----------|--------|
| Supabase (PostgreSQL) | @supabase/supabase-js 2.49 | Configured (with demo fallback) |
| Claude AI (chat) | @anthropic-ai/sdk 0.39 | Configured (with fallback) |
| Google Analytics 4 | window.gtag | Ready (tag pending) |
| Leaflet Maps | leaflet 1.9 + react-leaflet 5.0 | Active |
| Image CDN | Supabase Storage + Unsplash + croaziere.net | Active |
| BNR Exchange Rate | REST XML (bnr.ro) | Active (daily, auto-cached) |
| Croaziere.net API | REST JSON (sync) | Active (daily cron recommended) |

---

## 6. Constraints & Assumptions

### Constraints
1. **No instant booking** — all conversions require consultant follow-up
2. **No user accounts** — visitors are anonymous until lead form submission
3. **Admin auth** — simple password-based (no role-based access control)
4. **Data source** — cruise data from static JSON (synced via croaziere.net API)
5. **Languages** — EN + RO only (no other locales planned)
6. **Exchange rate** — EUR/RON from BNR with 2.5% margin, fallback to 4.97

### Assumptions
1. Supabase free tier is sufficient for initial traffic
2. Claude API costs are manageable for chat volume
3. Cruise data is refreshed daily via API sync (cron job or manual trigger)
4. GDPR compliance is managed via consent checkboxes and policy pages
5. BNR exchange rate is published daily on weekdays; weekends use Friday's rate
