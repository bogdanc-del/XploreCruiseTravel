# XploreCruiseTravel — User Manual

**Version:** 1.0.0
**Date:** 2026-03-03
**Audience:** Site administrators, consultants, and content managers

---

## Table of Contents

1. [Public Website Overview](#1-public-website-overview)
2. [Browsing Cruises](#2-browsing-cruises)
3. [Guided Recommendation Flow](#3-guided-recommendation-flow)
4. [Cruise Detail Pages](#4-cruise-detail-pages)
5. [Lead Capture & Contact](#5-lead-capture--contact)
6. [AI Chat Assistant](#6-ai-chat-assistant)
7. [Submitting Reviews (QR)](#7-submitting-reviews-qr)
8. [Admin Dashboard](#8-admin-dashboard)
9. [Managing Reviews](#9-managing-reviews)
10. [Managing Testimonials](#10-managing-testimonials)
11. [Managing Site Stats](#11-managing-site-stats)
12. [A/B Testing Dashboard](#12-ab-testing-dashboard)
13. [Language Switching](#13-language-switching)
14. [Price Display & Exchange Rate](#14-price-display--exchange-rate)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Public Website Overview

XploreCruiseTravel is a bilingual (English/Romanian) cruise travel website offering 8,400+ cruise options. The site serves as a lead-generation platform where visitors browse cruises and submit "Solicita oferta" (Request an offer) requests to be contacted by a consultant.

### Homepage Sections
- **Hero banner** with primary call-to-action
- **Guided recommendation entry card** ("Not sure which cruise is right for you?")
- **Featured cruises** grid (curated selection)
- **Trust metrics** (animated counters: cruise offers, destinations, happy clients, years experience)
- **Testimonials** section (curated customer quotes)
- **Reviews** section (approved customer reviews)
- **CTA section** with consultant photo (Daniela)
- **AI Chat widget** (bottom-right corner)

---

## 2. Browsing Cruises

### Accessing the Cruise Listing
Navigate to `/cruises` or click "Cruises" in the main navigation.

### Filtering Options
| Filter | Description | How to Use |
|--------|-------------|------------|
| **Destination** | Caribbean, Mediterranean, Alaska, etc. | Dropdown selector |
| **Cruise Type** | Ocean, River, Luxury, Expedition | Toggle buttons |
| **Price Range** | Minimum and maximum EUR | Slider or input fields |
| **Duration** | Number of nights | Range selector |
| **Search** | Full-text across title, cruise line, ship, ports | Search bar at top |

### Sorting
Click column headers or use the sort dropdown:
- Price (low to high / high to low)
- Departure date (soonest / latest)
- Duration (shortest / longest)

### Pagination
- 24 cruises per page
- Navigate with page numbers at the bottom
- Duplicate departures are collapsed under a single card (click to expand)

### Freshness Labels
- **New** — recently added cruise
- **Updated** — price or details recently changed
- **Upcoming** — departure within 30 days

---

## 3. Guided Recommendation Flow

### Starting the Flow
Click the gold "Recomandare rapida" / "Quick Recommendation" card on:
- The homepage (below hero section)
- The cruise listing page (top banner)

### Steps

**Step 1: Travel Party** (Required)
Select who you're traveling with:
- Solo / As a couple / With family / With friends / Organized group

**Step 2: Experience Level** (Required)
- "Is this your first cruise?" — Yes or No
- If No: optional follow-up about previous cruise line

**Step 3: What Matters Most** (Required)
- Best price / Premium experience / Family activities / Exotic destinations / Relaxation & spa

**Step 4: Travel Timing** (Required)
- Next 3 months / Next 6 months / Next year / I'm flexible

**Step 5: Additional Preferences** (Optional — can skip)
- Budget range per person (Under 500 EUR / 500-1000 / 1000-2000 / Over 2000)
- Preferred destination (dropdown)

### Results
After completing the flow, you'll see 3-5 recommended cruises ranked by relevance. Each card shows:
- Why it was recommended
- Relevance score
- "Solicita oferta" button

### Navigation
- **Back** — returns to previous step
- **Next** — proceeds (only enabled when a selection is made)
- **Skip** — only on Step 5 (goes directly to results)
- **Close (X)** — exits the flow
- **"Browse all cruises"** — always available in the top bar

---

## 4. Cruise Detail Pages

Each cruise has a dedicated page at `/cruises/[cruise-name]`.

### Sections
1. **Hero Gallery** — HD images of the ship and destinations
2. **Key Info** — Price (EUR + approximate RON for Romanian locale), nights, cruise line, ship, embarkation port
3. **CTA Buttons** — "Solicita oferta" (primary) + secondary CTA
4. **Itinerary** — Day-by-day port stops with descriptions
5. **Interactive Map** — Leaflet map showing route with port markers
6. **Port Details** — Click a port marker to see activities and info
7. **Excursions** — Available shore excursion cards
8. **Beverage Packages** — Pricing tables for drink packages
9. **Cruise Line Terms** — T&Cs specific to the cruise line
10. **Reviews** — Approved customer reviews for this cruise type

---

## 5. Lead Capture & Contact

### "Solicita oferta" Form
When you click any "Solicita oferta" / "Request an offer" button, a form appears:

| Field | Required | Notes |
|-------|----------|-------|
| Full name | Yes | |
| Email | Yes | Validated format |
| Phone | Yes | |
| Message | No | Pre-filled from guided flow if applicable |
| GDPR consent | Yes | Checkbox must be checked |

The form automatically includes:
- Cruise title and slug
- Starting price
- Guided flow context (if completed)

### Contact Page
A standalone contact form is available at `/contact` for general inquiries.

### What Happens After Submission
- A success message confirms receipt
- A consultant (Daniela) will contact you within 24 hours
- The submission is stored in the database with full context

---

## 6. AI Chat Assistant

### How to Use
- Click the chat bubble (bottom-right corner of any page)
- The assistant is named "Daniela — Cruise Advisor"
- Type your question in the message field and press Enter

### What It Can Help With
- Cruise recommendations based on your preferences
- Information about specific destinations
- Cruise line comparisons
- Pricing questions
- Travel tips and advice

### Language
The assistant responds in the same language as the current site locale (EN or RO).

---

## 7. Submitting Reviews (QR)

### For Customers
1. Scan the QR code provided by the consultant
2. You'll be directed to `/review`
3. Fill in the review form:
   - **Rating** (1-5 stars) — required
   - **Your name** — required
   - **City** — optional
   - **Cruise type** (ocean, river, luxury, expedition) — optional
   - **Your review** — required (min. 10 characters)
   - **Consent to publish** — checkbox
4. Submit — your review will be held for moderation

### Rate Limiting
- Maximum 5 review submissions per IP address per hour
- A honeypot field blocks automated bots

---

## 8. Admin Dashboard

### Accessing the Dashboard
1. Navigate to `/admin`
2. Enter the admin password: `xplore2026`
3. The session persists in browser storage (no re-login needed until you log out)

### Dashboard Overview Tab
- **Total Bookings** — count of all booking requests
- **Pending** — bookings awaiting confirmation
- **Confirmed** — confirmed bookings
- **Unread Messages** — contact messages not yet read
- Recent bookings list
- Recent messages preview

### Navigation Tabs
| Tab | Purpose |
|-----|---------|
| Dashboard | Overview cards and recent activity |
| Bookings | View and manage booking requests |
| Messages | Read and respond to contact form messages |
| Reviews | Moderate customer reviews |
| Testimonials | Create, edit, delete curated testimonials |
| Stats | Manage homepage trust metrics |
| A/B Testing | View CTA variant performance |
| Cruises | Placeholder for future cruise management |
| Settings | Company info and integration status |

---

## 9. Managing Reviews

### Reviews Tab Functions

**Viewing Reviews**
- All submitted reviews are shown, sorted by date (newest first)
- Each review shows: name, rating, city, cruise type, message, source (QR/direct/manual), date
- Pending reviews are highlighted

**Approving/Rejecting Reviews**
- Click **Approve** to make a review visible to the public
- Click **Reject** to hide a review
- Only approved reviews appear on the public website

**Review Sources**
- **QR** — submitted via QR code scan
- **Direct** — submitted from the website directly
- **Manual** — entered by admin

---

## 10. Managing Testimonials

### Testimonials Tab Functions

**Creating a Testimonial**
1. Click "Add Testimonial" / "+ Adauga"
2. Fill in:
   - **Name** (required)
   - **City** (optional)
   - **Rating** (1-5)
   - **Quote** (required — the testimonial text)
   - **Tags** (comma-separated: ocean, mediterranean, family, etc.)
   - **Sort order** (lower = appears first)
3. Click Save

**Editing a Testimonial**
- Click the edit icon on any testimonial row
- Modify fields and save

**Toggling Active/Inactive**
- Click the toggle switch to show/hide a testimonial on the public site
- Inactive testimonials are preserved in the database but not displayed

**Deleting a Testimonial**
- Click the delete icon
- Confirm the deletion (this is permanent)

### Tag System
Tags control where testimonials appear contextually:
- `ocean`, `river`, `luxury`, `expedition` — cruise types
- `mediterranean`, `caribbean`, `alaska`, etc. — destinations
- `family`, `romantic`, `solo`, `adventure` — travel styles
- `msc-cruises`, `royal-caribbean`, etc. — cruise lines

---

## 11. Managing Site Stats

### Stats Tab Functions

**Viewing Stats**
The default trust metrics are:
| Stat | Default | Label (EN) | Label (RO) |
|------|---------|-----------|-----------|
| cruises | 150 | Cruise Offers | Oferte Croaziere |
| destinations | 25 | Destinations | Destinatii |
| clients | 500 | Happy Clients | Clienti Multumiti |
| years | 10 | Years Experience | Ani Experienta |

**Editing a Stat**
1. Click the edit icon next to any stat
2. Update the value, labels, or suffix
3. Click Save

**Creating a New Stat**
1. Click "Add Stat"
2. Fill in: key, value, English label, Romanian label, suffix (+, %, etc.)
3. Click Save

**Toggling Active/Inactive**
- Toggle the switch to show/hide a stat on the homepage

**Deleting a Stat**
- Click delete and confirm

---

## 12. A/B Testing Dashboard

### A/B Testing Tab

The site runs 3 CTA variants on cruise detail pages:

| Variant | Primary CTA | Secondary CTA | Description |
|---------|-------------|---------------|-------------|
| **A** (Control) | Solicita oferta | Verifica disponibilitatea | Gold button, standard text |
| **B** (Value) | Obtine pret personalizat | Locuri limitate — verifica acum | Price-focused + urgency |
| **C** (Expert) | Vorbeste cu un expert | Consultanta gratuita — fara obligatii | Trust-building + free consultation |

### Dashboard Features

**Period Selector**
- Click 7d / 30d / 90d buttons to change the lookback window

**Summary Cards**
- Total Impressions — how many times CTA buttons were shown
- Total Clicks — how many times CTAs were clicked
- Conversion Rate — clicks / impressions as percentage
- Winner — variant with highest conversion rate

**Per-Variant Table**
- Impressions, clicks, conversion rate for each variant
- Primary vs secondary click breakdown
- Winner badge on the best-performing variant

**Bar Chart**
- Visual comparison of conversion rates across variants

**CTA Preview**
- Side-by-side preview of how each variant's buttons look

**CSV Export**
- Click "Export CSV" to download results as a spreadsheet
- File includes all metrics + period info

### How A/B Assignment Works
- Each visitor receives a random variant (33.3% each) via cookie
- The cookie persists for 30 days
- The same visitor always sees the same variant
- Demo data is shown when Supabase is not configured

---

## 13. Language Switching

### How to Switch
- Click the language toggle in the header (EN / RO flag icons)
- All UI text, labels, CTAs, and navigation switch immediately
- The chat assistant also responds in the selected language

### What Changes
- All button text and labels
- Navigation items
- Form labels and placeholders
- Error and success messages
- Admin dashboard text
- Date and number formatting

### What Stays the Same
- Cruise titles (original language from data source)
- Port names (international standard)
- Cruise line names (brand names)

---

## 14. Price Display & Exchange Rate

### EUR Prices
All cruise prices are displayed in EUR (euros) as the primary currency. This is the base price from the cruise line.

### RON (Romanian Lei) Approximate Prices
When the site is viewed in Romanian (RO locale), an approximate RON price is shown alongside the EUR price (e.g., "~2.549 RON"). This is calculated using the daily BNR (National Bank of Romania) reference rate plus a 2.5% margin.

### How the Exchange Rate Works
- The EUR/RON rate is fetched daily from BNR (bnr.ro) after 14:00 EET on weekdays
- On weekends/holidays, the most recently published rate is used
- The rate is cached and refreshed automatically — no manual action needed
- If BNR is temporarily unavailable, a fallback rate of 4.97 is used

### Important Note
RON prices are **approximate** and for reference only. The final price in any currency will be confirmed by the consultant during the offer process.

---

## 15. Troubleshooting

### Common Issues

**"Demo data" warning in admin**
- Supabase is not configured. Set `NEXT_PUBLIC_SUPABASE_URL` and keys in `.env.local`
- The site works fully with demo data for development

**Chat widget not responding**
- Check that `ANTHROPIC_API_KEY` is set in Vercel Environment Variables
- The Anthropic account must have purchased API credits (Evaluation plan has no free credits)
- Verify credit balance at [platform.claude.com/settings/billing](https://platform.claude.com/settings/billing)
- Without a valid key or credits, the chat widget shows a friendly fallback message with contact details

**Reviews not appearing after submission**
- Reviews require admin approval before they appear publicly
- Check the Reviews tab in the admin dashboard

**Stats not updating on homepage**
- Changes made in admin take effect immediately
- If using cached data, wait for the 10-minute cache to expire

**A/B Testing shows "Demo data"**
- This is normal when Supabase is not configured
- Real data appears after visitors interact with the live site

**Login password not working**
- The admin password is: `xplore2026`
- This is hardcoded and not configurable via UI

**Cruise prices seem outdated**
- Cruise data is synced automatically every day at 07:00 Romanian time (04:00 UTC)
- The sync is handled by GitHub Actions — no manual action needed
- Check the `logs/sync-log.jsonl` file for the last sync timestamp
- To trigger a manual sync: go to GitHub → Actions → "Daily Cruise Sync" → Run workflow

### Getting Help
- **Email:** xplorecruisetravel@gmail.com
- **Phone:** +40 749 558 572
- **Developer contact:** Check the project repository
